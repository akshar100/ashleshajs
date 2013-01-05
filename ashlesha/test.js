/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global YUI*/
"use strict";

YUI({
    AppConfig: @CLIENT_CONFIG@
    
}).use( 'ashlesha-base-app',
        'cache-offline',
        'ashlesha-base-models', 
        'ashlesha-base-view',
        'ashlesha-topbar',
        'ashlesha-home',
        'ashlesha-timeline',
        'ashlesha-wardrobe',
        'ashlesha-signup',
        'ashlesha-login',
        'ashlesha-page',
        'ashlesha-places',
        'ashlesha-gmap',
        'ashlesha-fanpage',
        'ashlesha-search',
        'ashlesha-brandpage',
        'ashlesha-profile',
        'test',
        'ashlesha-api-base',
        function(Y) {
        	Y.api = new Y.BaseAPI();
        	var infraSuite = new Y.Test.Suite("Infra Test Suite"),
        	    dbSuite = new Y.Test.Suite("DB Test Suite") ,
				testCase = new Y.Test.Case({
					testSimpleCase: function () {
						
						
				        Y.Assert.areEqual(true, true, "Test Infra not working fine");
				        
				   },
				   testBasicInfrastructure:function(){
				   		
				   		Y.Assert.isObject(Y.api,"API Not Found");
				   		Y.Assert.isObject(Y.AshleshaBaseView,"BaseView Not found");
				   		Y.Assert.isObject(Y.AshleshaCurrentUserModel,"CurrentUserModel");
				   		Y.Assert.isObject(new Y.HomePageView(),"HomepageView");
				   		var page = new Y.HomePageView(); 
				   		page.on("render",function(e){
				   		   Y.log("Testing Render Callback");
				   		   Y.Assert.isString(e.data,"Rendering Template Sucessfully"); 
				   		});
				   		page.render();
				   		
				   		Y.Assert.isTrue(typeof page.render==="function","Render Function Exists");
				   	
				   },
				   testCurrentUser:function(){
				       var currentUser = new Y.AshleshaCurrentUserModel();
				       Y.Assert.isObject(currentUser);
				       Y.on("UpdateUser",function(e){
				           Y.Assert.isObject(e,"Updateuser fired without a user object");
				       });
				       Y.api.invoke("/login",{
				           username:'akshar@akshar.co.in',
				           password:'123456'
				       },function(err,success){
				          Y.Assert.isNull(err,"Login Error Occured");
				          Y.Assert.isNotNull(success,"Login failed"); 
				       });
				       setTimeout(function(){
				           
				           currentUser.load(function(){
				               //Y.Assert.isString(currentUser.get("_id"),"CurrentUser not found");
				               Y.log(currentUser.toJSON());
				           });
				           
				       },300);
				       
				   }
				   
					
				}),
				dbTests = new Y.Test.Case({
				    
				    testDBSetup:function(){
				       

                       Y.api.invoke("/db/update",{},function(err){
                            Y.Assert.isUndefined(err,"DB Update Failed");
                            Y.log("##################################");
                       });
			           
                        
				        
				    },
				    testCommonModel:function(){
				        var model = new Y.CommonModel({
				            "property":"value"
				        }),id;
				        /*model.on("save",function(err,val){
				            Y.Assert.isString(model.get("_id"),"Model failed to get saved");
				            id = model.get("_id");
				            model = new Y.CommonModel({
				                '_id':id
				            });
				            model.on("load",function(){
				                
				                Y.Assert.isEqual(model.get("property","value","Model was not saved"));
				                sys.puts(model.get("_id"));
				                
				            });
				            model.load();
				        });
				        */
				        model.save();
				        setTimeout(function(){
				           Y.Assert.isString(model.get("_id"),"Model Not Saved"); 
				        },200);
				    },
				    testSignup:function(){
				       
				       var user  = new Y.SignUpModel();
				       user.setAttrs({
                           firstname:"Akshar",
                           lastname:"Prabhudesai",
                           email:"akshar@akshar.co.in",
                           password:"123456",
                           password2:"123456",
                           gender:"male",
                           dob:"2012-12-12",
                           type:"user",
                           api:Y.api
                       });
                       
                       
                       user.on("save",function(err,success){
                           Y.Assert.isNotNull(user.get("_id"),"Failed to save SignupModel");
                           Y.log(user.get("_id"));
                       });
                       
                       user.save();
				        
				    }
				});
			
			infraSuite.add(testCase);
			dbSuite.add(dbTests);
			
			
			Y.Test.Runner.add(dbSuite);
			Y.Test.Runner.add(infraSuite);
			
			
			Y.Test.Runner.run();
        	
        	
        	
        	
		});