/*
  This is the server file defining the back-end operations for this website.
  The script will listen to client communications through the network port 3009 and
  reference external script files as necessary to enact upon each request.
*/

//System references and dependencies.
var express = require('express'),
    path = require('path'),
    app = new express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    fs = require('fs');


app.set('port', (process.env.PORT || 5000));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('client'));

require('./config').run();
app.use('/api/profile', require('./modules/profile/routes'));
app.use('/auth', require('./modules/auth/routes'));

// Static weather for the server instance
var scheduleWeather = false;  // flag to update the weather file every hour
var weatherSearch = 'Sydney, NSW';  // string to specify location of weather

function updateWeatherFile() {
  var weather = require('weather-js');
  var w = "";
  weather.find({search: weatherSearch, degreeType: 'C'}, function(err, result) {
    if(err)
      console.log(err);
    w = JSON.stringify(result, null, 2);
    fs.writeFile('public/weather.json', w, function(err) {
      if(err) {
        console.log(err);
      }
    });
  });
}

if(scheduleWeather) {
  var schedule = require('node-schedule');
  var sequence = '1 * * * *';  // cron string to specify first minute of every hour
  var j = schedule.scheduleJob(sequence, function(){
    updateWeatherFile();
    console.log('weather is updated to public/weather.json at ' + new Date());
  });
}
else {
  updateWeatherFile();
  }

app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send(w);
});

//Wrap the app module located within the config subdirectory for handling client
//requests.


//Execution of the server: continuously listen on the defined port.
app.listen(app.get('port'), function() {
    console.log(`APIDating v2 is listening on port: ${app.get('port')}`);
});
