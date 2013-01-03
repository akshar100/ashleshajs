var config = {};

config.TOKENS = {}; 

config.TOKENS = {
    'port':8000,
    'host':'localhost',
    'couchHost':'localhost',
    'couchPort':'5984',
    'couchdbURL':'http://localhost:5984/',
    'dbName':'devportal',
    'modelMapURL':'models/',
    'baseURL':'http://localhost:8000/',
    'listURL':'list',
    'apiURL':'api',
    'loaderImage':'/static/loader.gif',
    'uploadURL':'upload',
    'oAuth':{
        "google":{
            consumerKey:"anonymous",
            consumerSecret:"anonymous"
        },
        "facebook":{
            consumerKey:"",
            consumerSecret:""
        },
        "yahoo":{
            consumerKey:"dj0yJmk9dGNGTFlmTWI4UjRmJmQ9WVdrOVNFWlpaemRGTkdFbWNHbzlNVGs0TXpJMk16azJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD00Yw--",
            consumerSecret:"65277a7159ae118b512af9c22ce816a33229685a"
        }
    }
};

//Which Configuration attributes are visible to the client side ? 
config.CLIENT = ['baseURL','modelMapURL','listURL','apiURL','loaderImage','uploadURL'];

config.ServerComponents = ['google-login','yahoo-login'];

exports.config = config;