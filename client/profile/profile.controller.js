// Controller of Profile list view
angular.module('aipdatingApp')
    .controller('ProfileCtrl', function($http, authentication, Weather, $scope) {

  // Profile holder
  var vm = this;

  vm.formProfile = {};
  vm.profileEval = [];
  vm.isAdmin = false;

  vm.temperature = 0;
  Weather.getTemperature(function(temperature) {
    vm.temperature = temperature;
  });

  var extended = {
    nickname: "",
    distance: "-",
    match: "No",
    _id: ""
  };


  // Check Admin role
  if(authentication.currentUser().role === "Admin")
     vm.isAdmin = true;

  // Get current logged-in user's name
  vm.currentUser = authentication.currentUser().name;

  $http.get('/api/profile/').then(function(res) {
    vm.profiles = res.data;
    // Initialise the default evaluation of matches
    vm.profileEval = [];
    for(i = 0; i < vm.profiles.length; i++)
      vm.profileEval.push(extended);
  });


  vm.clear = function() {
    vm.formProfile = {};
    $scope.profileForm.$setPristine();
    $scope.profileForm.$setUntouched();
    vm.error = '';
  }

  vm.isOwner = function(profile) {
    return profile.user === authentication.currentUser()._id
  }

  /**
   * This function handles Add and Edit profile
   * If not existing id in the form -> this is an Add new profile case
   * otherwise, this is the Edit operation to the current profile of that id
   * @return none
   */
  vm.submit = function(isValid) {
    if(isValid) {
        // Add new profile
        if(!vm.formProfile._id) {
          // Check "Male" radio button for default
          if(vm.formProfile.gender == null){
            vm.formProfile.gender = "Male";
          }

          var newProfile = {
            nickname: vm.formProfile.nickname,
            age: vm.formProfile.age,
            interest: vm.formProfile.interest,
            suburb: vm.formProfile.suburb,
            state: vm.formProfile.state,
            gender: vm.formProfile.gender
          };

          // Attempt to add new profile first
          vm.profiles.push(newProfile);
          // Database call: then call http.post to add into database
          $http.post('/api/profile/', newProfile).then(
            function(res) {
              vm.profiles[vm.profiles.length - 1]._id = res.data.profile._id;
              vm.profiles[vm.profiles.length - 1].user = res.data.profile.user._id;
            },
            function(err) {
              // If fail to update, then roll back
              vm.profiles.pop();
              vm.error = err.data.error;
            }
          );
        }
        else {
          // Edit existing profile
          // Backup before executing the operation
          var backup = vm.profiles;

          // Local view update: update the current local data with the new updated item
          vm.profiles = vm.profiles.map(function(profile) {
              if(profile._id === vm.formProfile._id) {
                  return {
                    nickname: vm.formProfile.nickname,
                    age: vm.formProfile.age,
                    suburb: vm.formProfile.suburb,
                    state: vm.formProfile.state,
                    interest: vm.formProfile.interest,
                    gender: vm.formProfile.gender,
                    user: vm.formProfile.user,
                    _id: vm.formProfile._id
                  };
              }
              return profile;
          });

          // Database call: call http.put to update into database
          $http.put('/api/profile/' + vm.formProfile._id, {
            nickname: vm.formProfile.nickname,
            age: vm.formProfile.age,
            interest: vm.formProfile.interest,
            suburb: vm.formProfile.suburb,
            state: vm.formProfile.state,
            gender: vm.formProfile.gender
          }).then(
            function(res) {
              // Successful
            },
            function(err) {
              // Error then roll back the update
              vm.profiles = backup;
            }
          );
        }
        // Clear the form after finishing operation
        vm.clear();
        vm.isEdit = false;
    }
  }

  /**
   * This function deletes Profile
   * @return none
   */
  vm.delete = function(index) {
      // Backup before executing the operation
      var backup = vm.profiles;
      var deleteId = vm.profiles[index]._id;
      vm.profiles = vm.profiles.filter(function(profile, profileIndex) {
          return index !== profileIndex;
      });
      $http.delete('/api/profile/'+ deleteId).then(function(res) {
      }, function(res) {
          // If fail to update, roll back
          vm.profiles = backup;
      });
  }

  /**
   * This function moves the selected Profile's data into the profileForm
   * @return none
   */
  vm.edit = function(index) {
    console.log("vm edit is call");
      vm.isEdit = true;
      var editProfile = vm.profiles[index];
      vm.formProfile = {
          nickname: editProfile.nickname,
          age: editProfile.age,
          suburb: editProfile.suburb,
          state: editProfile.state,
          interest: editProfile.interest,
          gender: editProfile.gender,
          user: editProfile.user,
          _id: editProfile._id
      }
  }

});
