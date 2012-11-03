YUI().add('ashlesha-api', function(Y) {
    
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
    Y.api = new API(); //A global instace available to everyone else. :)
    
},'0.0.1',{
    requires:['base','ashlesha-api-base']
});
