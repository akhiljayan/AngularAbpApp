(function (angular) {
    appModule.directive('maxdate', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;

                    var isInclusive = attrs.maxdate === 'false' ? false : true;
                    var dateFormat = attrs.dateformat ? attrs.dateformat : null;
                    var maxDate = Date.parse(attrs.maxdate);
                    maxDate = isNaN(maxDate) ? new Date() : new Date(maxDate);
                    maxDate.setHours(0, 0, 0, 0);

                    ctrl.$validators.maxdate = function (modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }

                        //var modelDate = Date.parse(modelValue);
                        var modelDate;
                        if (dateFormat != null) {
                            modelDate = moment(modelValue, dateFormat).toDate();
                        } else {
                            modelDate = Date.parse(modelValue);
                        }

                        //console.log(modelDate);

                        if (isNaN(modelDate)) {
                            return false;
                        } else {
                            modelDate = new Date(modelDate);
                            modelDate.setHours(0, 0, 0, 0);

                            return isInclusive
                                ? modelDate.getTime() <= maxDate.getTime()
                                : modelDate.getTime() < maxDate.getTime()
                        }
                    };
                }
            };
        }
    ]);

    appModule.directive('regDocNumValidation', [
        function () {
            return {
                require: "ngModel",
                restrict: "A",
                link: function (scope, elem, attrs, ctrl) {
                    ctrl.$validate();
                    elem.bind("keyup", function () {
                        ctrl.$validate();
                        checkError();
                    });

                    elem.bind("blur", function () {
                        checkError();
                    });

                    attrs.$observe('regDocNumValidation', function () {
                        ctrl.$validate();
                        checkError();
                    });


                    scope.$watch(attrs['ngModel'], function (newValue) {
                        selectedType = attrs.regDocNumValidation;
                        ducNumber = newValue;
                        checkError();
                    });

                    function validate(value, documentType) {
                        if (ctrl.$isEmpty(value)) {
                            return true;
                        }
                        var typesToCheck = { nricBlue: "NRIC Blue", nricPink: "NRIC Pink", fin: "Fin" };
                        var selectedRegDocumentType = documentType.trim();
                        if (selectedRegDocumentType != null) {
                            if (value == null) {
                                return true;
                            } else {
                                if (selectedRegDocumentType === typesToCheck.nricBlue || selectedRegDocumentType === typesToCheck.nricPink) {
                                    return isValidNric('nric', value);
                                } else if (selectedRegDocumentType == typesToCheck.fin) {
                                    return isValidNric('fin', value);
                                } else {
                                    return true;
                                }
                            }
                        } else {
                            return true;
                        }
                    };

                    function checkError() {
                        var flag = validate(ctrl.$viewValue, attrs['regDocNumValidation']);
                        if (!flag && ctrl.$viewValue != null && ctrl.$viewValue != "" && typeof ctrl.$viewValue != 'undefined') {
                            ctrl.$valid = false;
                            ctrl.$invalid = true;
                        } else if (flag && (ctrl.$viewValue == null || ctrl.$viewValue == "" || typeof ctrl.$viewValue == 'undefined')) {
                            var parentNode = angular.element(elem).parents("div.form-group.form-md-line-input");
                            var validateionMessage = angular.element(parentNode[0].querySelector('.has-erreor.validationMessage'));
                            if (validateionMessage) {
                                validateionMessage.remove();
                            }
                            //ctrl.$error = { 'required': true };
                        } else {
                            ctrl.$valid = true;
                            ctrl.$invalid = false;
                        }
                    };

                    //NRIC validator
                    function isValidNric(type, regdocumentno) {
                        if (regdocumentno == null || regdocumentno.length != 9) {
                            return false;
                        }
                        var st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
                        var fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
                        var weights = [2, 7, 6, 5, 4, 3, 2,];
                        var data = regdocumentno.toUpperCase();
                        var prefix = data[0];
                        var suffix = data[8];
                        var weightedSum = 0;
                        for (var i = 1; i <= 7; i++) {
                            weightedSum += (parseInt(data[i], 10) * weights[i - 1]);
                        }
                        var offset = (prefix == 'T' || prefix == 'G') ? 4 : 0;
                        var index = (weightedSum + offset) % 11;
                        var checksum = null;
                        if (type == 'nric' && (prefix == 'S' || prefix == 'T')) {
                            checksum = st[index];
                        } else if (type == 'fin' && (prefix = 'F' || prefix == 'G')) {
                            checksum = fg[index];
                        }
                        return suffix === checksum;
                    };

                } // end link.
            }; // end return.
        }
    ]);

    appModule.directive('dateAfter', [
        function () {
            return {
                require: "ngModel",
                restrict: "A",
                link: function (scope, elem, attrs, ctrl) {
                    ctrl.$validate();
                    elem.bind("keyup", function () {
                        ctrl.$validate();
                        checkError();
                    });

                    elem.bind("blur", function () {
                        checkError();
                    });

                    attrs.$observe('dateAfter', function () {
                        ctrl.$validate();
                        checkError();
                    });


                    scope.$watch(attrs['ngModel'], function (newValue) {
                        targetDate = attrs.dateAfter;
                        selectedDate = newValue;
                        checkError();
                    });

                    function validate(selectedDate, targetDate) {
                        if (ctrl.$isEmpty(selectedDate)) {
                            return true;
                        }
                        if (targetDate != null) {
                            if (selectedDate == null) {
                                return true;
                            } else {
                                if (new Date(selectedDate) < new Date(targetDate)) {
                                    return false
                                } else {
                                    return true;
                                }
                            }
                        } else {
                            return true;
                        }
                    };

                    function checkError() {
                        var flag = validate(ctrl.$modelValue, attrs['dateAfter']);
                        if (!flag && ctrl.$viewValue != null && ctrl.$viewValue != "" && typeof ctrl.$viewValue != 'undefined') {
                            ctrl.$valid = false;
                            ctrl.$invalid = true;
                        } else if (flag && (ctrl.$viewValue == null || ctrl.$viewValue == "" || typeof ctrl.$viewValue == 'undefined')) {
                            var parentNode = angular.element(elem).parents("div.form-group.form-md-line-input");
                            var validateionMessage = angular.element(parentNode[0].querySelector('.has-erreor.validationMessage'));
                            if (validateionMessage) {
                                validateionMessage.remove();
                            }
                            //ctrl.$error = { 'required': true };
                        } else {
                            ctrl.$valid = true;
                            ctrl.$invalid = false;
                        }
                    };

                } // end link.
            }; // end return.
        }
    ]);

    //New
    appModule.directive('beforeoron', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;

                    var minDate = null;
                    var dateFormat = attrs.dateformat ? attrs.dateformat : null;

                    scope.$watch(attrs.beforeoron, function (newValue, oldValue) {
                        minDate = Date.parse(newValue);
                        ////minDate = moment(newValue, "DD-MMM-YYYY").toDate();
                        //if (dateFormat != null) {
                        //    minDate = moment(newValue, dateFormat).toDate();
                        //} else {
                        //    date = Date.parse(newValue);
                        //}

                        minDate = isNaN(minDate) ? null : new Date(minDate);   //.setHours(0, 0, 0, 0));
                        //console.log(minDate);
                        ctrl.$validate();
                    });

                    ctrl.$validators.beforeoron = function (modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }

                        //var date = Date.parse(modelValue);
                        ////var date = moment(modelValue, "DD-MMM-YYYY").toDate();

                        var date;
                        //if (dateFormat != null) {
                        //    date = moment(modelValue, dateFormat).toDate();
                        //} else {
                        date = Date.parse(modelValue);
                        //}
                        //console.log(date);
                        date = isNaN(date) ? null : new Date(date);   //.setHours(0, 0, 0, 0));
                        //console.log(date);
                        if (date == null)
                            return true;

                        return (minDate == null) || (date.getTime() >= minDate.getTime());
                    };
                }
            };
        }
    ]);

    appModule.directive('checkregisterdoc', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                scope: {
                    personid: '=',
                    skip: '@',
                },
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;

                    ctrl.$asyncValidators.checkregisterdoc = function (modelValue, viewValue) {
                        return duplicateCheck(modelValue, scope.personid, scope.skip);
                    };

                    function duplicateCheck(modelValue, id, skipValue) {
                        var promise = new Promise(function (resolve, reject) {
                            if (ctrl.$isEmpty(modelValue)) {
                                resolve();
                            } else {
                                abp.services.app.person.isRegistrationDocumentAvailable({
                                    documentNumber: modelValue,
                                    personid: id,
                                    skip: skipValue
                                }).then(function (result) {
                                    if (result) {
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                });
                            }
                        });

                        return promise;
                    }
                }
            };
        }
    ]);

    appModule.directive('responsiveTabs', [
        '$window',
        function ($window) {
            return {
                restrict: "A",
                link: function (scope, elem, attrs, input) {
                    var userAgent = $window.navigator.userAgent;
                    var isTab = window.matchMedia('(max-width: 780px)').matches;
                    var isipadOriPhone = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android|IEMobile/i);

                    if (isipadOriPhone) {
                        elem.addClass('responsive-tabs');
                        elem.append($('<span class="glyphicon glyphicon-triangle-bottom"></span>'));
                        elem.append($('<span class="glyphicon glyphicon-triangle-top"></span>'));

                        elem.on('click', 'li.active > a, span.glyphicon', function () {
                            this.toggleClass('open');
                        }.bind(elem));

                        elem.on('click', 'li:not(.active) > a', function () {
                            elem.removeClass('open');
                        }.bind(elem));
                    }
                }
            };
        }
    ]);

    appModule.directive('checkOrientationChange', [
        '$window', '$state',
        function ($window, $state) {
            return {
                restrict: "A",
                link: function (scope, elem, attrs, input) {
                    var userAgent = $window.navigator.userAgent;
                    var isTab = window.matchMedia('(max-width: 780px)').matches;
                    var isipadOriPhone = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android|IEMobile/i);
                    var initialPortrait = $window.innerHeight > $window.innerWidth;
                    if (isipadOriPhone) {
                        $window.addEventListener('orientationchange', function () {
                            if ($window.innerHeight > $window.innerWidth) {
                                elem.css("padding-top", "0px");
                            } else {
                                if (!initialPortrait) {
                                    elem.css("padding-top", "55px");
                                } else {
                                    elem.css("padding-top", "0px");
                                }
                            }
                        });
                    }

                }
            };
        }
    ]);

    appModule.directive('iosDblclick', [
        function () {
            const DblClickInterval = 300; //milliseconds
            var firstClickTime;
            var waitingSecondClick = false;
            return {
                restrict: "A",
                link: function (scope, element, attrs) {
                    element.bind('click', function (e) {
                        if (!waitingSecondClick) {
                            firstClickTime = (new Date()).getTime();
                            waitingSecondClick = true;
                            setTimeout(function () {
                                waitingSecondClick = false;
                            }, DblClickInterval);
                        }
                        else {
                            waitingSecondClick = false;

                            var time = (new Date()).getTime();
                            if (time - firstClickTime < DblClickInterval) {
                                scope.$apply(attrs.iosDblclick);
                            }
                        }
                    });
                } // end link.
            }; // end return.
        }
    ]);

    appModule.directive('disableDateIcon', [
        function () {
            return {
                restrict: "A",
                scope: {
                    disableDateIcon: '@',
                },
                link: function (scope, elem, attrs, input) {

                    if (scope.disableDateIcon == true) {
                        elem.css({ 'pointer-events': 'none' });
                    }

                    elem.bind('click', function (e) {
                        if (scope.disableDateIcon == true) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                    });
                } // end link.
            }; // end return.
        }
    ]);
    appModule.directive('regDocNumValidation', [
        function () {
            return {
                require: "ngModel",
                restrict: "A",
                link: function (scope, elem, attrs, ctrl) {
                    ctrl.$validate();
                    elem.bind("keyup", function () {
                        ctrl.$validate();
                        checkError();
                    });

                    elem.bind("blur", function () {
                        checkError();
                    });

                    attrs.$observe('regDocNumValidation', function () {
                        ctrl.$validate();
                        checkError();
                    });


                    scope.$watch(attrs['ngModel'], function (newValue) {
                        selectedType = attrs.regDocNumValidation;
                        ducNumber = newValue;
                        checkError();
                    });

                    function validate(value, documentType) {
                        if (ctrl.$isEmpty(value)) {
                            return true;
                        }
                        var typesToCheck = { nricBlue: "NRIC Blue", nricPink: "NRIC Pink", fin: "Fin" };
                        var selectedRegDocumentType = documentType.trim();
                        if (selectedRegDocumentType != null) {
                            if (value == null) {
                                return true;
                            } else {
                                if (selectedRegDocumentType === typesToCheck.nricBlue || selectedRegDocumentType === typesToCheck.nricPink) {
                                    return isValidNric('nric', value);
                                } else if (selectedRegDocumentType == typesToCheck.fin) {
                                    return isValidNric('fin', value);
                                } else {
                                    return true;
                                }
                            }
                        } else {
                            return true;
                        }
                    };

                    function checkError() {
                        var flag = validate(ctrl.$viewValue, attrs['regDocNumValidation']);
                        if (!flag && ctrl.$viewValue != null && ctrl.$viewValue != "" && typeof ctrl.$viewValue != 'undefined') {
                            ctrl.$valid = false;
                            ctrl.$invalid = true;
                        } else if (flag && (ctrl.$viewValue == null || ctrl.$viewValue == "" || typeof ctrl.$viewValue == 'undefined')) {
                            var parentNode = angular.element(elem).parents("div.form-group.form-md-line-input");
                            var validateionMessage = angular.element(parentNode[0].querySelector('.has-erreor.validationMessage'));
                            if (validateionMessage) {
                                validateionMessage.remove();
                            }
                            //ctrl.$error = { 'required': true };
                        } else {
                            ctrl.$valid = true;
                            ctrl.$invalid = false;
                        }
                    };

                    //NRIC validator
                    function isValidNric(type, regdocumentno) {
                        if (regdocumentno == null || regdocumentno.length != 9) {
                            return false;
                        }
                        var st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
                        var fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
                        var weights = [2, 7, 6, 5, 4, 3, 2,];
                        var data = regdocumentno.toUpperCase();
                        var prefix = data[0];
                        var suffix = data[8];
                        var weightedSum = 0;
                        for (var i = 1; i <= 7; i++) {
                            weightedSum += (parseInt(data[i], 10) * weights[i - 1]);
                        }
                        var offset = (prefix == 'T' || prefix == 'G') ? 4 : 0;
                        var index = (weightedSum + offset) % 11;
                        var checksum = null;
                        if (type == 'nric' && (prefix == 'S' || prefix == 'T')) {
                            checksum = st[index];
                        } else if (type == 'fin' && (prefix = 'F' || prefix == 'G')) {
                            checksum = fg[index];
                        }
                        return suffix === checksum;
                    };

                } // end link.
            }; // end return.
        }
    ]);

    appModule.directive('checkregisterdoc', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                scope: {
                    personid: '=',
                    skip: '@',
                },
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;

                    ctrl.$asyncValidators.checkregisterdoc = function (modelValue, viewValue) {
                        return duplicateCheck(modelValue, scope.personid, scope.skip);
                    };

                    function duplicateCheck(modelValue, id, skipValue) {
                        var promise = new Promise(function (resolve, reject) {
                            if (ctrl.$isEmpty(modelValue)) {
                                resolve();
                            } else {
                                abp.services.app.person.isRegistrationDocumentAvailable({
                                    documentNumber: modelValue,
                                    personid: id,
                                    skip: skipValue
                                }).then(function (result) {
                                    if (result) {
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                });
                            }
                        });

                        return promise;
                    }
                }
            };
        }
    ]);


    appModule.directive('tabNavigationHash', ['$location', '$rootScope', '$timeout', '$anchorScroll', '$window',
        function ($location, $rootScope, $timeout, $anchorScroll, $window) {
            return {
                restrict: "A",
                link: function (scope, elem, attrs, input) {
                    $timeout(function () {
                        var userAgent = $window.navigator.userAgent;
                        $anchorScroll.yOffset = 75;
                        var hash = $location.hash();
                        var hashs = hash.split('#');
                        var isipadOriPhone = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android|IEMobile/i);
                        var hashArray = hashs[0].split('+');
                        if (hashArray.length > 0) {
                            var tabName = hashArray[0]
                            var prefix = "tab_";
                            if (hash) {
                                var tabElement = elem.find("[href='#" + tabName.replace(prefix, "") + "']");
                                tabElement.tab('show');
                                tabElement.parent().click();
                                tabElement.on('shown.bs.tab', function (event) {
                                    $timeout(function () {
                                        if (hashArray.length > 1) {
                                            //var topPos = 0;
                                            var key = hashArray[1];
                                            var keyPrefix = "key_"
                                            //document.getElementById(key.replace(keyPrefix, "")).scrollTop = topPos;

                                            //$location.hash(key.replace(keyPrefix, ""));
                                            $anchorScroll();
                                        }
                                    }, 1000);
                                });

                            }
                        }
                    }, 0);


                    scope.$watch('$viewContentLoaded', function () {

                        //var topPos = 0;
                        //var key = hashArray[1];
                        //var keyPrefix = "key_"
                        //document.getElementById(key.replace(keyPrefix, "")).scrollTop = topPos;

                        //$location.hash(key.replace(keyPrefix, ""));
                        //$anchorScroll();
                    });
                }
            };
        }
    ]);

    appModule.directive('showOnlyControll', [
        function () {
            return {
                require: "ngModel",
                restrict: "A",
                link: function (scope, elem, attrs, input) {//form-group form-md-line-input
                    var parent = elem.parent('div.form-md-line-input').first();
                    if (!parent) {
                        var parent = elem.parents("div.form-md-line-input").first();
                    }
                    parent.replaceWith(elem);
                }
            };
        }
    ]);

    appModule.directive('greaterorequal', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;

                    ctrl.$validators.greaterorequal = function (modelValue, viewValue) {
                        //debugger
                        var minValue = attrs.greaterorequal;

                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }

                        var actualValue = modelValue;

                        return (actualValue >= minValue);
                    };
                }
            };
        }
    ]);

    appModule.directive('currencyrestrictor', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attr, ctrl) {
                    // Matches characters that aren't `0-9`, `.`
                    if (!ctrl) return;
                    var pattern = /^\d{1,16}([,.]\d{1,2})?$/;

                    ctrl.$validators.currencyrestrictor = function (modelValue, viewValue) {
                        //debugger
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }

                        return pattern.test(modelValue);
                    };
                }
            };
        }
    ]);

    appModule.directive('conditionalRequired', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;

                    var validateItem = function () {
                        var isValid = true;
                        var isRequired = scope.$eval(attrs.conditionalRequired);
                        var value = scope.$eval(attrs.ngModel);
                        if (!isRequired) {
                            isValid = true;
                        } else {
                            if (typeof value == 'undefined' || value == null) {
                                isValid = false;
                            } else {
                                isValid = (value && value != scope.EmptyGuid);
                            }
                        }
                        ctrl.$setValidity(attrs.ngModel, isValid);
                    }

                    scope.$watch(attrs.ngModel, function (modelValue, viewValue) {
                        validateItem();
                        scope.$broadcast('check-conditional-required');
                    });

                    scope.$watch(attrs.conditionalRequired, function (modelValue, viewValue) {
                        validateItem();
                    });

                }
            };
        }
    ]);

    appModule.directive('uiCustomValidator', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    if (!ctrl) return;
                    scope.$watch(attrs.uiCustomValidator, function (modelValue, viewValue) {
                        var isValid = modelValue;
                        if (typeof isValid == "undefined") {
                            isValid = true;
                        }
                        ctrl.$setValidity(attrs.ngModel + "customValidation", isValid);
                        scope.$broadcast('check-custom-validation');
                    });

                }
            };
        }
    ]);


    ///* W.I.P */
    //appModule.directive('greaterthan', [
    //    function () {
    //        return {
    //            restrict: 'A',
    //            require: '?ngModel',
    //            link: function (scope, elm, attrs, ctrl) {
    //                if (!ctrl) return;

    //                ctrl.$validators.greaterthan = function (modelValue, viewValue) {
    //                    //debugger
    //                    console.log('Hi');
    //                    //var minValue = JSON.parse(attrs.greater);

    //                    //console.log(minValue);

    //                    //if (ctrl.$isEmpty(modelValue)) {
    //                    //    return true;
    //                    //}

    //                    //var actualValue = modelValue;
    //                    //console.log(actualValue);

    //                    //return (actualValue > minValue);
    //                    return false;
    //                };
    //            }
    //        };
    //    }
    //]);
})(angular);