//Angular Front-end script file

angular.module('aipdatingApp')
    .controller('ProfileCtrl', function($http, authentication) {

		// Profile holder
		var extended = {
		  nickname: "",
		  distance: "-",
		  match: "No",
		  _id: ""
		};

        var vm = this;
        vm.formProfile = [];
        vm.admin = false;
		vm.profileEval = [];

        if(authentication.currentUser().role === "Admin")
          vm.admin = true;
          vm.currentUser = authentication.currentUser().name;

        console.log("Role isssssss " + vm.admin);

        $http.get('/api/profile/', {
          headers: {
            Authorization: authentication.getToken()
          }
        }).then(function(res) {
            vm.profiles = res.data;
			vm.profileEval = [];
			for(i = 0; i < vm.profiles.length; i++)
			  vm.profileEval.push(extended);
        });

		vm.match = function() {
			vm.extendedProfiles.length = 0;

			for(i = 0; i < vm.profiles.length; i++) {
				console.log("ABID " + vm.profiles[i].nickname);
				extended.nickname = vm.profiles[i].nickname;
				extended._id = vm.profiles[i]._id;

				// get the distance from the maps web service
				extended.distance = i.toString();

				// evaluate the match
				extended.match = "Maybe";

				// add to the bound list data
				vm.profileEval.push(extended);
			}
		}

        vm.clear = function() {
            vm.formProfile = {};
        }

        //This function will handle both of ADD and EDIT operation after checking the current
        //existing ID
        vm.submit = function() {
            //Split between Add or Edit operation
            //Add new profile

            if(!vm.formProfile._id) {
                //Check "Male" radio button for default
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
                //Local view update: push the new item into the local data first
                console.log("NEW profile is: ");
                console.log(newProfile);
                //optimistic adding
                vm.profiles.push(newProfile);
                //Database call: then call http.post to add into database
                $http.post('/api/profile/', newProfile).then(
                  function(res) {
                    vm.profiles[vm.profiles.length - 1]._id = res.data.profile._id;
                  },
                  function(res) {
                    //If fail to update, roll back
                    vm.profiles.pop();
                  });
            }
            else {
                //Edit existing profile
                //Backup before executing the operation
                var backup = vm.profiles;

                //Local view update: update the current local data with the new updated item
                vm.profiles = vm.profiles.map(function(profile) {
                    if(profile._id === vm.formProfile._id) {
                        return {
                          nickname: vm.formProfile.nickname,
                          age: vm.formProfile.age,
                          suburb: vm.formProfile.suburb,
                          state: vm.formProfile.state,
                          interest: vm.formProfile.interest,
                          gender: vm.formProfile.gender,
                          _id: vm.formProfile._id
                        };
                    }
                    return profile;
                });

                //Database call: call http.put to update into database
                $http.put('/api/profile/' + vm.formProfile._id, {
                  nickname: vm.formProfile.nickname,
                  age: vm.formProfile.age,
                  interest: vm.formProfile.interest,
                  suburb: vm.formProfile.suburb,
                  state: vm.formProfile.state,
                  gender: vm.formProfile.gender
                }).then(
                  function(res) {
                    //successful
                  },
                  function(res) {
                    //error
                    vm.profiles = backup;
                  }
                );
            }
            //Clear the form after finishing operation
            vm.clear();
            vm.isEdit = false;
        }

        //This function to delete the item in the database
        vm.delete = function(index) {
            //Backup before executing the operation
            var backup = vm.profiles;
            var deleteId = vm.profiles[index]._id;
            vm.profiles = vm.profiles.filter(function(profile, profileIndex) {
                return index !== profileIndex;
            });
            $http.delete('/api/profile/'+ deleteId).then(function(res) {
            }, function(res) {
                //If fail to update, roll back
                vm.profiles = backup;
            });
        }

        //This function is used to move the chosen item data into the form
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
                _id: editProfile._id
            }
        }

        vm.close = function() {
          vm.isEdit = false;
        }
    });
