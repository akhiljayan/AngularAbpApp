(function () {
    appModule.component('transportrequisitionDetail', {
        bindings: {
            model: '<',
            onSave: '&',
            onDelete: '&',
            onConfirm: '&',
            onCancel: '&',
            onComplete: '&',
            onReload: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$anchorScroll', '$location', '$uibModal', '$state', '$stateParams', '$rootScope',
            function ($anchorScroll, $location, $uibModal, $state, $stateParams, $rootScope) {
                var ctrl = this;

                // To prevent simultaneous saving of records which would result in duplicated records
                ctrl.isSavingDisabled = false;

                ctrl.personHeaderisPinned = false;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.appPath = abp.appPath;
                    $anchorScroll.yOffset = 265;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Cancel'),
                        delete: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Delete'),
                        complete: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Complete')
                    };

                    ctrl.navigationalMenu = [
                        { key: 'General', displayName: 'General', permission: true },
                        { key: 'Booking', displayName: 'Transport Requisition and Booking Section', permission: true },
                        { key: 'SpecialArrangement', displayName: 'Special Arrangement', permission: true },
                    ];

                    if (ctrl.model.isCompleted) {
                        ctrl.navigationalMenu.push({
                            key: 'Completion',
                            displayName: 'Completion',
                            permission: true
                        });
                    }

                    updateRecordStatus();
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.model = angular.copy(ctrl.model);
                        if (ctrl.model.tcu) {
                            ctrl.model.tCUId = ctrl.model.tcu.id;
                        }

                        console.log(ctrl.model);
                        updateRecordStatus();
                    }
                };

                // event handlers
                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.saveTransportRequisition = function (closeAfterSave) {
                    ctrl.form.submitted = true;
                   
                    if (ctrl.form.$invalid) {
                        return;
                    }

                    ctrl.model.specialArrangements = [];

                    if (ctrl.model.categories) {
                        for (var i = 0; i < ctrl.model.categories.length; i++) {
                            var category = ctrl.model.categories[i];

                            for (var x = 0; x < category.specialArrangements.length; x++) {
                                if (category.specialArrangements[x].isChecked) {
                                    ctrl.model.specialArrangements.push(category.specialArrangements[x]);
                                }
                            }
                        }
                    }
                  

                    ctrl.onSave({
                        $event: {
                            model: ctrl.model,
                            success: function (id) {
                                if (closeAfterSave) {
                                    // Save and Close for New and Edit
                                    ctrl.close();
                                } else {
                                    if (!ctrl.model.id) {
                                        // Save for New
                                        $state.go('tenant.transportrequisitionsEdit', { id: id });
                                    } else {
                                        // Save for Edit
                                        ctrl.close(true);   // CancelEdit = true
                                    }
                                }
                            }
                        }
                    });
                };

                ctrl.reloadTransportRequisition = function () {
                    ctrl.onReload();
                    updateRecordStatus();
                }

                ctrl.confirmTransportRequisition = function (event) {
                    if (!ctrl.permissions.confirm) {
                        abp.message.info(app.localize('UnauthorisedConfirm', app.localize('transportrequisition')));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('ConfirmWarningMessage', app.localize('transportrequisition')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onConfirm({
                                    $event: {
                                        data: ctrl.model.id
                                    }
                                });
                            }
                        }
                    );
                };

                ctrl.cancelTransportRequisition = function (event) {
                    ctrl.model.isCancelling = true;

                    if (!ctrl.permissions.cancel) {
                        abp.message.info(app.localize('UnauthorisedCancel', app.localize('transportrequisition')));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('CancelWarningMessage', app.localize('transportrequisition')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancelTransportRequisitionModal();
                            }
                        }
                    );
                };

                ctrl.completeTransportRequisition = function (event) {
                    ctrl.model.isCompleting = true;

                    if (!ctrl.permissions.complete) {
                        abp.message.info(app.localize('UnauthorisedComplete', app.localize('transportrequisition')));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('CompleteWarningMessage', app.localize('transportrequisition')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCompleteTransportRequisitionModal();
                            }
                        }
                    );
                };

                ctrl.deleteTransportRequisition = function (event) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onDelete({
                                    $event: {
                                        data: {
                                            id: ctrl.model.id
                                        }
                                    }
                                });
                            }
                        }
                    );
                };

                function openCancelTransportRequisitionModal() {
                    var modalInstance = $uibModal.open({
                        component: "cancelTransportRequisition",
                        backdrop: 'static',
                        resolve: {
                            transportRequisitionId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelTransportRequisition) {
                        ctrl.onCancel({
                            $event: {
                                data: {
                                    id: ctrl.model.id,
                                    cancellationReason: cancelTransportRequisition.cancellationReason
                                }
                            }
                        });
                    });
                }

                function openCompleteTransportRequisitionModal() {
                    var modalInstance = $uibModal.open({
                        component: "completeTransportRequisition",
                        backdrop: 'static',
                        resolve: {
                            transportRequisitionId: function () {
                                return ctrl.model.id;
                            },
                            transportRequisition: function () {
                                return ctrl.model;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (completeTransportRequisition) {
                        ctrl.onComplete({
                            $event: {
                                model: completeTransportRequisition
                            }
                        });
                    });
                }

                ctrl.close = function (cancelEdit = false) {
                    if (cancelEdit) {
                        // Add reload to refresh data if data edited not saved
                        ctrl.onReload();
                        ctrl.mode = 'view';
                    } else {
                        $state.go('tenant.transportrequisitions');
                    }
                };

                function updateRecordStatus() {
                    ctrl.isNew = !ctrl.model.id || ctrl.model.id == "00000000-0000-0000-0000-000000000000";

                    if (ctrl.isNew) {
                        ctrl.mode = 'new';
                    } else if (ctrl.model.isConfirmed || ctrl.model.isCancelled || ctrl.model.isCompleted) {
                        ctrl.mode = 'readonly';
                    } else {
                        ctrl.mode = 'view';
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail.cshtml'
    });
})();