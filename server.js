/*
  This is the server file defining the back-end operations for this website.
  The script will listen to client communications through the network port 3009 and
  reference external script files as necessary to enact upon each request.
*/

//System references and dependencies.
var express = require('express'),
    path = require('path'),
    app = new express(),
    mongoose = require('mongoose'),
    config = require('./config'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    fs = require('fs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('client'));

app.use('/api/profile', require('./modules/profile/routes'));
app.use('/auth', require('./modules/auth/routes'));

// Static weather for the server instance
var weather = require('weather-js');
var w = "";
weather.find({search: 'Sydney, NSW', degreeType: 'C'}, function(err, result) {
  if(err)
    console.log(err);
  w = JSON.stringify(result, null, 2);
  //fs.writeFile('public/weather.json', w, function(err) {
	 // if(err) {
		 // console.log(err);
	  //}
  //});
});

app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send(w);
});

//Execution of the server: continuously listen on the defined port.
app.listen(config.serverPort, function() {
    console.log(`APIDating v3 is listening on port: ${config.serverPort}`);
    mongoose.connect(config.dbURL, { useMongoClient: true }, function(err) {
      err ? console.log('Fail to connect to the database: ', err) : console.log('Connected to the database');
    });
});
