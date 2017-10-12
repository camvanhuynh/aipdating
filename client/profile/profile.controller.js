//Angular Front-end script file

angular.module('aipdatingApp')
    .controller('ProfileCtrl', function($http, authentication) {

        // Profile holder
        var vm = this;

        vm.formProfile = {};
        vm.profileEval = [];
        vm.weather = "Unknown";
        vm.temperature = "Uknown";
        vm.admin = false;
      
        var extended = {
          nickname: "",
          distance: "-",
          match: "No",
          _id: ""
        };

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
          
          // initialise the default evaluation of matches
          vm.profileEval = [];
          for(i = 0; i < vm.profiles.length; i++)
            vm.profileEval.push(extended);
        });

        // get the current weather from the server
        $http.get('weather.json').then(function(response) {
          console.log(response['data'][0]['current']);
          vm.weather = response['data'][0]["current"].skytext;
          vm.temperature = response['data'][0]["current"].temperature;
        });

        vm.match = function() {
          var valid = 
            vm.formProfile.state &&
            vm.formProfile.age &&
            vm.formProfile.gender;
          if(valid) {
            vm.profileEval = [];
            
            for(i = 0; i < vm.profiles.length; i++) {
              extended.nickname = vm.profiles[i].nickname;
              extended._id = vm.profiles[i]._id;
              console.log(vm.profiles[i].gender);

              // [TODO: NEED TO GET THE FOLLOWING FROM THE WEB SERVER - THE BROWSER HATES THIS CODE]
              // get the distance from the maps web service
              //var origins = vm.formProfile.suburb.replace(" ", "+") + "," + vm.formProfile.state;
              //var destinations = vm.profiles[i].suburb.replace(" ", "+") + "," + vm.profiles[i].state;
              //var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&" +
              //  "origins=" + origins + "&destinations=" + destinations;
              //$.getJSON(url, function(data) {
              //		console.log(data);
              //	});
              extended.distance = "TBD";  // not supported yet
              
              // evaluate the match
              if(vm.formProfile.state != vm.profiles[i].state)
                extended.match = "Wrong state";
              else if(vm.formProfile.gender == vm.profiles[i].gender)
                extended.match = "Wrong gender";
              else if(Math.abs(vm.formProfile.age - vm.profiles[i].age) > 10)
                extended.match = "Age gap.";
              else
                extended.match = "YES!!!";
              
              // add to the bound list data
              vm.profileEval.push(extended);
            }
          }
          else
            window.alert("Please fill in the state, age and gender fields.");
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
                    vm.profiles[vm.profiles.length - 1].user = res.data.profile.user._id;
                  },
                  function(res) {
                    //If fail to update, roll back
                    vm.profiles.pop();
                  }
                );
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
                          user: vm.formProfile.user,
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
                user: editProfile.user,
                _id: editProfile._id
            }
        }

        vm.close = function() {
          vm.isEdit = false;
        }
    });
