(function () {
    'use strict';

    angular
      .module('app')
      .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$state', 'authenticationService'];

    function RegisterController($state, authenticationService) {
      var vm = this;
      vm.user = {};
      
      vm.register = register;        
      
      ////////////

      function register() {      
        if (vm.registerForm.$dirty === true && vm.registerForm.$valid === true) {
          authenticationService.register(vm.user)
            .then(function(){
              $state.go('home');
            }, function(error) {
              console.error('Registration error', error);
            });      
        }
      }
      
    }
})();