// Controller of Resgister view
angular.module('aipdatingApp')
  .controller('RegisterCtrl', function($location, authentication) {
    var vm = this;
    vm.registrationForm = {};

    vm.submit = function() {
      authentication.register(vm.registrationForm).then(
        function() {
          $location.path('register-success');
        },
        function (err) {
          alert(err);
        }
      );
    }
  });
