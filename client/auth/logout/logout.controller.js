angular.module('aipdatingApp').controller('logoutCtrl', function($location,authentication) {
  authentication.logout();
  $location.path('profile');
});
