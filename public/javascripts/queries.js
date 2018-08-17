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
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

function getAllRecords(req, res, next) {
  client.query('SELECT * from IB;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
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
