AshleshaJS
=============

NodeJS/Express based framework for building single modern web applications still providing incremental enhancements for
those browsers which dont support Javascript. 

* Based on YUI3
* Uses Twitter Bootstrap
* MVC architecture at the backend and front end.
* Write an API that seamlessly works on client as well as on server. No more redundant code.
* Module based design. Write web pages as collection of self-contained modules.
* Determine which code goes to server and which code remains on server.
* Use Server Sent Events using Socket.IO which makes real-time communication possible.
* LocalStorage based caching for templates and models. (Falls back to memory on other browsers)
* Finetuned for A grade on YSlow. 
* Intergrated with CouchDB
* Runs JSHint, Minification on the Javascript file, minifies and concatenates it into a single file.
 

Configuration
--------------

- After you clone the repository run the command ```git submodules update```. This will fetch Twitter Bootstrap
- Install NodeJS
- Install the dependent node modules using the command ```npm install -g yui3 express redis nodemailer less```
- Since our framework uses Bootstrap you will also the need the modules required to compile bootstrap ```npm install recess uglify-js jshint -g``` 
- Modify the custom.properties file to configure your domain name and other server details
- Run ```ant all`` from the base directory
- Go to the build directory using command  ```cd build/ashlesha/``` and run ```node server.js```
- This will start the server on specified domain name at port 8888 (You can change the port number in custom.properties file)

Example:
----------------

Code to create a signup form:

```Javascript
app.route("/signup",function(req,res){
    	this.showView('page', {
            req: req,
            res: res,
            user:currentUser,
            modules: {
                ".topbar": {
                    view: "TopBarView"
                },
                ".page-content": {
                	view:"SignUpView",
                	config:{
                		modules:{
                			'div.date_field':{
                				view:"DateField",
                				config:{
                					label:'Date of Birth',
                					field_name:'dob'
                				}
                			},
                			'div.first_name':{
                				view:'FormItem',
                				config:{
                					label:'First Name',
                					field_name:'firstname'
                				}
                			},
                			'div.last_name':{
                				view:'FormItem',
                				config:{
                					label:'Last Name',
                					field_name:'lastname'
                				}
                			},
                			'div.password':{
                				view:'FormItem',
                				config:{
                					label:'Password',
                					field_name:'password',
                					field_type:'password'
                				}
                			},
                			'div.password2':{
                				view:'FormItem',
                				config:{
                					label:'Repeat Password',
                					field_name:'password2',
                					field_type:'password'
                				}
                			},
                			'div.email':{
                				view:'FormItem',
                				config:{
                					label:'Email',
                					field_name:'email'
                				}
                			},
                			'div.gender':{
                				view:'SelectField',
                				config:{
                					label:'You are',
                					field_name:'gender',
                					options:{
                						m:"Male",
                						f:"Female"
                					}
                				}
                			}
                		}
                	}
                }

            }
        });
    });
    
   Y.SignUpView = Y.Base.create("SignUpView", Y.FormView, [], {
        altInitializer: function(auth) {
            var c, t;
            Y.SignUpView.superclass.altInitializer.apply(this, arguments);
            c = this.get('container');
            t = this.get('template');
            c.setHTML(t.one("#SignUpView-main-unsigned").getHTML());
            this.loadModules();
        },
        onSubmit:function(e){
        	
        	var item = this.getFormItems(), model = new Y.CommonModel({
        		attrs:{
        			
        			firstname:{
        				value:'',
        				validation_rules:"trim|required"
        			},
        			lastname:{
        				value:'',
        				validation_rules:"trim|required"
        			},
        			email:{
        				value:'',
        				validation_rules:"trim|required"
        			},
        			dob:{
        				value:'',
        				validation_rules:"required"
        			},
        			password:{
        				value:'',
        				validation_rules:'required'
        			},
        			password2:{
        				value:'',
        				validation_rules:'required'
        			},
        			type:{
        				value:'user'
        			},
        			gender:{
        				value:'',
        				validation_rules:'required'
        			}
        		}
        	});
        	e.halt();
        	this.startWait(e.target);
        	model = this.plugModel(model); //Method used to map the Form to the Model
        	
        	
        	model.save();
        }
    });
```
A HTML template needs to be placed on the server and our framework generates all the other code. The Server starts listening to */signup*, the client starts listening for */signup* 
URL change. The model is plugged into the the View is is also responsible for validating the form inputs and save it on the server. The input values are validated on client and also 
on the server. 


Common Problems
-----------------

- Not tested on windows 
- Ant requires Java Runtime 

Documentation
-----------------

You can generate the documentation bu running ```ant docs```. This will run YUIDocs on the Javascript code and generate the documentation.

A file documentation.pdf is provided which gives the basic overview of the architecture and the philosophy behind design in an academic perspective.

Credits and Bugs
------------------
This framework is authored by Akshar Prabhu Desai. Many people helped conceptualize this framework and many people provided the neccessary resources. 
This code is realeased under MIT license. For any queries write to akshar at akshar.co.in 
