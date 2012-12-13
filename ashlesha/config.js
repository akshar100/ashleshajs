var config = {};

config.TOKENS = {}; 

config.TOKENS = {
    'port':8000,
    'host':'localhost',
    'couchdbURL':'http://localhost:5984/',
    'dbName':'devportal',
    'modelMapURL':'models/',
    'baseURL':'http://localhost:8000/',
    'listURL':'list',
    'apiURL':'api',
    'loaderImage':'/static/loader.gif'
};

//Which Configuration attributes are visible to the client side ? 
config.CLIENT = ['baseURL','modelMapURL','listURL','apiURL','loaderImage'];

exports.config = config;