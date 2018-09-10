(function () {
    appModule.controller('tenant.views.diagnosis.createOrEditDiagnosis', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'personId', 'diagnosisId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.diagnosis', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, masterLookup, personId, diagnosisId, referralId, template, appReferralService, diagnosisService, personService) {

            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.diagnosisId = diagnosisId;
            vm.referralId = referralId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;
            vm.diagnosisTypeList = app.consts.diagnosisType.values;
            vm.diagnosisCodeTypeList = app.consts.diagnosisCodeType.values;
            vm.diagnosisStateList = app.consts.diagnosisState.values;

            vm.disableOthersDiagnosis = true;
            vm.isOtherDiagnosisSelected = false;

            vm.save = function (diagnosis) {
                if (!vm.saving) {
                    vm.saving = true;

                    if (diagnosis.diagnosisCodeType == 3 && (diagnosis.otherDiagnosis == 'undefined' || diagnosis.otherDiagnosis == null)) {
                        abp.message.info("You must provide a value for Others Diagnosis");

                    } else if (diagnosis.diagnosisCodeType != 3 && (diagnosis.diagnosisCodeId == 'undefined' || diagnosis.diagnosisCodeId == null)) {
                        abp.message.info("You must provide a value for Diagnosis Code");
                    } else {
                        if (vm.diagnosisId == null || vm.diagnosisId == app.consts.EmptyGuid) {
                            if (personId && template == 'person') {
                                diagnosis.PersonId = personId;
                                diagnosisService.createPersonDiagnosis(diagnosis).then(function (result) {
                                    emitAfterSave();
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            } else if (referralId && template == 'referral') {
                                diagnosis.ReferralId = referralId;
                                diagnosisService.createReferralDiagnosis(diagnosis).then(function (result) {
                                    emitAfterSave();
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            }
                        } else {

                            if (personId && template == 'person') {
                                diagnosisService.updatePersonDiagnosis(diagnosis).then(function (result) {
                                    emitAfterSave();
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            } else if (referralId && template == 'referral') {
                                diagnosisService.updateReferralDiagnosis(diagnosis).then(function (result) {
                                    emitAfterSave();
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            }
                        }
                    }
                }                                
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-Diagnosis');
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Diagnosis.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Diagnosis.Edit'),
                };
                vm.disableSave = false;                

                if (vm.diagnosisId != app.consts.EmptyGuid) {                    
                    vm.editMode = true;                    
                } else {
                    /* Create Mode */                    
                    /*	Set default value as SNOMED- CT */
                    vm.diagnosis = { isActive: true, diagnosisCodeType: 2 };
                    vm.bindDiagnosisCodesLookup(vm.diagnosis.diagnosisCodeType);
                }

                if (personId && template == 'person' && vm.editMode) {
                    /* Person Edit Mode */
                    diagnosisService.getPersonDiagnosis(vm.diagnosisId).then(function (result) {                        
                        vm.diagnosis = result.data;
                        
                        if (vm.diagnosis.diagnosisCodeType == 3) {

                            vm.disableOthersDiagnosis = false;
                            vm.isOtherDiagnosisSelected = true;
                            vm.disableDiagnosisCode = true;
                        } else {
                            vm.disableOthersDiagnosis = true;
                            vm.isOtherDiagnosisSelected = false;

                            vm.disableDiagnosisCode = false;
                            vm.bindDiagnosisCodesLookup(vm.diagnosis.diagnosisCodeType);
                        }
                    });

                } else if (referralId && template == 'referral' && vm.editMode) {
                    /* Referral Edit Mode */
                    diagnosisService.getReferralDiagnosis(vm.diagnosisId).then(function (result) {
                        vm.diagnosis = result.data;

                        if (vm.diagnosis.diagnosisCodeType == 3) {

                            vm.disableOthersDiagnosis = false;
                            vm.isOtherDiagnosisSelected = true;
                            vm.disableDiagnosisCode = true;
                        } else {
                            vm.disableOthersDiagnosis = true;
                            vm.isOtherDiagnosisSelected = false;

                            vm.disableDiagnosisCode = false;
                            vm.bindDiagnosisCodesLookup(vm.diagnosis.diagnosisCodeType);
                        }
                    });
                }
            };

            vm.onChangeResolvedDate = function () {
                
                //console.log(vm.diagnosis.resolvedDate + "|" + vm.diagnosis.onSetDate);
                if (vm.diagnosis.onSetDate != '' && vm.diagnosis.resolvedDate != '') {

                    if (Date.parse(vm.diagnosis.onSetDate) > Date.parse(vm.diagnosis.resolvedDate)) {
                        swal('Resolved date cannot be before Onset Date');
                        vm.diagnosis.resolvedDate = null;                        
                    }
                }

            };
                        
            vm.onChangeDiagnosisCodeType = function (selectedDiagnosisCodeType) {
                
                /*  1 : 'ICD-10' | 2 : 'SNOMED-CT' | 3 : 'Others' */
                if (selectedDiagnosisCodeType.value == 1 || selectedDiagnosisCodeType.value == 2) {

                    vm.diagnosis.diagnosisCodeId = null;
                    vm.bindDiagnosisCodesLookup(selectedDiagnosisCodeType.value);
                    vm.disableDiagnosisCode = false;

                    vm.disableOthersDiagnosis = true;
                    vm.diagnosis.otherDiagnosis = null;
                    vm.isOtherDiagnosisSelected = false;

                } else if (selectedDiagnosisCodeType.value == 3) {

                    vm.disableDiagnosisCode = true;
                    vm.diagnosis.diagnosisCodeId = null;
                    vm.disableOthersDiagnosis = false;
                    vm.isOtherDiagnosisSelected = true;
                }
                
            };

            //lookups
            vm.diagnosisCodesLookup = [];
            vm.diagnosisCodeTypeValue = '';
            vm.bindDiagnosisCodesLookup = function (value) {

                if (value == 1) {

                    vm.diagnosisCodeTypeValue = 'ICD-10';
                    vm.refreshDiagnosisCode(null, null, false);

                } else if (value == 2) {

                    vm.diagnosisCodeTypeValue = 'SNOMED-CT';
                    vm.refreshDiagnosisCode(null, null, false);
                }
            };

            /* To bind Diagnosis Code with Pagination Style */
            vm.refreshDiagnosisCode = function ($select, $event, isLoadMore) {

                if (vm.diagnosisCodeTypeValue != '') {
                    var result = app.consts.grid.defaultPageSize;
                    var skipcount = 0;
                    var concat = false;
                    var searchValue = null;
                    if ($select != null) {
                        searchValue = $select.search;
                    }

                    if (isLoadMore) {
                        if (!$event) {
                            ctrl.page = 1;
                        } else {
                            $event.stopPropagation();
                            $event.preventDefault();
                            vm.page++;
                        }
                        skipcount = vm.page * result;
                        concat = true;
                    } else {
                        vm.page = 0;
                    }

                    var param = { type: vm.diagnosisCodeTypeValue, filter: searchValue, skipCount: skipcount, maxResultCount: result };
                    masterLookup.getMasterTypeItemsWithPagination(param).then(function (result) {
                        if (concat) {
                            vm.diagnosisCodesLookup = vm.diagnosisCodesLookup.concat(result.data.items);
                        } else {
                            vm.diagnosisCodesLookup = result.data.items;
                        }
                        vm.diagnosisCodeCount = result.data.totalCount;
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