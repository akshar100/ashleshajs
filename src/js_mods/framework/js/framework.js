/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global YUI*/
/*global jQuery*/
/*dev alert("debug version"); */
/**
 * The ashlesha-app is the module that loads all the neccessary infrastructure for the Ashlesha based web application
 * @module module-name
 */
YUI.add('ashlesha-app', function(Y) {
	"use strict";
    // handy constants and shortcuts used in the module
    var Lang = Y.Lang;

    /**
     * The RequestServer provides the basic functionality of accepting requests and sending responses asynchronously.
     * This is a a classic Facade Design pattern.
     * To use do 
     * 
     *  	Y.mix(YourObj,Y.RequestServer);
     * 
     * @class RequestServer
     * @extends Base
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.RequestServer = function() {
        Y.RequestServer.superclass.constructor.apply(this, arguments);
    };

    Y.augment(Y.RequestServer, Y.EventTarget);
    Y.extend(Y.RequestServer, Y.Base, {
    	/**
		* This method is to be used if your object acts as a server if you call
		* 
		* 	myobj.registerListener("pincode",function(e){
		* 		if(e.pincode && e.pincode.length===6){
		* 			this.sendResponse(e,"valid");
		*   	}
		* 		else{
		* 			this.sendResponse(e,"invalid");
		* 		}
		* 	},this); 
		*
		* @method registerListener
		* @param {String} token_name is a string using which clients will send requests.
		* @param {Function} callback Will be called everytime a request is received. You might want to call this.sendResponse() to send response inside the callback
		* @return 
		*/
        registerListener: function(keyword, listenerCallback, ctx) {
            Y.on(keyword + "_request", function(e) {
                e.__keyword = keyword;
                listenerCallback.call(this, e); // you should call this.sendResponse(e,response) inside this method else no response will be sent.
            }, ctx);
        },
        sendResponse: function(e, obj, broadcast) {
            var eventStr = e.__keyword + "_response:";
            if (broadcast !== true) {
                Y.fire(eventStr + e.__token, obj); //send only to the one who has requested
                return;
            }
            this.sendBroadcastResponse(e.__keyword, obj); //send unsolicitated response to all the objects
        },
        sendRequest: function(keyword, request, responseCallback, ctx) {
            var eventStr = keyword + "_response:";
            request = request || {}; // if request is empty please create an empty object
            request.__token = Math.random();
            if (Lang.isFunction(responseCallback)) {
                Y.once(eventStr + request.__token, responseCallback, ctx);
            }

            Y.fire(keyword + "_request", request);
        },
        sendBroadcastResponse: function(keyword, obj) {

            var eventStr = keyword + "_response:*";
            Y.fire(eventStr, obj); //send unsolicitated response to all the objects
        },
        receiveBroadcast: function(keyword, callback, ctx) {
            if (!Lang.isFunction(callback)) {

                throw new Error("Callback function not provided");
            }
            Y.on(keyword + "_response:*", function(e) {
                callback.apply(ctx, [e]);
            });
        }


    });

    /**
     * The AshleshaAuth Class holds the Current User Information. Depending the user presence and his rights other modules do async calls via Y.fire and Y.on
     * to perform their operations. This class must always be initialized synchronously before any other modules are initialized.
     * @class AshleshaAuth
     * @extends Y.Model
     * @uses WidgetParent
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaAuth = Y.Base.create('AshleshaAuth', Y.Model, [Y.RequestServer], {
        sendAuthResponse: function(token, obj) {
            Y.fire("auth_response:" + token, obj);
        },
        initializer: function() {
            this.registerListener("auth", function(e) {
                var model, user, self = this;
                if (this.get("user")) {
                    this.sendResponse(e, {
                        authenticated: true,
                        user: this.get("user")
                    });
                }
                else {

                    if (e.username || e.password) //If someone is trying to attempt a login by providing Username and Password
                    {
                        model = new Y.AshleshaLoginModel({
                            username: e.username,
                            password: e.password
                        });
                        model.on("save", function(err) {


                            this.setUpAuthEnvironment(); // Load the current user and let everyone know that
                        }, this);
                        model.on("error", function(errorEvent) {
                            this.sendResponse(e, {
                                authenticated: false,
                                //tell the requester that his attempt succeeded and proceede to informing everyone
                                error: errorEvent.error // actual error
                            });
                        }, this);
                        model.save();


                    }
                    else {
                        this.sendResponse(e, {
                            authenticated: false,
                            error: 'Please provide both username and password'
                        });
                    }


                }

            }, this);
            this.on("change", function(e) {
                if (e.changed.user) {
                    if (e.changed.user.newVal === "") {
                        this.sendBroadcastResponse("auth", {
                            authenticated: false
                        }); //broadcast message
                    }
                    else {
                        this.sendBroadcastResponse("auth", {
                            authenticated: true,
                            user: this.get("user")
                        });
                    }
                }
            }, this);

            Y.on("auth_logout", function() {
                var user = this.get('user');
                if (user) {
                    this.set('user', "");
                    user.destroy({
                        remove: true
                    });
                    Y.fire("navigate", {
                        action: "/"
                    });
                }

            }, this);

        },
        setUpAuthEnvironment: function() {
            var user = new Y.AshleshaCurrentUserModel({
                _id: 'current_user'
            }),
                self = this;
            user.load(function(err, response) {
                if (!err) {
                    self.set("user", user); //the moment you set the user everyone is notified :)
                }
            });
        }


    }, {
        ATTRS: {
            user: {
                value: ""
            }
        }
    });

    /**
     * AshleshaViewServer creates Views that are commonly used and keeps them in the DOM and serves them whenever requested
     * @class AshleshaViewServer
     * @extends Widget
     * @uses WidgetParent
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaViewServer = Y.Base.create('AshleshaViewServer', Y.Model, [Y.RequestServer], {
        initializer: function() {
            this.registerListener("view", function(e) {
                var view = e.view;
                if (view) //the view is either not provided or not loaded
                {
                    if (!this.get(view)) {

                        try {

                            if (Lang.isObject(Y[view])) {

                                this.set(view, new Y[view](e.config || {})); //Create and Instance of the supplied view with the configuration provided
                            }
                        }
                        catch (ex) {
                            Y.log(ex);
                        }
                    }

                    this.sendResponse(e, {
                        view: this.get(view)
                    });
                } else {
                    throw new Error("The ViewServer received a request but no view name was provided");
                }

            }, this);

        }
    }, {
        ATTRS: {

        }
    });


    /**
     * The AshleshaBaseView class is the base class for all Views. It dynamically loads the templates, stores them in localstorage if available,
     * it fetches the user if present and accordingly calls two functions. (authenticated or unauthenticated). If your view is agnostic to user
     * then please provide ("useragnostic:true") as initialization parameter. The method to be specified in that case is altInitializer (Alternate Initializer)
     * All the child Modules hence need not bother about theme loading and user detection.
     * @class AshleshaBaseView
     * @extends View
     * @uses
     * @constructor
     * @cfg {userAgnostic:false} configuration attributes
     */
    Y.AshleshaBaseView = Y.Base.create('AshleshaBaseView', Y.View, [Y.RequestServer], {
        containerTemplate: '<DIV/>',
        initializer: function() {
            var request_token = Math.random(),
                c = this.get("container"),
                cache = new Y.CacheOffline(),
                loader = Y.Node.create('<img src=' + Y.config.AppConfig.LOADER + ' />');

            c.setHTML(loader);
            this.on("template_loaded", function() {
                if (this.get("userAgnostic")) {
                    this.altInitializer.apply(this, arguments);
                }
                else {

                    this.sendRequest("auth", {}, this.authChangeHandler, this);
                    this.receiveBroadcast("auth", this.authChangeHandler, this);
                }

            }, this);
            this.loadTemplate();

            this.on("wait:start", function(e) {
                var c = e.target.render().get('container'),
                    region, overlay, body = Y.one("body");
                if (body.contains(c)) {
                    region = c.get("region");
                    overlay = Y.Node.create("<div class='wait-backdrop'/>");
                    overlay.setXY([region.left, region.top]);
                    overlay.setStyle("height", region.height + "px");
                    overlay.setStyle("width", region.width + "px");
                    overlay.append(loader);
                    c.append(overlay);
                }
            });
            this.on("wait:end", function(e) {
                var overlay, c = e.target.render().get('container');
                overlay = c.one('.wait-backdrop');
                overlay.remove(true);
            });
        },
        hasPermission: function(u) {
            var user = u || this.get("user"),
                roles = this.get("roles");
            if (roles && user) {
                Y.Array.each(roles, function(role) {
                    if (user.hasRole(role)) {
                        return true;
                    }
                });
                return false;
            }
            return true;

        },
        authChangeHandler: function(response) {
            var roles, user, permission_flag = false,
                c = this.get('container');

            if (response.authenticated) {
                this.set("user", response.user); //set user for the use
                permission_flag = this.hasPermission();
                if (permission_flag) //only if the user has persmission then execute this authenticated method
                {
                    this.authenticated.call(this, response.user);
                }
                else //user does not have permission so simply hide the container
                {
                    c.addClass('hide');
                }

            }
            else {
                this.unauthenticated.call(this);
            }
        },
        loadTemplate: function() {
            var templateURL = Y.config.AppConfig.baseURL + Y.config.AppConfig.templateURL,
                cache = new Y.CacheOffline(),
                tl = this.get("templateName") || this.name;

            if (this.get('template')) {
                this.fire("template_loaded"); //If user has provided a template then dont bother to fetch it just return it
            }

            if (cache.retrieve(tl)) {
                this.set("template", Y.Node.create(cache.retrieve(tl).response));
                this.fire("template_loaded");
            }
            else {
                Y.io(templateURL, {
                    method: 'POST',
                    data: {
                        view: tl,
                        skin: Y.config.AppConfig.skin
                    },
                    context: this,
                    on: {
                        success: function(i, o, a) {

                            cache.add(tl, o.responseText + "<script type='text/x-template'></script>");

                            this.set("template", Y.Node.create(cache.retrieve(tl).response));
                            this.fire("template_loaded");
                        }
                    }
                });
            }

        },
        authenticated: function(user) { //what happens when a view is called and
        },
        unauthenticated: function() {

        },
        altInitializer: function() {

        },
        requestView: function(view, config, callback) {


            this.sendRequest("view", {
                view: view,
                config: config || {}
            }, function(e) {

                if (e.view && Lang.isFunction(callback)) {
                    callback.apply(this, [e.view]);
                }
            });
        },
        processModules: function(callback) {
            var c = this.get('container'),
                self = this;
            c.all('[data-module=enabled]').each(function(item) {
                self.appendModule(item);
            });

        },
        appendModule: function(container, config, callback) {
            var modules = Y.config.AppConfig.modules,
                moduleName = container.getAttribute('data-module-name'),
                module = modules[moduleName],
                self = this,
                providedConfig = config || {},
                moduleConfig, customConfig = container.getAttribute('data-module-config');

            if (modules[moduleName].customConfigs && customConfig && modules[moduleName].customConfigs[customConfig]) {
                Y.mix(providedConfig, modules[moduleName].customConfigs[customConfig]);
            }
            if (module && module.view) {
                moduleConfig = module.config || {};
                Y.mix(providedConfig, moduleConfig);
                self.requestView(module.view, providedConfig, function(view) {
                    container.setHTML(view.render().get('container'));
                    if (Lang.isFunction(callback)) {
                        callback.apply(this, [view, moduleName]);
                    }

                });

            }
            else {
                throw new Error("Could not load the module " + moduleName);
            }
        },
        requestModel: function(modelName, callback, context) {
            var token = Math.random();
            Y.once("model_response:" + token, function(e) {
                if (Lang.isFunction(callback)) {
                    callback.call(context || this, e.model);
                }
            });
            Y.fire("model_request", {
                modelName: modelName,
                token: token
            });
        }

    });


    /**
     * The HeroUnit class represents a block that appears on the HomePage
     * @class HeroView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.HeroUnit = Y.Base.create('HeroUnit', Y.AshleshaBaseView, [], {
        containerTemplate: '<DIV/>',
        altInitializer: function() {

            this.get("container").setHTML(this.get("template").one("#herounit-template").getHTML());
            if (Lang.isFunction(jQuery)) {
                jQuery(this.get("container").getDOMNode()).carousel({
                    interval: 6000
                });
            }

        }
    });
    
    

    /**
     * The AshleshaLoginModel model is responsible for Login
     * @class  AshleshaBaseModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaLoginModel = Y.Base.create('AshleshaLoginModel', Y.AshleshaBaseModel, [], {

        validate: function(attrs) {
            if (!attrs.username || !attrs.password) {
                return "Username and Password both must be provided!";
            }
            if (attrs.username.length < 3) {
                return "We dont allow that small Username";
            }
            if (attrs.password.length < 6) {
                return "Passwords less than 6 characters are not allowed";
            }
        }
    }, {
        ATTRS: {
            username: {

            },
            password: {

            },
            authenticated: {
                value: false
            }
        }
    });







    /**
     * The AshleshaCurrentUserModel model is the current user model which means it will fetch all the information of the current user only.
     * This model can not be used to fetch any other user's details.
     * @class  AshleshaBaseModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaCurrentUserModel = Y.Base.create('AshleshaCurrentUserModel', Y.AshleshaBaseModel, [], {
        hasRole: function(role) {
            var roles = this.get("roles");
            if (roles && roles.indexOf(role) > -1) {
                return true;
            }
            return false;
        }

    }, {
        ATTRS: {


        }
    });

    /**
     * The LoginView module renders a login box. Currently it does not support OpenID based logins
     * @class HeroView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.LoginView = Y.Base.create('LoginView', Y.AshleshaBaseView, [], {
        containerTemplate: '<DIV/>',
        unauthenticated: function() {
            var c = this.get("container"),
                token = Math.random();
            c.setHTML(this.get("template").one("#login-template").getHTML());
            Y.on("auth_response:" + token, function(e) {
                if (!e.authenticated) {
                    c.one('.alert-error').removeClass('hide');
                    c.one('.alert-error').setHTML(e.error);
                }
                else {
                    c.one('.alert-success').removeClass('hide');
                }

            }, this);
            c.one("button.login").on("click", function(e) {
                c.one('.alert').addClass('hide');
                Y.fire("auth_request", {
                    username: c.one("#username").get("value"),
                    password: c.one("#password").get("value"),
                    token: token
                });
            }, this);

        }
    });


    /**
     *
     * AshleshaSignUpModel is created to let users signup or to create new users. It requires the config attributes for validation functions
     * @class  AshleshaBaseModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaSignUpModel = Y.Base.create('AshleshaSignUpModel', Y.AshleshaBaseModel, [], {
        remoteValidate: function() { //Function for which we wish to call remote validator
        },
        validate: function(attrs) {

            var vfs = Y.config.AppConfig.validations,
                i, error = null,
                errors = [];
            for (i in attrs) {
                if (Lang.isFunction(vfs[i])) {
                    error = vfs[i].apply(this, [attrs[i]]);
                    if (error) {
                        errors.push({ //return all the errors we returns all the errors as a an array
                            label: i,
                            error: error
                        });
                    }
                }
            }
            if (errors.length > 0) {
                return errors;
            }

        }
    }, {
        ATTRS: {
            username: {
                value: ''
            },
            password: {
                value: ''
            },
            fullname: {
                value: ''
            },
            email: {
                value: ''
            },
            gender: {
                value: ''
            },
            type: {
                value: ''
            }

        }
    });

    /**
     * The LoginView module renders a login box. Currently it does not support OpenID based logins
     * @class HeroView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.SignUpView = Y.Base.create('SignUpView', Y.AshleshaBaseView, [], {
        containerTemplate: '<DIV/>',
        altInitializer: function() {
            var model = new Y.AshleshaSignUpModel(),
                c = this.get("container"),
                t = this.get("template");
            this.set("model", model);
            c.setHTML(t.one("#signup-template").getHTML());
            model.on('error', this.errorHandler, this);
            model.on('save', this.success, this);
            c.one('#signup-form-submit').on('click', function() {
                model.setAttrs({
                    username: c.one("#username").get("value"),
                    password: c.one("#password").get("value"),
                    email: c.one("#email").get("value"),
                    fullname: c.one("#fullname").get("value"),
                    gender: c.one("[name=gender]:checked").get("value")
                });
                c.all(".control-group").removeClass('error');
                c.all(".help-inline").setHTML("");
                model.save();
            }, this);

        },
        errorHandler: function(e) {
            var c = this.get('container');
            if (e.error && Lang.isArray(e.error)) {
                Y.Array.each(e.error, function(item) {
                    var input = c.one("#" + item.label),
                        cg;
                    if (input) {
                        cg = input.ancestor(".control-group");
                        if (cg) {
                            cg.addClass('error');
                            if (cg.one(".help-inline")) {
                                cg.one(".help-inline").setHTML(item.error);
                            }

                        }
                    }
                });
            }
            c.all("input").each(function(item) {
                var cg;
                if (e.error.label === item.get("id")) {
                    cg = item.ancestor(".control-group");
                    if (cg) {
                        cg.addClass('error');
                        if (cg.one(".help-inline")) {
                            cg.one(".help-inline").setHTML(e.error.error);
                        }

                    }
                }
            });
        },
        success: function() {
            var m = this.get("model");
            Y.fire("auth_request", {
                username: m.get("username"),
                password: m.get("password")
            });
        }
    });

    /**
     * The TopBarView class represents the view of the main page. For an unauthenticatd user this would be a signup page.
     * @class TopBarView
     * @extends View
     * @uses WidgetParent
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.TopBarView = Y.Base.create('TopBarView', Y.AshleshaBaseView, [], {
        authenticated: function(user) {
            var c = this.get('container');
            c.setHTML(Lang.sub(this.get('template').one("#topbar-authenticated").getHTML(), {
                LOGO: Y.config.AppConfig.baseURL + Y.config.AppConfig.logoImage
            }));
            this.processModules();
        },
        unauthenticated: function() {
            var c = this.get('container');
            c.setHTML(Lang.sub(this.get('template').one("#topbar-unauthenticated").getHTML(), {
                LOGO: Y.config.AppConfig.baseURL + Y.config.AppConfig.logoImage
            }));

        }
    });


    /**
     * The AshleshaSideBarModel model is responsible for Login
     * @class  AshleshaSideBarModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaSideBarModel = Y.Base.create('AshleshaSideBarModel', Y.AshleshaBaseModel, [], {});


    /**
     * The SideBarView is the sidebar of our application of course it will be present only for the signed in users.
     * @class SideBarView
     * @extends View
     * @uses View, Model
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.SideBarView = Y.Base.create('SideBarView', Y.AshleshaBaseView, [], {
        authenticated: function(user) {
            var c = this.get('container'),
                model;
            c.setHTML(this.get('template').one('#sidebar-authenticated').getHTML());
            model = new Y.AshleshaSideBarModel({
                user: user.get("_id")
            });
            model.on('load', function() {
                var list = c.one(".nav-list");
                list.setHTML('');
                Y.Object.each(model.get('items') || [], function(item, index) {
                    list.append(Lang.sub('<li class="nav-header">{LABEL}</li>', {
                        LABEL: index
                    }));
                    Y.Object.each(item, function(links, link_text) {
                        list.append(Lang.sub('<li><a href="{LINK}">{LABEL}</a></li>', {
                            LINK: links,
                            LABEL: link_text
                        }));
                    });
                });
            }, this);
            model.load();

        },
        unauthenticated: function() {
            var c = this.get('container');
            c.addClass('hide');

        }
    });

    /**
     * The MainMessageView is the place where you give messages to the users.
     * @class MainMessageView
     * @extends View
     * @uses View, Model
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.MainMessageView = Y.Base.create('MainMessageView', Y.AshleshaBaseView, [], {
        altInitializer: function(user) {
            var c = this.get('container'),
                model;
            model = new Y.AshleshaBaseModel({ //create Main Message model
                modelID: 'MainMessageModel'
            });
            model.on('load', function() {
                c.setHTML(Lang.sub(this.get('template').one("#mainmessage-template").getHTML(), {
                    MESSAGE: model.get("message")
                }));
                this.processModules();
            }, this);
            model.load();

        }
    });



    /**
     * The HomeView class represents the view of the main page. For an unauthenticatd user this would be a signup page.
     * @class HomeView
     * @extends View
     * @uses WidgetParent
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.HomeView = Y.Base.create('HomeView', Y.AshleshaBaseView, [], {
        authenticated: function(user) {
            var c = this.get('container'),
                t = this.get('template'),
                action = this.get('action'),
                actionHandler;
            c.setHTML(t.one("#outer").getHTML());
            c.one("#maincontainer").setHTML(t.one("#main").getHTML());
            this.processModules();
            if (action) {
                this.actionHandler(action);
            }
        },
        unauthenticated: function() { //keep this method Synchronous
            var c = this.get('container'),
                t = this.get('template');
            if (t.one("#outer") && t.one("#unsigned-main")) {
                try {
                    c.setHTML(t.one("#outer").getHTML());
                    c.one("#maincontainer").setHTML(t.one("#unsigned-main").getHTML());
                    this.processModules();
                } catch (ex) {
                    Y.log(ex);
                }


            }

        },
        actionHandler: function(e) {
            var c = this.get('container'),
                actions = Y.config.AppConfig.actions,
                action = e.action,
                module = e.module,
                container, views = actions[module][action]; //fetch the config from the Global configuration
            if (module && action && actions[module] && actions[module][action]) {
                Y.Array.each(views, function(item) {
                    container = c.one(Lang.sub("[data-action-holder={CONTAINER}]", {
                        CONTAINER: item.container
                    }));
                    if (container) {
                        container.setAttribute("data-module-name", item.module);
                        this.appendModule(container, actions[module][action].config);
                    }
                }, this);

            }

        }
    });

    /**
     * The this view shows the post cosole for a user. Use can create, update, delete his posts. Publish them as public or publish them to various streams.
     * @class PostsView
     * @extends View
     * @uses WidgetParent
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.PostsView = Y.Base.create('PostsView', Y.HomeView, [], {
        authenticated: function(user) {
            Y[this.name].superclass.authenticated.call(this, user); //Call the superclass method            
        },
        unauthenticated: function() {

        }
    });

    /**
     * The ToolBarView is used to render toolbars
     * @class ToolBarView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.ToolBarView = Y.Base.create('ToolBarView', Y.AshleshaBaseView, [], {
        authenticated: function() {

            var c = this.get('container'),
                btnConfig = this.get("btnConfig"),
                n, t = this.get('template');
            c.setHTML(t.one("#toolbar-authenticated").getHTML());
            if (btnConfig && Lang.isArray(btnConfig)) {
                var toolbar = c.one('.toolbar');
                Y.Array.each(btnConfig, function(item) {
                    n = Y.Node.create(Lang.sub(t.one("#toolbar-button").getHTML(), {
                        PATH: item.link,
                        LABEL: item.label,
                        CLASSES: item.classes || '',
                        ICON: item.icon

                    }));
                    toolbar.append("&nbsp;");
                    toolbar.append(n); //Every button must be separate by a space
                });
            }
        },
        unauthenticated: function() {

        }
    });


    /**
     * The CreateItemView is a special view that renders forms based on the configuration properties provided.
     * It is also responsible for validation and submission
     * @class CreateItemView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.CreateItemView = Y.Base.create('CreateItemView', Y.AshleshaBaseView, [], {
        events: {
            "form": {
                "submit": "submitForm"
            }
        },
        authenticated: function() {
            var c = this.get('container'),
                t = this.get("template"),
                strLabels = this.get("strLabels") || {
                    title: "Create",
                    submit: "Create"
                };
            c.setHTML(Lang.sub(t.one("#createitem-template").getHTML(), {
                TITLE: strLabels.title,
                SUBMIT: strLabels.submit
            }));
            this.processModules();
        },
        submitForm: function(e) {
            var model = new Y.AshleshaBaseModel(this.get("modelConfig") || {}),
                c = this.get('container'),
                viewByKey = {};
            e.halt();
            this.fire("wait:start", {
                target: e.target
            }); //disable the buttons
            c.all('[data-model-key]').each(function(item) {
                var view = Y.View.NodeMap.getByNode(item),
                    key = view.get("modelKey");
                model.addAttr(key);
                model.set(key, view.get("value"));
                viewByKey[key] = view;
                view.clearError();
            });
            model.validate = function(attrs) { //Overrride the validate method
                var i, errors = [],
                    vrules = Y.config.AppConfig.validations,
                    f, rule;
                for (i in attrs) {

                    if (viewByKey[i]) {
                        rule = viewByKey[i].get("validate");
                        f = vrules[rule];
                        if (Lang.isFunction(f) && f(attrs[i], i)) {
                            errors.push({
                                key: i,
                                error: Y.AshleshaUtils.toTitleCase(i) + " is " + rule
                            });
                        }
                    }


                }
                if (errors.length > 0) {
                    return errors;
                }
            };
            model.on("error", function(m) {
                var errors = m.error,
                    i;
                Y.Array.each(errors, function(item) {
                    viewByKey[item.key].addError(item.error);
                });
                this.fire("wait:end", {
                    target: e.target
                });
            }, this);
            model.on("save", function(m) {
                this.fire("wait:end", {
                    target: e.target
                });
            }, this);
            model.save();

        }
    });



    /**
     * The TextBoxView is a simple textbox form control :)
     * @class TextBoxView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.TextBoxView = Y.Base.create('TextBoxView', Y.AshleshaBaseView, [Y.View.NodeMap], {
        altInitializer: function() {

            var c = this.get('container'),
                t = this.get('template');
            c.setHTML(Lang.sub(t.one("#" + this.name.toLowerCase() + "-template").getHTML(), {
                LABEL: this.get("label"),
                PLACEHOLDER: this.get("placeholder") || "",
                NAME: this.get("name") || this.name,
                MODEL_KEY: this.get("modelKey"),
                HELPTEXT: this.get("helptext") || ""
            }));

        },
        addError: function(error) {
            var c = this.get('container');
            c.one(".control-group").addClass('error');
            c.one(".help-block").setHTML(error);
        },
        clearError: function() {
            var c = this.get('container');
            c.one(".control-group").removeClass('error');
            c.one(".help-block").setHTML('');
        }
    }, {
        ATTRS: {
            value: {
                getter: function(val, name) {
                    return this.get('container').one("input[type=text]").get("value");
                },
                setter: function(val, name) {
                    this.get('container').one("input[type=text]").set("value", val);
                }

            }
        }
    });

    /**
     * The TextAreaView is a simple textbox form control :)
     * @class TextAreaView
     * @extends View
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.TextAreaView = Y.Base.create('TextAreaView', Y.TextBoxView, [], {
        altInitializer: function() {
            var c = this.get('container'),
                textarea;
            Y[this.name].superclass.altInitializer.apply(this, arguments);
            textarea = c.one("textarea");
            if (textarea) {
                this.expandToFit(textarea); //will ensure that textare expands
            }
        },
        expandToFit: function(r) {
            var f = function() {
                var c, targetHeight;
                c = Y.Node.create("<div/>");
                c.addClass("textarea");
                c.setStyle("width", r.getComputedStyle("width"));
                c.setStyle("display", "block");
                c.setContent("<pre>" + r.get("value") + "</pre>");
                c.setStyle("position", "absolute");
                c.setStyle("z-index", "-20");
                Y.one("body").append(c);
                targetHeight = c.getComputedStyle('height');
                r.setStyle("height", targetHeight);
                c.setStyle("display", "none");
                c.remove();

            };
            r.on(["change", "keyup"], f);
            f();
        }
    }, {
        ATTRS: {
            value: {
                getter: function(val, name) {
                    return this.get('container').one("textarea").get("value");
                },
                setter: function(val, name) {
                    this.get('container').one("textarea").set("value", val);
                }
            }
        }
    });

    Y.AshleshaUtils = {};

    Y.AshleshaUtils.toTitleCase = function(str) {
        var tokens = str.split(" "),
            s;
        Y.Array.each(tokens, function(item, index, arr) {
            tokens[index] = item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
        });
        return tokens.join(" ");
    };

}, '0.99', {
    requires: ['ashlesha-base-model','event-custom', 'view-node-map', 'router', 'app-base', 'app-transitions', 'node', 'event', 'json', 'cache', 'model', 'model-list', , 'view', 'querystring-stringify-simple', 'io-upload-iframe', 'io-form', 'io-base', 'sortable'],
    skinnable: false
});
