/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global __dirname*/
"use strict";

var YUI = require('yui').YUI,
    API = require('api'),
    redis = require('redis'),
    io = require("socket.io"),
    crypto = require('crypto'),
    fs = require('fs'),
    http = require('http'),
    confObj = require('./config.js').config;


YUI().add('ashlesha-api-base', function(Y) {
    Y.APIEndpoint = {
        invoke: function(path, config,callback) {
            var response;
            API.setYInstance(Y);
            response = API.api(path, config,callback); //The Real API will never have callbacks into it
			return response;
        }
    };


    /**
     * The BaseAPI class is the base class that we use to invoke the API
     * @class  BaseAPI
     * @extends Y.Base
     * @uses
     * @constructor
     * @cfg {object} no configuration attributes required
     */
    Y.BaseAPI = Y.Base.create("BaseAPI", Y.Base, [], {
        initializer: function() {
            this.set("m", []);
        },
        invoke: function(path, config, callback) {
            var ep = Y.APIEndpoint,
                cfg = config || {},
                output;
            cfg.user = this.get("user"); // We need to send the current user with the API call as well.
            output = ep.invoke(path, cfg, callback);
            if(typeof callback !== "undefined"){
                callback(null,output);
            }
            return output; // If the method is a sync method it will automatically return the output else the call
            
        }
    });



}, '0.9.9', {
    requires: ['base', 'io-nodejs', 'json', 'querystring-stringify-simple']
});


