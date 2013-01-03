YUI().add('ashlesha-signup', function(Y) {
    
   
    Y.SignUpModel = Y.Base.create("SignUpModel", Y.CommonModel, [], {
        initializer: function() {
            Y.SignUpModel.superclass.initializer.apply(this, [{
                attrs: {

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
                        validation_rules: "trim|required|email|unique"
                    },
                    dob: {
                        value: '',
                        validation_rules: "required"
                    },
                    password: {
                        value: '',
                        validation_rules: 'required|match(password2)|min(4)',
                        hash: true

                    },
                    password2: {
                        value: '',
                        validation_rules: 'required'
                        // save:false
                    },
                    type: {
                        value: 'user'
                    },
                    gender: {
                        value: '',
                        validation_rules: 'required'
                    }
                }}]);
        }
    }, {

    });

    Y.SignUpView = Y.Base.create("SignUpView", Y.FormView, [], {
        altInitializer: function(auth) {
            var c, t;
            c = this.get('container');
            t = this.get('template');
            c.setHTML(t.one("#SignUpView-main-unsigned").getHTML());
            this.loadModules();
            Y.SignUpView.superclass.altInitializer.apply(this, arguments);
        },
        onSubmit: function(e) {
            try {
                var model = new Y.SignUpModel();
                e.halt();

                this.startWait(e.target);
                model.set("type", "user");
                model = this.plugModel(model); //Method used to map the Form to the Model
                model.on("save", function() { // User Registers successfully.
                    this.signUpSuccess(model);
                }, this);
                model.save();
            }
            catch (ex) {
                Y.log(ex);
            }
        },
        signUpSuccess: function(model) {
           
                Y.fire("updateUser",{
                    navigate:"/invite_friends"
                });
                
            
           
            this.get('container').setHTML(this.get("template").one('#SignUpView-success').getHTML());
        }
    });
   
   
   
},'0.0.1',{
    requires:['base','ashlesha-form','ashlesha-common-model']
});