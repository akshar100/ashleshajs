/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global io*/
"use strict";


YUI().add('ashlesha-api', function(Y) {
    Y.APIEndpoint = {
        invoke: function(path, config, callback, ctx) {
            Y.io(Y.config.AppConfig.baseURL + Y.config.AppConfig.apiURL, {
                method: 'POST',
                data: {
                    data: Y.JSON.stringify(config || {}),
                    path: path
                },
                on: {
                    complete: function(i, o, a) {
                        var r = Y.JSON.parse(o.responseText);
                        if (Y.Lang.isFunction(callback)) {
                            if (r.error) {
                                callback.call(ctx || this, r);
                            }
                            else {
                                callback.call(ctx || this, null, r);
                            }
                        }

                    }
                }
            });
        }
    };

    Y.BaseAPI = Y.Base.create("BaseAPI", Y.Base, [], {
        initializer: function() {
            var cache = new Y.CacheOffline({
                sandbox: "api"
            });
            this.set("cache", cache);
            this.set("m", []); //m stands for middleware
        },
        invoke: function(path, config, callback) {
            var ep = Y.APIEndpoint,
                cfg = config || {};

            if (typeof callback === "undefined" || !Y.Lang.isFunction(callback)) { //Never execute a client API call if the callback is not provided. Simply ignore it.
                return false;
            }
            ep.invoke(path, config, callback, this);

        },
        use: function(f) {
            var m = this.get("m");
            m.push(f);
            this.set("m", m);
        }
    });



}, '0.9.9', {
    requires: ['base', 'io', 'json', 'querystring-stringify-simple']
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
            var cache, cached, data;
            this.removeAttr("attrs", "");
            data = {
                data: Y.JSON.stringify(this.toJSON()),
                action: action,
                name: this.name
            };
            cache = new Y.CacheOffline({
                sandbox: "models"
            });
            if (action === "read" && this.get("_id")) {
                cached = cache.retrieve(this.get("_id"));
                if (cached && cached.response) {
                    callback(null, Y.JSON.parse(cached.response));
                }
            }
            else {
                Y.io(Y.config.AppConfig.baseURL + Y.config.AppConfig.modelMapURL, {
                    method: 'POST',
                    data: data,
                    on: {
                        success: function(i, o, a) {
                            var data = Y.JSON.parse(o.responseText);
                            if (data.success) {
                                cache.add(data.data._id, Y.JSON.stringify(data.data));
                                callback(null, data.data);
                            }
                            else {

                                callback(data.error);
                            }

                        },
                        failure: function(i, o, a) {
                            var r = Y.JSON.parse(o.responseText);
                            if (typeof data._id !== "undefined") {
                                cache.add(data._id, "");
                            }

                            callback(r.error);
                        }
                    }
                });
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
     * @class  AshleshaBaseModel
     * @extends Model
     * @uses
     * @constructor
     * @cfg {object} configuration attributes
     */
    Y.AshleshaCurrentUserModel = Y.Base.create('AshleshaCurrentUserModel', Y.AshleshaBaseModel, [], {

    });

    Y.AshleshaBaseList = Y.Base.create('AshleshaBaseList', Y.ModelList, [], {
        model: Y.AshleshaBaseModel,
        sync: function(action, options, callback) {
            if (action === "read") {
                Y.io(Y.config.AppConfig.baseURL + Y.config.AppConfig.listURL, {
                    method: 'POST',
                    context: this,
                    data: {
                        name: this.name,
                        size: this.get("size") || 10,
                        page: this.get("page") || 1,
                        query: ''
                    },
                    on: {
                        complete: function(i, o, a) {
                            var r;
                            try {
                                r = Y.JSON.parse(o.responseText);
                                callback(null, r);
                            } catch (ex) {
                                callback(r);
                            }
                        },
                        failure: function() {
                            callback("Error");
                        }
                    }
                });
            }
        }
    });

}, '0.9.9', {
    requires: ['model', 'app', 'cache', 'json', 'io', 'querystring-stringify-simple', 'model-list']
});

YUI().add('ashlesha-base-view', function(Y) {

    var Lang = Y.Lang;
    var ImageLoader = Y.Node.create('<img src="' + Y.config.AppConfig.loaderImage + '"/>');
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

    Y.AshleshaBaseView = Y.Base.create('AshleshaBaseView', Y.View, [Y.View.NodeMap], {
        containerTemplate: '<div/>',
        initializer: function(config) {
            var c = this.get('container'),
                cache = new Y.CacheOffline({
                    sandbox: 'views'
                });
            c.setHTML(ImageLoader);
            this.set('cache', cache);
            this.on("template_loaded", this.initTemplate, this);
            if (config) {
                this.set("user", config.user);
            }

            this.loadTemplate(this.get('templateID') || this.name);




        },
        loadTemplate: function(name) {
            var cache = this.get('cache'),
                cached = cache.retrieve(name),
                path;

            if (cached && cached.response) {
                this.set("template", Y.Node.create(cached.response));
                this.fire("template_loaded");
                return;
            }
            else {
                if (this.get("req")) {
                    path = this.get("req").path.substr(1);
                } //IF the view is instantiated separately feth the template via AJAX.
                else {
                    path = Y.config.AppConfig.templateURL + "/" + name;
                }
                Y.io(Y.config.AppConfig.baseURL + path, {
                    method: 'GET',
                    context: this,
                    on: {
                        success: function(i, o, a) {
                            var r = Y.JSON.parse(o.responseText);
                            Y.Object.each(r, function(item, key) {
                                cache.add(key, item + "<script type='text/x-template'></script>");
                            });
                            cached = cache.retrieve(this.get('templateID') || this.name);
                            this.set("template", Y.Node.create(cached.response));
                            this.fire("template_loaded");
                        }
                    }
                });
            }

        },
        userLoaded: function() {
            var user = this.get("user"),
                self = this;
            if (user && user.get('_id')) {
                self.altInitializer.apply(self, [{
                    user: user}]);
            }
            else {
                self.altInitializer.apply(self, [{
                    user: false}]);
            }
            // Y.log("REceived USer change event by :"+this.name);
        },
        initTemplate: function() {
            var user = this.get("user"),
                handler, self = this;

            if (this.get("userAgnostic")) {
                this.altInitializer.apply(this, [{
                    agnostic: true}]);
            }
            else {


                user.on(['load', 'change', 'destroy'], function() {
                    setTimeout(function() {
                        self.userLoaded.call(self);
                    }, 10);
                }, self);
                setTimeout(function() {
                    self.userLoaded.call(self);
                }, 10);

            }


            this.commonInit();
        },
        commonInit: function() {
            var c = this.get('container'),
                t = this.get('template'),
                name = "#" + this.name + "-main";

            if (c && t && t.one(name)) {
                c.setHTML(t.one(name).getHTML());

            }

        },
        altInitializer: function(userObj) {},
        render: function() {
            return this;
        },
        addModules: function(modules) {
            var m = this.get("modules") || {};
            if (Y.Lang.isObject(modules)) {
                m = Y.mix(m, modules);
                this.set("modules", m);
            }
        },
        loadModules: function() {
            var modules = this.get("modules") || {},
                res = this.get("res"),
                req = this.get("req"),
                c = this.get('container'),
                t = this.get("template"),
                user = this.get("user"),
                addedModules = [];
            if (Y.Lang.isFunction(this.preModules)) {
                modules = Y.mix(modules, this.preModules());
            }
            Y.Object.each(modules, function(value, key) {
                var moduleContainer = c.one(key),
                    View = Y[value && value.view],
                    config, view;
                if (moduleContainer && View) {
                    config = (value && value.config) || {};
                    config.res = res;
                    config.req = req;
                    config.user = user;
                    view = new View(config);
                    moduleContainer.setHTML(view.render().get('container')); // replace the
                    addedModules.push(view);
                }

            });

        },
        halt: function(e) { //Halt an Event
            if (e && Lang.isFunction(e.halt)) {
                e.halt();
            }
        },
        startWait: function(node) {
            var loader = Y.Node.create('<img src="' + Y.config.AppConfig.loaderImage + '"/>');
            if (node) {
                node.addClass('hide');
                node.insert(loader, "after");
                this.on("endWait", function() {
                    loader.remove();
                    node.removeClass('hide');
                }, this);
            }
        },
        endWait: function() {
            this.fire("endWait");
        }
    });



}, '0.99', {
    requires: ['io', 'app', 'cache', 'ashlesha-base-models', 'event', 'event-delegate', 'json', 'view-node-map', 'io-upload-iframe']
});



YUI().add('client-app', function(Y) {
    Y.AshleshaApp = Y.Base.create("AshleshaApp", Y.App, [], {
        dispatch: function() {
            var socket;
            Y.AshleshaApp.superclass.dispatch.apply(this, arguments);
            Y.on("navigate", function(e) {
                if (e.action) {
                    this.navigate(e.action);
                }
            }, this);

/* try {
                socket = io.connect(Y.config.AppConfig.baseURL);
                socket.on('user', function(data) {
                    
                    
                });
            } catch (ex) {
                Y.log("Socket.IO not loaded" + ex);
            }
            
            */

        }
    });
}, '0.99', {
    requires: ['app', 'ashlesha-base-view', '"selector-css3"'],
    skinnable: false
});