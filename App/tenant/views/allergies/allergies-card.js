(function (abp) {
    appModule.component('allergiesCard', {
        bindings: {
            maintitle: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            admissionId: '<',
            isPatient: '<',
            isReferral: '<',
            lockCard: '<'
        },
        controller: [
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.allergy',
            function ($scope, $filter, $state, $uibModal, allergyService) {
                var ctrl = this;
                ctrl.filter = "active";
                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.models = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Allergies.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Allergies.Edit') && !ctrl.lockCard,
                        activate: abp.auth.hasPermission('Pages.Tenant.Allergies.Activate'),
                        deactivate: abp.auth.hasPermission('Pages.Tenant.Allergies.Deactivate'),
                        view: abp.auth.hasPermission('Pages.Tenant.Allergies.View'),
                    };
                };


                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        load();
                    }
                };

                // event handlers
                ctrl.create = function () {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template);
                };

                ctrl.editAllergy = function (allergy) {                    
                    if ((ctrl.permissions.edit || ctrl.permissions.view || (ctrl.isPatient || ctrl.isReferral)) && !ctrl.lockCard) {                        
                            openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, allergy.id, ctrl.template);
                    }
                };

                // callbacks
                function load() {                    
                    ctrl.loading = true;
                    if (ctrl.personId && ctrl.template == 'person') {
                        getActivePersonAllergies(ctrl.personId);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getActiveReferralAllergies(ctrl.referralId);
                    }
                };

                ctrl.getAllActive = function () {
                    if (ctrl.personId && ctrl.template == 'person') {
                        getActivePersonAllergies(ctrl.personId);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getActiveReferralAllergies(ctrl.referralId);
                    }
                };

                ctrl.getAllInactive = function () {
                    if (ctrl.personId && ctrl.template == 'person') {
                        getInactivePersonAllergies(ctrl.personId);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getInactiveReferralAllergies(ctrl.referralId);
                    }
                }


                function getActivePersonAllergies(personId) {
                    ctrl.filter = "active";
                    allergyService.getPersonAllergies(personId).then(function (result) {
                        mapToDisplayObjects(result);
                    });
                }

                function getInactivePersonAllergies(personId) {
                    ctrl.filter = "inactive";
                    allergyService.getPersonsInActiveAllergies(personId).then(function (result) {
                        mapToDisplayObjects(result);
                    });
                }

                function getActiveReferralAllergies(referralId) {
                    ctrl.filter = "active";
                    allergyService.getReferralAllergies(referralId).then(function (result) {
                        mapToDisplayObjects(result);
                    });
                }

                function getInactiveReferralAllergies(referralId) {
                    ctrl.filter = "inactive";
                    allergyService.getReferralInActiveAllergies(referralId).then(function (result) {
                        mapToDisplayObjects(result);
                    });
                }

                function mapToDisplayObjects(result) {
                    ctrl.models = result.data;
                    ctrl.drugAllergies = $filter('filter')(ctrl.models, function (m) { return m.category === 1 && m.isADR === false; });
                    ctrl.adrAllergies = $filter('filter')(ctrl.models, function (m) { return m.category === 1 && m.isADR === true; });
                    ctrl.nondrugAllergies = $filter('filter')(ctrl.models, function (m) { return m.category === 2 && m.isADR === false; });
                    ctrl.loading = false;
                }

                load();

                $scope.$on('Created-Updated-Allergy', function () {
                    load();
                });

                //create edit
                function openModelForCreateAndEdit(prsnId, refId, alrgyId, temp) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/allergies/createOrEditAllergies.cshtml',
                        controller: 'tenant.views.allergies.createOrEditAllergies as vm',
                        backdrop: 'static',
                        scope: $scope,
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            allergyId: function () {
                                return alrgyId;
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
                }
            }
        ],

        templateUrl: '~/App/tenant/views/allergies/allergies-card.cshtml'
    });
})(abp);