/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global __dirname*/
"use strict";
YUI().add('ashlesha-common', function(Y) {

    var API = Y.Base.create("API", Y.BaseAPI, [], {
        invoke: function() {
            if (arguments[0]) {
                API.superclass.invoke.apply(this, arguments);
            }
            else {
                throw "Please provide a path to api";
            }
        }
    });
    Y.api = new API();

    Y.FormItem = Y.Base.create("FormItem", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container');
            c.setHTML(Y.Lang.sub(this.get('template').one('#' + this.name + "-main").getHTML(), {
                LABEL: this.get("label") || "ITEM",
                FIELD_NAME: this.get('field_name') || "field",
                INPUT_TYPE: this.get("input_type") || "text",
                PLACEHOLDER: this.get("placeholder") || "",
                HELP_TEXT: this.get("help_text") || ""
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
        }

    }, {
        ATTRS: {
            value: {
                value: '',
                getter: function() {
                    var c = this.get('container');
                    return c.one("#" + this.get('field_name')).get("value").trim();
                },
                setter: function(val) {
                    var c = this.get('container');
                    val = val || "";
                    c.one("#" + this.get('field_name')).set("value", val.trim());
                }
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
            this.get('container').one(".yy").set("value",y);
        },
        setMonth: function(y) {
            this.get('container').one(".mm").set("value",y);
        },
        setDay: function(y) {
            this.get('container').one(".dd").set("value",y);
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
                    var date = val.split("-"),
                        c = this.get('container');
                    this.setYear(date[0]);
                    this.setMonth(date[1]);
                    this.setDay(date[2]);
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


    Y.TopBarView = Y.Base.create("TopBarView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get('template');
            if (!auth.user) { //if the user is not signed in
                c.setHTML(t.one('#TopBarView-main-unsigned').getHTML());
            } else { //if the user is signed in
                c.setHTML(t.one('#TopBarView-main-unsigned').getHTML());
            }
            this.loadModules();
        }
    });

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

            this.login(); // show the login screen by default
        },
        onSubmit: function(e) {
            var c = this.get('container'),
                user, password, email, form = e.target.getAttribute("id");
            this.halt(e);
            if (form === "login") { //If user is trying to log in
            }
            else if (form === "forgot_password") { //If the user is trying to retrieve forgotten password
                email = c.one('#email').get("value");
            }
            Y.api.invoke("/user/recover_password");
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
            Y.log(nodes);
            nodes.each(function(item) {
                items.push(Y.AshleshaBaseView.getByNode(item).get('value'));
            });
            return items;
        }

    });


    Y.SignUpView = Y.Base.create("SignUpView", Y.FormView, [], {
        altInitializer: function(auth) {
            var c, t;
            Y.SignUpView.superclass.altInitializer.apply(this, arguments);
            c = this.get('container');
            t = this.get('template');
            c.setHTML(t.one("#SignUpView-main-unsigned").getHTML());
            this.loadModules();
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



}, '0.0.1', {
    requires: ['base', 'cache', function() {
        if (typeof document !== 'undefined') {
            return 'client-app';
        } else {
            return 'server-app';
        }}(), 'ashlesha-api']
});