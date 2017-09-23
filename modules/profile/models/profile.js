//Profile schema for MongoDB
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

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
    default: ''
    //required: true
  },

  //User's age field
  age: {
    type: Number,
    min: 16,
    max: 120,
    default: ''
    //required: true
  },


},
{
  timestamps: true
});


module.exports = mongoose.model('Profile', ProfileSchema);
