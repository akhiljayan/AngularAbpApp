(function () {
    'use strict';
    appModule.directive('searchForm', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                var searchForm = $(element);
                element.click(function () {
                    searchForm.find('.search-input').focus();
                    searchForm.find('.search-input').trigger('touchstart');
                });

                element.hover(function () {
                    searchForm.find('.search-input').focus();
                    searchForm.find('.search-input').trigger('touchstart');
                });

                searchForm.find('.search-input').on('touchstart', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $(this).focus();
                });
            }
        };
    });
})();