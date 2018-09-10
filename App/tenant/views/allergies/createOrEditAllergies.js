(function () {
    appModule.controller('tenant.views.allergies.createOrEditAllergies', [
        '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'personId', 'allergyId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.allergy', 'abp.services.app.genericDrug', 'abp.services.app.person',
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, masterLookup, personId, allergyId, referralId, template, appReferralService, allergyService, drugService, personService) {
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.allergyId = allergyId;
            vm.referralId = referralId;
            vm.editMode = false;

            
            vm.save = function (allergy) {
                
                if (!vm.saving) {

                    vm.saving = true;

                    if (vm.allergyId == null || vm.allergyId == app.consts.EmptyGuid) {
                        if (personId && template == 'person') {
                            allergyService.createPersonAllergy(allergy).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        } else if (referralId && template == 'referral') {
                            allergyService.createReferralAllergy(allergy).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    } else {
                        if (personId && template == 'person') {
                            allergyService.updatePersonAllery(allergy).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        } else if (referralId && template == 'referral') {
                            allergyService.updateReferralAllery(allergy).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    }
                }
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-Allergy');
                $uibModalInstance.close();
            }

            vm.disableOthersDrug = true;
            vm.setNameForDrug = function (allergyname) {
                vm.allergy.name = allergyname;
                if (allergyname == 'Others') {
                    vm.disableOthersDrug = false;
                } else {
                    vm.disableOthersDrug = true;                        
                }
            }

            vm.catagoryChanged = function (category) {
                vm.allergy.name = '';
                if (vm.allergy.genericDrug) {
                    vm.allergy.genericDrug.id = undefined;
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Allergies.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Allergies.Edit')
                };

                vm.disableSave = false;

                vm.allergyCategories = app.consts.allergiesCategories.values;
                if (personId && template == 'person') {
                    allergyService.getPersonAllergy(vm.allergyId).then(function (result) {
                        mapToVmObjects(result);
                    });
                } else if (referralId && template == 'referral') {
                    allergyService.getReferralAllergy(vm.allergyId).then(function (result) {
                        mapToVmObjects(result);
                    });
                }

                if (vm.allergyId != app.consts.EmptyGuid) {
                    vm.editMode = true;
                }
            }

            function mapToVmObjects(result) {
                vm.allergy = result.data;
                vm.setNameForDrug(vm.allergy.name);
                vm.allergy.state = Boolean(vm.allergy.state);
                vm.setNameForDrug(vm.allergy.name);
                if (personId && template == 'person') {
                    vm.allergy.person = { "id": personId };
                } else if (referralId && template == 'referral') {
                    vm.allergy.referral = { "id": referralId };
                }
 
                if (!vm.allergy.category) {
                    vm.allergy.category = null;
                }
            }

            init();

            //lookups
            vm.drugs = [];
            drugService.getAll().then(function (result) {
                vm.drugs = result.data;
            });

            if (personId != null) {
                personService.getPerson(personId).then(function (result) {
                    vm.person = result.data;
                });
            } 

            if (referralId != null) {
                appReferralService.get(referralId).then(function (result) {
                    vm.referral = result.data;
                    vm.person = vm.referral.person;
                });
            }
        }
    ]);
})();