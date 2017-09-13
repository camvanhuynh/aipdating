// Wrapper linking the database entities to its definitions.

module.exports = {
  run: function(app) {
    require('./db');
    require('../modules/profile')(app);

  },
  secret: 'secret key for aipdating',
};
