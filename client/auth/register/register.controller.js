// Controller of Resgister view
angular.module('aipdatingApp')
  .controller('RegisterCtrl', function($location, authentication) {
    var vm = this;
    vm.registrationForm = {};

    /**
     * Send the credentials to the server for user registration
     * @return none
     */
    vm.submit = function(isValid) {
      if(isValid) {
        authentication.register(vm.registrationForm).then(
          function() {
            console.log('register right');
            $location.path('register-success');
          },
          function (err) {
            vm.error = err.data.error;
          }
        );
      }
    }
  });
