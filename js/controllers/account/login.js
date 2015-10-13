(function () {
    'use strict';

    angular
      .module('app')
      .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'authenticationService'];

    function LoginController($state, authenticationService) {
      var vm = this;
      vm.user = {};
      
      vm.login = login;        
      
      ////////////

      function login() {      
        if (vm.loginForm.$dirty === true && vm.loginForm.$valid === true) {
          authenticationService.login(vm.user)
            .then(function(){
              $state.go('notelist');
            });      
        }
      }
      
    }
})();
