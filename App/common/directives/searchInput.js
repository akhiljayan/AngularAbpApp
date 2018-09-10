(function () {
    'use strict';
    appModule.directive('searchInput', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                var searchFormInput = $(element);

                element.bind('focus', function () {
                    searchFormInput.parent().addClass("hover");
                });

                element.bind('blur', function () {
                    searchFormInput.parent().removeClass("hover");
                });
            }
        };
    });
})();