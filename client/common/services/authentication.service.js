angular.module('aipdatingApp').service('authentication', function($http, $window, $timeout) {

  var user = null;

  function initState() {
    var token = getToken();

    if(token) {
      var payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);

      if (payload.exp > Date.now() / 1000) {
        user = {
          _id: payload._id,
          email: payload.email,
          name: payload.name,
          role: payload.role
        };
      };
    };

  };

  initState();

  function currentUser() {
    //console.log("currentUser email: " + user.email);
    return user;
  };

  function getToken() {
    return $window.localStorage['token'];
  }

  function loggedIn(loggedInUser,token) {
    $window.localStorage['token'] = token;
    user = {
      _id: loggedInUser._id,
      email: loggedInUser.email,
      name: loggedInUser.name,
      role: loggedInUser.role
    };
    initState();
  }

  function login(candidateUser) {
    return $http.post('/auth/login',candidateUser).success(function(res) {
      /*
      console.log(res.user);
      user = {
        _id: res.user._id,
        email: res.user.email,
        name: res.user.name,
        role: res.user.role
      };
      console.log("new user : " + user.email);
      */
      loggedIn(res.user, res.token);
    });
  };

  function register(user) {
    return $http.post('/auth/register',user).success(function(res) {
      loggedIn(res.user, res.token);
    })
  }

  function logout() {
    $window.localStorage['token'] = "";
  }

  return {
    currentUser: currentUser,
    getToken: getToken,
    register: register,
    login: login,
    logout: logout,
  };

});
