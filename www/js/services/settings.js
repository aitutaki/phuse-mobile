angular.module('starter', [])
.factory('Settings', [function() {
  var _url = "http://www.phuse-app.com/api/";
  return {
    url: _url
  };
}]);
