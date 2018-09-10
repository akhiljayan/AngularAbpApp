appModule.directive('scrollToTop', function () {
    return {
        link: function (scope, elm, attrs, ctrl) {
            $(elm).click(function () {
                $('html').animate({ scrollTop: 0 }, 500);
            });
        }
    };

});