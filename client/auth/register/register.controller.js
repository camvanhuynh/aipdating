angular.module('aipdatingApp')
  .controller('RegisterCtrl', function($location, authentication) {
    var vm = this;
    vm.registrationForm = {};

    vm.submit = function() {
      console.log("Register is calling ");

      authentication.register(vm.registrationForm).error(function (err) {
        alert(err);
      }).then(function() {
        console.log("registration success");
        console.log("New registered user is: " + authentication.currentUser().name);
        $location.path('register-success');
      });

      console.log("After, Register is calling " + authentication.getToken());
    }
  });
