// Wrapper linking the database entities to its definitions.

module.exports = {
 run: function() {
   require('./db');
   require('./passport');
 },
 secret: 'secret key for aipdating',
};
