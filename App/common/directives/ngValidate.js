(function (angular, $) {
    appModule.directive('ngValidate', [
        function () {
            return {
                require: 'form',
                restrict: 'A',
                scope: {
                    ngValidate: '='
                },
                link: function (scope, element, atts, form) {
                    var validator = element.validate(scope.ngValidate);

                    form.validate = function (options) {
                        var oldSettings = validator.settings;
                        validator.settings = $.extend(true, {}, validator.settings, options);

                        var valid = validator.form();
                        validator.settings = oldSettings; // Reset to old settings

                        return valid;
                    };

                    form.numberOfInvalids = function () {
                        return validator.numberOfInvalids();
                    };
                }
            };
        }
    ]);

    appModule.provider('$validator', [
        function () {
            $.validator.setDefaults({
                onsubmit: false // To prevent validating twice
            });

            return {
                $get: function () {
                    return {
                        setDefaults: $.validator.setDefaults,
                        addMethod: $.validator.addMethod,
                        setDefaultMessages: function (messages) {
                            angular.extend($.validator.messages, messages);
                        },
                        format: $.validator.format,
                    };
                }
            };
        }
    ]);
})(angular, jQuery);