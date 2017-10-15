// Weather service
angular.module('aipdatingApp').service('Weather', function($http, $timeout) {

  /**
   * Get temperature from a request to server
   * Translate from F degree to C degree
   * @return result of C degress to callback
   */
  function getTemperature(callback) {
    return $http.get('/api/weather/temperature').then(function(res) {
      var tem = res.data.temperature;
      if (tem !== -100) {
        tem = (tem - 32)*5/9;
      }
      callback(Math.round(tem));
    })
  }

  return {
    getTemperature: getTemperature
  };
});
