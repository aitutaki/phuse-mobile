angular.module('starter', []).factory('Culture', ['$http', "$rootScope", "$q", "$ionicLoading", "Settings", function($http, $rootScope, $q, $ionicLoading, Settings) {

  var _languages = {
    "en": {
      "LocalName": "English",
      "Culture": "en",
      "Labels": {
        "create_coming_soon": "Coming soon - create new albums on your mobile.",
        "albums_login_bad": "Incorrect password",
        "albums_getting_location": "Getting location...",
        "albums_title": "Albums",
        "albums_login_error": "Unable to login",
        "error": "Error",
        "login": "Login",
        "albums_distance": "miles away",
        "albums_select_album": "Select album",
        "pull_to_refresh": "Pull to refresh",
        "albums_getting_albums": "Getting albums...",
        "home_new_album": "Create a new album",
        "home_contribute": "Contribute to an album",
        "albums_enter_password": "Enter album password",
        "create_new_album": "New Album",
        "menu": "Menu",
        "back": "Back",
        "home": "Home",
        "album_details": "Album Details",
        "album_name": "Name",
        "album_password": "Password",
        "album_contribute_from": "Contribution From",
        "album_contribute_to": "Contribution To",
        "album_venue_name": "Name",
        "album_venue_address": "Address",
        "album_wifi_name": "Name",
        "album_wifi_password": "Password",
        "photos_uploading": "Photos Uploading",
        "recent_albums": "Recent Albums",
        "available_languages": "Available Languages",
        "greeting": "Hi",
        "albums_login_error": "Unable to login.", /* NEW */
        "albums_signup_error": "Unable to sign up", /* NEW */
        "email": "Email", /* NEW */
        "logout": "Logout", /* NEW */
        "user_name": "User Name", /* NEW */
        "password": "Password", /* NEW */
        "not_registered": "Not Registered? Sign Up.", /* NEW */
        "repeat_password": "Repeat Password", /* NEW */
        "sign_up": "Sign Up", /* NEW */
        "new_album": "New Album", /* NEW */
        "new_album_error": "Unable to create new album", /* NEW */
        "upload": "Upload", /* NEW */
        "upload_error": "Unable to upload photo at this time" /* NEW */
      },
      "Lookups": {
        "AlbumCategoryTypes": [],
        "AlbumViewingControlTypes": [],
        "DurationTypes": []
      }
    }
  };

  var _currLang = _languages["en"];
  var _available = [];

  function _getAvailableCultures() {
    var def = $q.defer();
    if (_available.length > 0) {
      def.resolve(_available);
    }
    else {
      $http.get(Settings.url + "culturetypes/get")
        .then(function(data) {
          _available = data.data;
          def.resolve(data.data);
        });
    }
    return def.promise;
    //_available = [{"CultureName":"en-GB","LocalName":"English","CountryCode":"GB"},{"CultureName":"es-ES","LocalName":"Español","CountryCode":"ES"}];
  }

  function _getLanguage(lang) {
    return $http.get(Settings.url + "uitext/get?culture=" + lang);
  }

  function _translate(label) {
    var culture = _currLang || _languages["en"];
    var ret = culture.Labels[label] || "";
    return ret;
  }

  function _setLang(lang) {
    _getLanguage(lang).then(function(data) {
      _languages[lang] = data.data;
      _currLang = _languages[lang];
    });
  }

  // _getAvailableCultures();

  // Setup default or saved language
  var savedLang = window.localStorage.getItem("lang");

  return {
    getAvailableCultures: _getAvailableCultures,
    getLanguage: _getLanguage,
    currLang: function() { return _currLang; },
    translate: _translate,
    setLang: _setLang
  };
}]);
