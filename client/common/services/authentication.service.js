// Authentication service for front-end:
// Check current status
// Setup Log in state

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


  function storeToken(payload, token) {
    $window.localStorage['aip-token'] = token;
    user = getUserInfo(payload);
    reset();
  }

  function clearToken() {
    $window.localStorage['aip-token'] = "";
    user = null;
    reset();
  }

  function login(candidateUser) {
    return $http.post('/auth/login', candidateUser).then(
      function(res) {
        storeToken(res.data.user, res.data.token);
      }
    );
  }

  function register(user) {
    return $http.post('/auth/register', user).then(
      function(res) {
        storeToken(res.data.user, res.data.token);
      }
    );
  }

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
