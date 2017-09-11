// Wrapper linking the database entities to its definitions.

module.exports = function(app) {
  require('./db');
  require('../modules/profile')(app);
};
