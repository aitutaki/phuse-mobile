angular.module('starter.directives', []).directive ('passwordMatch', function () {
  return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity("unique", n);
            });
        }
    };
})
.directive ('errIcon', function () {
    return {
        restrict: 'A',
        scope:true,
        //require: 'ngModel',
        //template: "<i class='aitu-form-err fa fa-warning'></i>",
        link: function (scope, elem , attrs, control) {
          elem.after("<i class='aitu-form-err fa fa-warning' ng-show='!signupForm." + elem.attr("name") + ".$valid'></i>");
        }
    };
    /*
    return function(scope, elem, attrs, control) {
      //elem.after("boo");
      elem.after("<i class='aitu-form-err fa fa-warning' ng-show='!signupForm." + elem.attr("name") + ".$valid'></i>")
    };
    */
});
