var AWS = require('aws-sdk');
var fs =  require('fs');
var index = require('../../index')


// var accesskey = index.hello();
// var secretAccess = index.secretAccess();
// AWS.config.update( {accessKeyId: accesskey, secretAccessKey: secretAccess} );
// var s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

var myBucket = 'ibqualification';


function uploadFile(file, filetype){

  var accesskey = index.accessKeyId();
  var secretAccess = index.secretAccess();
  // console.log("access key" + accesskey);
  // console.log("secret access" + secretAccess);
  AWS.config.update( {accessKeyId: accesskey, secretAccessKey: secretAccess} );
  var s3 = new AWS.S3();

  //var file = index.file();
  s3.createBucket(function(){
    myBucket = myBucket + "/" + filetype;
    var params = {Bucket: myBucket, Key: file.name, Body: file.data };

    s3.upload(params, function (err, data) {
      if (err) {
        console.log('error in callback');
        console.log(err);
      }
      console.log('success');
      console.log(data);
   });
  });

  myBucket = "ibqualification";

  var url = "";
  if(filetype == "passport"){
    url = "https://s3-ap-southeast-1.amazonaws.com/ibqualification/passport/" + file.name;
  } else if (filetype == "IB"){
    url = "https://s3-ap-southeast-1.amazonaws.com/ibqualification/IB/" + file.name;
  }

  return url;


  //res.send("Something")
}

exports.uploadFile = uploadFile
