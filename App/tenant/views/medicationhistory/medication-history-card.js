(function (abp) {
    appModule.component('medicationHistoryCard', {
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
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.medicationHistory',
            function ($scope, $filter, $state, $uibModal, medicationHistoryService) {
                var ctrl = this;
                ctrl.selectedFilter = true;
                // lifecycle hooks
                ctrl.$onInit = function () {                 
                    ctrl.medicationhistories = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MedicationHistory.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.MedicationHistory.Edit'),
                        activate: abp.auth.hasPermission('Pages.Tenant.MedicationHistory.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.MedicationHistory.Delete'),
                    };
                };

                var templateurl = '~/App/tenant/views/medicationhistory/createOrEditMedicationHistories.cshtml';
                var controller = 'tenant.views.medicationhistory.createOrEditMedicationHistories as vm';

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    }
                };

                // event handlers

                //Clear the list filtering
                ctrl.clearFilter = function () {
                    ctrl.medicationhistoryCard.filterText = "";
                };

                ctrl.create = function () {
                    openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template, templateurl, controller);
                };

                ctrl.editMedicationhistory = function (medicationhistory) {
                    if (ctrl.permissions.edit || ctrl.permissions.activate || (ctrl.isPatient || ctrl.isReferral)) {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, medicationhistory.id, ctrl.template, templateurl, controller);
                    }
                };
                
                ctrl.deleteMedicationHistory = function (medicationhistoryId) { 
                    var requestParams = { skipCount: 0 };
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                if (ctrl.personId && ctrl.template == 'person') {
                                    medicationHistoryService.deletePersonMedicationHistory(medicationhistoryId).then(function (result) {
                                    }).finally(function () {
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                        ctrl.load(requestParams);
                                    });
                                } else if (ctrl.referralId && ctrl.template == 'referral') {
                                    medicationHistoryService.deleteReferralMedicationHistory(medicationhistoryId).then(function (result) {
                                    }).finally(function () {
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                        ctrl.load(requestParams);
                                    });
                                }
                            }
                        }
                    );
                }

                ctrl.getAllActive = function () {

                    ctrl.headingAppend = "";
                    ctrl.selectedFilter = true;
                    var requestParams = { skipCount: 0 };

                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonMedicationHistory(ctrl.personId, true, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralMedicationHistory(ctrl.referralId, true, requestParams);
                    }                    
                };

                ctrl.getAllInactive = function () {
                    
                    ctrl.headingAppend = " - Inactive";     
                    ctrl.selectedFilter = false;
                    var requestParams = { skipCount: 0 };

                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonMedicationHistory(ctrl.personId, false, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralMedicationHistory(ctrl.referralId, false, requestParams);
                    }
                };

                ctrl.refreshGrid = function () {                    
                    var prms = {
                        skipCount: 0,
                        filter: ctrl.medicationhistoryCard.filterText
                    };
                    ctrl.loading = true;
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonMedicationHistory(ctrl.personId, true, prms);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralMedicationHistory(ctrl.referralId, true, prms);
                    }
                };

                // callbacks
                ctrl.load = function (requestParams) {
                    
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonMedicationHistory(ctrl.personId, ctrl.selectedFilter, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralMedicationHistory(ctrl.referralId, ctrl.selectedFilter, requestParams);
                    }
                };

                function getReferralMedicationHistory(referralId, status, prms) {
                    ctrl.loading = true;
                    medicationHistoryService.getReferralMedicationHistories(
                        $.extend({ ReferralId: referralId, IsActive: status }, prms)
                    ).then(function (result) {                    

                        ctrl.medicationhistories = result.data.items;
                        ctrl.data = result.data;
                        }).finally(function () {

                        ctrl.loading = false;
                    });
                };

                function getPersonMedicationHistory(personId, status, prms) {
                    ctrl.loading = true;
                    medicationHistoryService.getPersonMedicationHistories(
                        $.extend({ PersonId: personId, IsActive: status }, prms)
                    ).then(function (result) {                      

                        ctrl.medicationhistories = result.data.items;                        
                        ctrl.data = result.data;                        
                        }).finally(function () {

                        ctrl.loading = false;
                    });
                };

                $scope.$on('Created-Updated-Medicationhistory', function () {
                    var requestParams = { skipCount: 0 };
                    ctrl.load(requestParams);
                });

                //create edit
                function openModelForCreateAndEdit(prsnId, refId, medicationhistoryId, temp, temptemplateurl, controller) {
                    var modalInstance = $uibModal.open({
                        templateUrl: temptemplateurl,
                        controller: controller,
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            medicationhistoryId: function () {
                                return medicationhistoryId;
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
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/medicationhistory/medication-history-card.cshtml'
    });
})(abp);