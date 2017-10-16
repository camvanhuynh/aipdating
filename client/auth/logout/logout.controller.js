// Controller of Log Out function
angular.module('aipdatingApp').controller('logoutCtrl', function($location,authentication) {
  authentication.logOut();
  // After log user out, redirect back to Log in page
  $location.path('login');
});
