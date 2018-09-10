appModule.directive('uiSelectValidation', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, element, attrs, formCtrl) {
            var inputEl = element[0];
            var inputNgEl = angular.element(inputEl);
            var blurred = false;
            var requiredMessage = attrs.requiredMessage;

            function resetError() {
                var parentEl = element.parent('div.form-md-line-input').first();
                $timeout(function () {
                    parentEl.removeClass('has-error');
                }, 0, false);
            }

            function removeError() {
                var parentEl = element.parent('div.form-md-line-input').first();
                var remHtml = parentEl[0].querySelector(".help-block");
                var elementName = element.attr('name');
                var elementCntrl = formCtrl[elementName];
                parentEl.toggleClass('has-error', elementCntrl.$invalid);

                if (remHtml != null) {
                    parentEl[0].removeChild(remHtml);
                }

                if (element.attr("theme") == 'selectize') {
                    var inputContent = element[0].querySelector(".selectize-input");
                } else if (element.attr("theme") == 'select2') {
                    var inputContent = element[0].querySelector(".select2-choice");
                }

                var labelElm = parentEl[0].querySelector("label");
                inputContent.classList.remove("ui-select-has-error");
                labelElm.classList.remove("ui-select-has-error-label");


            }


            if (typeof attrs.requiredMessage != 'undefined') {
                var parentEl = element.parent('div.form-md-line-input').first();
                var labelElm = parentEl[0].querySelector("label");
                var checkPblock = labelElm.querySelector(".businessRequired");
                if (checkPblock == null || checkPblock == '') {
                    var starhtml = '<span class="businessRequired"> * </span>';
                    labelElm.insertAdjacentHTML('beforeend', starhtml);
                }
            }

            if (typeof attrs.conditionalRequired != 'undefined') {
                scope.$watch(attrs.conditionalRequired, function () {
                    var isRequired = scope.$eval(attrs.conditionalRequired);
                    var parentEl = element.parent('div.form-md-line-input').first();
                    var labelElm = parentEl[0].querySelector("label");
                    var checkPblock = labelElm.querySelector(".businessRequired");
                    if (!isRequired) {
                        if (checkPblock != null) {
                            labelElm.removeChild(checkPblock);
                            removeError();
                        }
                    } else {
                        if (checkPblock == null || checkPblock == '') {
                            var starhtml = '<span class="businessRequired"> * </span>';
                            labelElm.insertAdjacentHTML('beforeend', starhtml);
                        }
                    }
                });
            }

            scope.$on('check-conditional-required', function () {
                var parentEl = element.parent('div.form-md-line-input').first();
                var remHtml = parentEl[0].querySelector(".help-block");
                if (remHtml != null) {
                    parentEl[0].removeChild(remHtml);
                }
                var elementName = element.attr('name');
                var elementCntrl = formCtrl[elementName];
                parentEl.toggleClass('has-error', elementCntrl.$invalid);
                var inputContent;
                if (element.attr("theme") == 'selectize') {
                    inputContent = element[0].querySelector(".selectize-input");
                } else {
                    inputContent = element[0].querySelector(".select2-choice");
                }
                try {
                    elementCntrl.$invalid;
                } catch (e) {
                    console.log("Please provide name attribute for " + attrs.ngModel + " to ui-select controll!!", e);
                    throw e;
                }
                var labelElm = parentEl[0].querySelector("label");
                if (!elementCntrl.$invalid) {
                    inputContent.classList.remove("ui-select-has-error");
                    labelElm.classList.remove("ui-select-has-error-label");
                }
            });
            scope.$on('check-custom-validation', function () {

                var invalidName = attrs.invalidMessage;

                var parentEl = element.parent('div.form-md-line-input').first();
                var formnode = parentEl[0];
                while (formnode.nodeName.toLowerCase() != "form" && formnode.parentNode) {
                    formnode = formnode.parentNode;
                }
                var formName = formnode.getAttribute("name");
                var elementName = element.attr('name');
                var errorString = formName + '.' + elementName + '.' + '$error.' + attrs.ngModel + "customValidation";

                if (typeof formCtrl.$error[attrs.ngModel + "customValidation"] == "undefined") {
                    removeError();
                    return;
                }

                var elementCntrl = formCtrl.$error[attrs.ngModel + "customValidation"][0];

                parentEl.toggleClass('has-error', elementCntrl.$invalid);

                if (elementCntrl.$invalid) {
                    var checkPblock = parentEl[0].querySelector(".help-block");

                    if (checkPblock == null || checkPblock == '') {
                        var errorhtml = '<p class="help-block ui_select_required_error" style="display:inline-block" ng-if="' + errorString + '">' + invalidName + '</p>';
                        parentEl[0].insertAdjacentHTML('beforeend', errorhtml);
                    }
                }

                var labelElm = parentEl[0].querySelector("label");
                if (element.attr("theme") == 'selectize') {
                    var inputContent = element[0].querySelector(".selectize-input");
                } else if (element.attr("theme") == 'select2') {
                    var inputContent = element[0].querySelector(".select2-choice");
                }
                if (elementCntrl.$invalid) {
                    inputContent.className += " ui-select-has-error";
                    labelElm.className += " ui-select-has-error-label";
                } else {
                    inputContent.classList.remove("ui-select-has-error");
                    labelElm.classList.remove("ui-select-has-error-label");
                }
            });



            inputNgEl.bind('blur', function () {
                blurred = true;
                var parentEl = element.parent('div.form-md-line-input').first();
                parentEl.toggleClass('has-error', formCtrl.$invalid);
            });

            scope.$watch(attrs.ngModel, function () {

                var parentEl = element.parent('div.form-md-line-input').first();
                var remHtml = parentEl[0].querySelector(".help-block");
                if (remHtml != null) {
                    parentEl[0].removeChild(remHtml);
                }
                var elementName = element.attr('name');
                var elementCntrl = formCtrl[elementName];
                parentEl.toggleClass('has-error', elementCntrl.$invalid);
                var inputContent;
                if (element.attr("theme") == 'selectize') {
                    inputContent = element[0].querySelector(".selectize-input");
                } else {
                    inputContent = element[0].querySelector(".select2-choice");
                }
                try {
                    elementCntrl.$invalid;
                } catch (e) {
                    console.log("Please provide name attribute for " + attrs.ngModel + " to ui-select controll!!", e);
                    throw e;
                }
                var labelElm = parentEl[0].querySelector("label");
                if (!elementCntrl.$invalid) {
                    inputContent.classList.remove("ui-select-has-error");
                    labelElm.classList.remove("ui-select-has-error-label");
                }

            });

            scope.$watch(function () {
                return formCtrl.$invalid;
            }, function (invalid) {
                if (!blurred && invalid) { return }
                var parentEl = element.parent('div.form-md-line-input').first();
                parentEl.toggleClass('has-error', invalid);
            });

            //scope.$on('show-errors-check-validity', function () {
            //    var parentEl = element.parent('div.form-md-line-input').first();
            //    parentEl.toggleClass('has-error', formCtrl.$invalid);
            //});

            scope.$on('check-select-ui-required', function () {
                if (typeof attrs.conditionalRequired != 'undefined') {
                    var isRequired = scope.$eval(attrs.conditionalRequired);
                    if (!isRequired) {
                        return;
                    }
                }

                if (typeof requiredMessage == 'undefined' || requiredMessage == null || requiredMessage == '') {
                    var displayname = attrs.displayname;
                    if (typeof displayname == 'undefined' || displayname == null || displayname == '') {
                        displayname = "this field";
                    }
                    requiredMessage = 'You must select a value for ' + displayname + ".";
                }
                var parentEl = element.parent('div.form-md-line-input').first();
                var formnode = parentEl[0];
                while (formnode.nodeName.toLowerCase() != "form" && formnode.parentNode) {
                    formnode = formnode.parentNode;
                }
                var formName = formnode.getAttribute("name");
                var elementName = element.attr('name');
                var errorString = formName + '.' + elementName + '.' + '$error.required';
                var elementCntrl = formCtrl[elementName];
                parentEl.toggleClass('has-error', elementCntrl.$invalid);

                if (elementCntrl.$invalid) {
                    var checkPblock = parentEl[0].querySelector(".help-block");

                    if (checkPblock == null || checkPblock == '') {
                        var errorhtml = '<p class="help-block ui_select_required_error" ng-if="' + errorString + '">' + requiredMessage + '</p>';
                        parentEl[0].insertAdjacentHTML('beforeend', errorhtml);
                    }
                }

                var labelElm = parentEl[0].querySelector("label");
                if (element.attr("theme") == 'selectize') {
                    var inputContent = element[0].querySelector(".selectize-input");
                } else if (element.attr("theme") == 'select2') {
                    var inputContent = element[0].querySelector(".select2-choice");
                }
                if (elementCntrl.$invalid) {
                    inputContent.className += " ui-select-has-error";
                    labelElm.className += " ui-select-has-error-label";
                } else {
                    inputContent.classList.remove("ui-select-has-error");
                    labelElm.classList.remove("ui-select-has-error-label");
                }

            });

            scope.$on('show-errors-reset', function () {
                resetError();
            });


            scope.$on('show-errors-remove', function () {
                removeError();
            });

        }
    }

}]);