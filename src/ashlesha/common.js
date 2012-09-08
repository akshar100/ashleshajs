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
            if(c.one("input")){
            	c.one("input").set("value", val || "");
            }
            if(c.one("textarea")){
            	c.one("textarea").setHTML(val || "");
            }
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
                        else
                        {
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
        },
        plugValues: function(model){
        	var items = this.getFormItems();
            Y.Array.each(items, function(item) {
                item.setValue(model.get(item.get("field_name")));
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
        	try{
	            var model = new Y.SignUpModel();
	            e.halt();
	
	            this.startWait(e.target);
				model.set("type","user");
	            model = this.plugModel(model); //Method used to map the Form to the Model
	            model.on("save", function() { // User Registers successfully.
	                this.signUpSuccess();
	            }, this);
	            model.save();
            }
            catch(ex){
            	Y.log(ex);
            }
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
                    user: this.get("user"),
                    query:this.get("query")
                }).render().get("container"));
                break;
            
            default:
            	
                //This is our regular timeline that shows posts from other people's publishing page
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "You too can share with your friends."
                }));
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
                    },
                    comments_count:{
                    	value:0
                    },
                    comments:{
                    	value:[]
                    },
                    likes:{
                    	value:[]
                    },
                    shares:{
                    	value:[]
                    },
                    tType:{ //tType refers to the category of the post.
                    	value:''
                    }
                    
                }}]);
        }
    });
    
    Y.CommentModel = Y.Base.create("CommentModel", Y.CommonModel, [], {
        initializer: function() {
            Y.PostModel.superclass.initializer.apply(this, [{
                attrs: {

                    commenttext: {
                        value: '',
                        validation_rules: "trim|required|min(8)"
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
            var model = new Y.PostModel() , user = this.get("user"),owner_id = this.get('owner_id') || null;
            e.halt();
			try{
	            this.startWait(e.target);
	            model = this.plugModel(model); //Method used to map the Form to the Model
	            
	            model.on("error",function(){
	            	Y.log("error found");
	            },this);
	           	model.on("save", function() {
	            	
	                this.postSuccess();
	            }, this);
				model.set("type","PostModel");
				model.set("tType",this.get("tType"));
				model.set("author_name",user.get("firstname"));
				model.set("owner_id",owner_id);
				model.set("author_id",user.get("_id"));
	            model.save();
	            
            }catch(ex){
            	Y.log(ex);
            }
        },
        postSuccess: function() {
            var c = this.get("container");
            c.one(".message-box").setHTML(this.get("template").one("#" + this.name + "-messagebox").getHTML());
        }
    });

    Y.PostList = Y.Base.create("PostList", Y.AshleshaBaseList, [], {
        model: Y.PostModel,
        comparator: function (model) {
		    return -1*model.get('created_at');
		}
    });

    Y.PostView = Y.Base.create("PostView", Y.AshleshaBaseView, [], {
    	events:{
    		".like":{
    			"click":function(e){
    				var model=this.get("model"),likes = model.get("likes") || []; 
    				likes.push(this.get("user").get("_id"));
    				likes = Y.Array.unique(likes);
    				model.set("likes",likes);
    				model.save();
    				e.halt();
    			}
    		},
    		".unlike":{
    			"click":function(e){
    				var model=this.get("model"),likes = model.get("likes") || [], index = likes.indexOf(this.get("user").get("_id")); 
    				if(index>=0){
    					likes.splice(index,1);
    				}
    				model.set("likes",likes);
    				model.save();
    				e.halt();
    			}
    		},
    		".comments":{
    			"click":function(e){
    				
    				this.toggleComments();
    				e.halt();
    			}
    		}
    		
    	},
        altInitializer: function() {
            var c = this.get('container'),
                t = this.get("template"),
                model = this.get("model");
            c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            if (model && model.get("created_at")) { //Check to see if the model is loaded. Not a very elegant one.
                this.modelLoaded();

            }
            else {
                model.on("load", this.modelLoaded,this);
               
                model.load();
            }
            model.on("save", this.modelLoaded,this);
        },
        modelLoaded: function() {
            var model = this.get("model"),
                c = this.get('container'),
                t = this.get('template'),
                date = new Date(model.get("created_at")),
                likes = model.get("likes"),
                user = this.get("user")
                ,likeDiv,unlikeDiv;
            c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(), {
            	author_id:model.get('author_id'),
                author_name: model.get("author_name"),
                post_text: model.get("posttext"),
                created_at: date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
                comment_count: model.get("comments_count")
            }));
            likeDiv = c.one(".like").ancestor("div");
            unlikeDiv = c.one(".unlike").ancestor("div");
            if(likes && typeof likes==="object" && likes.indexOf(user.get("_id"))>=0){
            	likeDiv.addClass("hide");
            	unlikeDiv.removeClass("hide");
            }else{
            	unlikeDiv.addClass("hide");
            	likeDiv.removeClass("hide");
            }
        },
        toggleComments:function(){
        	var c = this.get("container");
        	if(c.one(".commentsSection").hasClass('hide')){
        		this.showComments();
        	}else{
        		this.hideComments();
        	}
        },
        showComments:function(){
        	var c = this.get("container"),cs = c.one(".commentsSection"),btn = cs.one(".submitComment"), 
		        	txt = new Y.TextAreaField({
		        		label:'Your Comment',
		        		field_name: 'comment',
		                rows: 5,
		                cls: "span7",
		                user:this.get("user")
		        	}),
		        	model = this.get("model"),
		        	comments = model.get("comments"),
		        	user = this.get("user"),
		        	cl = c.one(".commentsList"),i,
		        	t= this.get("template").one("#PostView-CommentView").getHTML();
        	cs.removeClass('hide');
        	cs.one(".commentTextarea").setHTML(txt.render().get("container"));
        	btn.on("click",function(e){
        		var cm = new Y.CommentModel(),errors,error,comments;
        		cm.set("commenttext",txt.get("value"));
        		errors = cm.checkValidity();
        		if(Y.Lang.isArray(errors)){
        			error = errors.pop();
        			txt.setErrorText(error.error);
        			return;
        		}
        		else
        		{
        			comments = model.get("comments");
        			comments.push({
        				commentText:txt.get('value'),
        				author_id:user.get("_id"),
        				author_name:user.get("firstname")+" "+user.get("lastname")
        				
        			});
        			model.set("comments",comments);
        			this.startWait(btn);
        			model.once("save",function(){
        				this.showComments();
        			},this);
        			model.save();
        		}
        	},this);
        	
        	for(i=0;i<comments.length;i++){
        		cl.append(Y.Lang.sub(t,{
        				TEXT:comments[i].commentText,
        				NAME:comments[i].author_name
        		}));
        	}
        },
        hidecomments:function(){
        	var c = this.get("container");
        	c.one(".commentsSection").addClass('hide');
        }
    });

    Y.PostListView = Y.Base.create("PostListView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                list = new Y.PostList(),
                self = this,
                query = this.get("query") || {};
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
            list.load(query);

        }
    });
    
    
    Y.FriendshipView = Y.Base.create("FriendshipView", Y.AshleshaBaseView, [], {
    	events:{
    		"button.add-frnd":{
    			click:function(){
    				
    			}
    		},
    		"button.accept-friend":{
    			click:function(){
    				
    			}
    		},
    		"button.remove-friend":{
    			click:function(){
    				
    			}
    		},
    		"button.follow":{
    			click:function(){
    				
    			}
    		},
    		"button.unfollow":{
    			click:function(){
    				
    			}
    		}
    	},
    	altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                user = this.get("user"),
                targetUser = this.get("targetUser");
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
                this.refresh();
       },
       refresh:function(){
       		
       		Y.api.invoke("/relations/getRelation",{
       			source:this.get("source").get("_id"),
       			target:this.get("target").get("_id")
       		},function(){
       			Y.log(arguments);
       		});
       }
    });
    
    Y.UserPageView = Y.Base.create("UserPageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                targetUser = new Y.CommonModel({
                	_id:this.get("user_id")
                }),
                user = this.get("user"),
                relation = new Y.FriendshipView({
                	source:user,
                	target:targetUser,
                	user:user
                });
                
                
            targetUser.set("_id",this.get("user_id"));
            targetUser.on("load",function(){
            	c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(),{
            		USERNAME:targetUser.get("firstname")+" "+targetUser.get("lastname"),
            		IMG:targetUser.get("image")
            	}));
           		this.loadModules();
           		c.one(".friend").setHTML(relation.render().get('container'));
           		
            },this);
            targetUser.load({
           			_id:this.get("user_id")
           		});
           

        }
    });

    Y.ProfileModel = Y.Base.create("ProfileModel", Y.CommonModel, [], {
    	sync:function(options){
    		Y.log(arguments);
    	},
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
                    },
                    relations: {
                    	value: [] 
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
                t = this.get("template"),
                m = new Y.ProfileModel();
            if (auth && auth.user) {
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            }
            this.loadModules();
            m.set("_id", this.get("user").get("_id"));
            
            m.on("load",function(){
            	this.plugValues(m); 
            },this);
            setTimeout(function() { m.load();},500);
           	
            this.set("model",m);
            
        },
        onSubmit: function(e) {
            var model = this.get("model");
            
            try{
	            e.halt();
	            model.set("_id", this.get("user").get("_id"));
	            model = this.plugModel(model);
	            model.save(function(){
	            	
	            	model.load();
	            });
	            Y.log(model.toJSON()); 
	         }catch(ex){
	         	Y.log(ex);
	         }
            

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
    
    Y.FanPageModel = Y.Base.create("FanPageModel", Y.CommonModel, [], {
        initializer: function() {
            Y.FanPageModel.superclass.initializer.apply(this, [{
                attrs: {
					_id:{
						value:''
					},
                    title: {
                        value: '',
                        validation_rules: "trim|required|min(3)"
                    },
                    description: {
                    	value: '',
                    	validation_rules: "trim|required|min(8)"
                    },
                    brand_name: {
                    	value:'',
                    	validation_rules: "trim|required|min(3)" 
                    },
                    image: {
                    	value:''
                    }
                    
                }}]);
        }
    });
    
    Y.CreateFanPageView = Y.Base.create("CreateFanPageView",Y.FormView,[],{
    	altInitializer:function(auth){
    		var c = this.get("container"),t = this.get("template");
    		
    		if(auth && auth.user){
    			c.setHTML(t.one("#"+this.name+"-main-signed").getHTML());
    		}
    		this.loadModules();
    		
    	},
    	onSubmit:function(e){
    		var model = new Y.FanPageModel();
    		model.set("type",model.name);
    		this.startWait(e.target);
    		model.on(["save","error"],function(){
    			this.endWait();
    			Y.fire("navigate",{
    				action:"/"
    			});
    		},this);
    		model = this.plugModel(model);
    		model.save();
    		e.halt();
    	}
    });
    
    Y.FanPageList = Y.Base.create("FanPageList", Y.AshleshaBaseList, [], {
        model: Y.FanPageModel,
        comparator: function (model) {
		    return -1*model.get('created_at');
		}
    });
    
    Y.FanPageListView = Y.Base.create("FanPageListView",Y.AshleshaBaseView,[],{
    	altInitializer:function(auth){
    		var c = this.get("container"),t = this.get("template"),btn = c.one(".searchBtn"), list = new Y.FanPageList(), row = t.one("#FanPageListView-item").getHTML();
    		
    		if(auth && auth.user){
    			c.setHTML(t.one("#"+this.name+"-main-signed").getHTML());
    		}
    		this.loadModules();
    		list.on("load",function(){
    			list.each(function(item){
    				c.one(".pageList").append(
    					Y.Lang.sub(row,{
    						TITLE:item.get("title"),
    						DESCRIPTION:item.get("description"),
    						IMG:item.get("image"),
    						ID:item.get("_id")
    					})
    				);
    			});
    			this.endWait();
    		},this);
    		this.startWait(c.one(".pageList"));
    		list.load();
    	}
    });
    
    Y.WardrobeView = Y.Base.create("WardrobeView",Y.AshleshaBaseView,[],{
    	altInitializer:function(auth){
    		var c = this.get("container"),t = this.get("template"), self = this;
    		
    		if(auth && auth.user){
    			c.setHTML(t.one("#"+this.name+"-main-signed").getHTML());
    		}
    		
    		
    		
    	}
    });

	Y.FanPageView = Y.Base.create("FanPageView",Y.AshleshaBaseView,[],{
    	altInitializer:function(auth){
    		var c = this.get("container"),t = this.get("template"),model = new Y.FanPageModel(),pageID= this.get("pageID");
    		
    		this.startWait(c);
    		model.on("load",function(){
    			this.endWait();
    			if(auth && auth.user){
	    			c.setHTML(Y.Lang.sub(t.one("#"+this.name+"-main-signed").getHTML(),{
	    				TITLE:model.get("title"),
	    				DESCRIPTION:model.get('description'),
	    				IMG:model.get("image"),
	    				ID:model.get("_id")
	    			}));
	    		}
	    		this.loadModules();
    		},this);
    		model.set("_id",pageID);
			model.load();
    		
    		
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