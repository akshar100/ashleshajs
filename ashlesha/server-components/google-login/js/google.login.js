var OAuth = require('oauth').OAuth;
var querystring = require('querystring');


function require_google_login(req, res, next) {
    if(!req.session.oauth_access_token) {
    res.redirect("/google_login?action="+querystring.escape(req.originalUrl));
    return;
    }
    next();
};




exports.ROUTES = { 
        '/google_login':function(req, res) {
                
                var confObj = req.confObj; 
                var getRequestTokenUrl = "https://www.google.com/accounts/OAuthGetRequestToken";

                // GData specifid: scopes that wa want access to
                var gdataScopes = [
                    querystring.escape("https://www.google.com/m8/feeds/"),
                    querystring.escape("https://www.google.com/calendar/feeds/")
                    ];

                var oa = new OAuth(getRequestTokenUrl + "?scope=" + gdataScopes.join('+'), "https://www.google.com/accounts/OAuthGetAccessToken", confObj.TOKENS.oAuth.google.consumerKey, confObj.TOKENS.oAuth.google.consumerSecret, "1.0", "http://localhost:8000/google_cb" + (req.param('action') && req.param('action') != "" ? "?action=" + querystring.escape(req.param('action')) : ""), "HMAC-SHA1");

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
                        res.redirect("https://www.google.com/accounts/OAuthAuthorizeToken?oauth_token=" + oauth_token);
                    }
                });

        },
        "/google_cb":function(req,res){
                var confObj = req.confObj; 
             // get the OAuth access token with the 'oauth_verifier' that we received
                var oa = new OAuth(req.session.oa._requestUrl, req.session.oa._accessUrl, req.session.oa._consumerKey, req.session.oa._consumerSecret, req.session.oa._version, req.session.oa._authorize_callback, req.session.oa._signatureMethod);

                console.log(oa);

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

                        res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/google_contacts");
                    }

                });
        },
        '/google_contacts': [require_google_login, function(req, res) {
            
                var confObj = req.confObj; 
                var oa = new OAuth(req.session.oa._requestUrl, req.session.oa._accessUrl, req.session.oa._consumerKey, req.session.oa._consumerSecret, req.session.oa._version, req.session.oa._authorize_callback, req.session.oa._signatureMethod);

               
                // Example using GData API v3
                // GData Specific Header
                oa._headers['GData-Version'] = '3.0';

                oa.getProtectedResource("https://www.google.com/m8/feeds/contacts/default/full?alt=json&max-results=1000", "GET", req.session.oauth_access_token, req.session.oauth_access_token_secret, function(error, data, response) {

                    var feed = JSON.parse(data),emails=[];
                   
                    for(var i in feed.feed.entry){
                        if(feed.feed.entry.hasOwnProperty(i)){
                             try { emails.push(feed.feed.entry[i]["gd$email"][0]["address"]); } catch(ex){ console.log("Parsing failed for "+feed.feed.entry[i]);}
                        }
                       
                    }
                    
                    res.send(JSON.stringify(emails));
                });

            }]
};