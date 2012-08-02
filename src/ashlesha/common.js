/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global __dirname*/
"use strict";
YUI().add('ashlesha-common', function(Y) {



    Y.FormItem = Y.Base.create("FormItem", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container');
            c.setHTML(Y.Lang.sub(this.get('template').one('#' + this.name + "-main").getHTML(), {
                LABEL: this.get("label") || "ITEM",
                FIELD_NAME: this.get('field_name') || "field",
                INPUT_TYPE: this.get("input_type") || "text",
                PLACEHOLDER: this.get("placeholder") || "",
                HELP_TEXT: this.get("help_text") || "",
                CLS: this.get("cls") || ""
            }));

            c.addClass('yui3-input-container');

        },
        setHelpText: function(text) {
            var c = this.get("container");
            c.one(".help-block").setHTML(text);
        },
        setErrorText: function(text) {
            var c = this.get("container");
            c.one(".control-group").addClass('error');
            this.setHelpText(text);
        },
        clearError: function() {
            var c = this.get('container');
            c.one(".control-group").removeClass('error');
            this.setHelpText('');
        },
        setValue: function(val) {
            var c = this.get("container");
            c.one("input").set("value", val || "");
        }

    }, {
        ATTRS: {
            "value": {
                value: '',
                getter: function() {
                    var c = this.get('container');
                    return c.one("#" + this.get('field_name')).get("value");
                },
                setter: function(val) {
                    var c = this.get('container');
                    val = val || "";
                    
                }
            },
            "viewType": {
                value: "FormItem"
            }

        }
    });



    Y.DateField = Y.Base.create("DateField", Y.FormItem, [], {
        events: {
            '.dd': {
                change: 'dayChanged'
            },
            '.mm': {
                change: 'monthChanged'
            },
            '.yy': {
                change: 'yearChanged'
            }
        },
        altInitializer: function(auth) {
            Y.DateField.superclass.altInitializer.apply(this, arguments);
            this.set('month_days', [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
            this.set('month_names', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
            this.addYears();
            this.addMonths();
            this.addDays();
            this.loadModules();

        },
        addDays: function(month, year) {
            var ndays = this.get('month_days'),
                days = 31,
                i, c = this.get('container').one(".dd"),
                n = Y.Node.create('<option value="">--DD--</option>');
            c.setHTML(n);
            if (year && month) {
                if (month === 2 && year % 4 === 0 && year % 100 !== 0) {
                    days = 29;
                }

            } else if (month) {
                days = ndays[month - 1];
            }
            for (i = 1; i <= days; i++) {
                c.append(Y.Node.create("<option value=" + i + ">" + i + "</option>"));
            }
        },
        addMonths: function() {
            var c = this.get('container').one(".mm"),
                n = Y.Node.create('<option value="">--MM--</option>'),
                i, months = this.get('month_names');

            c.setHTML(n);
            for (i = 1; i <= months.length; i++) {
                c.append(Y.Node.create("<option value=" + i + ">" + months[i - 1] + "</option>"));
            }
        },
        addYears: function(start, end) {
            var c = this.get('container').one(".yy"),
                n = Y.Node.create('<option value="">--YY--</option>'),
                i;
            start = start || 1900;
            end = end || new Date().getFullYear();
            c.setHTML(n);
            for (i = start; i <= end; i++) {
                c.append(Y.Node.create("<option value=" + i + ">" + i + "</option>"));
            }

        },
        dayChanged: function() {},
        monthChanged: function() {
            var c = this.get('container'),
                m = c.one(".mm"),
                d = c.one(".dd"),
                y = c.one('.yy'),
                year, ndays = this.get("month_names"),
                selected_day, val;
            val = m.get("value");
            if (val && ndays[val]) //Some month is selected
            {
                year = y.get("value"); //See if year is also selected only of month==2 else we dont care about year
                if (val === 2 && year && year % 4 === 0 && year % 100 !== 0) //LEAP YEAR ?
                {
                    ndays[2] = 29;
                }
                selected_day = d.get("value");
                if (selected_day) {
                    if (selected_day > ndays[val]) //Bother to update
                    {
                        this.addDays(val);

                    }
                    else {

                        this.addDays(val);
                        this.setDay(selected_day);
                    }
                }


            }
        },
        yearChanged: function() {
            this.monthChanged();
        },
        setYear: function(y) {
            this.get('container').one(".yy").set("value", y);
        },
        setMonth: function(y) {
            this.get('container').one(".mm").set("value", y);
        },
        setDay: function(y) {
            this.get('container').one(".dd").set("value", y);
        },
        setValue: function(val) {
            var date = val.split("-"),
                c = this.get('container');
            this.setYear(date[0]);
            this.setMonth(date[1]);
            this.setDay(date[2]);
            return date[0] + "-" + date[1] + "-" + date[2];
        }

    }, {
        ATTRS: {
            value: {
                value: '',
                getter: function() {
                    var c = this.get('container'),
                        dd = c.one(".dd").get("value"),
                        mm = c.one(".mm").get("value"),
                        yy = c.one(".yy").get("value");
                    if (dd && mm && yy) {
                        return yy + "-" + mm + "-" + dd;
                    }
                    return null;
                },
                setter: function(val) {
/*var date = val.split("-"),
                        c = this.get('container');
                    this.setYear(date[0]);
                    this.setMonth(date[1]);
                    this.setDay(date[2]);
                    return date[0] + "-" + date[1] + "-" + date[2];*/
                }
            }
        }
    });

    Y.SelectField = Y.Base.create("SelectField", Y.FormItem, [], {
        altInitializer: function() {
            Y.SelectField.superclass.altInitializer.apply(this, arguments);
            this.setOptions(this.get("options") || {});

        },
        setOptions: function(opts) {
            var c = this.get('container').one("select");
            c.setHTML("");
            Y.Object.each(opts, function(val, key) {
                c.append("<option value='" + key + "'>" + val + "</option>");
            });
        }

    }, {


        ATTRS: {
            value: {
                value: '',
                getter: function() {
                    return this.get('container').one('select').get('value');
                },
                setter: function(val) {
                    this.get('container').one('select').all('option').each(function(item) {
                        if (item.get("value") === val) {
                            item.setAttribute("selected", "selected");
                        }
                    });
                    return val;
                }
            }
        }
    });


    Y.TextAreaField = Y.Base.create("TextAreaField", Y.FormItem, [], {
        altInitializer: function() {
            var c = this.get('container');
            Y.SelectField.superclass.altInitializer.apply(this, arguments);
            c.one("textarea").setAttribute("rows", this.get("rows") || 2);
        }

    }, {


        ATTRS: {
            value: {
                value: '',
                getter: function() {
                    return this.get('container').one('textarea').get('value');
                }
            }
        }
    });

    Y.FileUploadField = Y.Base.create("FileUploadField", Y.FormItem, [], {
        events: {
            "a.show-file-box": {
                click: "showFileBox"
            },
            "a.remove": {
                click: "removeFileBox"
            },
            "input[type=file]": {
                change: "startUpload"
            }
        },
        altInitializer: function() {
            var c = this.get('container');
            Y.SelectField.superclass.altInitializer.apply(this, arguments);

        },
        showFileBox: function(e) {
            e.halt();
            e.target.addClass('hide');
            this.get("container").one(".file-box").removeClass('hide');
        },
        removeFileBox: function(e) {
            var c = this.get("container");
            e.halt();
            c.one(".file-box").addClass('hide');
            c.one(".show-file-box").removeClass('hide');
            c.one(".image-preview").setHTML('');
            c.one("input[type=hidden]").set("value", "");
            this.endWait();
        },
        startUpload: function(e) {
            var c = this.get("container");
            Y.io(Y.config.AppConfig.baseURL + Y.config.AppConfig.uploadURL, {
                method: 'POST',
                form: {
                    id: c.one("form"),
                    upload: true
                },
                context: this,
                on: {
                    complete: function(i, o, a) {
                        var r;
                        this.endWait();
                        try {
                            r = Y.JSON.parse(o.responseText);


                            c.one(".image-preview").setHTML(
                            Y.Node.create(Y.Lang.sub("<img src='{URL}' class='span1 thumbnail'/>", {
                                URL: r.url
                            })));
                            c.one("input[type=hidden]").set("value", r.url);
                        } catch (ex) {
                            this.setErrorText("The file is not supported by us.");
                        }
                    },
                    failure: function() {
                        this.setErrorText("Upload failed! Your file seems to be larger than we can accept.");
                    },
                    start: function() {
                        this.startWait(c.one(".image-preview"));
                    }
                }
            });
        }

    }, {

        ATTRS: {
            value: {
                value: '',
                getter: function() {
                    return this.get('container').one('input[type=hidden]').get('value');
                }
            }
        }
    });


    Y.TopBarView = Y.Base.create("TopBarView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get('template');
            if (!auth.user) { //if the user is not signed in
                c.setHTML(t.one('#TopBarView-main-unsigned').getHTML());
            } else { //if the user is signed in
                c.setHTML(Y.Lang.sub(t.one('#TopBarView-main-signed').getHTML(), {
                    EMAIL: auth.user.get("email")
                }));
            }
            this.loadModules();
        }
    });
    Y.LoginModel = Y.Base.create("LoginView", Y.CommonModel, [], {
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
                            Y.api.invoke("/user/send_welcome_mail",{},function(){});
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

    Y.FormView = Y.Base.create("FormView", Y.AshleshaBaseView, [], {
        events: {
            'button[type=submit]': {
                click: 'onSubmit'
            }

        },
        altInitializer: function(auth) {

        },
        onSubmit: function(e) {
            var items;
            e.halt();
            items = this.getFormItems();

        },
        getFormItems: function() {
            var items = [],
                nodes = this.get('container').all('.yui3-input-container');

            nodes.each(function(item) {
                items.push(Y.AshleshaBaseView.getByNode(item));
            });
            return items;
        },
        plugErrors: function(errors) {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {

                Y.Array.each(errors, function(error) {
                    if (error.field === item.get("field_name")) {
                        item.setErrorText(error.error.message);
                    }
                });
            });

        },
        plugModel: function(model) {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {
                model.set(item.get("field_name"), item.get("value"));
            });

            model.on("error", function(e) {
                this.clearErrors();
                this.plugErrors(e.error);
                this.endWait();
            }, this);
            model.on("save", function() {
                this.clearErrors();
                this.endWait();
            }, this);
            return model;
        },
        clearErrors: function() {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {
                item.clearError();
            });
        }

    });

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
                        hash:true
                       
                    },
                    password2: {
                        value: '',
                        validation_rules: 'required',
                        save:false
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
            var model = new Y.SignUpModel();
            e.halt();

            this.startWait(e.target);
			model.set("type","user");
            model = this.plugModel(model); //Method used to map the Form to the Model
            model.on("save", function() { // User Rgisters successfully.
                this.signUpSuccess();
            }, this);
            model.save();
        },
        signUpSuccess: function() {
        	Y.api.invoke("/user/send_welcome_mail");
            this.get('container').setHTML(this.get("template").one('#SignUpView-success').getHTML());
        }
    });

    Y.PageView = Y.Base.create("PageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template");
            c.setHTML(t.one("#PageView-main-unsigned").getHTML());
            this.loadModules();
        }
    });

    Y.HomePageView = Y.Base.create("HomePageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container");
            if (auth.user) {
                c.setHTML(this.get("template").one("#" + this.name + "-main-signed").getHTML());
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        }

    });
    Y.SideBarView = Y.Base.create("SideBarView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container");
            if (auth.user) {
                c.setHTML(Y.Lang.sub(this.get("template").one("#" + this.name + "-main-signed").getHTML(), {
                    FIRSTNAME: auth.user.get("firstname"),
                    LASTNAME: auth.user.get("lastname")
                }));
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        }

    });
    Y.MainAreaView = Y.Base.create("MainAreaView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                req = this.get("req");
            if (auth.user) {
                c.setHTML(this.get("template").one("#" + this.name + "-main-signed").getHTML());
                if (req && req.path) {
                    c.one("li.active").removeClass('active');
                    c.all("a").each(function(node) {
                        if (node.getAttribute("href") === req.path) {
                            node.ancestor("li").addClass('active');
                        }
                    });

                }
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        }
    });

    Y.TimeLineView = Y.Base.create("TimeLineView", Y.AshleshaBaseView, [], {
        events: {
            "a.pub-btn": {
                click: 'pubBtnClick'
            }
        },
        altInitializer: function(auth) {
            var c = this.get("container");
            if (auth.user) {
                this.setupTimeline(this.get("timelineType")); //Load the default timeline
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        },
        setupTimeline: function(tType) {
            var c = this.get('container'),
                t = this.get('template');

            switch (tType) {

            case "wall":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "Your friend's have posted on your wall"
                }));
                c.one(".pub-btn").addClass('hide');
                //c.one(".create-post").setHTML(new Y.CreatePostView({tType:"publishing-page",user:this.get("user")}).render().get("container"));
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            case "brand-updates":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "your favourite brands are sharing with you"
                }));
                c.one(".pub-btn").addClass('hide');
                //c.one(".create-post").setHTML(new Y.CreatePostView({tType:"publishing-page",user:this.get("user")}).render().get("container"));
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            case "featured":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "@SITENAME@'s picks"
                }));
                c.one(".pub-btn").addClass('hide');
                //c.one(".create-post").setHTML(new Y.CreatePostView({tType:"publishing-page",user:this.get("user")}).render().get("container"));
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            case "wishlist":
            	c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "Whats on your wishlist ? Let others know."
                }));
                
                c.one(".create-post").setHTML(new Y.CreatePostView({tType:"publishing-page",user:this.get("user")}).render().get("container"));
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            
            default:
                //This is our regular timeline that shows posts from other people's publishing page
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "Your too can share with your friends."
                }));
                c.one(".create-post").setHTML(new Y.CreatePostView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            }


        },
        pubBtnClick: function(e) {
            var c = this.get("container"),
                create = c.one(".create-post");
            if (create) {
                create.toggleClass('hide');
                if (create.hasClass('hide')) {
                    e.target.set("text", "Publish");
                }
                else {
                    e.target.set("text", "Hide");
                }
            }
        }
    });

    Y.PostModel = Y.Base.create("PostModel", Y.CommonModel, [], {
        initializer: function() {
            Y.PostModel.superclass.initializer.apply(this, [{
                attrs: {

                    posttext: {
                        value: '',
                        validation_rules: "trim|required|min(8)"
                    },
                    image: {
                        value: ''
                    }
                }}]);
        }
    });
    Y.CreatePostView = Y.Base.create("CreatePostView", Y.FormView, [], {

        preModules: function() {
            return {
                ".form-item": {
                    view: "TextAreaField",
                    config: {
                        label: " ",
                        placeholder: "type something....",
                        rows: 2,
                        cls: "span9",
                        field_name: "posttext"
                    }
                },
                ".file-upload": {
                    view: "FileUploadField",
                    config: {
                        label: " ",
                        cls: "span9",
                        field_name: "image",
                        placeholder: "Upload Photo"
                    }
                }
            };
        },
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template");
            c.setHTML(t.one("#" + this.name + "-main").getHTML());
            if (this.get("postTitle")) {
                c.one(".title").setHTML(this.get("postTitle"));
            }
            this.loadModules();
        },
        onSubmit: function(e) {
            var model = new Y.PostModel();
            e.halt();

            this.startWait(e.target);

            model = this.plugModel(model); //Method used to map the Form to the Model
            model.on("save", function() { // User Rgisters successfully.
                this.postSuccess();
            }, this);
            model.save();
        },
        postSuccess: function() {
            var c = this.get("container");
            c.one(".message-box").setHTML(this.get("template").one("#" + this.name + "-messagebox").getHTML());
        }
    });

    Y.PostList = Y.Base.create("PostList", Y.AshleshaBaseList, [], {
        model: Y.PostModel
    });

    Y.PostView = Y.Base.create("PostView", Y.AshleshaBaseView, [], {
        altInitializer: function() {
            var c = this.get('container'),
                t = this.get("template"),
                model = this.get("model");
            c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            if (model && model.get("created_at")) { //Check to see if the model is loaded. Not a very elegant one.
                this.modelLoaded();

            }
            else {
                model.on("load", this.modelLoaded);
                model.load();
            }
        },
        modelLoaded: function() {
            var model = this.get("model"),
                c = this.get('container'),
                t = this.get('template'),
                date = new Date(model.get("created_at"));
            c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(), {
                author_name: model.get("author_name"),
                post_text: model.get("posttext"),
                created_at: date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
                comment_count: model.get("comment_count")
            }));
        }
    });

    Y.PostListView = Y.Base.create("PostListView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                list = new Y.PostList(),
                self = this;
            c.setHTML(t.one("#" + this.name + "-main").getHTML());
            list.on('load', function() {
                list.each(function(model) {
                    var post = new Y.PostView({
                        user: self.get("user"),
                        model: model
                    });
                    c.one(".list-container").append(post.render().get("container"));
                });
            });
            list.load();

        }
    });

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
                        validation_rules: "trim|required|email|unique"
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
                    }
                }}]);
        }
    });
    Y.EditProfileNavView = Y.Base.create("EditProfileNavView", Y.AshleshaBaseView, [], {
    	altInitializer:function(auth){
    		var c = this.get("container"),req = this.get("req");
    	
    		if(auth && auth.user)
    		{
    			c.setHTML(this.get("template").one("#"+this.name+"-main-signed").getHTML());
    			if(req && req.path)
    			{
    				c.all("a").each(function(node){
    					if(node.getAttribute("href")===req.path){
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
                t = this.get("template");
            if (auth && auth.user) {
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            }
            this.loadModules();
        },
        onSubmit: function(e) {
            var model = new Y.ProfileModel();
            e.halt();
            model.set("_id", this.get("user").get("_id"));
            this.plugModel(model);

        }
    });
    
    Y.EditProfilePhotoView = Y.Base.create("EditProfilePhotoView",Y.FormView, [],{
    	altInitializer:function(auth){
    		var c = this.get("container");
    		c.setHTML(Y.Lang.sub(this.get("template").one("#"+this.name+"-main-signed").getHTML(),{
    			IMG:'http://placehold.it/100x100'
    		}));
    		this.loadModules();
    		
    	}
    });
    
    Y.PasswordModel = Y.Base.create("PasswordModel",Y.CommonModel,[],{
    	initializer:function(){
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
    Y.ChangePasswordView = Y.Base.create("ChangePasswordView",Y.FormView,[],{
    	altInitializer:function(auth){
    		var c = this.get("container");
    		c.setHTML(Y.Lang.sub(this.get('template').one("#"+this.name+"-main-signed").getHTML()));
    		this.loadModules();
    	}
    });
    
    Y.CreateFanPageView = Y.Base.create("CreateFanPageView",Y.FormView,[],{
    	altInitializer:function(auth){
    		var c = this.get("container"),t = this.get("template");
    		if(auth && auth.user){
    			c.setHTML(t.one("#"+this.name+"-main-signed").getHTML());
    		}
    		this.loadModules();
    	}
    });

}, '0.0.1', {
    requires: ['base', 'cache', 'model-list', function() {
        if (typeof document !== 'undefined') {
            return 'client-app';
        } else {
            return 'server-app';
        }}(), 'ashlesha-api', 'common-models-store']
});