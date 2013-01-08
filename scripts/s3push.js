var knox = require("knox"),
    client = knox.createClient({
        key:process.env.s3key,
        secret:process.env.s3secret,
        bucket:process.env.s3repobucket
    });


if(!process.argv[2]){
    console.log("Please use the command 'node s3push ashlesha/module-name.zip'");
    
}
else{
    client.putFile(process.argv[2], '/'+process.argv[2], function(err, res){
       if(err){
           console.log(err);
       }else{
           console.log("Uploaded successfully to your amazon s3 bucket: "+process.env.s3bucket);
       }
    });
}

    

