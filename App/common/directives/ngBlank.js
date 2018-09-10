appModule.directive('ngBlank', function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: '='
        },
        template: '<span>{{ ngModel ? ngModel : "-" }}</span>',
        replace: true
    };
});