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

  //User's password
  password: {
    type: String,
    required: true
  },

  //User's gender field
  gender: {
    type: String
    //required: true
  },

  //User's age field
  age: {
    type: Number,
    min: 16,
    max: 120
    //required: true
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
ProfileSchema.pre('save', function(next) {
  const profile = this;
        SALT_FACTOR = 5;

  if(!profile.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(profile.password, salt, null, function(err, hash) {
      if(err) return next(err);
      profile.password = hash;
      next();
    })
  })
});

//Compare password when user enters password to login
ProfileSchema.methods.comparePassword = function(enteredPassword, callback) {
  bcrypt.compare(enteredPassword,this.password, function(err,isMatch) {
    if(err) return callback(err);

    callback(null,isMatch);
  });
};

module.exports = mongoose.model('Profile', ProfileSchema);
