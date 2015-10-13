(function () {
    'use strict';

    angular
      .module('app')
      .controller('ForgotController', ForgotController);

    ForgotController.$inject = ['$state', 'authenticationService'];

    function ForgotController($state, authenticationService) {
      var vm = this;   
      vm.email = null;    
      
      vm.resetPassword = resetPassword;        
      
      ////////////

      function resetPassword() {
        authenticationService.resetPassword(vm.email)
          .then(function() {
            console.info("Password reset success");
            $state.go('account-login');
          }, function(error) {
            console.error("Error: ", error);
          });        
      }
      
    }    
})();