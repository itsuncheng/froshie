var express = require('express');
var app = express();
require('dotenv').config();
var path = require('path');
var bodyParser = require('body-parser')
var fs = require('fs')

var db = require('./public/javascripts/queries');
var uploadAWS = require('./public/javascripts/uploadAWS')

var multer  = require('multer');


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


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + 'public/database/passport')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

app.post('/uploadPassport', upload.any(), function (req, res){

  // var busboy = new Busboy({ headers: req.headers });
  //
  // //const passport = req.files.file;
  // busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
  //   console.log("fdgfd");
  //   fstream = fs.createWriteStream('public/database/passport/' + filename);
  //   file.pipe(fstream);
  //
  // });
  //
  // busboy.on('finish', function() {
  //   console.log("Storage Path:");
  //   console.log(__dirname + '/public/database/passport/' + 'filename');
  //   console.log("Passport uploaded successfully");
  //   //res.writeHead(200, { 'Connection': 'close' });
  //   res.send('stop');
  // });
  //
  //
  // return req.pipe(busboy);

  // var fstream;
  // req.pipe(req.busboy);
  // req.busboy.on('file', function (fieldname, file, filename) {
  //   var filePath = path.join(__dirname, '/public/database/passport/', filename);
  //   fstream = fs.createWriteStream(filePath);
  //   file.pipe(fstream);
  //   fstream.on('close', function () {
  //       console.log('Files saved');
  //   });
  // });


  console.log(req.files);
  console.log(req.files.file.path);
  console.log(req.files.file.type);
  res.send("stop")

});


app.post('/uploadIB', function (req, res, next){
  var busboy = new Busboy({ headers: req.headers });

  //const passport = req.files.file;
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    fstream = fs.createWriteStream(__dirname + '/public/database/IB/' + filename);
    file.pipe(fstream);


  });

  busboy.on('finish', function() {
    console.log("IB uploaded successfully");
    next()
  });


  return req.pipe(busboy);

});

app.post('/uploadIB', function(req, res, next){

  var spawn = require("child_process").spawn;
  ib_url = "http://ibocr.herokuapp.com/IBcert.png"
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

      console.log("result!!!!!!!!!!!" + result)
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


app.listen(3000);
//app.listen(process.env.PORT || 5000);
