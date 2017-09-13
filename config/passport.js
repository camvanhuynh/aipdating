//Using Passport library for authentication
const passport = require('passport'),
      Profile = require('../modules/profile/models/profile'),
      config = require('../config'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');


var localOptions = {
  usernameField: 'email'
};

var localLogin = new LocalStrategy (localOptions, function(email, password, done) {
  Profile.findOne({ email }, function(err, profile){
    if (err) { return done(err); }
    if (!profile) { return done(null, false, { error: 'We don\'t recognize that email. Please Sign Up if you don\'t have an account.' }); }

    profile.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: 'Password is incorrect. Please try again.' }); }

      return done(null, profile);
    });
  });
});

//
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
};

//
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  Profile.findById(payload._id, function(err, profile) {
    if (err) { return done(err, false); }

    if (profile) {
      done(null, profile);
    } else {
      done(null, false);
    }
  });
});

passport.use(localLogin);
passport.use(jwtLogin);
