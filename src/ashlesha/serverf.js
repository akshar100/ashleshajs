/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global __dirname*/
"use strict";

var YUI = require('yui').YUI,
    API = require('api'),
    redis = require('redis'),
    io = require("socket.io");

YUI().add('ashlesha-api', function(Y) {
    Y.APIEndpoint = {
        invoke: function(path, config) {
            var response;
            API.setYInstance(Y);
            response = API.api(path, config); //The Real API will never have callbacks into it
			return response;
        }
    };

    Y.BaseAPI = Y.Base.create("BaseAPI", Y.Base, [], {
        initializer: function() {
            this.set("m", []);
        },
        invoke: function(path, config, callback) {
            var ep = Y.APIEndpoint,
                cfg = config || {},
                output;
            config.user = this.get("user"); // We need to send the current user with the API call as well.
            output = ep.invoke(path, cfg);
            return output;
            
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
            var dburl = "http://@COUCHHOST@:@COUCHPORT@/@COUCHDB_NAME@",
                data = this.toJSON();

            switch (action) {
            case "read":
                Y.io(dburl + "/" + data._id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
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
                            Y.log(Y.JSON.stringify(response));
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
                        'Content-Type': 'application/json',
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
                            Y.log(Y.JSON.stringify(response));
                        }
                    }
                });
                break;
            case "update":
                Y.io(dburl + "/" + data._id, {
                    method: 'PUT',
                    data: Y.JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
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
                        'Content-Type': 'application/json',
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



YUI().add('server-app', function(Y) {

    var express = require('express'),
        routes = require('./routes'),
        fs = require("fs"),
        Lang = Y.Lang,
        oneYear = 31557600000;;

    Y.Express = express;
    var RedisStore = require('connect-redis')(express);
    
    Y.AshleshaApp = function() {
        Y.AshleshaApp.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Y.AshleshaApp, Y.Base, {
        initializer: function(config) {
            var app = module.exports = express.createServer();
            io = io.listen(app);
            app.configure(function() {
                var oneYear = 0; //31557600000; //We are setting Expirty to none for development version.
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
                    store: new express.session.MemoryStore
                }));
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
            Y.log("requested to render:"+view.name);
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
            Y.log(view.name);
            view.render();

        },
        dispatch: function() {
        	
            var ex = this.get('express');
            ex.listen(Y.config.AppConfig.port, function() {
                Y.log("server started");
            });
            var self = this;
            
           /* io.sockets.on('connection', function(socket) {
				
			});
			*/

            ex.post("/" + Y.config.AppConfig.modelMapURL, function(req, res) { //model mappers
                var data = Y.JSON.parse(req.body.data),
                    action = req.body.action,
                    name = req.body.name,
                    model = new Y[name]();
                    
                if (model) {
                    model.setAttrs(data);
                    model.on(['save', 'load'], function() {
                        res.send(Y.JSON.stringify({
                            success: true,
                            data: model.toJSON()
                        }));
                    });
                    model.on('error', function(e) {
                    	Y.log(e);
                        res.send(Y.JSON.stringify({
                            success: false,
                            src: e.src,
                            error: e.error
                        }));
                    });
                    if (action === "create" || action === "update") {
                    	if(action ==="create") { model.set("created_at",Date.now()); }
                    	if(action ==="update") { model.set("updated_at",Date.now()); }
                        model.save();
                    }
                    else if (action === "read") {
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

            ex.post("/" + Y.config.AppConfig.apiURL, function(req, res) {
                var path = req.body.path,
                    data = Y.JSON.parse(req.body.data),
                    user = req.session.user,
                    output;
                Y.api = self.get("config").api;
                Y.api.set("user", user);
                Y.on("api:/login",function(e){
                	
	        		if(e.user)
	        		{
	        			user = req.session.user = e.user;
	        		}
	           	});
                try
                {
                	output = Y.JSON.stringify(Y.api.invoke(path, data));
                }
                catch(ex)
                {
                	output = Y.JSON.stringify({error:true});
                }
               
                
                res.send(output);

            });
			ex.get("/"+Y.config.AppConfig.templateURL+"/:template",function(req,res){
				new Y[req.params.template]().render();
			});
			
			ex.post("/upload",function(req,res){
				var file = req.files.fileupload.path,
				filename = file.split("/").pop();
            	res.send({
            		success:true,
            		url:"/static/uploads/"+filename
            	});

            });
			
			
            ex.get("/test-suite",function(req,res){
            	res.log(req.session.user);
            	
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
        }
    });


    Y.AshleshaBaseView = function() {
        Y.AshleshaBaseView.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Y.AshleshaBaseView, Y.Base, {
        initializer: function(config) {
        	var m;
            if (config) {
                this.set("xhr", config.xhr || false);
                this.set("modules", config.modules || {} );
                if(Y.Lang.isFunction(this.preModules)) //Sometimes you may want to define modeules within the view instead of passing them to the constructor
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
                                    fs.readFile("./views/mixins/default/" + template + ".tpl", function(err, data) {
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
                    
                    fs.readFile("./views/mixins/default/" + template + ".tpl", function(err, data) {
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
                fs.readFile("./views/mixins/default/mainpage.tpl", function(err, data) {
                    if (!err) {
                        self.fire("render", {
                            data: Lang.sub(data.toString(), {
                                baseURL: Y.config.AppConfig.baseURL
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


}, '0.99', {
    requires: ['base', 'model', 'ashlesha-base-models', 'ashlesha-api'],
    skinnable: false
});