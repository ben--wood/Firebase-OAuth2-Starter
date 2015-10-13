/**
 */

(function () {
  'use strict';

  angular
    .module('app')    
    .factory('authenticationService', authenticationService);
        
  authenticationService.$inject = ['$q', '$firebaseAuth', '$firebaseObject', 'FIREBASE_URL'];

  function authenticationService($q, $firebaseAuth, $firebaseObject, FIREBASE_URL) {
    var firebaseRef_ = new Firebase(FIREBASE_URL);
  	var firebaseAuth_ = $firebaseAuth(firebaseRef_);

    var loggedinuser_ = null;
    
    var service = {
      loggedinuser_: loggedinuser_,
      firebaseRef_: firebaseRef_,
              
      changePassword: changePassword,
      createProfile: createProfile,
      isAuthenticated: isAuthenticated,    
      login: login,
      logout: logout,
      register: register,
      resetPassword: resetPassword
    };

    return service;

    ////////////

    function changePassword(user) {
			return firebaseAuth_.$changePassword({email: user.email, oldPassword: user.oldPassword, newPassword: user.newPassword});
		}

    function isAuthenticated() {
      return (service.loggedinuser_ !== null && service.loggedinuser_.provider !== null  && service.loggedinuser_.provider > 0);      
    }
    
    function login(user) {
      var deferred = $q.defer();
      
      firebaseAuth_.$authWithPassword({email: user.email, password: user.password}, 
        function (error, authData) {
          if (error) {
            console.error(error);
            deferred.reject(error);
          } else {
            console.info('TODO: grab the actual profile and assign to service.loggedinuser_ using the authData userid and Lovefield', authData);
            angular.copy(authData, service.loggedinuser_);
            
            service.firebaseRef_ = firebaseRef_;
            // service.user.profile = $firebaseObject(firebaseRef_.child('profile').child(authData.uid));
            // ref.child('profile').orderByChild("id").equalTo(authData.uid).on("child_added", function(snapshot) {
            // console.log(snapshot.key());
            // userkey = snapshot.key();
            // var obj = $firebaseObject(ref.child('profile').child(userkey));

            deferred.resolve();
          }  
        }
      );
      
      return deferred.promise;              
    }
    
    function logout() {
      firebaseAuth_.$unauth();
    }

    function register(user) {
      return firebaseAuth_.$createUser({email: user.email, password: user.password})
        .then(function() {
          // registration success to log the user in too
          return login(user);
        })
        .then(function(data) {
          // explicitly create profile info in Firebase too
          return createProfile(data.uid, user);
        });
    }

    function resetPassword(email) {
			return firebaseAuth_.$resetPassword({email: email})
        .then(function() {
					console.log("Password reset email sent");
				})
        .catch(function(error) {					
				  console.error("Error: ", error);
				});
    }
    
    
    /*
    * 
    * @private
    */
    function createProfile(userid, user) {
      var profile = {
				id: userid,
        email: user.email,
				dateregistered: new Date()
      };

      var profileRef = $firebaseObject(firebaseRef_.child('profiles').child(profile.id));
      return profileRef.$save().then(function() {
          console.log('Profile saved');
        })
        .catch(function(error) {
          console.error('Error!', error);
        });
    }
    
    firebaseAuth_.$onAuth(function(authData) {
      console.info('firebaseAuth_.$onAuth', authData);
      
      if(authData) {
        // angular.copy(authData, service.user);
        // service.user.profile = $firebaseObject(firebaseRef.child('profile').child(authData.uid));
  
      } else {
        if(service.loggedinuser_ && service.loggedinuser_.profile) {
          service.loggedinuser_.profile.$destroy();  
        }  
        service.loggedinuser_ = null;
        angular.copy({}, service.loggedinuser_);
      }
    });	
    
    
  }	

})();