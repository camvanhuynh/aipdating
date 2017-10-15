// Routing for Profile RESTful api
var router = require('express').Router(),
    Profile = require('./models/profile'),
    ProfileController = require('./controllers/profile.controller'),
    config = require('../../config/')
    passport = require('../../config/passport');

/**
 * This function checks authenticaton for 2 types of request:
 * checkOwner = false: User of the request does not need to be the owner of the profile (Get and Add)
 * checkOwner = true: User of the request must be the owner of the profile to process (Edit and Delete)
 * @return error if error or next to the next waiting function
 */
const requireAuth = function(checkOwner = false) {
  return function(req, res, next) {
    // Verify req.body
    passport.authenticate(
      'jwt',
      { session: false },
      function(err, user) {
        if(err) {
          return res.status(422).send({error: config.text.systemError });
        }
        if(!user) {
          return res.status(401).send({error: config.text.unregisteredEmail });
        }
        if(checkOwner) {
          Profile.findOne({
            _id: req.params.profileId
          }, function(err, profile) {
            if(err) {

            }
            if(!profile) {
              return res.status(422).send({error: config.text.unExistingProfile });
            }
            if(profile.user.toString() !== user._id.toString()) {
              return res.status(403).send({error: config.text.unAuthorizationError });
            }
          });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  }
};

// Server obtaining the profile information sent by the client
router.get('/', requireAuth(), ProfileController.list);

// Adding the profile to the list
router.post('/', requireAuth(), ProfileController.add);

// Removing the profile from the list
router.delete('/:profileId', requireAuth(true), ProfileController.delete);

// Editing the existing profile
router.put('/:profileId', requireAuth(true), ProfileController.update);

module.exports = router;
