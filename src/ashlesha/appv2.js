/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global YUI*/
"use strict";

YUI({
    AppConfig: {
        baseURL: 'http://@SUBDOMAIN@.@DOMAIN@.@TLD@/',
        port:'@PORT@',
        logoImage: 'static/images/logo.png',
        loaderImage:'static/loader.gif',
        modelMapURL: 'model',
        apiURL:'api',
        couch: {
            host: '@COUCHHOST@',
            port: 5984,
            dbname: '@COUCHDB_NAME@'
        }
        
    },
    modules: {

    }
}).use('base', 'cache', 'ashlesha-common', function() {
    if (typeof document !== 'undefined') {
        return 'client-app';
    } else {
        return 'server-app';
    }
}(), function(Y) {
    var vcache = new Y.CacheOffline({
        sandbox: "views"
    }),
        mcache = new Y.CacheOffline({
            sandbox: "models"
        }),
        model;
    vcache.flush();
    mcache.flush();
	var currentUser = new Y.AshleshaCurrentUserModel();
		currentUser.load();
		
    Y.HomeView = Y.Base.create("HomeView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get('template');
            if (!auth.user) { //if the user is not signed in
            	
                c.setHTML(t.one('#HomeView-main-unsigned').getHTML());
               
            } else { //if the user is signed in
            	Y.log("signed in");
            }
            this.loadModules();
        }
    });


    var app = new Y.AshleshaApp({
        views: {
            home: {
                type: "HomeView"
            },
            page: {
            	type:"PageView",
            	preserve:false
            }
        },
        transitions: {
            navigate: 'fade',
            toChild: 'fade',
            toParent: 'fade'
        },
        api:Y.api
    });

    app.route("/", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user:currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                }

            }
        });
    });
    
    app.route("/signin",function(req,res){
    	this.showView('page', {
            req: req,
            res: res,
            user:currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".page-content": {
                	view:"LoginView"
                }

            }
        });
    });
    
    app.route("/signup",function(req,res){
    	this.showView('page', {
            req: req,
            res: res,
            user:currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".page-content": {
                	view:"SignUpView",
                	config:{
                		modules:{
                			'div.date_field':{
                				view:"DateField",
                				config:{
                					label:'Date of Birth',
                					field_name:'dob'
                				}
                			},
                			'div.first_name':{
                				view:'FormItem',
                				config:{
                					label:'First Name',
                					field_name:'firstname'
                				}
                			},
                			'div.last_name':{
                				view:'FormItem',
                				config:{
                					label:'Last Name',
                					field_name:'lastname'
                				}
                			},
                			'div.password':{
                				view:'FormItem',
                				config:{
                					label:'Password',
                					field_name:'password',
                					field_type:'password'
                				}
                			},
                			'div.password2':{
                				view:'FormItem',
                				config:{
                					label:'Repeat Password',
                					field_name:'password2',
                					field_type:'password'
                				}
                			},
                			'div.email':{
                				view:'FormItem',
                				config:{
                					label:'Email',
                					field_name:'email'
                				}
                			},
                			'div.gender':{
                				view:'SelectField',
                				config:{
                					label:'You are',
                					field_name:'gender',
                					options:{
                						m:"Male",
                						f:"Female"
                					}
                				}
                			}
                		}
                	}
                }

            }
        });
    });
   
    app.render().dispatch();
});