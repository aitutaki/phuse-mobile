angular.module('starter.filters', []) .filter('translateLabel', ['$rootScope', 'Culture', function ($rootScope, Culture) {
  return function(value) {
    value = Culture.translate(value);
    return value;
  }
}]);
