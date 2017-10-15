// Routing of weather service
var router = require('express').Router(),
    WeatherController = require('./controllers/weather');

router.get('/temperature', WeatherController.getTemperature);

module.exports = router;
