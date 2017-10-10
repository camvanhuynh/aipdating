angular.module('aipdatingApp').service('authentication', function($http, $window, $timeout) {

  var user = null;

  function initState() {
    var token;
    var payload;

    token = getToken();

    user = null;
    if(token) {
      console.log("token is not null");
      payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);

      if (payload.exp > Date.now() / 1000) {
        user = {
          _id: payload._id,
          email: payload.email,
          name: payload.name,
          role: payload.role
        };
        console.log("you are currently logged in");
      };
    };

  };

  initState();

  function currentUser() {
    //console.log("currentUser email: " + user.email);
    return user;
  };

  function getToken() {
    return $window.localStorage['aip-token'];
  }

  function loggedIn(loggedInUser,token) {
    $window.localStorage['aip-token'] = token;
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
    })
  }

  function register(user) {
    console.log("calling register");
    return $http.post('/auth/register',user).success(function(res) {
      console.log("register success");
      console.log("token is: " + res.token);
      loggedIn(res.user, res.token);
    })
  }

  function logout() {
    console.log("logging outttttttttt user");
    $window.localStorage['aip-token'] = "";
    initState();
  }

  return {
    currentUser: currentUser,
    getToken: getToken,
    login: login,
    register: register,
    logout: logout,
  };

});
