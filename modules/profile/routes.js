//This javascript file is responsible for controlling the handling of transfer
//between client and server

var router = require('express').Router(),
    Profile = require('./models/profile'),
    passport = require('../../config/passport');

// requireAuth = passport.authentication('jwt',{ session:false });
//var  requireLogin = passport.authentication('local', { session:false });

const requireAuth = function(checkOwner = false) {
  return function(req, res, next) {
    passport.authenticate(
      'jwt',
      { session: false },
      function(err, user, info) {
        if(!user) {
          return res.status(401).end();
        }
        if(checkOwner) {
          Profile.findOne({
            _id: req.params.profileId
          }, function(err, profile) {
            console.log(profile.user);
            console.log(user._id);
            if(profile.user.toString() !== user._id.toString()) {
              return res.status(403).end();
            }
          });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  }
}

//Server obtaining the profile information sent by the client
//so that it can be listed
router.get('/', requireAuth(), function(req, res) {
  Profile.find({}, function(err, profiles) {
    if(err)
      return res.send(err);
    res.json(profiles);
  });
});

//Adding the profile to the list
router.post('/' , requireAuth(), function(req, res) {
  console.log("POST is CALLLING");
  //check isOwner
  var profile = new Profile({
    nickname: req.body.nickname,
    age: req.body.age,
    interest: req.body.interest,
    suburb: req.body.suburb,
    state: req.body.state,
    gender: req.body.gender,
    user: req.user
  });

  console.log(profile);

  profile.save(function(err, insertedProfile) {
    if(err) {
      console.log("ERRORRRRRRR is " + err);
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
router.delete('/:profileId', requireAuth(true), function(req, res) {
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
router.put('/:profileId', requireAuth(true), function(req, res) {
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
      res.status(200).end();
    }
  );
});

module.exports = router;
