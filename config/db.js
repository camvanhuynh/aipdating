//This module will contain all global database operations pertaining to the
//client-server operations. The mongoose library is used.

var mongoose = require('mongoose');
var dbURL = process.env.MONGODB_URL || 'mongodb://localhost/aip';
mongoose.connect(dbURL, { useMongoClient: true }, function(err) {
  err ? console.log('Fail to connect to the database: ', err) : console.log('connected to the database');
});
