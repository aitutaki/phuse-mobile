angular.module('starter.services', [])
.service('User', ['$http', "$rootScope", "$q", "$ionicLoading", function($http, $rootScope, $q, $ionicLoading) {
   var _userdata = null;

   /*
   if (u) {
     _login(_userdata);
   }
   */

   function _login (creds) {
     var def = $q.defer();

     $ionicLoading.show();
     $http.post($rootScope.url + "login", creds)
     .then(function(data) {
         _userdata = creds;
         window.localStorage.setItem("creds", JSON.stringify(creds));
         $ionicLoading.hide();
         def.resolve(true);
       }, function() {
         _logout();
         $ionicLoading.hide();
         def.reject(false);
       });
      return def.promise;
   }

   function _signup (creds) {
     var def = $q.defer();

     $ionicLoading.show();
     $http.post($rootScope.url + "users", creds)
     .then(function(data) {
         if (data) {
           _userdata = creds;
           window.localStorage.setItem("creds", JSON.stringify(creds));
           $ionicLoading.hide();
           def.resolve(true);
         }
         else
         {
           _logout();
           $ionicLoading.hide();
           def.reject(false);
         }
       }, function() {
         _logout();
         $ionicLoading.hide();
         def.reject(false);
       });
      return def.promise;
   }

   function _logout(remoteLogout) {
     if (remoteLogout) $http.post($rootScope.url + "logout", {});
     _userdata = null;
     window.localStorage.removeItem("creds");
   }

   function _getUserData() {
     var ret = _userdata;
     try {
       if (!_userdata) {
         var data = window.localStorage.getItem("creds");
         ret = JSON.parse(data);
       }
     }
     catch (e) {
       ret = null;
     }
     return ret;
   }

   function _isLoggedIn() {
     return !!_userdata;
   }

   function _getRecent() {
     var ret = [];
     var album = null;
     var d;

     for(var key in window.localStorage) {
       if (key != "creds") {
         album = JSON.parse(window.localStorage.getItem(key));
         d = moment(album.ContributionUntil);
         if (d > moment()) {
           ret.push(album);
         }
       }
     }
     return ret;
   }

  this.getUserData= _getUserData;
  this.isLoggedIn= _isLoggedIn;
  this.login= _login;
  this.signup= _signup;
  this.getRecent= _getRecent;
  this.logout= _logout;
 }])

.service('Album', ['$http', "$rootScope", "$q", "$ionicLoading", function($http, $rootScope, $q, $ionicLoading) {

    var _album = null;

    function _hasAccess (album, pwd) {
      var def = $q.defer();
      var d = {
        "_id": album._id,
        "pwd": pwd
      };
      $http.post($rootScope.url + "albums/canContribute", d)
        .then(function(ok) {
          if (ok.data) {
            def.resolve(album);
          }
          else
          {
            def.reject(null);
          }
        });
      return def.promise;
    }

    function _setCurr(obj) {
      _album = obj;
    }

    function _getCurr() {
      return _album;
    }

    function _getAlbums(lat, lng) {
      return $http.get($rootScope.url + "albums/active?lat=" + lat + "&lng=" + lng);
    }

    this.hasAccess= _hasAccess;
    this.setCurrent= _setCurr;
    this.getCurrent= _getCurr;
    this.getAlbums= _getAlbums;
  }]);
