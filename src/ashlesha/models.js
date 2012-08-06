/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global __dirname*/
"use strict";
YUI().add('common-models-store', function(Y) {

    var API = Y.Base.create("API", Y.BaseAPI, [], {
        invoke: function() {
            if (arguments[0]) {
                return API.superclass.invoke.apply(this, arguments);
            }
            else {
                throw "Please provide a path to api";
            }
        }
    });
    Y.api = new API();
    /**
     * Validations Facade. All the validation rules go here.
     */
    Y.ValidationFacade = Y.Base.create("ValidationFacade", Y.Base, [], {

        validations: {
            trim: function(key, val, attrs) {
                if (!val) {
                    val = "";
                }
                return val.trim();
            },
            required: function(key, val, attrs) {
                if (typeof val === "undefined" || !val) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> can not be empty", {
                            s: this.titlize(key)
                        })
                    };

                }
                return val;
            },
            max: function(key, val, attrs, a) {
                var args = a.replace("(", "").replace(")", "").split(",");
                if (parseInt(args[0], 10) < val.length) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> can not be longer than {L} chars", {
                            s: this.titlize(key),
                            L: args[0]
                        })
                    };
                }
                return val;
            },
            min: function(key, val, attrs, a) {
                var args = a.replace("(", "").replace(")", "").split(",");
                
                if (parseInt(args[0], 10) > val.length) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> can not be shorter than {L} chars", {
                            s: this.titlize(key),
                            L: args[0]
                        })
                    };
                }
                return val;
            },
            email: function(key, val, attrs) {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (!reg.test(val)) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> is not a valid email address", {
                            s: this.titlize(key)
                        })
                    };
                }
                return val.toLowerCase();
            },
            match: function(key, val, attrs, a) {
                var args = a.replace("(", "").replace(")", "").split(",");
                if (!attrs[args[0]] || attrs[args[0]] !== val) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> does not match with {L}", {
                            s: this.titlize(key),
                            L: this.titlize(args[0])
                        })
                    };
                }
            },
            numeric: function(key, val, attrs) {
                var reg = /^([0-9])$/;
                if (!reg.test(val)) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> is not a number", {
                            s: this.titlize(key)
                        })
                    };
                }
                return val;
            },
            string: function(key, val, attrs) {
                var reg = /^([A-Za-z])$/;
                if (!reg.test(val)) {
                    throw {
                        target: key,
                        val: val,
                        message: Y.Lang.sub("<strong>{s}</strong> is not a string", {
                            s: this.titlize(key)
                        })
                    };
                }
                return val;
            },
            /**
             * Uniqueness is a server only valdiation though it is transparently to the user.
             * @param a: "DocumentType,key"
             */
            unique: function(key, val, attrs) {
                var output;
                output = Y.api.invoke("/user/is_taken", {
                    key: key,
                    val: val
                });
               
                if (typeof output !== "undefined" && output !== false) {
                    if (output.taken === true) {
                        throw {
                            target: key,
                            val: val,
                            message: Y.Lang.sub("<strong>{s}</strong> is taken", {
                                s: this.titlize(key)
                            })
                        };
                    }
                }
                return val;
            }


        },
        titlize: function(str) {
            str = str.replace(/_/g, " ");
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

        },
        checkValidity:function(){ 
        	var errors = this.validate(this.getAttrs());
        	if(typeof errors ==="undefined" || errors===null){
        		return;
        	}
        	else{
        		return errors;
        	}
        	
        }

    });

/*
     * The CommonModel class represents the base Model for our application which supports our customized validation framework as well
     * @class  CommonModel
     * @extends AshleshaBaseModel
     * @uses
     * @constructor
     * @cfg {attrs:{
     *         attr_name:{
     *         value:'default value',
     *         validation_rules:'trim|required|numeric',
     *         hash:[true|false]
     *         save:[true,false]
     * }
     * }} configuration attributes
     *
     */
    Y.CommonModel = Y.Base.create("CommonModel", Y.AshleshaBaseModel, [Y.ValidationFacade], {
        initializer: function(config) {
            var attrs = this.get("attrs") || (config && config.attrs);

            if (attrs) //We supply attributes as initialization parameters along with
            {
                this.set("attrs", Y.clone(attrs));
                this.addAttrs(attrs);

            }

        },
        validate: function(attrs,callback) {

            var attrConfig = this.get("attrs"),
                errors = [];
            if (attrConfig) {

                Y.Object.each(attrConfig, function(val, key) {
                    var v = val.validation_rules,
                        rules;

                    //If the validation rule chain is specified
                    if (v) {
                        rules = v.split("|");

                        try {

                            Y.Array.each(rules, function(item, index) {
                                var args = item.match(/\(.*\)/),
                                    f;
                                if (!args) {
                                    val = this.validations[item].apply(this, [key, attrs[key], attrs]);
                                }
                                else {
                                    f = item.match(/^(.*)(:?\(.*)/);

                                    //Teh function name max where the item = max(10)
                                    val = this.validations[f[1]].apply(this, [key, attrs[key], attrs, f[2]]);
                                }

                            }, this);

                        } catch (ex) {

                            errors.push({
                                field: key,
                                error: ex
                            });
                        }

                    }
                }, this);
            }
            if (errors.length > 0) {
                return errors;
            }
        }
    	
    });

}, '0.0.9', {
    requires: ['ashlesha-base-models']
});