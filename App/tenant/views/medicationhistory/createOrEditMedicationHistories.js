(function () {
    appModule.controller('tenant.views.medicationhistory.createOrEditMedicationHistories', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'medicationhistoryId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.medicationHistory', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, personId, medicationhistoryId, referralId, template, appReferralService, medicationHistoryService, personService) {
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.medicationhistoryId = medicationhistoryId;
            vm.referralId = referralId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;

            vm.save = function (medicationhistory) {
                if (!vm.saving) {
                    vm.saving = true;
                    if (vm.medicationhistoryId == null || vm.medicationhistoryId == app.consts.EmptyGuid) {
                        if (personId && template == 'person') {
                            medicationhistory.PersonId = personId;
                            medicationHistoryService.createPersonMedicationHistory(medicationhistory).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        } else if (referralId && template == 'referral') {
                            medicationhistory.referralId = referralId;
                            medicationHistoryService.createReferralMedicationHistory(medicationhistory).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    } else {

                        if (personId && template == 'person') {
                            medicationHistoryService.updatePersonMedicationHistory(medicationhistory).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        } else if (referralId && template == 'referral') {
                            medicationHistoryService.updateReferralMedicationHistory(medicationhistory).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    }
                }
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-Medicationhistory');
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicationHistory.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicationHistory.Edit'),
                };
                vm.medicationhistory = { isActive: true };
                vm.disableSave = false;
                if (vm.medicationhistoryId != app.consts.EmptyGuid) {
                    vm.editMode = true;
                }
         
                if (personId && template == 'person' && vm.editMode ) {
                    medicationHistoryService.getPersonMedicationHistory(vm.medicationhistoryId).then(function (result) {
                        vm.medicationhistory = result.data;
                    });
                } else if (referralId && template == 'referral' && vm.editMode ) {
                    medicationHistoryService.getReferralMedicationHistory(vm.medicationhistoryId).then(function (result) {
                        vm.medicationhistory = result.data;
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