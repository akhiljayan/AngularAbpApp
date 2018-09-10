(function (abp) {
    appModule.component('immunizationCard', {
        bindings: {
            maintitle: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        //controllerAs: "vm",
        controller: [
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.referral', 'abp.services.app.immunization',
            function ($scope, $filter, $state, $uibModal, referralService, immunizationService) {
                var ctrl = this;
                ctrl.serviceTypeStatus = app.consts.referralServiceTypeStatus;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Immunization.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Immunization.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Immunization.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Immunization.Delete')
                    };
                    ctrl.detailsOpen = false;                    
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    }
                };

                //Clear the list filtering
                ctrl.clearFilter = function () {
                    ctrl.immunizationCard.filterText = "";
                };

                //Create
                ctrl.create = function () {
                    openModelForCreateAndEdit(ctrl.personId, app.consts.EmptyGuid);
                };

                //Edit
                ctrl.edit = function (immunization) {
                    if (ctrl.isPatient != undefined && (ctrl.permissions.edit || ctrl.permissions.view) ) {
                        openModelForCreateAndEdit(ctrl.personId, immunization.id);
                    }
                };

                //Delete
                ctrl.delete = function (id) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                if (ctrl.personId && ctrl.template == 'person') {
                                    immunizationService.deleteImmunization(id).then(function (result) {
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

                //It's used to call when user key in search filter.
                ctrl.refreshGrid = function () {
                    var prms = {
                        skipCount: 0,
                        filter: ctrl.immunizationCard.filterText
                    };
                    ctrl.loading = true;
                    getImmunizationList(ctrl.personId, prms);
                };

                // Calling from simple-pagination when form load.
                ctrl.load = function (requestParams) {
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonAdmissionStatus(ctrl.personId);
                        getImmunizationList(ctrl.personId, requestParams); 
                    }
                };

                // Expired items to be highlighted in red if person is still admitted, otherwise do not need to highlight in red.
                function getPersonAdmissionStatus(personId) {
                    referralService.getAllReferralServiceTypesByPersonId(
                        personId
                    ).then(function (result) {                        
                        ctrl.referralServiceTypes = result.data.referralServiceTypes;

                        var keepGoing = true;
                        angular.forEach(ctrl.referralServiceTypes, function (item) {                            
                            if (keepGoing) {
                                if (item.status == ctrl.serviceTypeStatus.Admitted) {
                                    ctrl.isPersonAdmitted = true;
                                    keepGoing = false;
                                } else {
                                    ctrl.isPersonAdmitted = false;
                                }
                            }                            
                        });
                    });
                };

                function getImmunizationList(personId, prms) {                    
                    ctrl.loading = true;

                    immunizationService.getAllImmunization($.extend({ PersonId: personId }, prms)).then(function (result) {
                        ctrl.immunizations = result.data.items[0];
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };
                
                //create edit
                function openModelForCreateAndEdit(prsnId, immunizationId) {
                    var modalInstance = $uibModal.open({
                        component: 'immunizationDetail',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            id: function () {
                                return immunizationId;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            },
                            template: function () {
                                return ctrl.template;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/immunization/immunization-card.cshtml'
    });
})(abp);