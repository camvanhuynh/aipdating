var router = require('express').Router(),
    AuthenticationController = require('./controllers/authentication'),
    express = require('express'),
    passport = require('passport'),
    passportService = require('../../config/passport');

// requireAuth = passport.authentication('jwt',{ session:false });
//var  requireLogin = passport.authentication('local', { session:false });

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

//Login Route
router.post('/login', requireLogin, AuthenticationController.login);

//Registration Route
router.post('/register', AuthenticationController.register);

module.exports = router;
