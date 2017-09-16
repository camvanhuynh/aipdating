angular.module('aipdatingApp')
  .controller('LoginCtrl', function($location, authentication) {
    var vm = this;
    vm.formLogin = {};
/*
    vm.onSubmit = function () {
      console.log("Started login process...");
      authentication.login(vm.formLogin).error(function (err) {
        alert(err);
      }).then(function() {
        console.log("login success!")
        $location.path("profile");
      })
    }
*/
vm.login = function () {
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
