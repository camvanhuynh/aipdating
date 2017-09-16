/*
  This is the server file defining the back-end operations for this website.
  The script will listen to client communications through the network port 3009 and
  reference external script files as necessary to enact upon each request.
*/

//System references and dependencies.
var express = require('express'),
    path = require('path'),
    app = new express(),
    bodyParser = require('body-parser');


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('client'));

require('./config').run();
app.use('/api/profile', require('./modules/profile/routes'));
app.use('/auth', require('./modules/auth/routes'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(function(req, res, next) {
  res.redirect('/');
});

//Wrap the app module located within the config subdirectory for handling client
//requests.


//Execution of the server: continuously listen on the defined port.
app.listen(app.get('port'), function() {
    console.log(`APIDating is listening on port: ${app.get('port')}`);
});
