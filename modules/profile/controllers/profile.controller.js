// Profile controller for Profile CRUD
var Profile = require('../models/profile');
var config = require('../../../config/')

function checkValidity(profile) {
  var error = '';
  if(!profile.nickname) {
    error = config.text.emptyNicknameError + '\n';
  }

  if(!profile.age) {
    error += config.text.emptyAgeError + '\n';
  }

  if(!profile.interest) {
    error += config.text.emptyInterestError + '\n';
  }

  if(!profile.suburb) {
    error += config.text.emptySuburbError + '\n';
  }

  if(!profile.state) {
    error += config.text.emptyStateError + '\n';
  }

  if(!profile.gender) {
    error += config.text.gender + '\n';
  }

  if(!profile.user) {
    error += config.text.emptyOwnerError + '\n';
  }

  return error;
}


exports.list = function(req, res) {
  Profile.find({}, function(err, profiles) {
    if(err) {
      return res.send(err);
    }
    res.json(profiles);
  });
};

// One user can create many profiles
exports.add = function(req, res) {
  var profile = new Profile({
    nickname: req.body.nickname,
    age: req.body.age,
    interest: req.body.interest,
    suburb: req.body.suburb,
    state: req.body.state,
    gender: req.body.gender,
    user: req.user
  });

  // Nickname is unique
  Profile.findOne({ nickname: profile.nickname }, function(err, result) {
    if(err) {
      // Something wrong with the database
      return res.status(422).send({ error: config.text.systemError });
    }
    if(result) {
      // The nickname has existed
      console.log("erorrrrrr: " + config.text.existingNicknameError);
      return res.status(422).send({ error: config.text.existingNicknameError });
    }

    profile.save(function(err, insertedProfile) {
      if(err) {
        return res.status(400).send({
          error: err
        })
      }
      res.status(200).send({
        profile: insertedProfile
      });
    });
  });
};

exports.delete = function(req, res) {
  Profile.remove({ _id: req.params.profileId}, function(err,result) {
    if(err) {
      return res.status(400).send({
        message: err
      });
    }
    res.sendStatus(200);
  })
};

exports.update = function(req, res) {
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
};
