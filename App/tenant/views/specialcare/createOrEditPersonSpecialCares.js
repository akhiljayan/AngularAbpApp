(function () {
    appModule.controller('tenant.views.specialcare.createOrEditPersonSpecialCares', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal','commonFormFunction', '$uibModalInstance', 'personId', 'specialcareId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.specialCare', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, commonFormFunction, $uibModalInstance, personId, specialcareId, referralId, template, appReferralService, specialCareService, personService) {
            
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.specialcareId = specialcareId;
            vm.referralId = referralId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;
            vm.isOthersSelected = false;
            vm.isFrequencySelected = false;
            vm.selectedFrequencyCode = "";
            vm.others = false;
            // event handlers
            vm.save = function (specialcare) {
                commonFormFunction.setFormSubmitted(vm.specialCareForm);

                if (!vm.specialCareForm.$valid) {
                    return;
                }
                commonFormFunction.setPristine();

                if (!vm.saving) {
                    vm.saving = true;
                    if (vm.specialcareId == null || vm.specialcareId == app.consts.EmptyGuid) {
                        if (personId && template == 'person') {
                            specialcare.PersonId = personId;
                            specialCareService.createPersonSpecialCare(specialcare).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    } else {
                        specialCareService.updatePersonSpecialCare(specialcare).then(function (result) {
                            emitAfterSave();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }                
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.changeSpecialCare = function ($select) {
                vm.others = false;
                vm.specialcare.otherSpecialCare = '';
                if ($select.description == "Others") {
                    vm.others = true;
                }
            }

            vm.onChangeFrequencyOrLastChangeDate = function (selectedFrequency) {
                var NextChangeDate = null; var DateChangable = false; var isAsRequiredSelected = false;
                var FrequencyDateCount = 0;
                if (vm.specialcare.lastChangeDate != null) {
                    NextChangeDate = new Date(vm.specialcare.lastChangeDate);
                    DateChangable = true;
                } else {
                    DateChangable = false;
                }                
                //var today = moment().format('D MMM, YYYY');

                if (selectedFrequency != null) {
                    vm.isFrequencySelected = true;
                    vm.selectedFrequencyCode = selectedFrequency.code;                         
                } else {
                    vm.isFrequencySelected = false;
                }

                switch (vm.selectedFrequencyCode) {
                    case 'Weekly':                        
                        vm.isOthersSelected = false;
                        vm.specialcare.otherFrequency = null;
                        FrequencyDateCount = 7;                                                
                        break;
                    case 'Fortnightly':                        
                        vm.isOthersSelected = false;
                        vm.specialcare.otherFrequency = null;
                        FrequencyDateCount = 14;
                        break;
                    case 'Monthly':                        
                        vm.isOthersSelected = false;
                        vm.specialcare.otherFrequency = null;
                        FrequencyDateCount = 28;
                        break;
                    case 'Quarterly':                        
                        vm.isOthersSelected = false;
                        vm.specialcare.otherFrequency = null;
                        FrequencyDateCount = 84;
                        break;
                    case 'OTHFrequency':
                        vm.isOthersSelected = true;
                        break;
                    default:
                        vm.isOthersSelected = false;
                        vm.specialcare.otherFrequency = null;
                        //vm.specialcare.nextChangeDate = moment();
                        break;
                }

                if (NextChangeDate != null && DateChangable && FrequencyDateCount != 0) {
                    NextChangeDate.setDate(NextChangeDate.getDate() + FrequencyDateCount);
                    vm.specialcare.nextChangeDate = NextChangeDate;
                } else if (FrequencyDateCount == 0) {
                    vm.specialcare.nextChangeDate = null;
                }
            };

            // call backs
            function emitAfterSave() {
                $scope.$emit('Created-Updated-SpecialCare');
                $uibModalInstance.close();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Edit'),
                };
                vm.specialcare = { isActive: true };
                vm.disableSave = false;
                if (vm.specialcareId != app.consts.EmptyGuid) {
                    vm.editMode = true;
                }
                if (personId && template == 'person' && vm.editMode ) {
                    specialCareService.getPersonSpecialCare(vm.specialcareId).then(function (result) {
                        vm.specialcare = result.data;
                        if (vm.specialcare.specialCareItem.description == 'Others') {
                            vm.others = true;
                        }
                       
                    });
                }
            };

            // init
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
        }
    ]);
})();