(function () {
    appModule.directive('datePicker', ['$timeout', '$filter', function ($timeout, $filter) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                ngModel: "=",
                ngDisabled : "="
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var parent = $(element).parent();

                var form = $(element).parents('form:first');

                var maxdate = (typeof attrs.maxdate == 'undefined' || attrs.maxdate == null || attrs.maxdate == '') ? "" : attrs.maxdate;

                var mindate = (typeof attrs.mindate == 'undefined' || attrs.mindate == null || attrs.mindate == '') ? "" : attrs.mindate;

                //defaultViewDate

                var dtpOptions = {
                    autoclose: true,
                    startDate: mindate,
                    endDate: maxdate, 
                    disableTouchKeyboard: false,
                    orientation: "bottom right",
                    showOnFocus: false,
                    enableOnReadonly: false,
                    showClose: true,
                    useCurrent: false
                };

                if (attrs.hasOwnProperty("monthyearpickerselection")) {
                    angular.extend(dtpOptions, {
                        format: "M-yyyy",
                        minViewMode: 1,
                        forceParse: false
                    });

                } else {
                    angular.extend(dtpOptions, {
                        todayHighlight: true,
                        format: "dd-M-yyyy"
                    });
                }




                ngModelCtrl.$parsers.push(function (value) {
                    if (value != "") {
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                        if (attrs.hasOwnProperty("monthyearpickerselection")) {
                            if (navigator.userAgent.indexOf("Firefox") > 0) {
                                value = value.replace("-", "/");
                                var newvalue = "01/" + value;
                                var modelNewValue = newvalue.replace("-", "/");
                                //var modalValue = moment(modelNewValue).format('YYYY-MM-DDT00:00Z');   // *Proper format to implement for Date (Yet to implement) * //
                                var modalValue = modelNewValue;
                            } else {
                                var newvalue = "01-" + value;
                                //var modalValue = moment(newvalue).format('YYYY-MM-DDT00:00Z');   // *Proper format to implement for Date (Yet to implement) * //
                                var modalValue = newvalue;
                            }
                        } else {
                            if (navigator.userAgent.indexOf("Firefox") > 0) {
                                value = value.replace("-", "/");
                                var modelNewValue = value.replace("-", "/");
                                //var modalValue = moment(modelNewValue).format('YYYY-MM-DDT00:00Z');   // *Proper format to implement for Date (Yet to implement) * //
                                var modalValue = modelNewValue;
                            } else {
                                //var modalValue = moment(value).format('YYYY-MM-DDT00:00Z');   // *Proper format to implement for Date (Yet to implement) * //
                                var modalValue = value;
                            }
                        }
                        //return new Date(modalValue).toISOString(); 
                        return modalValue;
                    } else {
                        return "";
                    }
                });

                ngModelCtrl.$formatters.push(function (modelValue) {
                    if (modelValue != null && typeof modelValue != 'undefined' && modelValue != "") {
                        if (attrs.hasOwnProperty("monthyearpickerselection")) {
                            var datevalue = $filter('date')(modelValue, "MMM-yyyy");
                            var isValid = moment(datevalue, ["MMM-YYYY"], true).isValid();
                            if (!isValid) {
                                var setdate = Date.parse(datevalue);
                                datevalue = moment(setdate).format('MMM-YYYY');
                            }
                        } else {
                            var datevalue = $filter('dateFormat')(modelValue);
                            //datevalue = modelValue;  // *Proper format to implement for Date (Yet to implement) * //
                            var isValid = moment(datevalue, ["DD-MMM-YYYY"], true).isValid();
                            if (!isValid) {
                                var setdate = Date.parse(datevalue);
                                datevalue = moment(setdate).format('DD-MMM-YYYY');
                            }
                        }

                        //var DefaultValueObj = {
                        //    year: new Date(modelValue).getFullYear(),
                        //    month: new Date(modelValue).getMonth(),
                        //    day: new Date(modelValue).getDate()
                        //}

                        //angular.extend(dtpOptions, {
                        //    defaultViewDate: DefaultValueObj
                        //});

                        //var dtp = parent.datepicker(dtpOptions);


                        //dtp.on("changeDate", function (e) {//validateDate();
                        //}).end().on('blur', function (e) {//Blur event if any
                        //});


                        //dtp.on("show", function (e) {//validateDate();
                        //    e.date = ngModelCtrl.$modelValue;
                        //    element.val(ngModelCtrl.$viewValue);
                        //});

                        //dtp.on("hide", function (e) {//validateDate();
                        //    e.date = ngModelCtrl.$modelValue;
                        //    element.val(ngModelCtrl.$viewValue);
                        //});

                        return datevalue;
                    }
                });

                var dtp = parent.datepicker(dtpOptions);


                dtp.on("changeDate", function (e) {//validateDate();
                }).end().on('blur', function (e) {//Blur event if any
                });


                dtp.on("show", function (e) {//validateDate();
                    e.date = ngModelCtrl.$modelValue;
                    element.val(ngModelCtrl.$viewValue);
                });

                dtp.on("hide", function (e) {//validateDate();
                    e.date = ngModelCtrl.$modelValue;
                    element.val(ngModelCtrl.$viewValue);
                });


                

                if (attrs.ngDisabled == "true") {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    var icon = parentEl[0].querySelector(".input-group-addon");
                    angular.element(icon).bind('click', function (e) {
                        e.stopImmediatePropagation();
                        parent.datepicker("hide");
                    });
                    icon.className += " cursor-not-allowed";
                }


                //scope.$watch('ngDisabled', function (val) {
                //    if (attrs.ngDisabled) {
                //        dtp = parent.datepicker(dtpOptions);
                //        if (val == true) {
                           
                //        } else {
                            
                //        }
                //    }
                //});

                var icon = parent[0].querySelector(".input-group-addon");
                angular.element(icon).bind("click", function (e) {
                });


                element.bind("blur", function (e) {
                    ngModelCtrl.$dirty = true;
                    scope.$apply();
                });

                ngModelCtrl.$viewChangeListeners.push(function () {
                    ngModelCtrl.$dirty = false;
                });

                scope.$on('$destroy', function () {
                    element.off('blur');
                });


                var parseInputDateFunc = function (inputDate) {
                    return moment(inputDate, "DD-MM-YYYY");
                }

                function emitMarkupChange(e) {
                    scope.$apply(
                        function changeModel() {
                            ngModelCtrl.$setViewValue(e.date);
                        }
                    );
                };

               
                if (typeof attrs.showRequiredLabel != 'undefined' && attrs.showRequiredLabel != null && attrs.showRequiredLabel != '') {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    var labelElm = parentEl[0].querySelector("label");
                    var starhtml = '<span class="businessRequired"> * </span>';
                    labelElm.insertAdjacentHTML('beforeend', starhtml);
                }
                



                scope.$on('focus-on-error-field', function () {
                    var hasErrorChild = parent[0].querySelector("span#DischargedOn-error.help-block.help-block-validation-error") != null;
                    if (hasErrorChild) {
                        showValidationError();
                    } else {
                        if (!form.hasClass('ng-invalid')) {
                            removeValidationError();
                        }
                    }

                });

                function showValidationError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].className += " has-error";
                }

                function removeValidationError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].classList.remove("has-error");
                }

                function showError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].className += " has-error";
                    var dateFormatMessage = 'Please enter a proper date format: DD-MMM-YYYY';
                    var checkPblock = parentEl[0].querySelector(".invalid_date_format");
                    var labelElm = parentEl[0].querySelector("label");
                    var input = parentEl[0].querySelector("input");
                    var validatmsg = parent[0].querySelector("span.validationMessage");
                    input.className += " ng-invalid";
                    var icon = parentEl[0].querySelector(".input-group-addon");
                    icon.className += " error-border";

                    if (checkPblock == null || checkPblock == '') {
                        if (typeof ngModelCtrl.$modelValue != 'undefinned' && attrs.required != true) {
                            var errorhtml = '<p class="help-block invalid_date_format">' + dateFormatMessage + '</p>';
                            parentEl[0].insertAdjacentHTML('beforeend', errorhtml);
                            labelElm.className += " datetimepicker-has-error-label";
                        }
                    }
                }

                function removeError() {
                    var parentEl = parent.parent('div.form-md-line-input').first();
                    parentEl[0].classList.remove("has-error");
                    var dateFormatMessage = 'Please enter a proper date format: DD-MMM-YYYY';
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
                }


                function checkForError() {
                    if (ngModelCtrl.$valid) {
                        removeValidationError();
                    } else {
                        showValidationError();
                    }
                }
            }
        };
    }]);
})();