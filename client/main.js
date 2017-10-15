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
  $http.defaults.headers.common['Authorization'] = authentication.getToken();

  $rootScope.$on('$routeChangeStart', function(event, to, from) {
    if(to.authorize === true) {
      to.resolve = to.resolve || {};
      to.resolve.auth = function(authentication) {
        if (authentication.currentUser()) {
            return true;
        }
        throw new AuthenticationError();
      }
    }
  });

  $rootScope.$on('$routeChangeError', function(event, current, previous, error) {
    if (error instanceof AuthenticationError) {
      $location.path("login");
    }
  });

  function AuthenticationError() {
    this.code = 'Authorization Error';
    this.error = 'User must be authorized to view this content';
  };

  AuthenticationError.prototype.constructor = AuthenticationError;
});
