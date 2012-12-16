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
    'uploadURL':'upload'
};

//Which Configuration attributes are visible to the client side ? 
config.CLIENT = ['baseURL','modelMapURL','listURL','apiURL','loaderImage','uploadURL'];

exports.config = config;