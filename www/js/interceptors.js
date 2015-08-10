var module = angular.module('starter.injectors', []);
module.factory('connectivity', ['$q', '$injector', function($q, $injector) {
    function getConx() {
      c = "";
      try {
        c = navigator.connection.type;
      }
      catch (e) {
        c = "";
      }
      return c;
    }
    var interceptor = {
        request: function(config) {
          //console.log ("Connectivity")
          if (config.url.indexOf("/api") > -1) {
            //alert("Connectivity is " + getConx() + " url is " + config.url);
            var c = getConx();
            if (c == "none" || c == "unknown") {
              config = null;
            }
          }
          return config;
        }
    };
    return interceptor;
}]);
module.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('connectivity');
}]);
