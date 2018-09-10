appModule.directive('ngPopover', [
    function () {
        return {
            restrict: 'A',
            scope: {
                ngPopover: '='
            },
            link: function (scope, element, atts, form) {
                element.popover();
            }
        };
    }
]);