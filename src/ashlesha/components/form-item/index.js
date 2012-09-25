/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global __dirname*/
"use strict";
YUI().add('form-item', function(Y) {
	
	 /**
		* Create BootStrap based forms. with 
		* and <code>from</code> attributes.
		* @module anim
		* @submodule anim-color
		*/
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
            if (c.one("input")) {
                c.one("input").set("value", val || "");
            }
            if (c.one("textarea")) {
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
	
	
	
}, '0.0.1', {
    requires: ['app','ashlesha-base-view']
});