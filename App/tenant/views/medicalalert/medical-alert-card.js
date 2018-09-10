(function (abp) {
    appModule.component('medicalAlertCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            isPatient: '<',
            isReferral: '<',
            lockCard: '<'
        },
        controller: [
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.medicalAlert',
            function ($scope, $filter, $state, $uibModal, medicalAlertService) {
                var ctrl = this;
                ctrl.medicalalerts = [];
                ctrl.medicalAlertSummary = [];

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Edit'),
                        activate: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Delete'),
                    };
                    ctrl.medicalAlertDetailsOpen = false;
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    }
                };

                // event handlers
                ctrl.create = function () {
                    openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template);                    
                };

                ctrl.editMedicalAlert = function (medicalalert) {
                    if ((ctrl.permissions.edit || ctrl.permissions.activate || (ctrl.isPatient || ctrl.isReferral)) && !ctrl.lockCard) {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, medicalalert.id, ctrl.template);
                    }
                };

                ctrl.deleteMedicalAlert = function (medicalalertId) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                if (ctrl.personId && ctrl.template == 'person') {
                                    medicalAlertService.deletePersonMedicalAlert(medicalalertId).then(function (result) {
                                    }).finally(function () {
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                        var requestParams = { skipCount: 0 };
                                        ctrl.load(requestParams);
                                    });
                                } else if (ctrl.referralId && ctrl.template == 'referral') {
                                    medicalAlertService.deleteReferralMedicalAlert(medicalalertId).then(function (result) {
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
                    var requestParams = { skipCount: 0 };

                    getPersonSummaryMedicalAlert(ctrl.personId, true, requestParams);
                    getPersonDetailMedicalAlert(ctrl.personId, true, requestParams);
                };

                ctrl.getAllInactive = function () {
                    ctrl.loading = true;
                    ctrl.headingAppend = " - Inactive";
                    var requestParams = { skipCount: 0 };
                    
                    getPersonSummaryMedicalAlert(ctrl.personId, false, requestParams);
                    getPersonDetailMedicalAlert(ctrl.personId, false, requestParams);

                };

                // callbacks
                ctrl.load = function (requestParams) {       
                    ctrl.loading = true;
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonSummaryMedicalAlert(ctrl.personId, true, requestParams);
                        getPersonDetailMedicalAlert(ctrl.personId, true, requestParams);
                    } else if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralMedicalAlert(ctrl.referralId);
                    }
                };                

                function getReferralMedicalAlert(referralId) {
                    medicalAlertService.getReferralMedicalAlerts(referralId).then(function (result) {
                        ctrl.medicalalerts = result.data;
                        ctrl.loading = false;
                    });
                };

                function getPersonSummaryMedicalAlert(personId, status, prms) {
                    medicalAlertService.getPersonSummaryMedicalAlerts($.extend({ PersonId: personId, IsActive: status }, prms)).then(function (result) {
                        ctrl.medicalAlertSummary = result.data;
                        ctrl.loading = false;
                    });
                };

                function getPersonDetailMedicalAlert(personId, status, prms) {
                    medicalAlertService.getPersonMedicalAlerts($.extend({ PersonId: personId, IsActive: status }, prms)).then(function (result) {
                        ctrl.resultCount = result.data.totalCount;
                        ctrl.medicalalerts = result.data.items;
                        ctrl.loading = false;
                    });
                };

                //create edit
                function openModelForCreateAndEdit(prsnId, refId, medicalalertId, temp) {
                    var templateurl = '~/App/tenant/views/medicalalert/createOrEditMedicalAlert.cshtml';
                    var controller = 'tenant.views.medicalalert.createOrEditMedicalAlert as vm';

                    if (ctrl.template == 'referral') {
                        templateurl = '~/App/tenant/views/medicalalert/addReferralMedicalAlert.cshtml';
                        controller = 'tenant.views.medicalalert.addReferralMedicalAlert as vm';
                    }

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
                            medicalalertId: function () {
                                return medicalalertId;
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

        templateUrl: '~/App/tenant/views/medicalalert/medical-alert-card.cshtml'
    });
})(abp);