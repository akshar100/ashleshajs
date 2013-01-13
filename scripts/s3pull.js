var knox = require("knox"),
    conf = {
        key:process.env.s3key || "nokey",
        secret:process.env.s3secret || "nokey",
        bucket:process.env.s3repobucket || "ashlesha"
    },
    client = knox.createClient(conf),
    module = process.argv[2],
    location = process.argv[3],
    fs = require("fs"),
    http = require("http");
    
    var options = {
      hostname: 's3.amazonaws.com',
      port: 80,
      path: '/'+conf.bucket+'/'+module,
      method: 'GET'
    };


if(!module || !location){
    console.log("Please use the command 'node s3pull module-name <server-component|components>'");
    
}
else{
    
    
    var request = http.request(options,function (res) {
        
        var downloadfile = fs.createWriteStream("ashlesha/"+location+"/"+module, {'flags': 'a'}); 
        console.log('STATUS: ' + res.statusCode);
        var headers = JSON.stringify(res.headers);
        console.log('HEADERS: ' + headers);
        res.on('data', function(chunk){
            downloadfile.write(chunk, encoding='binary');
        });
        res.on("end", function(){
            downloadfile.end();
        });
    });
    
    request.end();
}

    

