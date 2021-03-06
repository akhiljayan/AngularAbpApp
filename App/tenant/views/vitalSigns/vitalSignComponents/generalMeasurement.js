﻿(function (abp) {
    appModule.component('generalMeasurement', {
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

                //$scope.$on('Created-Updated-Allergy', function () {
                //    load();
                //});

            }
        ],

        templateUrl: '~/App/tenant/views/vitalSigns/vitalSignComponents/generalMeasurement.cshtml'
    });
})(abp);