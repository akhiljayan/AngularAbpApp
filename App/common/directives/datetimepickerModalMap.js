(function () {
    appModule.directive('dateTimePicker', ['$rootScope', '$timeout', '$filter', function ($rootScope, $timeout, $filter) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {

                var maxdateInitial = new Date();

                maxdateInitial.setMinutes(maxdateInitial.getMinutes() + 1);

                var parent = $(element).parent();

                var parentEl = parent.parent('div.form-md-line-input').first();

                var icon = element[0].querySelector(".input-group-addon") == null ? parentEl[0].querySelector(".input-group-addon") : element[0].querySelector(".input-group-addon");

                var form = $(element).parents('form:first');

                if (navigator.userAgent.indexOf("Firefox") > 0) {
                    var defMax = new Date('31 Dec 2999 12:00:00');
                    var defMin = new Date('01 Jan 1900 12:00:00')
                } else {
                    var defMax = new Date('31-Dec-2999 12:00:00');
                    var defMin = new Date('01-Jan-1900 12:00:00')
                }

                var allowedFutureDate = (typeof attrs.allowfuturedate == 'undefined' || attrs.allowfuturedate == null || attrs.allowfuturedate == '') ? new Date(maxdateInitial) : defMax;

                var maxdate = (typeof attrs.maxdate == 'undefined' || attrs.maxdate == null || attrs.maxdate == '') ? allowedFutureDate : new Date(attrs.maxdate).setSeconds(0, 0);

                var mindate = (typeof attrs.mindate == 'undefined' || attrs.mindate == null || attrs.mindate == '') ? defMin : new Date(attrs.mindate).setSeconds(0, 0);

                var previousVal;

                var dtp = parent.datetimepicker({
                    format: "DD-MMM-YYYY hh:mm A",
                    maxDate: maxdate,
                    minDate: mindate,
                    useCurrent: false,
                    focusOnShow: false,
                    ignoreReadonly: true,
                    widgetPositioning: {
                        horizontal: 'right',
                        vertical: 'bottom',
                    },
                });




                ngModelCtrl.$formatters.push(formatInput);

                ngModelCtrl.$render = renderViewValue;

                ngModelCtrl.$parsers.push(parseOutput);




                scope.$on('focus-on-error-field', function () {
                    var parentEl = element.parent('div.form-md-line-input').first();
                    parentEl.toggleClass('has-error', ngModelCtrl.$invalid);
                });

                dtp.on("dp.show", function (e) {
                    if (ngModelCtrl.$modelValue != null && typeof ngModelCtrl.$modelValue != 'undefined' && ngModelCtrl.$modelValue != "") {
                        $(parent).data("DateTimePicker").date(new Date(ngModelCtrl.$modelValue));
                    }
                });

                angular.element(icon).bind('click', function () {
                    if (ngModelCtrl.$modelValue != null && typeof ngModelCtrl.$modelValue != 'undefined' && ngModelCtrl.$modelValue != "") {
                        $(parent).data("DateTimePicker").date(new Date(ngModelCtrl.$modelValue));
                    }
                });

                dtp.on("dp.change", function (e) {
                    emitMarkupChange(e);
                    if (!e.oldDate || !e.date.isSame(e.oldDate, 'day')) {
                        $(this).data('DateTimePicker').hide();
                    }
                }).end().on('blur', function (e) {//Blur event if any
                    var view = ngModelCtrl.$viewValue;
                    var isValid = moment(ngModelCtrl.$viewValue, ["DD-MMM-YYYY hh:mm A"], true).isValid();

                    if (attrs.required && (ngModelCtrl.$viewValue == false || ngModelCtrl.$viewValue == "" || !isValid)) {
                        var datevalue = $filter('dateTimeFormat')(ngModelCtrl.$modelValue);
                        if (datevalue != '-') {
                            ngModelCtrl.$setViewValue(datevalue);
                            element.val(datevalue);
                        } else {
                            ngModelCtrl.$setViewValue("");
                            element.val("");
                        }

                    }

                    if (!isValid) {
                        if (ngModelCtrl.$viewValue != "" && ngModelCtrl.$viewValue != '-' && typeof ngModelCtrl.$viewValue != 'undefined' && ngModelCtrl.$viewValue != null) {
                            var dateFormatMessage = 'Please enter a proper date format: DD-MMM-YYYY HH:mm A';
                            showValidationError(dateFormatMessage);
                        }
                    } else {
                        if (ngModelCtrl.$valid) {
                            removeValidationError();
                        } else {
                            showValidationError();
                        }
                    }
                });




                function formatInput(value) {
                    var datevalue = $filter('dateTimeFormat')(value);
                    return datevalue;
                };

                function renderViewValue() {
                    if (typeof ngModelCtrl.$modelValue != 'undefined') {
                        var datevalue = $filter('dateTimeFormat')(ngModelCtrl.$modelValue);
                        element.val(datevalue);
                    }
                };

                function parseOutput(value) {
                    previousVal = ngModelCtrl.$$rawModelValue;
                    if (!isNaN(Date.parse(value)) && moment(value, ["DD-MMM-YYYY hh:mm A"], true).isValid()) {
                        var date = new Date(value).toISOString();
                        return new Date(value).toISOString();
                    } else {
                        if (attrs.required) {
                            if (value == false || value == "" || !moment(value, ["DD-MMM-YYYY hh:mm A"], true).isValid()) {
                                ngModelCtrl.$viewValue = "";
                                return previousVal;
                            }
                            return previousVal;
                        } else {
                            if (value == false || value == "" || !moment(value, ["DD-MMM-YYYY hh:mm A"], true).isValid()) {
                                ngModelCtrl.$viewValue = "";
                                return "";
                            } else {
                                return value;
                            }
                        }
                    }
                };

                function emitMarkupChange(e) {
                    scope.$apply(
                        function changeModel() {
                            ngModelCtrl.$setViewValue(e.date);
                        }
                    );
                };

                function showRequiredValidationError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].className += " has-error";
                    var spanError = parent[0].querySelector("span.help-block");
                };

                function convertModelValue(viewValue) {
                    var modelDate = new Date(Date.parse(viewValue));
                    viewValue = modelDate;
                    ngModelCtrl.$viewValue = viewValue;
                    return viewValue;
                };

                function convertViewValue(modelValue) {
                    modelValue = $filter('dateTimeFormat')(modelValue);
                    ngModelCtrl.$modelValue = modelValue;
                    return modelValue;
                };

                function showValidationError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].className += " has-error";
                };

                function removeValidationError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].classList.remove("has-error");
                };

                function showError(dateFormatMessage) {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].className += " has-error";
                    // var dateFormatMessage = 'Please enter a proper date format: DD-MMM-YYYY HH:mm A';
                    var checkPblock = parentEl[0].querySelector(".invalid_date_format");
                    var labelElm = parentEl[0].querySelector("label");
                    var input = parentEl[0].querySelector("input");;
                    input.className += " ng-invalid";
                    var icon = parentEl[0].querySelector(".input-group-addon");
                    icon.className += " error-border";
                    if (checkPblock == null || checkPblock == '') {
                        var errorhtml = '<p class="help-block invalid_date_format">' + dateFormatMessage + '</p>';
                        parentEl[0].insertAdjacentHTML('beforeend', errorhtml);
                        labelElm.className += " datetimepicker-has-error-label";
                    }
                };

                function removeError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].classList.remove("has-error");
                    var dateFormatMessage = 'Please enter a proper date format: DD-MMM-YYYY HH:mm A';
                    var checkPblock = parentEl[0].querySelector(".invalid_date_format");
                    var labelElm = parentEl[0].querySelector("label");
                    var input = parentEl[0].querySelector("input");
                    input.classList.remove("ng-invalid");
                    var icon = parentEl[0].querySelector(".input-group-addon");
                    icon.classList.remove("error-border");
                    if (checkPblock != null && checkPblock != '') {
                        parentEl[0].removeChild(checkPblock);
                        labelElm.classList.remove("datetimepicker-has-error-label");
                    }
                };

                function checkForError() {
                    if (ngModelCtrl.$valid) {
                        removeValidationError();
                        return false;
                    } else {
                        showValidationError();
                        return true;
                    }
                };

            }
        };
    }]);
})();