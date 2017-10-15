angular.module('aipdatingApp').service('Weather', function($http, $timeout) {
  function getTemperature(callback) {
    return $http.get('/api/weather/temperature').then(function(res) {
      callback(Math.round((res.data.temperature - 32)*5/9));
    })
  }

  return {
    getTemperature: getTemperature
  };
});
