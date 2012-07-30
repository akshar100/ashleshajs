/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global YUI*/
/*global jQuery*/
"use strict";
YUI({
    AppConfig: {
        baseURL: 'http://@SUBDOMAIN@.@DOMAIN@.@TLD@/',
        logoImage: 'static/images/logo.png',
        skin: "default",
        templateURL: 'template/',
        //URL that returns templates,
        cache: false,
        LOADER: 'http://@SUBDOMAIN@.@DOMAIN@.@TLD@/static/loader.gif',
        modules: {
            "chart": {
                view: 'Chart'
            },
            "signup": {
                view: "SignUpView",
                config: {
                    "userAgnostic": true
                }
            },
            "login": {
                view: "LoginView"
            },
            "herounit": {
                view: "HeroUnit",
                config: {
                    "userAgnostic": true
                }
            },
            "topbar": {
                view: "TopBarView"
            },
            "sidebar": {
                view: "SideBarView"
            },
            "mainmessage": {
                view: "MainMessageView",
                config: {
                    "userAgnostic": true
                }
            },
            "posts": {
                view: "PostsView"
            },
            "poststoolbar": {
                view: "ToolBarView",
                config: {
                    btnConfig: [{
                        link: "/my/posts/new",
                        label: 'New Post',
                        icon: 'icon-plus'},
                    {
                        link: '/my/posts/manage',
                        label: 'Manage',
                        icon: 'icon-list-alt'

                        }
                                                                                                ]
                }
            },
            "newpost": {
                view: "CreateItemView",
                config:{
                	templateName: "CreatePostView", //this is the model which CreateItemView will use to render a form
                	strLabels:{
                		title:"Create Post",
                		submit:"Post"
                	},
                	modelConfig:{
                		type:"post",
                		modelID:'PostModel'
                	}
                }
            },
            "managepost": {
                view: "CreateItemView"
            },
            "textbox": {
            	view: "TextBoxView",
            	config:{
            		"userAgnostic": true
            	},
            	customConfigs:{
            		"post-title":{
            			modelKey:"title",
            			placeholder:"Title..",
            			label:"Title",
            			helptext:"",
            			name:"title",
            			validate:"required"
            		}
            	}
            },
            "textarea": {
            	view:"TextAreaView",
            	config:{
            		"userAgnostic": true
            	},
            	customConfigs:{
            		"post-body":{
            			modelKey:"text",
            			placeholder:"Whatever you have to say...",
            			label:"Post",
            			helptext:"Keep your post short",
            			name:"text",
            			validate:"required"
            		}
            	}
            }
        },
        actions: { //Actions tell is which views are to be loaded for which url patterns in URL /posts/new new is an action of PostsView
            "posts": {
                "new": [{
                    container: "content",
                    //this will ensure that the Action View is rendered in data-action-holder=content
                    module: "newpost",
                    //New Post module is to be loaded
                    config: {} //Any additional parameters. Will be Y.mixed with default parameters
                    }
                                        ],
                "manage": [{
                    container: "content",
                    //this will ensure that the Action View is rendered in data-action-holder=content
                    module: "managepost",
                    //New Post module is to be loaded
                    config: {} //Any additional parameters. Will be Y.mixed with default parameters
                    }]
            }
        },
       
        modelURL: 'datastore/',
        //Cache the models syn layer as well ?
        validations: {
            required:function(val,name){
            	if(!val)
            	{
            		return true; //Error exists
            	}
            },
            maxlen:function(len){
            	return function(val,name){
            		if(val.length>len){
            			return true;
            		}
            	};
            	
            },
            minlen:function(len){
            	return function(val,name){
            		if(val.length<len){
            			return true;
            		}
            	};
            	
            }            
            
        }
    }
}).use('ashlesha-app', function(Y) {
    var AppUI, AshleshaAuth = new Y.AshleshaAuth(),
        AshleshaViewServer = new Y.AshleshaViewServer(),
        cache = new Y.CacheOffline(),
        modules = Y.config.AppConfig.modules,
        mainViews;
    if (!Y.config.AppConfig.cache) {
        cache.flush();
    }

    //Based on configuration let us decide which views are available to us
    mainViews = {
        home: {
            'type': 'HomeView'
        }
    };
    Y.Object.each(modules, function(value, key) {
        if (!mainViews[key]) {
            mainViews[key] = {
                "type": value.view
            };
        }
    });
    
    AppUI = new Y.App({
        views: mainViews,
        transitions: {
            navigate: 'fade',
            toChild: 'fade',
            toParent: 'fade'
        }
    });
    AppUI.route("/", function(req) {
        this.showView('home');
    });
    AppUI.route("/logout", function(req) {
        Y.fire("auth_logout");
    });

    AppUI.route("/my/:module/:action", function(req) {
        var m = req.params.module,
            a = req.params.action,
            config;
        if (modules[m]) {
            config = modules[m].config || {};
            Y.mix(config, {

                action: {
                    module: m,
                    action: a
                }
            });
            this.showView(m, config);
        }
    });

    AppUI.route("/my/:module", function(req) {
        var m = req.params.module;
        if (modules[m]) {
            this.showView(m, modules[m].config || {});
        }
    });

    AppUI.render().dispatch();
    Y.on("navigate", function(e) {
        AppUI.navigate(e.action || "/");
    });

    AshleshaAuth.setUpAuthEnvironment(); //check if the user is logged in and then according notify all the views
});