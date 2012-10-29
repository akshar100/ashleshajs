YUI().add('ashlesha-login', function(Y) {
    
    
Y.LoginModel = Y.Base.create("LoginModel", Y.CommonModel, [], {
        initializer: function() {
            Y.LoginModel.superclass.initializer.call(this, {
                attrs: {
                    username: {
                        value: '',
                        validation_rules: 'trim|required'
                    },
                    password: {
                        value: '',
                        validation_rules: 'trim|required'
                    }
                }
            });
        }
    }, {});
    Y.LoginView = Y.Base.create("LoginView", Y.AshleshaBaseView, [], {
        events: {
            'button[type=submit]': {
                click: 'onSubmit'
            },
            'a.forgot_password': {
                click: 'forgotPassword'
            },
            'a.login': {
                click: 'login'
            }
        },
        altInitializer: function(auth) {

            if (auth.user) {
                Y.fire("navigate", {
                    action: "/"
                });
                return;
            }
            this.login(); // show the login screen by default
        },
        onSubmit: function(e) {
            var c = this.get('container'),
                email, form = e.target.getAttribute("id"),
                loginModel, errors, alert = c.one('.alert'),
                username, password;
            this.halt(e);
            alert.addClass('hide');

            if (form === "login") { //If user is trying to log in
                loginModel = new Y.LoginModel();
                username = c.one("#username").get("value");
                password = c.one("#password").get("value");
                loginModel.set("username", username);
                loginModel.set("password", password);
                errors = loginModel.checkValidity();

                if (Y.Lang.isArray(errors)) {
                    c.one(".alert").removeClass('hide');
                }
                else {
                    Y.api.invoke("/login", {
                        username: username,
                        password: password
                    }, function(err, data) {

                        if (data.success) {
                            Y.fire("updateUser");
                        }
                        else {
                            c.one(".alert").removeClass('hide');
                        }
                    });
                }
            }
            else if (form === "forgot_password") { //If the user is trying to retrieve forgotten password
                email = c.one('#email').get("value");
            }

        },
        forgotPassword: function(e) {
            var c = this.get("container"),
                t = this.get("template");
            c.setHTML(t.one("#ForgotPasswordView-main").getHTML());
            this.halt(e);
            this.loadModules();
        },
        login: function(e) {
            var c = this.get("container"),
                t = this.get("template");
            c.setHTML(t.one("#LoginView-main-unsigned").getHTML());
            this.halt(e);
            this.loadModules();
        }

    });
},'0.0.1',{
    requires:['base','app','common-models-store']
});
