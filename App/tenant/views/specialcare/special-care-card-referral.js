(function (abp) {
    appModule.component('specialCareCardReferral', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            isPatient: '<',
            isReferral: '<'
        },
        controller: [
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.specialCare',
            function ($scope, $filter, $state, $uibModal, specialCareService) {
                var ctrl = this;
                ctrl.specialcares = []; 
                ctrl.resultCount = 0;
                // init
                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Edit'),
                        activate: abp.auth.hasPermission('Pages.Tenant.SpecialCare.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Delete'),
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        load();
                    }
                };
                
                // event handlers
                ctrl.create = function () {
                    if (ctrl.referralId && ctrl.template == 'referral') {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template);
                    }
                };

                ctrl.editSpecialCare = function (specialcare) {
                    if (ctrl.permissions.edit || ctrl.permissions.activate && ctrl.isReferral) {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, specialcare.id, ctrl.template);
                    }
                };
                
                // call backs
                function load() {
                    ctrl.loading = true;
                    if (ctrl.referralId && ctrl.template == 'referral') {
                        specialCareService.getReferralSpecialCares(ctrl.referralId).then(function (result) {
                            ctrl.resultCount = result.data.totalCount;
                            ctrl.specialcares = result.data;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    }
                };
                load();

                $scope.$on('Created-Updated-SpecialCare', function () {
                    load();
                });

                // create edit popup model
                function openModelForCreateAndEdit(prsnId, refId, specialcareId, temp) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/specialcare/addReferralSpecialCare.cshtml',
                        controller: 'tenant.views.specialcare.addReferralSpecialCare as vm',
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            specialcareId: function () {
                                return specialcareId;
                            },
                            referralId: function () {
                                return refId;
                            },
                            template: function () {
                                return temp;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        load();
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/specialcare/special-care-card-referral.cshtml'
    });
})(abp);