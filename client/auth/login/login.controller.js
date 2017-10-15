// Controller for Login view
angular.module('aipdatingApp')
  .controller('LoginCtrl', function($location, authentication) {
    var vm = this;
    vm.formLogin = {};

    /**
     * Send the credentials to the server for authentication
     * @return none
     */
    vm.submit = function (isValid) {
      console.log(isValid);
      if(isValid) {
        authentication.login(vm.formLogin).then(
          function() {
            //Redirect to profile page at login success
            $location.path('profile');
          },
          function (err) {
            vm.error = err.data.error;
          }
        );
      }
    };
  });
