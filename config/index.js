// Wrapper linking the database entities to its definitions.
// CONSTANT defined

module.exports = {
  dbURL: process.env.MONGOLAB_URI || 'mongodb://localhost/aip',
  darksky: process.env.DARKSKY_KEY || '8eb186f7cb40b684c2f879c59619775b',
  serverPort: process.env.PORT || 5000,
  secret: 'secret key for aipdating',
  text: {
    emptyEmailError: 'Email cannot be empty',
    emptyPwdError: 'Password cannot be empty',
    emptyNameError: 'Name cannot be empty',
    existingEmailError: 'This email is already in used',
    unregisteredEmail: 'We don\'t recognize that email. Please Sign Up if you don\'t have an account.',
    unmatchedPwd: 'Password is incorrect.',
    systemError: 'System Error',
    unAuthorizationError: 'You are not authorized to perform that action',
    unExistingProfile: 'Profile does not exist',
  }
};
