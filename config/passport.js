//Using Passport library for authentication
const passport = require('passport');
const Local = require('passport-local');
const JWT = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../modules/auth/models/user');
const config = require('../config');

//Documentation: http://passportjs.org/docs

//Local login with email and password
passport.use(new Local({usernameField: 'email'},function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }

    //Email is unregistered
    if (!user) {
      return done(null, false, { error: config.text.unregisteredEmail });
    }

    user.verifyPassword(password, function(err, res) {
      if (err) {
        return done(err);
      }
      if (!res) {
        return done(null, false, { error: config.text.unmatchedPwd });
      }
      return done(null, user);
    });
  });
}));

//
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secret
};

// token login
passport.use(new JWT(options, function(payload, done) {
  User.findOne({ _id: payload._id }, function(err, user) {
    if (err) {
      return done(err, null);
    }

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
}));

module.exports = passport;
