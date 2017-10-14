// Controller of Log Out function
angular.module('aipdatingApp').controller('logoutCtrl', function($location,authentication) {
  authentication.logOut();
  $location.path('login');
});
