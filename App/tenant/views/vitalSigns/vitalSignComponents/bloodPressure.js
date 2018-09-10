(function (abp) {
    appModule.component('bloodPressure', {
        bindings: {
            maintitle: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<',
            vitalSign: '<',
            parentScope: '<'
        },
        controller: [
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.allergy',
            function ($scope, $filter, $state, $uibModal, allergyService) {
                var ctrl = this;
                // lifecycle hooks
                ctrl.$onInit = function () {

                    ctrl.models = ctrl.parentScope.vitalSign;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.VitalSign.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.VitalSign.Edit'),
                    };
                };


                ctrl.$onChanges = function (changes) {
                    load();
                };

                // callbacks
                function load() {
                    ctrl.loading = true;
                };

                load();

            }
        ],

        templateUrl: '~/App/tenant/views/vitalSigns/vitalSignComponents/bloodPressure.cshtml'
    });
})(abp);



appModule.directive('bloodPressureValidations', [
    function () {
        return {
            restrict: "A",
            link: function (scope, elem, attrs, ctrl) {

                var systolicElm = elem.find("input[bp='systolic']");
                var diastolicElm = elem.find("input[bp='diastolic']");

                var systolicCtrl = systolicElm.data('$ngModelController');
                var diastolicCtrl = diastolicElm.data('$ngModelController');

                systolicElm.bind('keyup', function () {
                    bpRangeValidation(systolicCtrl, systolicElm, 'systolic');
                });


                diastolicElm.bind('keyup', function () {
                    bpRangeValidation(diastolicCtrl, diastolicElm, 'diastolic');
                });

                systolicElm.bind('mousewheel', function (event) {
                    bpRangeValidation(systolicCtrl, systolicElm, 'systolic');
                });

                diastolicElm.bind('mousewheel', function (event) {
                    bpRangeValidation(diastolicCtrl, diastolicElm, 'diastolic');
                });

                function bpRangeValidation(input, element, valueOf) {
                    if (!input.$valid) {
                        if (input.$error.max == true || input.$error.min == true) {
                            var errormessage = "Blood pressure should be between " + element.attr('min') + " and " + element.attr('max');
                            input.errorMessage = errormessage;
                            if (!angular.element(elem.context).hasClass('has-error')) {
                                angular.element(elem.context).addClass("has-error");
                            }
                            scope.$apply();
                        } else {
                            input.errorMessage = "";
                            scope.$apply();
                            if (systolicElm.val() != "" && diastolicElm.val() != "") {
                                checkValueValidation(element.val(), valueOf);
                            }
                        }
                    } else {
                        input.errorMessage = "";
                        scope.$apply();
                        if (systolicElm.val() != "" && diastolicElm.val() != "") {
                            checkValueValidation(systolicElm.val(), diastolicElm.val(), valueOf, input);
                        }
                    }
                }

                function checkValueValidation(sistValue, distValue, valueOf, input) {
                    var systolicFlag = "";
                    var dystolicflag = "";
                    systolicFlag = Number(diastolicElm.val()) * 100 < Number(sistValue) * 100;
                    if (!systolicFlag) {
                        systolicCtrl.$valid = false;
                        var errormessage = "Systolic value should be greater than Dastolic";
                        systolicCtrl.errorMessage = errormessage;
                        scope.$apply();
                    } else {
                        systolicCtrl.$valid = true;
                    }

                    dystolicflag = Number(systolicElm.val()) * 100 > Number(distValue) * 100;
                    if (!dystolicflag) {
                        diastolicCtrl.$valid = false;
                        var errormessage = "Systolic value should be greater than Dastolic";
                        diastolicCtrl.errorMessage = errormessage;
                        scope.$apply();
                    } else {
                        diastolicCtrl.$valid = true;
                    }

                    if (systolicCtrl.$valid == true && diastolicCtrl.$valid == true) {
                        input.errorMessage = "";
                        scope.$apply();
                        angular.element(elem.context).removeClass("has-error");
                        angular.element(systolicElm).removeClass("ng-touched");
                        angular.element(diastolicElm).removeClass("ng-touched");
                    } else {
                        if (!angular.element(elem.context).hasClass('has-error')) {
                            angular.element(elem.context).addClass("has-error");
                        }
                    }
                }

                scope.$on('focus-on-error-field', function () {
                    if (diastolicCtrl.$error.required == true) {
                        var errormessage = "You must provide a value for Diastolic";
                        diastolicCtrl.errorMessage = errormessage;
                        scope.$apply();
                    } else if (systolicCtrl.$error.required == true) {
                        var errormessage = "You must provide a value for Systolic"
                        systolicCtrl.errorMessage = errormessage;
                        scope.$apply();
                    }
                });


            } // end link.
        }; // end return.
    }
]);


