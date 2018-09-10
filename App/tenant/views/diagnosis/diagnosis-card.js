(function (abp) {
    appModule.component('diagnosisCard', {
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
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.diagnosis',
            function ($scope, $filter, $state, $uibModal, diagnosisService) {
                var ctrl = this;
                ctrl.diagnosisList = [];
                ctrl.selectedFilter = true;               

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Diagnosis.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Diagnosis.Edit'),
                        activate: abp.auth.hasPermission('Pages.Tenant.Diagnosis.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Diagnosis.Delete'),
                    };
                    ctrl.diagnosisDetailsOpen = false;                    
                   
                };               

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    }
                };

                // event handlers

                //Clear the list filtering
                ctrl.clearFilter = function () {
                    ctrl.diagnosisCard.filterText = "";
                };

                ctrl.create = function () {         
                    openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template);                    
                };

                ctrl.edit = function (diagnosis) {
                    if (ctrl.permissions.edit || ctrl.permissions.activate || (ctrl.isPatient || ctrl.isReferral)) {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, diagnosis.id, ctrl.template);
                    }
                };

                ctrl.delete = function (id) {
                    
                    ctrl.loading = true;
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                if (ctrl.personId && ctrl.template == 'person') {
                                    diagnosisService.deletePersonDiagnosis(id).then(function (result) {
                                    }).finally(function () {
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                        var requestParams = { skipCount: 0 };
                                        ctrl.load(requestParams);
                                    });
                                } else if (ctrl.referralId && ctrl.template == 'referral') {
                                    diagnosisService.deleteReferralDiagnosis(id).then(function (result) {
                                    }).finally(function () {
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                        var requestParams = { skipCount: 0 };
                                        ctrl.load(requestParams);
                                    });
                                }
                            }
                        }
                    );
                }

                ctrl.getAllActive = function () {
                    ctrl.loading = true;
                    ctrl.headingAppend = "";
                    ctrl.selectedFilter = true;
                    var requestParams = { skipCount: 0 };

                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonDiagnosis(ctrl.personId, true, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralDiagnosis(ctrl.referralId, true, requestParams);
                    }
                };

                ctrl.getAllInactive = function () {
                    ctrl.loading = true;
                    ctrl.headingAppend = " - Inactive";
                    ctrl.selectedFilter = false;
                    var requestParams = { skipCount: 0 };

                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonDiagnosis(ctrl.personId, false, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralDiagnosis(ctrl.referralId, false, requestParams);
                    }
                };

                ctrl.refreshGrid = function () {
                    
                   
                    var prms = {
                        skipCount: 0,
                        filter: ctrl.diagnosisCard.filterText
                    };
                    ctrl.loading = true;
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonDiagnosis(ctrl.personId, true, prms);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralDiagnosis(ctrl.referralId, true, prms);
                    }
                };
                
                // callbacks
                ctrl.load = function (requestParams) {                                       
                    
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonDiagnosis(ctrl.personId, ctrl.selectedFilter, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralDiagnosis(ctrl.referralId, ctrl.selectedFilter, requestParams);
                    }
                };

                function getReferralDiagnosis(referralId, status, prms) {
                    
                    ctrl.loading = true;
                    diagnosisService.getAllReferralDiagnosis(
                        $.extend({ ReferralId: referralId, IsActive: status }, prms)
                    ).then(function (result) {                        
                        ctrl.diagnosisList = result.data.items;
                        ctrl.data = result.data;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                };

                function getPersonDiagnosis(personId, status, prms) {
                    ctrl.loading = true;
                    diagnosisService.getAllPersonDiagnosis(
                        $.extend({ PersonId: personId, IsActive: status }, prms)
                    ).then(function (result) {

                        ctrl.diagnosisList = result.data.items;
                        ctrl.data = result.data;

                        }).finally(function () {
                            ctrl.loading = false;
                        });
                };                

                //$scope.$on('Created-Updated-Diagnosis', function () {
                //    var requestParams = { skipCount: 0 };
                //    ctrl.load(requestParams);
                //});

                //create edit
                function openModelForCreateAndEdit(prsnId, refId, diagnosisId, temp) {

                    var templateurl = '~/App/tenant/views/diagnosis/createOrEditDiagnosis.cshtml';
                    var controller = 'tenant.views.diagnosis.createOrEditDiagnosis as vm';

                    var modalInstance = $uibModal.open({
                        templateUrl: templateurl,
                        controller: controller,
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            diagnosisId: function () {
                                return diagnosisId;
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

        templateUrl: '~/App/tenant/views/diagnosis/diagnosis-card.cshtml'
    });
})(abp);