// Profile schema for user's rofile
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

var ProfileSchema = Schema({
  nickname: {
    type: String,
    unique: true,
    required: true
  },

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

  gender: {
    type: String,
    required: true
  },

  // One profile belongs to only one user
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
