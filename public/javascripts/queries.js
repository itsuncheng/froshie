var promise = require('bluebird');

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

// add query functions

var index = require('../../index')



function getAllRecords(req, res, next) {
  db.any('select * from IB')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL records'
        });
    })
    .catch(function (err) {
      return next(err);
    });
  //res.send("Hello")
}

function insertRecord(req, res, next) {
  // req.body.age = parseInt(req.body.age);

  // candidate = {
  //   id: 7,
  //   name: "Jeff",
  //   institution: "hello",
  //   score: 41,
  //   ee: 'B',
  //   tok: 'B',
  //   chemistry: 6,
  //   physics: 6,
  //   mathematics: 6,
  //   english: 6,
  //   french: 6,
  //   economics: 6
  // }

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
