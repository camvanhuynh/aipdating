// Weather web service of darksky.com
var request = require('request-promise');
var config = require('../../../config/');

exports.getTemperature = function (req, res) {
  request.get({
    //uri: 'https://api.darksky.net/forecast/8eb186f7cb40b684c2f879c59619775/33.8688,151.2093',

    uri: `https://api.darksky.net/forecast/${config.darksky}/33.8688,151.2093`,
    json: true
  }).then(function(response) {
    res.status(200).send({
      temperature: response.currently.temperature
    });
  }, function(error) {
    res.status(200).send({
      temperature: -100
    });
  });
}
