angular.module('starter.services', [])
.factory('User', ['$http', "$rootScope", "$q", "$ionicLoading", function($http, $rootScope, $q, $ionicLoading) {
   var _userdata = null;

   /*
   if (u) {
     _login(_userdata);
   }
   */

   function _login (creds) {
     var def = $q.defer();

     $ionicLoading.show();
     $http.post($rootScope.url + "Account/Login", creds)
     .then(function(data) {
         if (data.data && data.data == "true") {
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

   function _signup (creds) {
     var def = $q.defer();

     $ionicLoading.show();
     $http.post($rootScope.url + "Account/Register", creds)
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
     if (remoteLogout) $http.post($rootScope.url + "Account/Logoff", {});
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

   return {
    getUserData: _getUserData,
    isLoggedIn: _isLoggedIn,
    login: _login,
    signup: _signup,
    getRecent: _getRecent,
    logout: _logout
   };
 }])

.factory('Album', ['$http', "$rootScope", "$q", "$ionicLoading", function($http, $rootScope, $q, $ionicLoading) {

    var _album = null;

    function _hasAccess (album, pwd) {
      var def = $q.defer();
      var d = {
        "AlbumId": album.AlbumID,
        "AlbumPassword": pwd
      };
      $http.post($rootScope.url + "Albums/CanContribute", d)
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
      return $http.get($rootScope.url + "Albums?lat=" + lat + "&lng=" + lng);
    }

    return {
      hasAccess: _hasAccess,
      setCurrent: _setCurr,
      getCurrent: _getCurr,
      getAlbums: _getAlbums
    };
  }]);
