(function () {
    appModule.directive('masterSave', ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attrs, ngModelCtrl) {

                element.bind('click', function () {
                    scope.$parent.$broadcast('check-select-ui-required');
                    scope.$parent.$broadcast('focus-on-error-field');
                });

            }
        };
    }]);
})();