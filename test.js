

var YUITest = require('yuitest'),
	YUI = require("yui").YUI,
	sys = require("sys");

YUI({useSync: true }).use('test', function(Y) {

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