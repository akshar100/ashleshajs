var OAuth = require('oauth').OAuth;
var querystring = require('querystring');

exports.ROUTES = { 
        '/yahoo_login':function(req,res){
            var getRequestTokenUrl = "https://api.login.yahoo.com/oauth/v2/get_request_token",
                    accessTokenURL = "https://api.login.yahoo.com/oauth/v2/get_token",
                    consumerKey = req.confObj.TOKENS.oAuth.yahoo.consumerKey,
                    consumerSecret = req.confObj.TOKENS.oAuth.yahoo.consumerSecret,
                    oa = new OAuth(getRequestTokenUrl,accessTokenURL,consumerKey,consumerSecret,"1.0",req.confObj.TOKENS.baseURL+"yahoo_cb","HMAC-SHA1");
                    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
                        if (error) {
                            console.log('error');
                            console.log(error);
                        }
                        else {
                            // store the tokens in the session
                            req.session.oa = oa;
                            req.session.oauth_token = oauth_token;
                            req.session.oauth_token_secret = oauth_token_secret;
    
                            // redirect the user to authorize the token
                            res.redirect("https://api.login.yahoo.com/oauth/v2/request_auth?oauth_token=" + oauth_token);
                        }
                    });    
            
            
            
        },
        "/yahoo_cb":function(req,res){
            var confObj = req.confObj; 
             // get the OAuth access token with the 'oauth_verifier' that we received
                var oa = new OAuth(req.session.oa._requestUrl, req.session.oa._accessUrl, req.session.oa._consumerKey, req.session.oa._consumerSecret, req.session.oa._version, req.session.oa._authorize_callback, req.session.oa._signatureMethod);

                

                oa.getOAuthAccessToken(
                req.session.oauth_token, req.session.oauth_token_secret, req.param('oauth_verifier'), function(error, oauth_access_token, oauth_access_token_secret, results2) {

                    if (error) {
                        console.log('error');
                        console.log(error);
                    }
                    else {

                        // store the access token in the session
                        req.session.oauth_access_token = oauth_access_token;
                        req.session.oauth_access_token_secret = oauth_access_token_secret;

                        res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/yahoo_contacts");
                    }

                });
        },
        "/yahoo_contacts":function(req,res){
            var confObj = req.confObj; 
                var oa = new OAuth(req.session.oa._requestUrl, req.session.oa._accessUrl, req.session.oa._consumerKey, req.session.oa._consumerSecret, req.session.oa._version, req.session.oa._authorize_callback, req.session.oa._signatureMethod);

               

                oa.getProtectedResource("http://query.yahooapis.com/v1/yql?format=json&q="+encodeURIComponent("SELECT * FROM social.contacts(200) WHERE guid=me"), "GET", req.session.oauth_access_token, req.session.oauth_access_token_secret, function(error, data, response) {
                    var r = JSON.parse(data),emails =[];
                   
                    for(var i in r.query.results.contact){
                        try {emails.push(r.query.results.contact[i].fields[0]['value']); } catch(ex){}
                    }
                    res.send(JSON.stringify(emails));
                });

        }
}; 