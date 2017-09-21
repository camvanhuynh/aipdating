//Profile schema for MongoDB
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
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
  },

  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}

},
{
  timestamps: true
});

//Before save profile into database, hash password first
UserSchema.pre('save', function(next) {
  const user = this;
        SALT_FACTOR = 5;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    })
  })
});

//Compare password when user enters password to login
UserSchema.methods.comparePassword = function(enteredPassword, callback) {
  bcrypt.compare(enteredPassword,this.password, function(err,isMatch) {
    if(err) return callback(err);

    callback(null,isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
