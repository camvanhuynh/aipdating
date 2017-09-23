angular.module('aipdatingApp').controller('logoutCtrl', function($location,authentication) {
  console.log("Logging out user");
  authentication.logout();
  $location.path('profile');
});
