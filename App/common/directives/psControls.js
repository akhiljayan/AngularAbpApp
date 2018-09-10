(function ($) {
    /*
    Transition control for radio button.
    To be used until it is added to ChameleonForms API.
    */
    appModule.directive('psRadio', [
        '$compile',
        function ($compile) {
            return {
                link: function (scope, element, attrs, formCtrl) {
                    var ngModel = attrs['ngModel'];
                    var labelText = attrs['label'];
                    var ngChange = attrs['ngChange'];
                    var ngDisabled = attrs['ngDisabled'];
                    var formGroup = $('<div>', { 'class': 'form-group form-md-line-input' });
                    var formControl = $('<div>', { 'class': 'form-control btn-group custom-radio-button', 'style': 'border: none;' });
                    var options = [{
                        value: true,
                        display: 'Yes'
                    }, {
                        value: false,
                        display: 'No'
                    }];

                    options.forEach(function (option) {
                        var label = $('<label>', {
                            'class': 'btn btn-default',
                            'ng-model': ngModel,
                            'ng-change': ngChange,
                            'uib-btn-radio': option.value,
                            'uncheckable': '',
                            'ng-disabled' : ngDisabled,
                            'width': '136px',
                        });
                  
                        label.text(option.display);
                        formControl.append(label);
                    });

                    var label = $('<label>', { 'class': 'control-label' });
                   
                    var lbltxt = labelText || '';

                    if (attrs['required'] && labelText !='')
                          lbltxt += '<span class="businessRequired"> * </span>';

                    label.html(lbltxt);

                    formGroup.append(formControl);
                    formGroup.append(label);

                    element.replaceWith($compile(formGroup)(scope));


                    scope.$on('focus-on-error-field', function () {
                        if (attrs['required']) {
                            if (element[0].validity.valid) {
                                removeError();
                            } else {
                                slowError();
                            }
                        }
                    });

                    scope.$watch(attrs.ngModel, function (v) {
                        if (attrs['required']) {
                            if (element[0].validity.valid) {
                                removeError();
                            }
                        }
                    });


                    function slowError() {
                        var errorHtml = '<p class="help-block radio-button-required-message" style="top:55px;">' + attrs.requiredMessage + '</p>';
                        formGroup[0].className += " has-error";
                        formGroup[0].insertAdjacentHTML('beforeend', errorHtml);
                    }


                    function removeError() {
                        if (formGroup[0].classList.contains("has-error")) {
                            formGroup[0].classList.remove("has-error");
                            var checkPblock = formGroup[0].querySelector(".radio-button-required-message");
                            formGroup[0].removeChild(checkPblock);
                        }
                    }
                }
            }
        }
    ]);


    appModule.directive('psRadioRequired', [
        '$compile',
        function ($compile) {
            return {
                link: function (scope, element, attrs, formCtrl) {
                    var ngModel = attrs['ngModel'];
                    var labelText = attrs['label'];
                    var ngChange = attrs['ngChange'];
                    var ngDisabled = attrs['ngDisabled'];
                    //var formGroup = $('<div>', { 'class': 'ps-radio-control' });
                    var parent = element.parent();
                    var formGroup = parent.parent();

                    scope.$on('focus-on-error-field', function () {
                        if (attrs['required']) {
                            if (element[0].validity.valid) {
                                removeError();
                            } else {
                                slowError();
                            }
                        }
                    });

                    scope.$watch(attrs.ngModel, function (v) {
                        if (attrs['required']) {
                            if (element[0].validity.valid) {
                                removeError();
                            }
                        }
                    });


                    function slowError() {
                        var errorHtml = '<p class="help-block radio-button-required-message" style="top:55px;">' + attrs.requiredMessage + '</p>';
                        formGroup[0].className += " has-error";
                        formGroup[0].insertAdjacentHTML('beforeend', errorHtml);
                    }


                    function removeError() {
                        if (formGroup[0].classList.contains("has-error")) {
                            formGroup[0].classList.remove("has-error");
                            var checkPblock = formGroup[0].querySelector(".radio-button-required-message");
                            formGroup[0].removeChild(checkPblock);
                        }
                    }
                }
            }
        }
    ]);



















})($);