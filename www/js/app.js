// Ionic phuse App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'pascalprecht.translate', 'starter.controllers', 'starter.services', 'starter.injectors', 'starter.directives'])
.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $translateProvider) {

  $ionicConfigProvider.backButton.text('');

  $translateProvider.translations('en', {
    'home-new-album': 'Create a new album',
    'home-contribute': 'Contribute to an album',
    'create-new-album': 'New Album',
    'create-coming-soon': 'Coming soon - create new albums on your mobile.',
    'albums-getting-albums': 'Getting albums...',
    'albums-getting-location': 'Getting location...',
    'albums-title': 'Albums',
    'albums-distance': 'miles away',
    'back': 'Back',
    'albums-select-album': 'Select album',
    'menu': 'Menu',
    'pull-to-refresh': 'Pull to refresh',
    'albums-login-error': 'Unable to login',
    'error': 'Error',
    'albums-login-bad': 'Incorrect password',
    'albums-enter-password': 'Enter album password',
    'login': 'Login',
    'logout': 'Log out',
    'signup': 'Sign Up',
    'home': 'Home',
    'greeting': 'Hi'
  });

  $translateProvider.translations('es', {
    'home-new-album': 'Crear un nuevo álbum de fotos',
    'home-contribute': 'Contribuye a un álbum existente',
    'create-new-album': 'Nuevo Álbum',
    'create-coming-soon': 'Próximamente - creación de álbums desde tu celular.',
    'albums-getting-albums': 'Obteniendo álbums...',
    'albums-getting-location': 'Obteniendo ubicación...',
    'albums-title': 'Álbums',
    'albums-distance': 'millas de distancia',
    'back': 'Regresar',
    'albums-select-album': 'Seleccionar álbum',
    'menu': 'Menú',
    'pull-to-refresh': 'Jala hacia abajo para actualizar',
    'albums-login-error': 'Incapaz de iniciar sesión',
    'error': 'Error',
    'albums-login-bad': 'Identificación no son correctos',
    'albums-enter-password': 'Introduzca álbum contraseña',
    'login': 'Ingresar',
    'logout': 'cerrar sesión',
    'signup': 'contratar',
    'home': 'Casa',
    'greeting': 'Hola'
  });


//ubicación

  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');

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

  .state('app.signup', {
    url: "/signup",
    views: {
      'menuContent': {
        controller: 'SignUpCtrl',
        templateUrl: "templates/signup.html"
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
  .state('app.album', {
    url: "/album",
    views: {
      'menuContent': {
        controller: 'albumCtrl',
        templateUrl: "templates/album.html"
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

.run(function($ionicPlatform, $translate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            $translate.use((language.value).split("-")[0]).then(function(data) {
                console.log("SUCCESS -> " + data);
            }, function(error) {
                console.log("ERROR -> " + error);
            });
        }, null);
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
});