YUI().add('ashlesha-base-models', function(Y) {


    /**
     * The AshleshaBaseModel class represents the base Model for our app
     * @class  AshleshaBaseModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaBaseModel = Y.Base.create('AshleshaBaseModel', Y.Model, [], {
        idAttribute: "_id",
        sync: function(action, options, callback) {
            var dburl = confObj.TOKENS.couchdbURL+confObj.TOKENS.dbName,
                data,
                api = this.get("api");
                data = this.toJSON();
                
            if(data.attrs){ //no need to save Attribute Metadata
                Y.Object.each(data.attrs,function(val,key){
                    
                    if(val.hash){
                        data[key] = api.invoke("/user/hash_password",{ val:data[key] });
                        console.log("log:"+data[key]);
                        
                    }
                    if(typeof val.save!== "undefined" && val.save===false){
                        delete data[key];
                    }
                    
                });
                this.removeAttr("api");
                delete data.attrs;
            }
            try { delete data.api;} catch(ex) { Y.log("API NOT PRESENT IN MODEL");}
            switch (action) {
            case "read":
                
                Y.io(dburl + "/" + data._id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    xdr: {
                        use: "nodejs"
                    },
                    on: {
                        success: function(i, o, a) {
                            callback(null, Y.JSON.parse(o.responseText));
                        },
                        failure: function(i, response) {
                            var r = Y.JSON.parse(response.responseText);
                            callback(r.reason);
                           
                        }
                    }
                });
                break;
            case "create":
                
                if (typeof data._id !== "undefined") {
                    delete data._id;
                }
                
                Y.io(dburl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    xdr: {
                        use: "nodejs"
                    },
                    data: Y.JSON.stringify(data),
                    on: {
                        success: function(i, o, a) {
                            callback(null, Y.JSON.parse(o.responseText));
                        },
                        failure: function(i, response) {
                            var r = Y.JSON.parse(response.responseText);
                            callback(r.reason);
                            
                        }
                    }
                });
                break;
            case "update":
                Y.io(dburl + "/" + data._id, {
                    method: 'PUT',
                    data: Y.JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    xdr: {
                        use: "nodejs"
                    },
                    on: {
                        success: function(i, o, a) {
                            callback(null, Y.JSON.parse(o.responseText));
                        },
                        failure: function(i, response) {
                            var r = Y.JSON.parse(response.responseText);
                            callback(r.reason);
                            
                        }
                    }
                });
                break;
            case "delete":
                Y.io(dburl + "/" + data._id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    xdr: {
                        use: "nodejs"
                    }
                });
                break;
            }
        }
    }, {
        ATTRS: {

            "created_at": {
                value: ""
            },
            "updated_at": {
                value: ""
            },
            "author_id": {
                value: ""
            },
            "type": {
                value: ""
            }
        }
    });

    /**
     * The AshleshaCurrentUserModel class represents the base Model for our app
     * @class  AshleshaCurrentUserModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaCurrentUserModel = Y.Base.create('AshleshaCurrentUserModel', Y.Model, [], {
        idAttribute: "_id",
        sync: function(action, options, callback) {
            if (action === "read") {
                if(options.req)
                {
                    
                    this.setAttrs(options.req.session.user);
                    callback(null, options.req.session.user);
                    return;
                }
                callback(null, {

                });
            }
        }
    }, {
        ATTRS: {

        }
    });


}, '0.9.9', {
    requires: ['model', 'json', 'io-nodejs', 'querystring-stringify-simple']
});

YUI().add('ashlesha-base-view',function(Y){ 
    
    Y.AshleshaBaseView = function() {
        Y.AshleshaBaseView.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Y.AshleshaBaseView, Y.Base, {
        initializer: function(config) {
            var m;
            if (config) {
                this.set("xhr", config.xhr || false);
                this.set("modules", config.modules || {} );
                if(Y.Lang.isFunction(this.preModules)) //Sometimes you may want to define modules within the view instead of passing them to the constructor
                {
                    m = this.get("modules");
                    m = Y.mix(m,this.preModules());
                    
                    this.set("modules",m);
                }
            }
            else {
                this.set("xhr", false);
                this.set("modules", null);
            }

        },
        render: function() {
            var name = this.name,
                template = this.get('templateID') || this.name,
                modules = this.get("modules"),
                self = this,
                chain = 0,
                response = {};
            if (this.get("xhr")) //if requested through AJAX
            {
                if (modules && !Y.Object.isEmpty(modules)) {
                    
                    Y.Object.each(modules, function(value, key) {
                        var config = (value && value.config) || {};
                        config.xhr = true;
                        Y.log("Rendering:"+value.view);
                        var v = new Y[value.view](config);
                        if (v) {

                            chain++;
                            v.on("render", function(e) {
                                var templateID = config.templateID || value.view;
                                chain -= 1;
                                if(Y.Lang.isString(e.data)){
                                    response[templateID] = e.data;
                                }else
                                {
                                    Y.Object.each(e.data,function(item,key){
                                        response[key] = item;
                                    });
                                }
                                
                                if (chain === 0) {
                                 
                                    fs.readFile("./views/default/" + template + ".tpl", function(err, data) {
                                                if (!err) {
                                                    response[template] = data.toString();
                                                    
                                                    
                                                  
                                                    self.fire("render", {
                                                        data: response
                                                    });
                                                }
                                                else {
                                                    self.fire("render", {
                                                        data: "Error! Template not found."
                                                    });
                                                }
                                            });
                                   
                                    
                                }



                            });
                            v.render();
                        }
                        else {
                            Y.log("View is Empty");
                        }
                    });
                }
                else {
                    
                    fs.readFile("./views/default/" + template + ".tpl", function(err, data) {
                        if (!err) {
                            response[template] = data.toString();
                            self.fire("render", {
                                data: response
                            });
                        }
                        else {
                            self.fire("render", {
                                data: "Error! Template not found."
                            });

                        }
                    });
                }

            }
            else //If its a normal GET request
            {
                fs.readFile("./views/default/mainpage.tpl", function(err, data) {
                    if (!err) {
                        self.fire("render", {
                            data: Y.Lang.sub(data.toString(), {
                                baseURL: confObj.TOKENS.baseURL
                            })
                        });
                    }
                    else {
                        self.fire("render", {
                            data: "Error! Template not found."
                        });
                    }
                });
            }
            return this;
        }
    });
    
    
    
    },'0.0.1',{
    requires:['base','cache']
});

YUI().add('ashlesha-base-app', function(Y) {
    var express = require('express'),
        fs = require("fs"),
        Lang = Y.Lang,
        oneYear = 31557600000;

    Y.Express = express;
  //  var RedisStore = require('connect-redis')(express), Redis = require("redis");
	//var redis = Redis.createClient(), fileClient = Redis.createClient();

    
    Y.AshleshaApp = function() {
        Y.AshleshaApp.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Y.AshleshaApp, Y.Base, {
        initializer: function(config) {
            var app =  express(), server = http.createServer(app);
            io = io.listen(server);
            app.configure(function() {
                var oneYear = 0; 
                app.set('views', __dirname + '/views');
                app.set('view engine', 'haml');
                app.use(express.bodyParser({
			      uploadDir: __dirname + '/public/static/uploads',
			      keepExtensions: true
			    }));
			    app.use(express.limit('5mb'));
                app.use(express.methodOverride());
                app.use(express.cookieParser());
                app.use(express.session({
                    secret: "SessionKey",
                  //  store: new RedisStore({ host: 'localhost', port: 6379, client: redis })

                }));
                
               
                
                /**Event Listener MiddleWare**/
                app.use(function(req,res,next){
                	
                	Y.on("UpdateUser",function(e){
                		if(e.user && e.success){
                			req.session.user = e.user;
                		}
                		
                	});
                	
                	next();
                });
                
                 /** API is decoupled from the NODEJS LAYER this middleware makes available an interface for that API through req object**/
                app.use(function(req,res,next){
                	var api = new Y.BaseAPI(),user = req.session.user || {};
                	req.api = api;
                	req.api.set("user",user);
                	next();
                });
                
                app.use(express.compress());
                app.use(app.router);
                app.use(express.favicon(__dirname + '/public/favicon.ico', {
                    maxAge: oneYear
                }));
                app.use(express.static(__dirname + '/public', {
                    maxAge: oneYear
                }));
                app.set('view options', {
                    layout: false
                });

            });

            this.set('express', app);
            this.set("ioserver",server);
            this.set('config', config);

        },
        showView: function(view, config) {
            var appConfig = this.get('config') || {},
                view, xhr = false;
            if (config.req.header("X-Requested-With") === "XMLHttpRequest") {
                xhr = true;
            }
            view = new Y[appConfig.views[view].type]({
                xhr: xhr,
                modules: config.modules || {}
            });
            
            view.on("render", function(e) {
            	if(Lang.isString(e.data))
            	{
            		config.res.send(e.data); // send the actual response the browser
            	}
            	else
            	{
            		config.res.send(Y.JSON.stringify(e.data));
            	}
                
            });
            
            view.render();

        },
        dispatch: function() {
        	
            var ex = this.get('express');
            ex.listen(confObj.TOKENS.port, function() {
                Y.log("server started on:"+confObj.TOKENS.port);
            });
            
            var self = this;
            
           /* io.sockets.on('connection', function(socket) {
				
			});
			*/

            ex.post("/" + confObj.TOKENS.modelMapURL, function(req, res) { //model mappers
                var data = Y.JSON.parse(req.body.data),
                    action = req.body.action,
                    name = req.body.name,
                    model = new Y[name](),
                    attrs = model.get("attrs") || {};
                   
                	model.set("api",req.api);
                if (model) {
                    model.setAttrs(data);
                    model.on(['save', 'load'], function() {
                    	model.removeAttr("api");
                        res.send(Y.JSON.stringify({
                            success: true,
                            data: model.toJSON()
                        }));
                    });
                    model.on('error', function(e) {
                    	
                        res.send(Y.JSON.stringify({
                            success: false,
                            src: e.src,
                            error: e.error
                        }));
                    });
                    if (action === "create" || action === "update") {
                    	if(action ==="create") { 
                    		model.set("created_at",Date.now());
                    	}
                    	if(action==="update"){
                    		model.set("_id",data._id);
                    	}
                    	model.set("updated_at",Date.now()); 
                        model.save();
                    }
                    else if (action === "read") {
                    	
                    	model.set("_id",data._id);
                        model.load({
                        	req:req
                        	
                        });
                    }
                    else if (action === "delete") {
                        model.destroy({
                            remove: true
                        });
                    }

                }
                else {
                    Y.log("Model Not found.");
                    res.send("");
                }



            });

            ex.post("/" + confObj.TOKENS.apiURL, function(req, res) {
                var path = req.body.path,
                    data = Y.JSON.parse(req.body.data),
                    user = req.session.user,
                    output;
                Y.log("Received API call");
                
                try
                {
                	Y.JSON.stringify(req.api.invoke(path, data,function(err,data){
                		if(typeof err ==="undefined" || err===null){
                			res.send(Y.JSON.stringify(data));
                		}
                		else{
                			res.send(Y.JSON.stringify(err));
                		}
                	}));
                }
                catch(ex)
                {
                	res.send(Y.JSON.stringify({error:true}));
                }
               
                
                

            });
			ex.get("/"+confObj.TOKENS.templateURL+"/:template",function(req,res){
				var view = new Y[req.params.template]({
					xhr:true
				});
				view.on("render",function(e){
					
					res.send(Y.JSON.stringify(e.data));
				});
				view.render();
				
			});
			
			ex.post("/upload",function(req,res){
				var file = req.files.fileupload.path,
				filename = file.split("/").pop();
            	res.send({
            		success:true,
            		url:"/static/uploads/"+filename
            	});

            });
            
            ex.post("/list",function(req,res){
            	var data = {
            		name : req.body.name,
            		size: req.body.size || 10,
					page: req.body.page || 1,
					query: (req.body.query && Y.JSON.parse(req.body.query))|| {}
            	},output;

                output = req.api.invoke("/list/"+req.body.name,data,function(err,data){
                	res.send(Y.JSON.stringify(data));
                });
                
            	
            });
			
			
            ex.get("/test-suite",function(req,res){
            	var testCase=new Y.Test.Case({

				    name: "Login",
				    testLogin : function () {
				        req.api.invoke("/login",{username:'akshar2@akshar.co.in',password:"123456"},function(err,data){
				        	Y.Assert.isObject(data);
				        	Y.Assert.isTrue(data.success,true);
				        	
				        });
				    },
				    testGetFriends: function(){
				    	req.api.invoke("/user/getFriends",{
				    		user_id:"f82553cf0de08b4fba34229d39029af7"
				    	},function(err,data){
				    		Y.Assert.isNull(err);
				    		Y.Assert.isArray(data);
				    	});
				    },
				    testGetByRelation: function(){
				    	req.api.invoke("/relations/getByRelation",{
				    		user_id:"f82553cf0de08b4fba34229d39029af7",
				    		relation:"friend"
				    	},function(err,data){
				    		Y.Assert.isNull(err);
				    		Y.Assert.isArray(data);
				    		
				    	});
				    },
				    testWardrobeSections:function(){
				    	req.api.invoke("/relations/getByRelation",{
				    		user_id:"f82553cf0de08b4fba34229d39029af7"
				    		
				    	},function(err,data){
				    		Y.Assert.isNull(err);
				    		Y.Assert.isArray(data);
				    		
				    	});
				    }
				    
				});
            	
            	res.send("Complete");
                Y.Test.Runner.add(testCase);
                Y.Test.Runner.run();
            });
           
           ex.get("/db-update",function(req,res){
           		req.api.invoke("/db/update",{},function(){
           			res.send("Updated");
           		});
           		res.send("Updated");
           });
           
           ex.get("/signout",function(req,res){
		
				delete req.session.user;
				req.session.regenerate(function(){
				    res.redirect('/');
				});
			
			});
            
           
             
            
        },
        route: function(path, callback) {
            var ex = this.get('express'),
                self = this;
            ex.get(path, function(req, res) {
                callback.apply(self, [req, res]);
            });
        },
        render: function() {
            return this;
        },
        navigate:function(path,res){
        	res.redirect(path);
        }
    });


	Y.AshleshaBaseList = function(){
		Y.AshleshaBaseView.superclass.constructor.apply(this, arguments);
	};
	Y.extend(Y.AshleshaBaseList, Y.ModelList,{});
	
}, '0.99', {
    requires: ['base','model-list','ashlesha-api-base','test'],
    skinnable: false
});