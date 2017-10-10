//Profile schema for MongoDB
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

var ProfileSchema = Schema({
  //User's name field
  nickname: {
    type: String,
    unique: true,
    required: true
  },

  //User's age field
  age: {
    type: Number,
    min: 16,
    max: 120,
    required: true
  },

  interest: {
    type: String,
    required: true
  },

  suburb: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  //User's gender field
  gender: {
    type: String,
    required: true
  },

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
