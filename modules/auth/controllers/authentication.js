const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../profile/models/profile');

//const getRole = require('../helpers').getRole;
const config = require('../../../config/');

const setUserInfo = function (user) {
  return {
    _id : user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };
};

//Token is generated and expired in 2 days
function generateToken(user) {
  return jwt.sign(user, config.secret, { expiresIn: 172800});
}

exports.login = function (req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

exports.register = function (req, res, next) {
  // Field validation before registration
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const gender = req.body.gender;
  const age = req.body.age;
  const role = req.body.role;

  // Error for empty email
  if (!email) {
    return res.status(422).send({ error: 'Email address cannot be empty' });
  }

  // Error for empty name
  if (!name) {
    return res.status(422).send({ error: 'Name cannot be empty' });
  }

  // Error for empty password
  if (!password) {
    return res.status(422).send({ error: 'Password cannot be empty' });
  }

  // Error for existing email
  User.findOne({ email }, function(err, existingEmail) {
    if (err) { return next(err); }

    // Email must be unique
    if (existingEmail) {
      return res.status(422).send({ error: 'This email is already in use.' });
    }
  });

  // Error for existing name
  User.findOne({ name }, function(err, existingName) {
    if (err) { return next(err); }

    // Name must be unique
    if (existingName) {
      return res.status(422).send({ error: 'This name is already in use.' });
    }
    // If email is unique, name is unique and password is valid, then create user
    const user = new User({
      email,
      password,
      name
    });

    user.save(function(err, user) {
      if (err) { return next(err); }
      const userInfo = setUserInfo(user);

      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};
