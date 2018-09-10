
appModule.directive('modaldraggable', function () {
    return {
        restrict: 'EA',
        link: function (scope, element) {
            element.draggable();
        }
    }
});

appModule.directive('uibPopoverTemplatePopup', function () {
    return {
        restrict: 'EA',
        link: function (scope, element) {
            element.draggable();
        }
    }
});

