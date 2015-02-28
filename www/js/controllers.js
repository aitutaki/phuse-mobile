angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {
  // Form data for the login modal
  $rootScope.url = "http://www.papmyday.com/api/";
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('HomeCtrl', function($scope, $location) {
  $scope.selectAlbum = function() {
    $location.path("#/app/albums");
  };
})

.controller('AlbumsCtrl', function($scope, $rootScope) {
  $scope.albums = [];

  function _getAlbums(lat, lng) {
    var url = $rootScope.url + "Albums?lat=" + lat + "&lng=" + lng;

  }

  navigator.geolocation.getCurrentPosition(function(position) {
      if (position && position.coords)
      {
        _getAlbums(position.coords.latitude, position.coords.longitude);
      }
      else {
        APP.alert("Unable to retrieve current location. Please try again later.");
      }
    },
    function(error) {
      APP.alert("Unable to retrieve current location. Please try again later.\n" + error.message);
    }
  );

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
