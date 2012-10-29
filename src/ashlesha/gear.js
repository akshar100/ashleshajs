var gear = require('gear'),fs=require("fs");
var buildfile = '../../build/ashlesha/build-common.js';
var components = fs.readdirSync("components");
var skin = "default";
var skinfile = '../../build/ashlesha/views/'+skin+'/';

try{ fs.unlinkSync(buildfile); } catch(ex){ console.log(buildfile+" not present"); }
fs.writeFileSync(buildfile,["/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */","/*global require*/","/*global module*/","/*global YUI*/","/*global google*/","/*global __dirname*/"].join("\n"));

components = ['ashlesha-api','ashlesha-common-model','ashlesha-form'];


process.argv.forEach(function (val, index, array) {
  if(val==="build"){
      var component_files = [buildfile];
      
      components.forEach(function(item){
        var fileName = item.replace(/-/g,".");
        
        component_files.push('components/'+item+'/js/'+fileName+'.js');
       });
       
       //Concatenate all the component files
        new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})}).
            read(component_files).
            concat().
            jslint().
            jsminify().
            write(buildfile).
        //    inspect().
            run(function(err, results) {
                console.log(err);
            });
            
         //Create The Server file 
         new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})}).
            read(["./serverf.js",buildfile,"appv2.js"]).
            concat().
            jslint().
            jsminify().
            write('../../build/ashlesha/server.js').
        //    inspect().
            run(function(err, results) {
                console.log(err);
            });
         //Create The Client File
         new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})}).
            read(["./client.js",buildfile,"appv2.js"]).
            concat().
            jslint().
            jsminify().
            write('../../build/ashlesha/public/static/js/build.min.js').
        //    inspect().
            run(function(err, results) {
                console.log(err);
            });
            
            
            
       /* new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})}).
            read('components/'+item+'/assets/skins/'+skin+"/"+fileName+'.tpl').
            write(skinfile+fileName+'.tpl').
            run();
            */
   
  }
  if(val==="create"){
      var moduleName = array[index+1]; //Create a module with provided name
      var dirName = 'components/'+moduleName;
      fs.mkdir(dirName,0777,function(err){
          var fileName = moduleName.replace(/-/g,".");
          fs.mkdir(dirName+"/js",0777);
          fs.mkdir(dirName+"/assets",0777);
          fs.mkdir(dirName+"/assets/skin",0777);
          fs.mkdir(dirName+"/assets/skin/default",0777);
          fs.mkdir(dirName+"/tests",0777); 
          fs.writeFile(dirName+"/js/"+fileName+".js","YUI().add('"+moduleName+"',function(Y) {},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });"); 
      });
      
  }
  
});









