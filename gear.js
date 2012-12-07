var gear = require('gear'),
    fs = require("fs"),
    wrench = require("wrench"),
    util = require('util');
    
var buildDir = "build"
var buildfile = buildDir+'/build-common.js';
var components = fs.readdirSync("ashlesha/components");
var skin = "default";
var skinfile = buildDir+'/views/' + skin + '/';

components = ['ashlesha-api', 'ashlesha-common-model', 'ashlesha-form', 'ashlesha-formview', 'ashlesha-gmap', 'ashlesha-postview', 'ashlesha-page', 'ashlesha-places', 'ashlesha-relation', 'ashlesha-profile', 'ashlesha-home', 'ashlesha-mapview', 'ashlesha-login', 'ashlesha-signup', 'ashlesha-timeline', 'ashlesha-topbar', 'ashlesha-userpageview', 'ashlesha-wardrobe','ashlesha-fanpage','ashlesha-search','ashlesha-brandpage'];

wrench.rmdirSyncRecursive(buildDir,true);
wrench.mkdirSyncRecursive(buildDir);
wrench.copyDirSyncRecursive('./ashlesha', buildDir, { preserve:false });


/**
 * Time to copy the configuration object from config file to client side. :) 
 * If there is a better way to do this let me know.
 */
(function(){
    
    var file = fs.readFileSync("./build/appv2.js","UTF-8");
    var config = require("./build/config.js").config;
    var clientConfig = {};
    for(var i in config.CLIENT){
        console.log(config.CLIENT[i]);
        clientConfig[config.CLIENT[i]] = config.TOKENS[config.CLIENT[i]];
    }
    
    file = file.replace("@CLIENT_CONFIG@",JSON.stringify(clientConfig));
    fs.writeFileSync("./build/appv2.js",file);
}());

/**
 * If the skin directory does not exist, create one
 */
if(!fs.existsSync(skinfile)){
    
    wrench.mkdirSyncRecursive(skinfile);
}


fs.writeFileSync(buildfile, ["/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */", "/*global require*/", "/*global module*/", "/*global YUI*/", "/*global google*/", "/*global __dirname*/", "\"use strict\";", "\n"].join("\n"));

process.argv.forEach(function(val, index, array) {
    if (val === "build") {
        var component_files = [buildfile];

        components.forEach(function(item) {
            var fileName = item.replace(/-/g, ".");

            component_files.push(buildDir+'/components/' + item + '/js/' + fileName + '.js');
        });


        console.log("Total Components Found:" + component_files.length);

        //Concatenate all the component files
        new gear.Queue({
            registry: new gear.Registry({
                module: 'gear-lib'
            })
        }).
        read(component_files).
        concat().
        jslint().
        //jsminify().
        write(buildfile).run(function(){
            
            new gear.Queue({
                registry: new gear.Registry({
                    module: 'gear-lib'
                })
            }).
            read(['build/serverf.js',buildfile,"build/appv2.js"]).
            concat().
            write(buildDir+'/server.js').
            jslint().
            run();
            
            
            
             new gear.Queue({
                registry: new gear.Registry({
                    module: 'gear-lib'
                })
            }).
            read(["ashlesha/public/static/bootstrap/bootstrap/css/bootstrap.min.css", "ashlesha/public/static/bootstrap/bootstrap/css/bootstrap-responsive.min.css","ashlesha/public/static/css/override.css","ashlesha/public/static/css/editor.css"]).
            concat().
            write(buildDir+"/public/static/css/build.css").run(function(err){
                wrench.copyDirSyncRecursive(
                    "ashlesha/public/static/bootstrap/bootstrap/img",
                    buildDir+"/public/static/img",{preserve:true});
                console.log(err);
            });
            
            
            new gear.Queue({
                registry: new gear.Registry({
                    module: 'gear-lib'
                })
            }).
            read(["build/client.js", buildfile, "build/appv2.js"]).
            concat().
            jslint().
            jsminify().
            write(buildDir+'/public/static/js/build.min.js').
            //    inspect().
            run(function(err, results) {
                
                wrench.rmdirSyncRecursive(buildDir+'/components');
                components.forEach(function(item){
                   
                    if(fs.existsSync('ashlesha/components/'+item+'/assets/skin/'+skin))
                    { 
                        
                        wrench.copyDirSyncRecursive(
                            'ashlesha/components/'+item+'/assets/skin/'+skin, 
                            buildDir+'/views/'+skin,
                            { preserve:true }
                        );
                    }
                    
                    
                });
                
                
                
                
                new gear.Queue({
                registry: new gear.Registry({
                    module: 'gear-lib'
                    })
                }).
                read(['ashlesha/public/static/js/parserRules.js','ashlesha/public/static/js/editor.js','ashlesha/public/static/bootstrap/bootstrap/js/bootstrap.min.js']).
                concat().
                write(buildDir+'/public/static/js/externalcomponents.js').
                run(function(err){
                    console.log(err);
                    
                    
                    process.chdir("./build");
                
                    require("./build/server.js");
                    
                });
            
               
                
                
                
            });
            
            
        }); 
        
    }
    if (val === "create") {
        var moduleName = array[index + 1]; //Create a module with provided name
        var dirName = 'ashlesha/components/' + moduleName;
        fs.mkdir(dirName, 0777, function(err) {
            var fileName = moduleName.replace(/-/g, ".");
            fs.mkdir(dirName + "/js", 0777);
            fs.mkdir(dirName + "/assets", 0777);
            fs.mkdir(dirName + "/assets/skin", 0777);
            fs.mkdir(dirName + "/assets/skin/default", 0777);
            fs.mkdir(dirName + "/tests", 0777);
            fs.writeFile(dirName + "/js/" + fileName + ".js", "YUI().add('" + moduleName + "',function(Y) {},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });");
        });

    }
    

});