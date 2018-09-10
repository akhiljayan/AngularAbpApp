(function () {
    appModule.controller('tenant.views.medicalhistory.createOrEditMedicalHistories', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'medicalhistoryId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.medicalHistory', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, personId, medicalhistoryId, referralId, template, appReferralService, medicalHistoryService, personService) {
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.medicalhistoryId = medicalhistoryId;
            vm.referralId = referralId;
            vm.editMode = false;

            vm.save = function (medicalhistory) {
                if (!vm.saving) {
                    vm.saving = true;
                    if (vm.medicalhistoryId == null || vm.medicalhistoryId == app.consts.EmptyGuid) {
                        if (personId && template == 'person') {
                            medicalhistory.PersonId = personId;
                            medicalHistoryService.createPersonMedicalHistory(medicalhistory).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving  = false;
                            });
                        } else if (referralId && template == 'referral') {
                            medicalhistory.referralId = referralId;
                            medicalHistoryService.createReferralMedicalHistory(medicalhistory).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    } else {
                        medicalHistoryService.update(medicalhistory).then(function (result) {
                            emitAfterSave();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-Medicalhistory');
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.Edit'),
                };

                vm.disableSave = false;
                if (vm.medicalhistoryId != app.consts.EmptyGuid) {
                    vm.editMode = true;
                }
                medicalHistoryService.getMedicalHistory(vm.medicalhistoryId).then(function (result) {
                    vm.medicalhistory = result.data;
                });

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