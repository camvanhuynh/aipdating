//This module will contain all global database operations pertaining to the
//client-server operations. The mongoose library is used.

var mongoose = require('mongoose');
mongoose.connect('mongodb://aipdating:vansushabid@aipdating-shard-00-00-r4p1w.mongodb.net:27017,aipdating-shard-00-01-r4p1w.mongodb.net:27017,aipdating-shard-00-02-r4p1w.mongodb.net:27017/test?ssl=true&replicaSet=AIPDating-shard-0&authSource=admin');
