angular.module('aipdatingApp')
  .controller('RegisterCtrl', function($http,authentication) {
    var vm = this;

    vm.submit = function() {
      console.log("Register is calling");
      authentication.resgiter(vm.registrationForm).error(function (err) {
        alert(err);
      }).then(function() {
        console.log("registration success");
        console.log("New registered user is: " + authentication.currentUser().name);
        //$location.path('yourProfile');
      })

      console.log("Started login process...");
      authentication.login(vm.formLogin).error(function (err) {
        alert(err);
      }).then(function() {
        console.log("login success! yay");
        console.log("current user isss newwww: " + authentication.currentUser().name);
        $location.path('profile');
      })
    }
  });
