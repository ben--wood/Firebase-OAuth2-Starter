'use strict';

angular
  .module('app', ['ionic', 'firebase'])
  
  .constant('FIREBASE_URL', 'https://ionic-nevernote.firebaseio.com/') /* TODO: change this to your Firebase App URL. */  
  
  .constant('TABLE', {
    Note: 'Note',
    User: 'User'
  })
    
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('forgotpassword', {
        url: '/forgotpassword',
        templateUrl: 'views/account/forgotPassword.html',
        controller:'ForgotPasswordController as vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/account/login.html',
        controller:'LoginController as vm'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/account/register.html',
        controller:'RegisterController as vm'
      })
      
          
      .state('noteadd', {
        url: '/noteadd',
        templateUrl: 'views/note/add.html',
        controller:'NoteAddController as vm'
      })
      .state('noteedit', {
        url: '/noteedit/{id}',
        templateUrl: 'views/note/edit.html',
        controller:'NoteEditController as vm'
      })
      .state('notelist', {
        url: '/notelist',
        templateUrl: 'views/note/list.html',
        controller:'NoteListController as vm'
      });
      
    $urlRouterProvider.otherwise("/login");
  }])
  
  .run(['$ionicPlatform', function($ionicPlatform) {
  
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

    });
  }]);