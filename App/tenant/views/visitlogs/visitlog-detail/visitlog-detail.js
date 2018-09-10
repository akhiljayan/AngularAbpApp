(function () {
    appModule.component('visitlogDetail', {
        bindings: {
            mode: '<',
            model: '<',
            loading: '<',
            onSave: '&',
            onUpdate: '&',
            onConfirm: '&',
            onCancel: '&',
            onDelete: '&',
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
                    { key: 'RenderedServices', displayName: 'Rendered Services', permission: true },
                    { key: 'Signature', displayName: 'Signature', permission: true }
                ];

                // lifecycle hooks
                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.forms = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Cancel'),
                        delete: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Delete'),
                    };
                };

                // event handlers
                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };

                ctrl.saveVisitLog = function (closeAfterSave) {

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
                                        if ($stateParams.person) {
                                            stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.person);
                                        } else {
                                            $state.go('tenant.visitLogs');
                                        }
                                    } else {
                                        $state.go('tenant.visitLogsEdit', {
                                            id: id,
                                            person: $stateParams.person
                                        });
                                    }
                                },
                                final: function () {
                                    ctrl.loading = false;
                                    ctrl.isSavingDisabled = false;
                                }
                            }
                        });
                    }
                };

                ctrl.updateVisitLog = function (event) {
                    ctrl.onUpdate({
                        event: event
                    });
                };

                ctrl.reloadVisitLog = function () {
                    ctrl.onReload();
                }

                ctrl.confirmVisitLog = function (event) {
                    if (!ctrl.permissions.confirm) {
                        abp.message.info(app.localize('UnauthorisedConfirmVisitLog'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('VisitLogConfirmWarningMessage'),
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

                ctrl.cancelVisitLog = function (event) {
                    ctrl.model.isCancelling = true;

                    if (!ctrl.permissions.cancel) {
                        abp.message.info(app.localize('UnauthorisedCancelVisitLog'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('VisitLogCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancelVisitLogModal();
                            }
                        }
                    );
                };

                ctrl.deleteVisitLog = function (event) {
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

                function openCancelVisitLogModal() {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/visitlogs/visitlog-detail/visitlog-detail-cancellation.cshtml',
                        controller: 'tenant.views.visitLogs.cancelVisitLog as vmx',
                        backdrop: 'static',
                        resolve: {
                            visitLogId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelVisitLog) {
                        ctrl.onCancel({
                            event: {
                                data: {
                                    id: ctrl.model.id,
                                    cancellationReason: cancelVisitLog.cancellationReason
                                }
                            }
                        });
                    });
                }

                ctrl.cancel = function () {
                    if ($stateParams.person) {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.person);
                    } else {
                        $state.go('tenant.visitLogs');
                    }
                };

                // callbacks
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-detail/visitlog-detail.cshtml'
    });
})();