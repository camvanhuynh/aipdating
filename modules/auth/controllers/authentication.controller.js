const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');

const config = require('../../../config/');

const getUserInfo = function (payload) {
  return {
    _id : payload._id,
    email: payload.email,
    name: payload.name,
    role: payload.role
  };
};

//Token is generated and expired in 2 days
function generateToken(user) {
  return jwt.sign(user, config.secret, { expiresIn: 86400});
}

function checkValidity(user) {
  var error = '';
  if(!user.email )
    error = config.text.emptyEmailError + '\n';

  if(!user.password)
    error += config.text.emptyPwdError + '\n';

  if(!user.name)
    error += config.text.emptyNameError + '\n';

  return error;
}

exports.login = function (req, res, next) {
  const userInfo = getUserInfo(req.user);
  res.status(200).json({
    token: 'jwt ' + generateToken(userInfo),
    user: userInfo
  });
};

exports.register = function (req, res, next) {
  // Field validation before registration
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  });

  var error = checkValidity(user);
  if(error)
    return res.status(422).send({ error: error});

  User.findOne({ email: user.email }, function(err, result) {
    if(err) {
      //something wrong with the database
      return res.status(422).send({ error: config.text.systemError});
    }
    if(result) {
      //the email has existed
      return res.status(422).send({ error: config.text.existingEmailError });
    }
    user.save(function(err, user) {
      if (err) {
        return res.status(422).send({ error: 'System Error'});
      }
      const userInfo = getUserInfo(user);
      res.status(201).json({
        token: 'jwt ' + generateToken(userInfo),
        user: userInfo
      });
    });
  });
};
