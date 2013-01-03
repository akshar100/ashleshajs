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
        	
        	var infraSuite = new Y.Test.Suite("Infra Test Suite"),dbSuite = new Y.Test.Suite("DB Test Suite") ,
				testCase = new Y.Test.Case({
					testSimpleCase: function () {
						
						
				        Y.Assert.areEqual(true, true, "Test Infra not working fine");
				        
				   },
				   testBasicInfrastructure:function(){
				   		
				   		Y.Assert.isObject(Y.api,"API Not Found");
				   		Y.Assert.isObject(Y.AshleshaBaseView,"BaseView Not found");
				   		Y.Assert.isObject(Y.AshleshaCurrentUserModel,"CurrentUserModel");
				   	
				   }
				   
					
				}),
				dbTests = new Y.Test.Case({
				    testDBSetup:function(){
				       
			             Y.api.invoke("/db/update",{},function(err){
                            Y.Assert.isNull(err,"DB Update Failed");
                            Y.log("##################################");
                         });
                        
				       
				        Y.Assert.isNull(null);
				        
				    },
				    testCommonModel:function(){
				        var model = new Y.CommonModel({
				            "property":"value"
				        }),id;
				        model.on("save",function(err,val){
				            Y.Assert.isString(model.get("_id"),"Model failed to get saved");
				            id = model.get("_id");
				            model = new Y.CommonModel({
				                '_id':id
				            });
				            model.on("load",function(){
				                
				                Y.Assert.isEqual(model.get("property","value","Model was not saved"));
				                sys.puts(model.get("_id"));
				                sys.puts("model not saved");
				            });
				            model.load();
				        });
				        model.save();
				    }
				});
			Y.api = new Y.BaseAPI();
			infraSuite.add(testCase);
			dbSuite.add(dbTests);
			
			Y.Test.Runner.add(infraSuite);
			Y.Test.Runner.add(dbSuite);
			
			Y.Test.Runner.run();
        	
        	
        	
        	
		});