(function () {
    appModule.component('financialassistanceDetail', {
        bindings: {
            mode: '<',
            model: '<',
            loading: '<',
            onSave: '&',
            onUpdate: '&',
            onConfirm: '&',
            onCancel: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$anchorScroll', '$location', '$uibModal', '$state', '$stateParams', '$rootScope', 'stateNavigation','stateNavigation',
            function ($anchorScroll, $location, $uibModal, $state, $stateParams, $rootScope, stateNavigation, stateNavigation) {
                var ctrl = this;
                ctrl.personHeaderisPinned = true;
                // To prevent simultaneous saving of records which would result in duplicated records
                ctrl.isSavingDisabled = false;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.forms = [];
                    ctrl.appPath = abp.appPath;

                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Cancel')
                    };
                };

                ctrl.navigationalMenu = [
                    { key: 'General', displayName: 'General', permission: true },
                    { key: 'FinancialAssistance', displayName: 'Means Test', permission: true }
                ];

                // event handlers
                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };

                ctrl.saveFinancialAssistance = function (closeAfterSave) {

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
                                        if ($stateParams.referral) {
                                            stateNavigation.closeToReferral(app.consts.referralTabs.tabs.financial, $stateParams.referral);
                                        } else if ($stateParams.person) {
                                            stateNavigation.closeToPerson(app.consts.personTabs.tabs.personDetails, $stateParams.person);
                                        } else {
                                            $state.go('tenant.financialAssistances');
                                        }
                                    } else {
                                        $state.go('tenant.financialAssistancesEdit', {
                                            id: id,
                                            referral: $stateParams.referral,
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

                ctrl.updateFinancialAssistance = function (event) {
                    ctrl.onUpdate({
                        event: event
                    });
                };

                ctrl.confirmFinancialAssistance = function (event) {
                    abp.message.confirm(
                        app.localize('FinancialAssistanceConfirmWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onConfirm({
                                    event: {
                                        data: {
                                            id: ctrl.model.id,
                                            status: ctrl.model.status
                                        }
                                    }
                                });
                            }
                        }
                    );
                };

                ctrl.cancelFinancialAssistance = function (event) {
                    ctrl.model.isCancelling = true;

                    abp.message.confirm(
                        app.localize('FinancialAssistanceCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancelFinancialAssistanceModal();
                            }
                        }
                    );
                };

                function openCancelFinancialAssistanceModal() {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/financialAssistances/financialassistance-detail/financialassistance-detail-cancellation.cshtml',
                        controller: 'tenant.views.financialAssistances.cancelFinancialAssistance as vmx',
                        backdrop: 'static',
                        resolve: {
                            financialAssistanceId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelFinancialAssistance) {
                        ctrl.onCancel({
                            event: {
                                data: {
                                    id: ctrl.model.id,
                                    cancellationReason: cancelFinancialAssistance.cancellationReason
                                }
                            }
                        });
                    });
                }

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                function refreshPage(id) {
                    $state.reload();
                }

                ctrl.close = function () {
                    if ($stateParams.referral) {
                        stateNavigation.closeToReferral(app.consts.referralTabs.tabs.financial, $stateParams.referral);
                    } else if ($stateParams.person) {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.personDetails, $stateParams.person);
                    } else {
                        $state.go('tenant.financialAssistances');
                    }
                };

                // callbacks
                function close() {
                    debugger
                };
            }],
        templateUrl: '~/App/tenant/views/financialassistances/financialassistance-detail/financialassistance-detail.cshtml'
    });
})();