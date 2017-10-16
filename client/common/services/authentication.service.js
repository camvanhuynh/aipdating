// Authentication service for front-end:
// 1. Return current logged in user
// 2. Setup Log in/Log out state
// 3. Get current token

angular.module('aipdatingApp').service('authentication', function($http, $window) {
  var user = null;
  var token = null;
  var payload = null;

  function getUser() {
    return user;
  };

  function getToken() {
    return $window.localStorage['aip-token'];
  };

  function isTokenValid(token) {
    return (token.exp > Date.now() / 1000);
  };

  function getUserInfo(payload) {
    return {
      _id: payload._id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  }

  /**
   * Set up "logged in" state by setting token + user
   * @return none
   */
  function storeToken(payload, token) {
    $window.localStorage['aip-token'] = token;
    user = getUserInfo(payload);
    reset();
  }

  /**
   * Clear "logged in" state by clearing token + user
   * @return none
   */
  function clearToken() {
    $window.localStorage['aip-token'] = "";
    user = null;
    reset();
  }

  /**
   * Send login request to server and log user in if the request is successful
   * Otherwise, error will be processed by the login controller that calls this login service
   * @return a promise
   */
  function login(candidateUser) {
    return $http.post('/auth/login', candidateUser).then(
      function(res) {
        storeToken(res.data.user, res.data.token);
        console.log(res.data.token);
      }
    );
  }

  /**
   * Send register request to server and log user in if the request is successful
   * Otherwise, error will be processed by the register controller that calls this login service
   * @return a promise
   */
  function register(user) {
    return $http.post('/auth/register', user).then(
      function(res) {
        storeToken(res.data.user, res.data.token);
      }
    );
  }


  /**
   * whenever reset is calling:
   * check if token is still valid or expired?
   * if valid, set token for later request of RESTful services
   * @return none
   */
  function reset() {
    token = getToken();
    if(token) {
      payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);

      if(isTokenValid(payload)) {
        user = getUserInfo(payload);
      };
    };
    $http.defaults.headers.common['Authorization'] = getToken();

  };

  reset();

  return {
    currentUser: getUser,
    getToken: getToken,
    login: login,
    register: register,
    logOut: clearToken,
  };
});
