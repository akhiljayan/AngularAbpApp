(function () {
    appModule.component('medicalappointmentDetail', {
        bindings: {
            mode: '<',
            model: '<',
            loading: '<',
            onSave: '&',
            onDelete: '&',
            onUpdate: '&',
            onConfirm: '&',
            onCancel: '&',
            onReload: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$anchorScroll', '$location', '$uibModal', '$state', '$stateParams', '$rootScope', 'stateNavigation',
            function ($anchorScroll, $location, $uibModal, $state, $stateParams, $rootScope, stateNavigation) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;

                // To prevent simultaneous saving of records which would result in duplicated records
                ctrl.isSavingDisabled = false;

                ctrl.personHeaderisPinned = true;

                ctrl.navigationalMenu = [
                    { key: 'General', displayName: 'General', permission: true },
                    { key: 'Other', displayName: 'Others', permission: true }
                ];

                // lifecycle hooks
                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.forms = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Confirm'),
                        delete: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Delete'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Cancel'),
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.model = angular.copy(ctrl.model);
                    }
                };

                // event handlers
                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };

                ctrl.saveMedicalAppointment = function (closeAfterSave) {
                    if (ctrl.isSavingDisabled == false) {

                        for (var i = 0, len = ctrl.forms.length; i < len; i++) {
                            var func = ctrl.forms[i];

                            if (typeof func === 'function' && !func()) {
                                return;
                            }
                        }

                        ctrl.loading = true;
                        ctrl.isSavingDisabled = true;

                        ctrl.onSave({
                            event: {
                                success: function (id) {
                                    if (closeAfterSave) {
                                        if ($stateParams.personId) {
                                            stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.personId);
                                        } else {
                                            $state.go('tenant.medicalappointments');
                                        }
                                    } else {
                                        $state.go('tenant.medicalAppointmentEdit', {
                                            id: id,
                                            personId: $stateParams.personId
                                        });
                                    }
                                },
                                final: function () {
                                    ctrl.loading = false;
                                    ctrl.isSavingDisabled = false;
                                },
                                model: ctrl.model
                            }
                        });
                    }
                };

                ctrl.updateMedicalAppointment = function (event) {
                    ctrl.onUpdate({
                        event: event
                    });
                };

                ctrl.reloadMedicalAppointment = function () {
                    ctrl.onReload();
                }

                ctrl.confirmMedicalAppointment = function (event) {
                    if (!ctrl.permissions.confirm) {
                        abp.message.info(app.localize('UnauthorisedConfirmMedicalAppointment'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('MedicalAppointmentConfirmWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onConfirm({
                                    event: {
                                        data: ctrl.model.id
                                    }
                                });
                            }
                        }
                    );
                };

                ctrl.cancelMedicalAppointment = function (event) {
                    ctrl.model.isCancelling = true;

                    if (!ctrl.permissions.cancel) {
                        abp.message.info(app.localize('UnauthorisedCancelMedicalAppointment'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('MedicalAppointmentCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancelMedicalAppointmentModal();
                            }
                        }
                    );
                };

                ctrl.deleteMedicalAppointment = function (event) {                    
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onDelete({
                                    event: {
                                        data: ctrl.model.id
                                    }
                                });
                            }
                        }
                    );
                };

                function openCancelMedicalAppointmentModal() {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-detail/medicalappointment-detail-cancellation.cshtml',
                        controller: 'tenant.views.medicalappointment.cancelMedicalAppointment as vmx',
                        backdrop: 'static',
                        resolve: {
                            medicalAppointmentId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelMedicalAppointment) {
                        ctrl.onCancel({
                            event: {
                                data: {
                                    id: ctrl.model.id,
                                    cancellationReason: cancelMedicalAppointment.cancellationReason
                                }
                            }
                        });
                    });
                }

                ctrl.close = function () {
                    if ($stateParams.personId) {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.personId);
                    } else {
                        $state.go('tenant.medicalappointments');
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-detail/medicalappointment-detail.cshtml'
    });
})();