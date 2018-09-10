(function (abp) {
    appModule.component('specialCareCard', {
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
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.specialCare',
            function ($scope, $filter, $state, $uibModal, specialCareService) {
                var ctrl = this;
                ctrl.specialcares = [];

                // init
                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Edit'),
                        activate: abp.auth.hasPermission('Pages.Tenant.SpecialCare.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Delete'),
                    };
                    ctrl.specialCareDetailsOpen = false;
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    }
                };

                // event handlers
                ctrl.create = function () {
                    if (ctrl.personId && ctrl.template == 'person') {                        
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template);
                    }
                };

                ctrl.editSpecialCare = function (specialcare) {
                    if (ctrl.permissions.edit || ctrl.permissions.activate && ctrl.isPatient) {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, specialcare.id, ctrl.template);
                    }
                };

                ctrl.deleteSpecialCare = function (specialcareId) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                if (ctrl.personId && ctrl.template == 'person') {
                                    specialCareService.deletePersonSpecialCare(specialcareId).then(function (result) {
                                    }).finally(function () {
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                        var requestParams = { skipCount: 0 };
                                        ctrl.load(requestParams);
                                    });
                                }
                            }
                        }
                    );
                };

                ctrl.getAllActive = function () {
                    ctrl.loading = true;
                    ctrl.headingAppend = "";
                    var requestParams = { skipCount: 0 };

                    getPersonSpecialCare(ctrl.personId, true, requestParams);
                };

                ctrl.getAllInactive = function () {
                    ctrl.loading = true;
                    ctrl.headingAppend = " - Inactive";
                    var requestParams = { skipCount: 0 };

                    getPersonSpecialCare(ctrl.personId, false, requestParams);
                };
                
                // call backs
                ctrl.load = function (requestParams) {       
                    ctrl.loading = true;
                    if (ctrl.personId && ctrl.template == 'person') {
                        getPersonSpecialCare(ctrl.personId, true, requestParams);
                    }
                };

                function getPersonSpecialCare(personId, status, prms) {                    
                    specialCareService.getPersonSpecialCares($.extend({ PersonId: personId, IsActive: status }, prms)).then(function (result) {
                        ctrl.resultCount = result.data.totalCount;
                        ctrl.specialcares = result.data.items;                        
                    }).finally(function () {
                        ctrl.loading = false;
                    });       
                };
                                
                // create edit popup model
                function openModelForCreateAndEdit(prsnId, refId, specialcareId, temp) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/specialcare/createOrEditPersonSpecialCares.cshtml',
                        controller: 'tenant.views.specialcare.createOrEditPersonSpecialCares as vm',
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            specialcareId: function () {
                                return specialcareId;
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

        templateUrl: '~/App/tenant/views/specialcare/special-care-card.cshtml'
    });
})(abp);