(function () {
    appModule.component('meanstestDetail', {
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
            '$scope', '$anchorScroll', '$location', '$uibModal', '$state', '$stateParams', '$rootScope', 'stateNavigation',
            function ($scope, $anchorScroll, $location, $uibModal, $state, $stateParams, $rootScope, stateNavigation) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.age = 0;
                ctrl.personHeaderisPinned = true;
                // To prevent simultaneous saving of records which would result in duplicated records
                ctrl.isSavingDisabled = false;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.forms = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MeansTests.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.MeansTests.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.MeansTests.Confirm'),
                        confirm_deviated: abp.auth.hasPermission('Pages.Tenant.MeansTests.ConfirmDeviated'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.MeansTests.Cancel'),
                        cancel_deviated: abp.auth.hasPermission('Pages.Tenant.MeansTests.CancelDeviated')
                    };
                };


                ctrl.navigationalMenu = [
                    { key: 'General', displayName: 'General', permission: true },
                    { key: 'MeansTest', displayName: 'Means Test', permission: true },
                    { key: 'Others', displayName: 'Contact Others', permission: true }
                ];

                // event handlers
                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };

                ctrl.saveMeansTest = function (closeAfterSave) {

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
                                            $state.go('tenant.meansTests');
                                        }
                                    } else {
                                        //$state.go('tenant.meansTestsEdit', { id: id });
                                        $state.go('tenant.meansTestsEdit', {
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

                ctrl.updateMeansTest = function (event) {
                    ctrl.onUpdate({
                        event: event
                    });
                };

                ctrl.confirmMeansTest = function (event) {
                    if (ctrl.model.isDeviated) {
                        if (!ctrl.permissions.confirm_deviated) {
                            abp.message.info(app.localize('UnauthorisedConfirmDeviatedMeansTest'));
                            return;
                        }
                    } else {
                        if (!ctrl.permissions.confirm) {
                            abp.message.info(app.localize('UnauthorisedConfirmMeansTest'));
                            return;
                        }
                    }

                    abp.message.confirm(
                        app.localize(ctrl.model.isDeviated ? 'MeansTestConfirDeviatedmWarningMessage' : 'MeansTestConfirmWarningMessage'),
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

                ctrl.cancelMeansTest = function (event) {
                    ctrl.model.isCancelling = true;

                    if (ctrl.model.isDeviated) {
                        if (!ctrl.permissions.cancel_deviated) {
                            abp.message.info(app.localize('UnauthorisedCancelDeviatedMeansTest'));
                            return;
                        }
                    } else {
                        if (!ctrl.permissions.cancel) {
                            abp.message.info(app.localize('UnauthorisedCancelMeansTest'));
                            return;
                        }
                    }

                    //if (!ctrl.model.cancellationReason) {
                    //    abp.message.info(app.localize('CancellationReasonIsRequired'));
                    //    return
                    //}

                    //abp.message.confirm(
                    //    app.localize(ctrl.model.isDeviated ? 'MeansTestCancelDeviatedWarningMessage' : 'MeansTestCancelWarningMessage'),
                    //    function (isConfirmed) {
                    //        if (isConfirmed) {
                    //            ctrl.onCancel({
                    //                event: {
                    //                    data: {
                    //                        id: ctrl.model.id,
                    //                        cancellationReason: ctrl.model.cancellationReason
                    //                    }
                    //                }
                    //            });
                    //        }
                    //    }
                    //);

                    abp.message.confirm(
                        app.localize(ctrl.model.isDeviated ? 'MeansTestCancelDeviatedWarningMessage' : 'MeansTestCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancelMeansTestModal();
                            }
                        }
                    );
                };

                function openCancelMeansTestModal() {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/meanstests/meanstest-detail/meanstest-detail-cancellation.cshtml',
                        controller: 'tenant.views.meansTests.cancelMeansTest as vmx',
                        backdrop: 'static',
                        resolve: {
                            meansTestId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelMeansTest) {
                        ctrl.onCancel({
                            event: {
                                data: {
                                    id: ctrl.model.id,
                                    cancellationReason: cancelMeansTest.cancellationReason
                                }
                            }
                        });
                    });
                }

                ctrl.cancel = function () {
                    if ($stateParams.referral) {
                        stateNavigation.closeToReferral(app.consts.referralTabs.tabs.financial, $stateParams.referral);
                    } else if ($stateParams.person) {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.personDetails, $stateParams.person);
                    } else {
                        $state.go('tenant.meansTests');
                    }
                };

                // callbacks
            }
        ],
        templateUrl: '~/App/tenant/views/meanstests/meanstest-detail/meanstest-detail.cshtml'
    });
})();