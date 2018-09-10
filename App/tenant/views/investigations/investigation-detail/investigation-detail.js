(function () {
    appModule.component('investigationDetail', {
        bindings: {
            mode: '<',
            model: '<',
            personId: '<',
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
                ctrl.personid = "";

                // To prevent simultaneous saving of records which would result in duplicated records
                ctrl.isSavingDisabled = false;

                ctrl.personHeaderisPinned = true;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.forms = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Investigations.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Investigations.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.Investigations.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.Investigations.Cancel'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Investigations.Delete'),
                        attachDocument: abp.auth.hasPermission('Pages.Tenant.Investigations.AttachDocument'),
                        deleteDocument: abp.auth.hasPermission('Pages.Tenant.Investigations.DeleteDocument'),
                        downloadDocument: abp.auth.hasPermission('Pages.Tenant.Investigations.DownloadDocument'),
                    };

                    ctrl.navigationalMenu = [
                        { key: 'General', displayName: 'General', permission: true },
                        { key: 'Attachment', displayName: 'Attachment', permission: true }
                    ];
                };

                // event handlers
                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };

                ctrl.saveInvestigation = function (closeAfterSave) {

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
                                        ctrl.cancel();
                                    } else {
                                        var query = {
                                            id: id
                                        };

                                        $stateParams.person && (query.person = $stateParams.person);
                                        $stateParams.referral && (query.referral = $stateParams.referral);

                                        $state.go('tenant.investigationsEdit', query);
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

                ctrl.updateInvestigation = function (event) {
                    ctrl.onUpdate({
                        event: event
                    });
                };

                ctrl.reloadInvestigation = function () {
                    ctrl.onReload();
                }

                ctrl.confirmInvestigation = function (event) {
                    if (!ctrl.permissions.confirm) {
                        abp.message.info(app.localize('UnauthorisedConfirmInvestigation'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('InvestigationConfirmWarningMessage'),
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

                ctrl.cancelInvestigation = function (event) {
                    ctrl.model.isCancelling = true;

                    if (!ctrl.permissions.cancel) {
                        abp.message.info(app.localize('UnauthorisedCancelInvestigation'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('InvestigationCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancelInvestigationModal();
                            }
                        }
                    );
                };

                ctrl.deleteInvestigation = function (event) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onDelete({
                                    event: {
                                        data: {
                                            id: ctrl.model.id
                                        }
                                    }
                                });
                            }
                        }
                    );
                };

                function openCancelInvestigationModal() {
                    var modalInstance = $uibModal.open({
                        component: "cancelInvestigation",
                        backdrop: 'static',
                        resolve: {
                            investigationId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelInvestigation) {
                        ctrl.onCancel({
                            event: {
                                data: {
                                    id: ctrl.model.id,
                                    cancellationReason: cancelInvestigation.cancellationReason
                                }
                            }
                        });
                    });
                }

                ctrl.cancel = function () {
                    if ($stateParams.person) {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.profile, $stateParams.person);
                    } else if ($stateParams.referral) {
                        stateNavigation.closeToReferral(app.consts.referralTabs.tabs.medical, $stateParams.referral);
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/investigations/investigation-detail/investigation-detail.cshtml'
    });
})();