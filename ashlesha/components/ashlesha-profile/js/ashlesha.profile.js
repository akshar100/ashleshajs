YUI().add('ashlesha-profile',function(Y) { 

 Y.ProfileModel = Y.Base.create("ProfileModel", Y.CommonModel, [], {
        initializer: function() {
            Y.ProfileModel.superclass.initializer.apply(this, [{
                attrs: {
                    _id: {
                        value: ''
                    },
                    firstname: {
                        value: '',
                        validation_rules: "trim|required"
                    },
                    lastname: {
                        value: '',
                        validation_rules: "trim|required"
                    },
                    email: {
                        value: '',
                        validation_rules: "trim|required|email"
                        
                    },
                    dob: {
                        value: '',
                        validation_rules: "required"
                    },
                    type: {
                        value: 'user'
                    },
                    gender: {
                        value: '',
                        validation_rules: 'required'
                    },
                    relations: {
                        value: []
                    },
                    profile_pic: { 
                    	value: 'http://placehold.it/100x100'
                    }
                }}]);
        }
    });
    Y.EditProfileNavView = Y.Base.create("EditProfileNavView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                req = this.get("req");

            if (auth && auth.user) {
                c.setHTML(this.get("template").one("#" + this.name + "-main-signed").getHTML());
                if (req && req.path) {
                    c.all("a").each(function(node) {
                        if (node.getAttribute("href") === req.path) {
                            node.ancestor("li").addClass('active');
                        }
                    });
                }
            }
        }
    });
    Y.EditProfileView = Y.Base.create("EditProfileView", Y.FormView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                m = new Y.ProfileModel();
            if (auth && auth.user) {
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            }
            this.loadModules();
            m.set("_id", this.get("user").get("_id"));

            m.on("load", function() {
                this.plugValues(m);
            }, this);
            setTimeout(function() {
                m.load();
            }, 500);
            
            this.set("model", m);
            m.load();

        },
        onSubmit: function(e) {
            var model = this.get("model");
            this.startWait(e.target);
            try {
                e.halt();
                model.set("_id", this.get("user").get("_id"));
                model = this.plugModel(model);
                model.save(function() {
                    this.endWait();
                    model.load();
                });
               
            } catch (ex) {
                Y.log(ex);
            }


        }
    });

    Y.EditProfilePhotoView = Y.Base.create("EditProfilePhotoView", Y.FormView, [], {
    	events:{
    		"button[type=submit]":{
    			click:function(e){
    				var m = this.get("m");
    				this.plugModel(m);
    				m.save();
    				e.halt();
    			}
    		}
    	},
    	onSubmit:function(e){
    		e.halt();
    	},
        altInitializer: function(auth) {
            var c = this.get("container"), m = new Y.ProfileModel();
            c.setHTML(Y.Lang.sub(this.get("template").one("#" + this.name + "-main-signed").getHTML(), {
                IMG: 'http://placehold.it/100x100'
            }));
            this.loadModules();
			m.set("_id", this.get("user").get("_id"));
			m.on("load",function(){
				this.plugValues(m); //Checks the model and picks up values from form and puts them into the model. The model attribtue name = form name
			},this);
			m.load();
			this.set("m",m);
        }
    });

    Y.PasswordModel = Y.Base.create("PasswordModel", Y.CommonModel, [], {
        initializer: function() {
            Y.PasswordModel.superclass.initializer.apply(this, [{
                attrs: {
                    password: {
                        value: '',
                        validation_rules: "required|match(password2)|min(4)"
                    },
                    password2: {
                        value: '',
                        validation_rules: "required"
                    }

                }}]);
        }
    });
    Y.ChangePasswordView = Y.Base.create("ChangePasswordView", Y.FormView, [], {
        altInitializer: function(auth) {
            var c = this.get("container");
            c.setHTML(Y.Lang.sub(this.get('template').one("#" + this.name + "-main-signed").getHTML()));
            this.loadModules();
        }
    });
    
    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });