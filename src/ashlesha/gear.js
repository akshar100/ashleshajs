var gear = require('gear'),fs=require("fs");
var buildfile = '../../build/ashlesha/build-common.js';
var components = fs.readdirSync("components");
var skin = "default";
var skinfile = '../../build/ashlesha/views/'+skin+'/';

try{ fs.unlinkSync(buildfile); } catch(ex){ console.log(buildfile+" not present"); }
fs.writeFile(buildfile,"");


components.forEach(function(item){
    var fileName = item.replace("-",".");
    new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})}).
        read('components/'+item+'/js/'+fileName+'.js',buildfile).
        inspect().
        jsminify().
        log('Parallel Tasks').concat().write(buildfile).
        run(function(err, results) {
            console.log(arguments);
        });
        
    new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})}).
        read('components/'+item+'/assets/skins/'+skin+"/"+fileName+'.tpl').
        write(skinfile+fileName+'.tpl').
        run();
        
});





