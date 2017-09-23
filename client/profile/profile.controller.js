//Angular Front-end script file

angular.module('aipdatingApp')
    .controller('ProfileCtrl', function($http, authentication) {
        var vm = this;

        vm.formProfile = {};
        vm.admin = false;

        if(authentication.currentUser().role === "Admin")
           vm.admin = true;


          vm.currentUser = authentication.currentUser().name;
          //vm.formProfile.name = authentication.currentUser().name;

        console.log("Role isssssss " + vm.admin);

        $http.get('/api/profile/', {
          headers: {
            Authorization: authentication.getToken()
          }
        }).then(function(res) {
            vm.profiles = res.data;
        });

        vm.clear = function() {
            vm.formProfile = {
                nickname: "",
                gender: "Male",
                age: "",
                interest: "",
                _id: ""
            };
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
/*
                var newProfile = {
                    name: vm.formProfile.name,
                    email: vm.formProfile.email,
                    gender: vm.formProfile.gender,
                    age: vm.formProfile.age
                };
*/
                var newProfile = {
                    nickname: vm.formProfile.nickname,
                    gender: vm.formProfile.gender,
                    age: vm.formProfile.age,
                    interest: vm.formProfile.interest
                };
                //Local view update: push the new item into the local data first
                vm.profiles.push(newProfile);

                console.log("NEW profile is: ");
                console.log(newProfile);

                //Database call: then call http.post to add into database
                $http.post('/api/profile/', newProfile).then(function(res) {
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
                        return vm.formProfile;
                    }
                    return profile;
                });

                //Database call: call http.put to update into database
                $http.put('/api/profile/' + vm.formProfile._id, {
                  nickname: vm.formProfile.nickname,
                  gender: vm.formProfile.gender,
                  age: vm.formProfile.age,
                  interest: vm.formProfile.interest
                }).then(function(res) { },
                    function(res) {
                        vm.profiles = backup;
                    });
            }

            //Clear the form after finishing operation
            //vm.clear();

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
            vm.isEdit = true;
            editProfile = vm.profiles[index];
            vm.formProfile = {
                nickname: vm.formProfile.nickname,
                gender: vm.formProfile.gender,
                age: vm.formProfile.age,
                interest: vm.formProfile.interest,
                _id: editProfile._id
            }
        }

        vm.close = function() {
          vm.isEdit = false;
        }
    });
