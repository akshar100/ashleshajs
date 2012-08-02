/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global YUI*/
"use strict";

YUI({
    AppConfig: {
        baseURL: 'http://@SUBDOMAIN@.@DOMAIN@.@TLD@/',
        port: '@PORT@',
        logoImage: 'static/images/logo.png',
        loaderImage: 'static/loader.gif',
        modelMapURL: 'model',
        templateURL: 'template',
        uploadURL: 'upload',
        apiURL: 'api',
        listURL: 'list'
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
    Y.currentUser = currentUser;
    Y.on("updateUser", function() {
        currentUser.load();
    });
    Y.HomeView = Y.Base.create("HomeView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get('template');
            if (!auth.user) { //if the user is not signed in
                c.setHTML(t.one('#HomeView-main-unsigned').getHTML());

            } else { //if the user is signed in
                c.setHTML(Y.Lang.sub(t.one('#HomeView-main-signed').getHTML(), {
                    EMAIL: auth.user.email
                }));
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
                type: "PageView",
                preserve: false
            }
        },
        transitions: {
            navigate: 'fade',
            toChild: 'fade',
            toParent: 'fade'
        },
        api: Y.api
    });

    app.route("/", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "MainAreaView",
                                config: {
                                    modules: {
                                        ".wall": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'timeline',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView"
                                                    },
                                                    ".post-list": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    });

    app.route("/wall", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "MainAreaView",
                                config: {
                                    modules: {
                                        ".wall": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'wall',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView"
                                                    },
                                                    ".post-list": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    });
    app.route("/wardrobes", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "MainAreaView",
                                config: {
                                    modules: {
                                        ".wall": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'wardrobes',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView"
                                                    },
                                                    ".post-list": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    });
    app.route("/brand-updates", function(req, res) {

        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "MainAreaView",
                                config: {
                                    modules: {
                                        ".wall": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'brand-updates',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView"
                                                    },
                                                    ".post-list": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    });
    app.route("/featured", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "MainAreaView",
                                config: {
                                    modules: {
                                        ".wall": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'featured',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView"
                                                    },
                                                    ".post-list": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    });

    app.route("/publish", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "CreatePostView",
                                config: {
                                    "postTitle": "Publish a Post"
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    app.route("/wardrobe/new", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "CreatePostView",
                                config: {
                                    "postTitle": "Add a wardrobe entry"
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    app.route("/me", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".top-nav": {
                                view: "EditProfileNavView"
                            },
                            ".mainarea": {
                                view: "EditProfileView",
                                config: {
                                    modules: {
                                        'div.date_field': {
                                            view: "DateField",
                                            config: {
                                                label: 'Date of Birth',
                                                field_name: 'dob'
                                            }
                                        },
                                        'div.first_name': {
                                            view: 'FormItem',
                                            config: {
                                                label: 'First Name',
                                                field_name: 'firstname'
                                            }
                                        },
                                        'div.last_name': {
                                            view: 'FormItem',
                                            config: {
                                                label: 'Last Name',
                                                field_name: 'lastname'
                                            }
                                        },
                                        'div.password': {
                                            view: 'FormItem',
                                            config: {
                                                label: 'Password',
                                                field_name: 'password',
                                                input_type: 'password'
                                            }
                                        },
                                        'div.password2': {
                                            view: 'FormItem',
                                            config: {
                                                label: 'Repeat Password',
                                                field_name: 'password2',
                                                input_type: 'password'
                                            }
                                        },
                                        'div.email': {
                                            view: 'FormItem',
                                            config: {
                                                label: 'Email',
                                                field_name: 'email'
                                            }
                                        },
                                        'div.gender': {
                                            view: 'SelectField',
                                            config: {
                                                label: 'You are',
                                                field_name: 'gender',
                                                options: {
                                                    m: "Male",
                                                    f: "Female"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    app.route("/me/photo", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".top-nav": {
                                view: "EditProfileNavView"
                            },
                            ".mainarea": {
                                view: "EditProfilePhotoView",
                                config: {
                                    modules: {
                                        ".upload-photo": {
                                            view: "FileUploadField",
                                            config: {
                                                label: " ",
                                                helptext: "The photo should be preferably a square image",
                                                placeholder: "click to upload"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });
    app.route("/me/password", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".top-nav": {
                                view: "EditProfileNavView"
                            },
                            ".mainarea": {
                                view: "ChangePasswordView",
                                config: {
                                    modules: {
                                        ".password": {
                                            view: "FormItem",
                                            config: {
                                                label: 'Password',
                                                field_name: 'password',
                                                input_type: 'password'
                                            }
                                        },
                                        ".password2": {
                                            view: "FormItem",
                                            config: {
                                                label: 'Repeat Password',
                                                field_name: 'password2',
                                                input_type: 'password'
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    app.route("/signin", function(req, res) {
        this.showView('page', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".page-content": {
                    view: "LoginView"
                }

            }
        });
    });

    app.route("/fanpage/new", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "CreateFanPageView",
                                config: {
                                    modules: {
                                        ".brand_name": {
                                            view: "FormItem",
                                            config: {
                                                label: 'Brand Name',
                                                field_name: 'brand_name',
                                                input_type: 'text'
                                            }
                                        },
                                        ".description": {
                                            view: "TextAreaField",
                                            config: {
                                                label: 'Description',
                                                field_name: 'description',
                                                rows: 5,
                                                cls: "span8"

                                            }
                                        },
                                        ".image": {
                                            view: "FileUploadField",
                                            config: {
                                                label: ' ',
                                                field_name: 'image',
                                                placeholder: 'Add an image'
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

    });

    app.route("/wishlist", function(req, res) {
        this.showView('home', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".homepage": {
                    view: "HomePageView",
                    config: {

                        modules: {
                            ".sidebar": {
                                view: "SideBarView"
                            },
                            ".mainarea": {
                                view: "MainAreaView",
                                config: {
                                    modules: {
                                        ".wall": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'wishlist',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView"
                                                    },
                                                    ".post-list": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    });


    app.route("/signup", function(req, res) {
        this.showView('page', {
            req: req,
            res: res,
            user: currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".page-content": {
                    view: "SignUpView",
                    config: {
                        modules: {
                            'div.date_field': {
                                view: "DateField",
                                config: {
                                    label: 'Date of Birth',
                                    field_name: 'dob'
                                }
                            },
                            'div.first_name': {
                                view: 'FormItem',
                                config: {
                                    label: 'First Name',
                                    field_name: 'firstname'
                                }
                            },
                            'div.last_name': {
                                view: 'FormItem',
                                config: {
                                    label: 'Last Name',
                                    field_name: 'lastname'
                                }
                            },
                            'div.password': {
                                view: 'FormItem',
                                config: {
                                    label: 'Password',
                                    field_name: 'password',
                                    input_type: 'password'
                                }
                            },
                            'div.password2': {
                                view: 'FormItem',
                                config: {
                                    label: 'Repeat Password',
                                    field_name: 'password2',
                                    input_type: 'password'
                                }
                            },
                            'div.email': {
                                view: 'FormItem',
                                config: {
                                    label: 'Email',
                                    field_name: 'email'
                                }
                            },
                            'div.gender': {
                                view: 'SelectField',
                                config: {
                                    label: 'You are',
                                    field_name: 'gender',
                                    options: {
                                        m: "Male",
                                        f: "Female"
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
    Y.fire("updateUser");
});