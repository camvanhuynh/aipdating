// Authentication controller for Login and Register
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

// Token is generated and expired in 2 days
function generateToken(user) {
  return jwt.sign(user, config.secret, { expiresIn: 86400});
}

/**
 * This function validate request from client
 * @return error if error
 */
function checkValidity(user) {
  var error = '';
  if(!user.email) {
    error = config.text.emptyEmailError + '\n';
  }

  if(!user.password) {
    error += config.text.emptyPwdError + '\n';
  }

  if(!user.name) {
    error += config.text.emptyNameError + '\n';
  }

  return error;
}


function validateFormat(user) {
  var error = '';
  var emailRegex = config.emailRegex;
  var passwordRegex = config.passwordRegex;
  var nameRegex = config.nameRegex;

  if(!emailRegex.test(user.email)) {
    error = config.text.invalidEmailError + '\n';
  }

  if(!passwordRegex.test(user.password) || user.password.length < 3 || user.password.length > 15) {
    error += config.text.invalidPwdError + '\n';
  }

  if(!nameRegex.test(user.name) || user.name.length > 20) {
    error += config.text.invalidNameError + '\n';
  }

  return error;
}



/**
 * This function generate token for login success
 * @return token and logged-in user to client's request
 */
exports.login = function (req, res, next) {
  const userInfo = getUserInfo(req.user);
  res.status(200).json({
    token: 'jwt ' + generateToken(userInfo),
    user: userInfo
  });
};

/**
 * This function registers a user by the following steps:
 * Validate user's info (required fields available, email must be unique)
 * Save user to database
 * Generate token
 * @return token and registered user to client's request
 */
exports.register = function (req, res, next) {

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  });

  // Field validation before registration. The following validations are checked:
  // Fields cannot be empty
  var error = checkValidity(user);
  if(error) {
    return res.status(422).send({ error: error});
  }

  // Format of data must be valid
  error = validateFormat(user);
  if(error) {
    return res.status(422).send({ error: error});
  }

  // Email is unique
  User.findOne({ email: user.email }, function(err, result) {
    if(err) {
      // Something wrong with the database
      return res.status(422).send({ error: config.text.systemError });
    }
    if(result) {
      // The email has existed
      return res.status(422).send({ error: config.text.existingEmailError });
    }
    user.save(function(err, user) {
      if (err) {
        return res.status(422).send({ error: config.text.systemError });
      }
      console.log("Registered successfully");
      const userInfo = getUserInfo(user);
      res.status(201).json({
        token: 'jwt ' + generateToken(userInfo),
        user: userInfo
      });
    });
  });
};
