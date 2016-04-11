angular.module('starter', []).factory('Album', ['$http', "$rootScope", "$q", "$ionicLoading", "Settings", function($http, $rootScope, $q, $ionicLoading, Settings) {

    var _album = null;

    function _hasAccess (album, pwd) {
      var def = $q.defer();
      var d = {
        "AlbumId": album.AlbumID,
        "AlbumPassword": pwd
      };
      $http.post(Settings.url + "Albums/CanContribute", d)
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
      return $http.get(Settings.url + "Albums?lat=" + lat + "&lng=" + lng);
    }

    return {
      hasAccess: _hasAccess,
      setCurrent: _setCurr,
      getCurrent: _getCurr,
      getAlbums: _getAlbums
    };
  }]);
