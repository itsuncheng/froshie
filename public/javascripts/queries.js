var promise = require('bluebird');
var index = require('../../index')


var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'mytestdb',
    user: 'raymond',
    password: 'raymond923'
};
var db = pgp(cn);



//Heroku Postgres
var pg = require('pg')
var connectionString = "postgres://sbvblqzpwodrow:c65601ca99c5237c9ab0e86f7a842ca4a542fcd1682123cd0d1a4c1052530127@ec2-107-21-98-165.compute-1.amazonaws.com:5432/deuqt6ucu403e0"

function getAllRecords(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
     client.query('SELECT * FROM IB', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log(result.rows);
     });
  });
}




// function getAllRecords(req, res, next) {
//   db.any('select * from IB')
//     .then(function (data) {
//       res.status(200)
//         .json({
//           status: 'success',
//           data: data,
//           message: 'Retrieved ALL records'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
//   //res.send("Hello")
// }

function insertRecord(req, res, next) {

  var candidate = index.candidate()
  db.none('insert into IB(${this:name}) values (${this:csv})',
    candidate)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one record'
        });
      //res.send('results');
    })
    .catch(function (err) {
      return next(err);
    });

  console.log("successfully inserted one record")
}

module.exports = {
  getAllRecords: getAllRecords,
  insertRecord: insertRecord
};
