//This module will contain all global database operations pertaining to the
//client-server operations. The mongoose library is used.

var mongoose = require('mongoose');
mongoose.connect(
  'mongodb://heroku_24f0kg6w:o3ab6r4ln2j87jkj76acuh4rr4@ds129144.mlab.com:29144/heroku_24f0kg6w',
  function(err) {
    if(err) {
      console.log('fail to connect to the database');
      return;
    }
    console.log('connected to the database');
  }
);
