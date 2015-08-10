angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $http, $ionicModal, $timeout, $ionicPopup, User) {
  // Form data for the login modal
  $rootScope.url = "http://www.phuse-app.com/api/";
  $rootScope.imageURL = "http://www.phuse-app.com/";

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

  ionic.Platform.ready(function(){
    // will execute when device is ready, or immediately if the device is already ready.
    try {
      //navigator.globalization.getPreferredLanguage(
      //  function (language) { $rootScope.lang = language; }
      //);
      var dev = ionic.Platform.device();
      $rootScope.uuid = dev.uuid;
      $rootScope.platform = dev.platform;
      $rootScope.isDroid = (($rootScope.platform || "").toLowerCase() == "android");

      var creds = User.getUserData();
      if (creds) {
        var prom = User.login(creds);
        prom.then(function() {
          //$ionicLoading.hide();
        });
        prom.catch(function() {
          $ionicPopup.alert({
           title: 'Login',
           template: 'Unable to login.'
         });
        });
      }

    } catch(e) {
      // nothing
    }
  });

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


.controller('HomeCtrl', function($scope, $location, $rootScope, $ionicPopup, $translate, User) {
  $scope.selectAlbum = function() {
    $location.url("/app/albums");
  };

  $scope.createAlbum = function() {
    if (User.isLoggedIn()) {
      $location.url("/app/album");
    }
    else
    {
      $location.url("/app/login");
    }
  };

  $scope.getUsername = function() {
    var u = User.getUserData() || {};
    return u.UserName || "";
  };

  $scope.isLoggedIn = function() {
    return User.isLoggedIn();
  };

  $scope.logout = function() {
    User.logout();
  };

})

.controller('MenuCtrl', function($scope, $location, $rootScope, $ionicPopup, $translate, User, Album) {
  $scope.creds = $rootScope.creds;
  $scope.recents = [];

  $scope.isLoggedIn = function() {
    return User.isLoggedIn();
  };

  $scope.logout = function() {
    User.logout();
  };

  function getRecent() {
    return User.getRecent();
  };

  $scope.select = function(obj) {
    Album.setCurrent(obj);
    $location.url("/app/photo?albumID=" + obj.AlbumID);
  };

  $scope.recents = getRecent();
  $scope.createAlbum = function() {
    if (User.isLoggedIn()) {
      $location.url("/app/album");
    }
    else
    {
      $location.url("/app/login");
    }
  };

})

.controller('albumCtrl', function($scope, $location, $rootScope, $http, $ionicPopup, $translate, $routeParams) {
  $scope.data = {
    ContributeFromDate: null,
    ContributeFromTime: null,
    AlbumName: "",
    VenueName: "",
    VenueAddress: "",
    VenueWifiName: "",
    VenuePassword: "",
    Password: ""
  };

  $scope.save = function() {

    var d = moment($scope.data.ContributeFromDate);
    var t = moment($scope.data.ContributeFromTime);
    $scope.data.ContributeFrom = moment(d.format("YYYY-MM-DD") + " " + t.format("HH:mm")).toISOString();
    delete $scope.data.ContributeFromDate;
    delete $scope.data.ContributeFromTime;

  //  $scope.data.contributeFrom =

    $http.post($rootScope.url + "Albums/Post", $scope.data)
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

.controller('LoginCtrl', function($scope, $location, $rootScope, $http, $ionicPopup, $translate, $ionicLoading, User) {
  $scope.data = {
    UserName: "",
    Password: ""
  };

  function _loginOK() {
    $ionicLoading.hide();
    $location.url("/app/album");
  }

  function _loginFailed() {
    $ionicLoading.hide();
    $translate(['error', 'albums-login-error']).then(function(trans) {
      $ionicPopup.alert({
         title: trans.error,
         template: trans['albums-login-error']
       });
    });
  }

  $scope.login = function() {
    $ionicLoading.show();
    var prom = User.login($scope.data);
    prom.then(_loginOK, _loginFailed);
  };
})

.controller('SignUpCtrl', function($scope, $location, $rootScope, $http, $ionicPopup, $translate, $ionicLoading, User) {
  $scope.data = {
    UserName: "",
    Password: "",
    EmailAddress: ""
  };

  function _loginOK() {
    $ionicLoading.hide();
    $location.url("/app/album");
  }

  function _loginFailed() {
    $ionicLoading.hide();
    $translate(['error', 'albums-signup-error']).then(function(trans) {
      $ionicPopup.alert({
         title: trans.error,
         template: trans['albums-signup-error']
       });
    });
  }

  $scope.signup = function() {
    $ionicLoading.show();
    var prom = User.signup($scope.data);
    prom.then(_loginOK, _loginFailed);
  };
})

.controller('PhotoCtrl', function($scope, $location, $rootScope, $http, $routeParams, Album) {
  $scope.uploads = [];
  var albumID = $routeParams.albumID;

  $scope.capturePhoto = function() {
    try {
      navigator.camera.getPicture(
          function(imgData) {
            var data = {
              "PhotoId": (new Date()).valueOf(),
              "AlbumId": Album.getCurrent().AlbumId,
              "AlbumPassword": Album.getCurrent().pwd,
              "Type": "jpg",
              "MediaData": imgData,
              "Location": {
                "Lat": "0",
                "Long": "0"
              },
              "TakenOn": (new Date()).toJSON(),
              "ContributorIdentifier": $rootScope.uuid
            };

            $scope.uploads.push(data.PhotoId);
            $http.post($rootScope.url + "Photos", data)
              .success(function(res, status, headers) {
                $scope.uploads.shift();
                //$scope.capturePhoto();
              })
              .error(function(err) {
                $scope.uploads.shift();
                //alert("ERROR " + JSON.stringify(err));
                $ionicPopup.alert({
                 title: 'Upload',
                 template: 'Unable to upload photo.'
               });
              });

          },
          function(msg) {
            // alert("ERROR 2: " + msg);
          },
          {
              quality: 70,
              targetWidth: 1000,
              targetHeight: 1000,
              destinationType: Camera.DestinationType.DATA_URL,
              allowEdit: false,
              encodingType: Camera.EncodingType.JPEG,
              saveToPhotoAlbum: false,
              correctOrientation: true
          });
    }
    catch(e) {
      $ionicPopup.alert({
       title: 'Upload',
       template: 'Unable to upload photo.'
     });
    }
  }
})

/*
.controller('PhotoCtrl3', function($scope, $location, $rootScope, $http, $timeout, $translate) {
  var media = null;
  $scope.uploads = [];

  $scope.capturePhoto = function(data) {
    window.plugin.CanvasCamera.takePicture(function(photoData) {
      //alert(JSON.stringify(photoData));
      var data = {
        "PhotoId": (new Date()).valueOf(),
        "AlbumId": $rootScope.album.AlbumID,
        "Type": "jpg",
        "MediaData": photoData.imageURI,
        "Location": {
          "Lat": "0",
          "Long": "0"
        },
        "AlbumPassword": $rootScope.albumPassword,
        "TakenOn": (new Date()).toJSON(),
        "ContributorIdentifier": $rootScope.uuid
      };

      $scope.uploads.push(data.PhotoId);

      $http.post($rootScope.url + "Photos", data)
        .then(function(data) {
        }, function(err) {
          alert("err " + err)
      });
    }, function(err) {
      alert(err);
    });
  };

  function resizer() {
    var h = window.innerHeight;
    var w = window.innerWidth;
    $scope.objCanvas.height = h;
    $scope.objCanvas.width = w;
  }

  $scope.init = false;
  $scope.objCanvas = document.getElementById("photo-canvas");
  if (window.plugin && window.plugin.CanvasCamera) {
    window.plugin.CanvasCamera.initialize($scope.objCanvas);
    var opt = {
        quality: 75,
        destinationType: window.plugin.CanvasCamera.DestinationType.DATA_URL,
        encodingType: window.plugin.CanvasCamera.EncodingType.JPEG,
        saveToPhotoAlbum:false,
        correctOrientation:false,
        height: 1000,
        width: 1000
    };

    window.plugin.CanvasCamera.start(opt);
  }

    //window.addEventListener("resize", resizer);
    //resizer();

})
*/

.controller('AlbumsCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $location, $interval, $translate, Album) {
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

  function _albumLoginOK(album) {
    Album.setCurrent = album;
    window.localStorage.setItem(album.AlbumID, JSON.stringify({ AlbumName: album.AlbumName, TitleImage: "", ContributionUntil: album.ContributionUntil, pwd: $scope.data.pwd }));
    $rootScope.albumPassword = $scope.data.pwd;
    $location.url("/app/photo");
  }

  function _albumLoginFailed() {
    $translate(['error', 'albums-login-bad']).then(function(trans) {
      $ionicPopup.alert({
         title: trans.error,
         template: trans['albums-login-bad']
       });
   });
  }

  $scope.select = function(album) {
    $scope.data.pwd = "";
    $rootScope.album = album;

    var storedPwd = window.localStorage.getItem(album.AlbumID);
    if (storedPwd) {
      storedPwd = JSON.parse(storedPwd);
      //$rootScope.albumPassword = storedPwd.pwd;
      Album.setCurrent(album);
      $location.url("/app/photo");
    }
    else
    {
      $translate('albums-enter-password').then(function(tran) {
        var popUpProm = $ionicPopup.show({
          template: '<input type="password" ng-model="data.pwd">',
          title: tran,
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
            var prom = Album.hasAccess(album, pwd);
            prom.then(_albumLoginOK, _albumLoginFailed);
          }
        });
      });
    }
  };

  function _updateTimeRemaining() {
    for (var i=0; i < $scope.albums.length; i++) {
      $scope.albums[i].timeRemaining = $scope.getTimeRemaining($scope.albums[i]);
    }
  }

  function _getAlbums(lat, lng) {
    $translate('albums-getting-albums').then(function(tran) {
      $ionicLoading.show({
        template: "<i class='icon ion-load-c ion-spin'></i>&nbsp;" + tran
      });
      Album.getAlbums(lat, lng).then(function(data) {
        $scope.albums = data.data;
        for (var i=0; i < $scope.albums.length; i++) {
          var a = $scope.albums[i];
          var d = new Date(a.ContributionUntil);
          var now = new Date();
          if (d > now) {
            a.timeRemaining = $scope.getTimeRemaining(a);
          }
        }
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        if (!$scope.$$phase) $scope.$apply();
      }, function() {
        $ionicLoading.hide();
        //alert("Unable to get Albums. Please check your connection.");
        $ionicPopup.alert({
         title: 'Albums',
         template: 'Unable to get albums. Please check your connection.'
       });
      });
    });
  }

  function _getLoc () {
    $translate('albums-getting-location').then(function(tran) {
      $ionicLoading.show({
        template: "<i class='icon ion-load-c ion-spin'></i>&nbsp;" + tran
      });

      navigator.geolocation.getCurrentPosition(function(position) {
          $scope.coords = position;
          if (position && position.coords)
          {
            _getAlbums(position.coords.latitude, position.coords.longitude);
          }
          else {
            _getAlbums(0, 0);
          }
        },
        function(error) {
          _getAlbums(0, 0);
        }
      );
    });
  }

  _getLoc();
  $interval(_updateTimeRemaining, 1000);

});
