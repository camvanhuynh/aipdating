//Profile schema for MongoDB
var mongoose = require('mongoose');

var ProfileSchema = mongoose.Schema({
  //User's name field
  name: {
    type: String,
    unique: true,
    required: true
  },

  //User's email address field
  email: {
    type: String,
    unique: true,
    required: true
  },

  //User's gender field
  gender: {
    type: String,
    required: true
  },

  //User's age field
  age: {
    type: Number,
    min: 16,
    max: 120,
    required: true
  }
})

module.exports = mongoose.model('Profile', ProfileSchema);
