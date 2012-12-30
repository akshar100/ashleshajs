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
        function(Y) {
        	
        	var suite = new Y.Test.Suite("Infra Test Suite"),
				testCase = new Y.Test.Case({
					testSimpleCase: function () {
						
						
				        Y.Assert.areEqual(true, true, "Test Infra not working fine");
				        
				    }
					
				});
			
			suite.add(testCase);
			
			
			Y.Test.Runner.add(suite);
			
			Y.Test.Runner.run();
        	
        	
        	
        	
		});