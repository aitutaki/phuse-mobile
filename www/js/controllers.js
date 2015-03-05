angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {
  // Form data for the login modal
  $rootScope.url = "http://www.papmyday.com/api/";
  $rootScope.imageURL = "http://www.papmyday.com/";
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


.controller('HomeCtrl', function($scope, $location, $rootScope) {
  $scope.selectAlbum = function() {
    $location.url("/app/albums");
  };

  $scope.createAlbum = function() {
    if ($rootScope.creds) {
      $location.url("/app/newAlbum");
    }
    else
    {
      $location.url("/app/login");
    }
  }

})

.controller('newAlbumCtrl', function($scope, $location, $rootScope, $http, $ionicPopup) {
  $scope.data = {
    contributeFromDate: new Date(),
    contributeFromTime: new Date()
  };

  $scope.save = function() {

    var d = moment($scope.data.ContributeFromDate);
    var t = moment($scope.data.ContributeFromTime);
    $scope.data.ContributeFrom = moment(d.format("YYYY-MM-DD") + " " + t.format("HH:mm")).toISOString();
    delete $scope.data.ContributeFromDate;
    delete $scope.data.ContributeFromTime;

  //  $scope.data.contributeFrom =

    $http.post($rootScope.url + "Albums", $scope.data)
      .then(function(data) {
        $ionicPopup.alert({
           title: "New Album",
           template: "New album created."
         }).then(function() {
           $location.url("/app/home");
         });
      })
      .error(function(err) {
        $ionicPopup.alert({
           title: "Error",
           template: "Unable to create album."
         });
      });
  };
})

.controller('LoginCtrl', function($scope, $location, $rootScope, $http, $ionicPopup) {
  $scope.data = {
    username: "",
    password: ""
  };

  $scope.login = function() {
    $http.post($rootScope.url + "Account/Login", $scope.data)
      .then(function(data) {
        if (data.data && data.data == "true") {
          $rootScope.creds = data.data;
          $location.url("/app/newAlbum");
        }
        else
        {
          $ionicPopup.alert({
             title: "Error",
             template: "Unable to login."
           });
        }
      });
      /*
      .error(function(data) {
        $ionicPopup.alert({
           title: "Error",
           template: "Unable to login."
         });
      });
      */
  };
})

.controller('PhotoCtrl', function($scope, $location, $rootScope, $http) {
  $scope.capturePhoto = function() {
    try {
      navigator.camera.getPicture(
          function(imgData) {
            var data = {
              "AlbumId": $rootScope.album.AlbumID,
              "Type": "jpg",
              "MediaData": imgData,
              "Location": {
                "Lat": "0",
                "Long": "0"
              },
              "AlbumPassword": $rootScope.albumPassword,
              "TakenOn": (new Date()).toJSON(),
              "ContributorIdentifier": "TC"
            };

            $http.post($rootScope.url + "Photos", data)
              .then(function(res, status, headers) {
                $scope.capturePhoto();
              });
              /*
              .error(function(err) {
                alert(err);
              });
              */

          },
          function(msg) {
            alert(msg);
          },
          {
              quality: 70,
              targetWidth: 600,
              targetHeight: 800,
              destinationType: Camera.DestinationType.DATA_URL,
              allowEdit: false
          });
    }
    catch(e) {
      alert(e);
    }
  }
})

.controller('AlbumsCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $location, $interval) {
  $scope.albums = [];
  $scope.coords = null;
  $scope.data = { pwd: "" };

  $scope.getTimeRemaining = function(a) {
    var until = moment(a.ContributionUntil);
    var now = moment();
    var ms = until.diff(now);
    return moment.utc(ms).format("HH:mm:ss");
  };

  $scope.getCoverImage = function(a) {
    var url = "img/default.png";
    if (a.LatestPhoto) {
      url = $rootScope.imageURL + a.LatestPhoto;
    }
    return url;
  };

  $scope.refresh = function() {
    if ($scope.coords) {
      _getAlbums($scope.coords.coords.latitude, $scope.coords.coords.longitude);
    }
    else
    {
      _getLoc();
    }
  };

  $scope.select = function(album) {
    $scope.data.pwd = "";
    $rootScope.album = album;

    var popUpProm = $ionicPopup.show({
      template: '<input type="password" ng-model="data.pwd">',
      title: 'Enter Album Password',
      // subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.pwd) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.pwd;
            }
          }
        }
      ]
    });

    popUpProm.then(function(pwd) {
      if (!!pwd) {
        $rootScope.albumPassword = pwd;
        $location.url("/app/photo");
        debugger;
      }
    })
  };

  function _updateTimeRemaining() {
    for (var i=0; i < $scope.albums.length; i++) {
      $scope.albums[i].timeRemaining = $scope.getTimeRemaining($scope.albums[i]);
    }
  }

  function _getAlbums(lat, lng) {
    var url = $rootScope.url + "Albums?lat=" + lat + "&lng=" + lng;

    $ionicLoading.show({
      template: "<i class='icon ion-load-c ion-spin'></i>&nbsp;Getting albums..."
    });
    $http.get(url).then(function(data) {
      $scope.albums = data.data.filter(function(a) {
        var d = new Date(a.ContributionUntil);
        var now = new Date();
        if (d > now) {
          a.timeRemaining = $scope.getTimeRemaining(a);
          return true;
        }
        else
        {
          return false;
        }
      });
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply()
    });
  }

  function _getLoc () {
    $ionicLoading.show({
      template: "<i class='icon ion-load-c ion-spin'></i>&nbsp;Getting your location..."
    });

    navigator.geolocation.getCurrentPosition(function(position) {
        $scope.coords = position;
        if (position && position.coords)
        {
          _getAlbums(position.coords.latitude, position.coords.longitude);
        }
        else {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$apply()
          $ionicPopup.alert({
             title: "Error",
             template: "Unable to get your location."
           });
        }
      },
      function(error) {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
        $ionicPopup.alert({
           title: "Error",
           template: "Unable to get your location."
         });
      }
    );
  }

  _getLoc();
  $interval(_updateTimeRemaining, 1000);

});
