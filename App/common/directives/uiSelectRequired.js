appModule.directive('uiSelectRequired', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {
                var isValid = (modelValue && modelValue != scope.EmptyGuid);
                return isValid;
            };

        }
    };

});


appModule.directive('datetimepickerRequired', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$validators.required = function (modelValue, viewValue) {
                var isValid = (viewValue && viewValue != false && viewValue != "" && modelValue && moment(viewValue, ["DD-MMM-YYYY hh:mm A"]));
                return isValid;
            };

        }
    };

});




appModule.directive('datepickerRequired', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$validators.required = function (modelValue, viewValue) {
                var isValid = (viewValue && viewValue != false && viewValue != "" && modelValue && moment(viewValue, ["DD-MMM-YYYY"]));
                return isValid;
            };

        }
    };

});

