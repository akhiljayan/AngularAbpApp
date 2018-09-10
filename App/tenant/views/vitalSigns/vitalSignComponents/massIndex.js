(function (abp) {
    appModule.component('massIndex', {
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

                ctrl.CalculateBMI = function (weight, height) {
                    var bmi;
                    if (weight && height) {
                        if (weight && height) {
                            bmi = $.roundDecimal((weight / ((height * height) / 10000)), 2);
                        } else {
                            bmi = "";
                        }
                        ctrl.vitalSign.bmi.value =  bmi;
                    } else {
                        ctrl.vitalSign.bmi.value = "";
                    }
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

        templateUrl: '~/App/tenant/views/vitalSigns/vitalSignComponents/massIndex.cshtml'
    });
})(abp);