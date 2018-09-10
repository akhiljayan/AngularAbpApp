(function () {
    appModule.controller('tenant.views.medicalalert.createOrEditMedicalAlert', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'medicalalertId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.medicalAlert', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, personId, medicalalertId, referralId, template, appReferralService, medicalAlertService, personService) {
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.medicalalertId = medicalalertId;
            vm.referralId = referralId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;

            vm.save = function (medicalalert) {
                if (!vm.saving) {
                    vm.saving = true;
                    if (vm.medicalalertId == null || vm.medicalalertId == app.consts.EmptyGuid) {
                        if (personId && template == 'person') {
                            medicalalert.PersonId = personId;
                            medicalAlertService.createPersonMedicalAlert(medicalalert).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    } else {
                        medicalAlertService.updatePersonMedicalAlert(medicalalert).then(function (result) {
                            emitAfterSave();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }                
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-MedicalAlert');
                $uibModalInstance.close();
            };

            vm.medicalAlertChange = function (text) {
                if (text == 'Others') {
                    vm.others = true;
                } else {
                    vm.others = false;
                    vm.medicalalert.others = '';
                }

                if (text == 'Infectious Disease') {
                    vm.infectiousDisease = true;
                } else {
                    vm.infectiousDisease = false;
                    vm.medicalalert.infectiousDisease = '';
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Edit'),
                };
                vm.medicalalert = { isActive: true };
                vm.disableSave = false;
                if (vm.medicalalertId != app.consts.EmptyGuid) {
                    vm.editMode = true;
                }
                if (personId && template == 'person' && vm.editMode ) {
                    medicalAlertService.getPersonMedicalAlert(vm.medicalalertId).then(function (result) {
                        vm.medicalalert = result.data;
                        vm.others = false;
                        vm.infectiousDisease = false;
                        if (vm.medicalalert.infectiousDisease != null && vm.medicalalert.infectiousDisease != '') {
                            vm.infectiousDisease = true;
                        }
                        if (vm.medicalalert.others != null && vm.medicalalert.others != '') {
                            vm.others = true;
                        }
                    });
                }
            };

            init();

            if (referralId != null) {
                appReferralService.get(referralId).then(function (result) {
                    vm.referral = result.data;
                    vm.person = vm.referral.person;
                });
            }
            else {
                personService.getPerson(personId).then(function (result) {
                    vm.person = result.data;
                });
            }
        }]);
})();