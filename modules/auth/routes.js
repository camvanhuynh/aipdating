var router = require('express').Router(),
    AuthenticationController = require('./controllers/authentication'),
    express = require('express'),
    passport = require('../../config/passport');

const checkAuth = passport.authenticate('local', { session: false });

//Login Route
router.post('/login', checkAuth, AuthenticationController.login);

//Registration Route
router.post('/register', AuthenticationController.register);

module.exports = router;
