// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        controller: 'HomeCtrl',
        templateUrl: "templates/home.html"
      }
    }
  })

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        controller: 'LoginCtrl',
        templateUrl: "templates/login.html"
      }
    }
  })

  .state('app.albums', {
    url: "/albums",
    views: {
      'menuContent': {
        controller: 'AlbumsCtrl',
        templateUrl: "templates/albums.html"
      }
    }
  })

  .state('app.photo', {
    url: "/photo",
    views: {
      'menuContent': {
        controller: 'PhotoCtrl',
        templateUrl: "templates/photo.html"
      }
    }
  })
  //newAlbumCtrl
  .state('app.newAlbum', {
    url: "/newAlbum",
    views: {
      'menuContent': {
        controller: 'newAlbumCtrl',
        templateUrl: "templates/newAlbum.html"
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
