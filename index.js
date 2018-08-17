var express = require('express');
var app = express();
require('dotenv').config();
var path = require('path');
var bodyParser = require('body-parser')

var db = require('./public/javascripts/queries');
var uploadAWS = require('./public/javascripts/uploadAWS')



var Busboy = require('busboy');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');

app.use(busboy());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(busboyBodyParser());

app.use("/css", express.static(path.join(__dirname, "/public/stylesheets/assets/css")));
app.use("/dropzone", express.static(path.join(__dirname, "/public/stylesheets/dropzone")));
app.use("/coreJS", express.static(path.join(__dirname, "/public/stylesheets/assets/js/core")));
app.use("/plugins", express.static(path.join(__dirname, "/public/stylesheets/assets/js/plugins")));
app.use("/effects", express.static(path.join(__dirname, "/public/stylesheets/assets/js")));


app.set('view engine', 'pug');

var result = ""

var candidate = {}
exports.candidate = function(){
  return candidate;
}

exports.accessKeyId = function(){
  return process.env.accessKeyId;
}

exports.secretAccess = function(){
  return process.env.secretAccessKey;
}

var candidate_modified = {}

var passport_url = "";
var ib_url = "";


app.get('/', function(req, res){
    res.render("home");
});

app.get('/results', function(req, res){

    candidate_modified["totalscore"] = result[2];
    candidate_modified["subject1"] = result[3];
    candidate_modified["subject2"] = result[4];
    candidate_modified["subject3"] = result[5];
    candidate_modified["subject4"] = result[6];
    candidate_modified["subject5"] = result[7];
    candidate_modified["subject6"] = result[8];

    candidate_modified["score1"] = result[9];
    candidate_modified["score2"] = result[10];
    candidate_modified["score3"] = result[11];
    candidate_modified["score4"] = result[12];
    candidate_modified["score5"] = result[13];
    candidate_modified["score6"] = result[14];

    res.render("results", candidate_modified);
});

app.get('/IB', db.getAllRecords);


app.post('/uploadPassport', function (req, res, next){

  var busboy = new Busboy({ headers: req.headers });


  busboy.on('finish', function() {

    const passport = req.files.file;
    console.log(passport);
    passport_url = uploadAWS.uploadFile(passport, "passport");

    console.log("Passport uploaded successfully to AW3");
    res.send('stop');
  });


  req.pipe(busboy);

});


app.post('/uploadIB', function (req, res, next){
  var busboy = new Busboy({ headers: req.headers });


  busboy.on('finish', function() {

    const IBfile = req.files.file;
    console.log(IBfile);
    ib_url = uploadAWS.uploadFile(IBfile, "IB");

    console.log("IB uploaded successfully to AW3");
    next()
  });
  req.pipe(busboy);

});

app.post('/uploadIB', function(req, res, next){

  var spawn = require("child_process").spawn;
  var process = spawn('python',["./ocr_scripts/ocrspace_example.py", ib_url]);
  process.stdout.on('data', function(data) {
      result = data.toString().split(",")
      // res.send(result[0]);
      //res.send(data.toString())
  })
  process.on('exit', function (code, signal) {
      console.log('child process exited with ' +
            `code ${code} and signal ${signal}`);

      candidate = {
        name: result[0],
        institution: result[1],
        score: parseInt(result[2]),
        ee: 'B',
        tok: 'B',

      }

      candidate[result[3].toLowerCase()] = parseInt(result[9]);
      candidate[result[4].toLowerCase()] = parseInt(result[10]);
      candidate[result[5].toLowerCase()] = parseInt(result[11]);
      candidate[result[6].toLowerCase()] = parseInt(result[12]);
      candidate[result[7].toLowerCase()] = parseInt(result[13]);
      candidate[result[8].toLowerCase()] = parseInt(result[14]);

      next()
  });

})

app.post('/uploadIB', db.insertRecord);


//app.listen(3000);
app.listen(process.env.PORT || 5000);
