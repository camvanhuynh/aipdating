//Using Passport library for authentication
const passport = require('passport'),
      User = require('../modules/auth/models/user'),
      config = require('../config'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');


var localOptions = {
  usernameField: 'email'
};

var localLogin = new LocalStrategy (localOptions, function(email, password, done) {
  User.findOne({ email }, function(err, user){
    if (err) { return done(err); }
    if (!user) { return done(null, false, { error: 'We don\'t recognize that email. Please Sign Up if you don\'t have an account.' }); }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: 'Password is incorrect. Please try again.' }); }

      return done(null, user);
    });
  });
});

//
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secret
};

//
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload._id, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(localLogin);
passport.use(jwtLogin);
