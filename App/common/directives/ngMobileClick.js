(function () {
    appModule.directive('ngMobileClick', [
        function () {
            return function (scope, element, attrs) {
                element.bind("touchstart click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    scope.$apply(attrs["ngMobileClick"]);
                });
            };
        }
    ]);
})();