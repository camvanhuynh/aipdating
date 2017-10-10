angular.module('aipdatingApp', ['ngRoute']).config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/profile/profile.view.html',
    controller: 'ProfileCtrl',
    controllerAs: 'vm',
    authorize: true
  }).when('/login', {
    templateUrl: '/auth/login/login.view.html',
    controller: 'LoginCtrl',
    controllerAs: 'vm',
  }).when('/register', {
    templateUrl: '/auth/register/register.view.html',
    controller: 'RegisterCtrl',
    controllerAs: 'vm',
  }).when('/profile', {
    templateUrl: '/profile/profile.view.html',
    controller: 'ProfileCtrl',
    controllerAs: 'vm',
    authorize: true
  }).when('/register-success', {
    templateUrl: '/auth/register/register.success.html',
    //controller: 'RegisterCtrl',
    //controllerAs: 'vm',
  }).when('/logout', {
    template: '',
    controller: 'logoutCtrl',
    controllerAs: 'vm'
  }).otherwise('/');

}).run(function($rootScope, $location, $http, authentication) {
  console.log('run is called!!!');
  $http.defaults.headers.common['Authorization'] = authentication.getToken();//$window.localStorage['aip-token'];

  $rootScope.$on('$routeChangeStart', function(event, to, from) {
    console.log("start routeChangeStart");
/*
    if(to.adminAuth === true) {
      to.resolve = to.resolve || {};
      to.resolve.auth = function(authentication) {
        if(authentication.currentUser() != null) {
          if (authentication.currentUser().role === 'Admin')
            return true;
        }
        throw new AuthorizationError();
      }
    }
*/
    if(to.authorize === true) {
      to.resolve = to.resolve || {};
      to.resolve.auth = function(authentication) {
        if (authentication.currentUser()){
            console.log("User is authorized");
            return true;
        }

        throw new AuthorizationError();
      }
    }

  });

  $rootScope.$on('$routeChangeSuccess', function() {

  });

  $rootScope.$on('$routeChangeError', function(event, current, previous, error) {
      if (error instanceof AuthorizationError) {
        $location.path("login");
      }
  });

  function AuthorizationError(description) {
    this.message = 'Forbidden';
    this.description = description || 'User authentication required';
  }
  AuthorizationError.prototype = Object.create(Error.prototype);
  AuthorizationError.prototype.constructor = AuthorizationError;

  //AuthorizationErrorRole.prototype = Object.create(Error.prototype);
  //AuthorizationErrorRole.prototype.constructor = AuthorizationError;

});
