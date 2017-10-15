// User schema for user account
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
  //User's name field
  name: {
    type: String,
    required: true
  },

  //User's email address field
  email: {
    type: String,
    unique: true,
    required: true
  },

  //User's password
  password: {
    type: String,
    required: true
  },

  //User's role, default is Member
  role: {
    type: String,
    enum: ['Member','Admin'],
    default: 'Member'
  }
},
{
  timestamps: true
});

// Before save profile into database, hash password first
UserSchema.pre('save', function(next) {
  const user = this;
  const saltRound = 5;

  if(!user.isModified('password')) {
    return next();
  };

  bcrypt.hash(user.password, bcrypt.genSaltSync(saltRound), null, function(err, hash) {
    if(err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Compare password when user enters password to login
UserSchema.methods.verifyPassword = function(enteredPassword, callback) {
  bcrypt.compare(enteredPassword, this.password, function(err, res) {
    if(err) {
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports = mongoose.model('User', UserSchema);
