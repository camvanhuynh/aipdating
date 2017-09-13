//This javascript file is responsible for controlling the handling of transfer
//between client and server

var Profile = require('./models/profile'),
    AuthenticationController = require('./controllers/authentication'),
    express = require('express'),
    passport = require('passport'),
    passportService = require('../../config/passport');

// requireAuth = passport.authentication('jwt',{ session:false });
//var  requireLogin = passport.authentication('local', { session:false });

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {

  //Server obtaining the profile information sent by the client
  //so that it can be listed
  app.get('/api/profile/list', function(req, res) {
    Profile.find({}, function(err, profiles) {
      if(err)
        res.send(err);
      res.json(profiles);
    });
  });

  //Adding the profile to the list
  app.post('/api/profile/add' ,function(req, res) {
    var profile = new Profile(req.body);
    profile.save(function(err, insertedProfile) {
      if(err) {
        return res.status(400).send({
          message: err
        })
      }
      res.status(200).send({
        profile: insertedProfile
      });
    });
  });

  //Removing the profile from the list
  app.delete('/api/profile/:profileId/delete', function(req, res) {
    Profile.remove({ _id: req.params.profileId}, function(err,result) {
      if(err) {
        return res.status(400).send({
          message: err
        });
      }
      res.sendStatus(200);
    })
  });

  //Editing the existing profile
  app.put('/api/profile/:profileId/edit', function(req, res) {
    Profile.update(
      {
        _id: req.params.profileId
      },
      req.body,
      function(err,result) {
        if(err) {
          return res.status(400).send({
            message: err
          });
        }
        res.sendStatus(200);
      }
    );
  });

  //Login Route
  app.post('/login', requireLogin, AuthenticationController.login);

  //Registration Route
  app.post('/register', AuthenticationController.register);

};
