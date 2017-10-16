// Controller of Resgister view
angular.module('aipdatingApp')
  .controller('RegisterCtrl', function($location, authentication) {
    var vm = this;
    vm.registrationForm = {};
    vm.emailRegex = "/^[A-Za-z0-9.+-_]+@[A-Za-z0-9]+\.[A-Za-z]{2,4}$/";

    /**
     * Send the credentials to the server for user registration
     * @return none
     */
    vm.submit = function(isValid) {
      if(isValid) {
        authentication.register(vm.registrationForm).then(
          function() {
            // After register success, redirect back to register success page with button to open Profile page
            $location.path('register-success');
          },
          function (err) {
            vm.error = err.data.error;
          }
        );
      }
    }
  });
