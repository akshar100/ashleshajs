/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global YUI*/
"use strict";

YUI('ashlesha-base-app', function(Y) {
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

	app.route("/",function(req,res){
		app.navigate("/wardrobes",res);
	});
    app.route("/timeline", function(req, res) {
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
                                                    ".timeline-container": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                },
                                                                ".post_dummy2": {
                                                                    view: "PlaceView"
                                                                },
                                                                ".post_dummy3": {
                                                                    view: "WREntryView"
                                                                }
                                                            },
                                                            tType: "publishing-page"
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
    
    app.route("/places", function(req, res) {
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
                                                timelineType: 'places',
                                                modules: {
                                                    ".post-list": {
                                                        view: "MapView"
                                                        
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
                                                modules: {
                                                    ".post-list": {
                                                        view: "WRListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "WREntryView"
                                                                }
                                                                
                                                            },
                                                            timelineType:"wardrobes"
                                                            
                                                        }
                                                    }
                                                },
                                                timelineType:"wardrobes"
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

    app.route("/fanpages", function(req, res) {
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
                                view: "FanPageListView"
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
                                view: "CreateWREntryView",
                                config: {
                                    "postTitle": "Add a wardrobe entry",
                                    tType: "wardrobe-entry"

                                }
                            }
                        }
                    }
                }
            }
        });
    });


	 app.route("/places/new", function(req, res) {
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
	                                view: "CreatePlaceEntryView",
	                                config: {
	                                    "postTitle": "Add a place",
	                                    tType: "place-entry"
	
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
                                        ".title": {
                                            view: "FormItem",
                                            config: {
                                                label: "Title",
                                                field_name: "title",
                                                input_type: "text"
                                            }
                                        },
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

    app.route("/fanpage/:id", function(req, res) {

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
                                view: "FanPageView",
                                config: {
                                    pageID: req.params.id,
                                    modules: {
                                        ".fanpageTimeline": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'fanpages',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView",
                                                        config: {
                                                            tType: 'fanpages',
                                                            owner_id: req.params.id //all the posts under this are owned by
                                                        }
                                                    },
                                                    ".timeline-container": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "PostView"
                                                                }
                                                            },
                                                            query: {
                                                                pageID: req.params.id,
                                                                tType: 'fanpages'
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

    app.route("/user/:id", function(req, res) {

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
                                view: "UserPageView",
                                config: {
                                    user_id: req.params.id,
                                    modules: {
                                        ".dummy": {
                                            view: "FriendshipView"
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

    app.route("/my/wardrobe", function(req, res) {

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
                                view: "WardrobeView",
                                config: {
                                    pageID: req.params.id,
                                    modules: {
                                        ".fanpageTimeline": {
                                            view: "TimeLineView",
                                            config: {
                                                timelineType: 'wardrobe-entry',
                                                modules: {
                                                    ".create-post": {
                                                        view: "CreatePostView",
                                                        config: {
                                                            tType: 'wardrobe-entry',
                                                            owner_id: currentUser.get("_id") || currentUser.get("id")
                                                        }
                                                    },
                                                    ".timeline-container": {
                                                        view: "PostListView",
                                                        config: {
                                                            modules: {
                                                                ".post_dummy": {
                                                                    view: "WREntryView"
                                                                }
                                                            },
                                                            query: {
                                                                owner_id: currentUser.get("_id") || currentUser.get("id"),
                                                                tType: 'wardrobe-entry'
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

	app.route("/my/friends",function(req,res){
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
                                view: "TitledPageView",
                                config:{
                                	title:"My Friends",
                                	modules:{
                                		".content":{
                                			view:"UserListView",
                                			config:{
                                				searchable:true, //User can search the users 
                                				selectable:true,
                                				load:{
                                					api:""
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
	
	app.route("/my/places",function(req,res){
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
                                view: "PlacesView",
                                config:{
                                	modules:{
                                		".dummy":{
                                			view: "PlaceView"
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
	
    app.render().dispatch();
    Y.fire("updateUser");
    
    
});