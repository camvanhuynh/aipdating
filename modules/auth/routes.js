var router = require('express').Router(),
    AuthenticationController = require('./controllers/authentication.controller'),
    express = require('express'),
    config = require('../../config'),
    passport = require('../../config/passport');

function checkValidity(user) {
  var error = '';
  if(!user.email ) {
    error = config.text.emptyEmailError + '\n';
  }

  if(!user.password) {
    error += config.text.emptyPwdError + '\n';
  }

  return error;
}

const checkAuth = function(req, res, next) {
  var error = checkValidity(req.body);
  if(error) {
    return res.status(422).json({ error: error});
  }

  passport.authenticate(
    'local',
    { session: false },
    function(err, user, info) {
      if(err) {
        //system error
        return res.status(422).json({
          error: 'System Error'
        });
      }
      if(!user) {
        return res.status(401).json({
          error: info.error
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
//Login Route
router.post('/login', checkAuth, AuthenticationController.login);

//Registration Route
router.post('/register', AuthenticationController.register);

module.exports = router;
