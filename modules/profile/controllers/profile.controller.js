var Profile = require('../models/profile');

exports.list = function(req, res) {
  Profile.find({}, function(err, profiles) {
    if(err)
      return res.send(err);
    res.json(profiles);
  });
};

exports.add = function(req, res) {
  console.log("POST is CALLLING");
  //
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
