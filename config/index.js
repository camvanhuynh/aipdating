// Wrapper linking the database entities to its definitions.
// CONSTANT defined

module.exports = {
  dbURL: process.env.MONGOLAB_URI || 'mongodb://localhost/aip',
  darksky: process.env.DARKSKY_KEY || '8eb186f7cb40b684c2f879c59619775b',
  serverPort: process.env.PORT || 5000,
  secret: 'secret key for aipdating',
  emailRegex: /^[A-Za-z0-9.+-_]+@[A-Za-z0-9]+\.[A-Za-z]{2,4}$/,
  passwordRegex: /^[a-zA-Z0-9#%!*_-]+$/,
  nameRegex: /^[a-zA-Z ]+$/,
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
    invalidEmailError: 'Email is invalid',
    invalidPwdError: 'Password is invalid',
    invalidNameError: 'Name is invalid',
    emptyNicknameError: 'Nickname cannot be empty',
    emptyAgeError: 'Age cannot be empty',
    emptyInterestError: 'Interest cannot be empty',
    emptyStateError: 'State cannot be empty',
    emptySuburbError: 'Suburb cannot be empty',
    emptyGenderError: 'Gender cannot be empty',
    emptyOwnerError: 'Owner cannot be empty',
    existingNicknameError: 'This nickname is already in used',
  }
};
