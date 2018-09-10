(function () {
    appModule.component('referralServiceTypes', {
        bindings: {
            referral: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$rootScope', '$state', '$scope', '$filter', '$uibModal', '$location', '$stateParams', 'abp.services.app.referral', 'abp.services.app.serviceType',
            function ($rootScope, $state, $scope, $filter, $uibModal, $location, $stateParams, referralService, serviceType) {
                var ctrl = this;
                ctrl.stStatus = app.consts.referralServiceTypeStatus;
                ctrl.serviceTypes = [];
                ctrl.openLogs = [];

                ctrl.view = function (id) {
                    $location.path('/tenant/referral/' + id);
                };

                ctrl.create = function (referral) {
                    ctrl.openCreateOrEditReferralServiceType($rootScope.EmptyGuid, 'create', referral, null);
                };

                ctrl.edit = function (id, referral, status) {
                    if (ctrl.serviceTypePermissions.edit) {
                        ctrl.openCreateOrEditReferralServiceType(id, 'edit', referral, status);
                    }
                };

                ctrl.$onInit = function () {
                    ctrl.loadingRST = true;
                    ctrl.serviceTypePermissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.View'),
                        approve: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Approve'),
                        reject: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Reject'),
                        withdraw: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Withdraw'),
                        admit: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Admit')
                    };
                    serviceType.getActiveServiceTypes().then(function (result) {
                        ctrl.serviceTypes = result.data;
                    });
                    ctrl.getReferralServiceTypes();
                };

                ctrl.getReferralServiceTypes = function() {
                    if ($stateParams.id) {
                        referralService.getAllReferralServiceTypes($stateParams.id).then(function (result) {
                            ctrl.referralServiceTypeList = result.data;
                            console.log(ctrl.referralServiceTypeList);
                        }).finally(function () {
                            ctrl.loadingRST = false;
                        });
                    } else {
                        ctrl.loadingRST = false;
                    }
                };

                ctrl.loadViewStatusLog = function (id) {
                    if (ctrl.openLogs.indexOf(id) != -1) { //exists
                        var index = ctrl.openLogs.indexOf(id);
                        ctrl.openLogs.splice(index, 1);
                    } else {
                        ctrl.openLogs.push(id);
                    }
                };

                ctrl.getWidthStyle = function (value) {
                    return value > 0 ? { 'width': '65.667%' } : { 'width': '100%' };
                };

                ctrl.openCreateOrEditReferralServiceType = function (id, action, referral, status) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType/createOrEditReferralServiceType.cshtml',
                        controller: 'tenant.views.referrals.createOrEditReferralServiceType as vm',
                        backdrop: 'static',
                        scope: $scope,
                        resolve: {
                            referralServiceTypeId: function () {
                                return id;
                            },
                            action: function () {
                                return action;
                            },
                            referral: function () {
                                return referral;
                            },
                            status: function () {
                                return status;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.getReferralServiceTypes();
                    });
                };

                ctrl.popupForm = function (referralServieType, action) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType/createReferralStatusLog.cshtml',
                        controller: 'tenant.views.referrals.createReferralStatusLog as vm',
                        backdrop: 'static',
                        scope: $scope,
                        resolve: {
                            referralServiceType: function () {
                                return referralServieType;
                            },
                            action: function () {
                                return action;
                            },
                            referral: function () {
                                return $scope.vm.referral;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.getReferralServiceTypes();
                    });
                };

                ctrl.openValidationForAdmission = function(referralValidationObj) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType/referralRequiredFieldsForAdmit.cshtml',
                        controller: 'tenant.views.referrals.referralRequiredFieldsForAdmit as vm',
                        backdrop: 'static',
                        scope: $scope,
                        size: 'lg',
                        resolve: {
                            referralValidationObj: function () {
                                return referralValidationObj;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.getReferralServiceTypes();
                    });
                };

                //ServiceType Approve
                ctrl.serviceApprove = function (referralServieType) {
                    ctrl.popupForm(referralServieType, "Approve");
                };
                //ServiceType Admit
                ctrl.serviceAdmit = function (referralServieType) {
                    abp.message.confirm(
                        'Please click Ok to continue',
                        'You are about to Admit "' + ctrl.referral.person.fullName + '" for "' + getServicetypeName(referralServieType.serviceTypeId) + '"',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                referralService.validateReferralForAdmission(referralServieType.id).then(function (result) {
                                    if (result.data !== null) {
                                        ctrl.openValidationForAdmission(result.data);
                                    } else {
                                        var action = 'create';
                                        $state.go('tenant.admissionNew', { action: 'create', referralId: referralServieType.referralId, id: referralServieType.id });
                                    }
                                });
                            }
                        });
                };
                //ServiceType Reject
                ctrl.serviceReject = function (referralServieType) {
                    ctrl.popupForm(referralServieType, "Reject");
                };
                //ServiceType Withdraw
                ctrl.serviceWithdraw = function (referralServieType) {
                    ctrl.popupForm(referralServieType, "Withdraw");
                };

                function getServicetypeName(servicetypeId) {
                    var data = $filter('filter')(ctrl.serviceTypes, function (m) { return m.id === servicetypeId; });
                    if (typeof data != 'undefined' && data != null) {
                        var dataDescription = data[0];
                    } else {
                        var dataDescription = null;
                    }
                    if (typeof dataDescription != 'undefined' && dataDescription != null) {
                        return dataDescription.description;
                    } else {
                        return "";
                    }
                }

                function getAllReferralServiceTypes(id) {
                    referralService.getAllReferralServiceTypes(id).then(function (result) {
                        ctrl.referralServiceTypeList = result.data;
                        ctrl.loadingRST = true;
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType.cshtml'
    });
})();




//(function () {
//    appModule.controller('tenant.views.referral.referralServiceType', [
//        '$rootScope','$state', '$scope', '$filter', '$uibModal', '$location', '$stateParams', 'abp.services.app.referral', 'abp.services.app.serviceType',
//        function ($rootScope, $state, $scope, $filter, $uibModal, $location, $stateParams, referralService, serviceType) {
//            var vm = this;
//            vm.mode = $scope.vm.mode;
//            vm.appPath = abp.appPath;
//            vm.filter = null;
//            vm.persons = [];

//            vm.stStatus = app.consts.referralServiceTypeStatus;


//            vm.accordion = {
//                current: null
//            };
//            vm.view = function (id) {
//                $location.path('/tenant/referral/' + id);
//            };
//            vm.create = function (referral) {
//                openCreateOrEditReferralServiceType($rootScope.EmptyGuid, 'create', referral, null);
//            };
//            vm.edit = function (id, referral, status) {
//                if (vm.serviceTypePermissions.edit) {
//                    openCreateOrEditReferralServiceType(id, 'edit', referral, status);
//                }
//            };
//            vm.load = function () {
//                vm.loadingRST = true;
//                vm.serviceTypePermissions = {
//                    create: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Create'),
//                    edit: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Edit'),
//                    view: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.View'),
//                    approve: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Approve'),
//                    reject: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Reject'),
//                    withdraw: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Withdraw'),
//                    admit: abp.auth.hasPermission('Pages.Tenant.ReferralServiceType.Admit')
//                };
//                refreshlist();
//            };
//            vm.openLogs = [];
//            vm.loadViewStatusLog = function (id) {
//                if (vm.openLogs.indexOf(id) != -1) { //exists
//                    var index = vm.openLogs.indexOf(id);
//                    vm.openLogs.splice(index, 1);
//                } else {
//                    vm.openLogs.push(id);
//                }
//            };
//            vm.serviceReject = function (referralServieType) {
//                vm.popupForm(referralServieType, "Reject");
//            };
//            vm.serviceApprove = function (referralServieType) {
//                vm.popupForm(referralServieType, "Approve");
//            };
//            vm.serviceWithdraw = function (referralServieType) {
//                vm.popupForm(referralServieType, "Withdraw");
//            };
//            vm.serviceAdmit = function (referralServieType) {
//                abp.message.confirm(
//                    'Please click Ok to continue',
//                    'You are about to Admit "' + $scope.vm.referral.person.fullName + '" for "' + getServicetypeName(referralServieType.serviceTypeId) + '"',
//                    function (isConfirmed) {
//                        console.log(isConfirmed);
//                        if (isConfirmed) {
//                            referralService.validateReferralForAdmission(referralServieType.id).then(function (result) {
//                                if (result.data !== null) {
//                                    openValidationForAdmission(result.data);
//                                } else {
//                                    var action = 'create';
//                                    $state.go('tenant.admissionDetailNew', { action: 'create', referralId: referralServieType.referralId, id: referralServieType.id });
//                                }
//                            });
//                        }
//                    });
//            };
//            vm.popupForm = function (referralServieType, action) {
//                var modalInstance = $uibModal.open({
//                    templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType/createReferralStatusLog.cshtml',
//                    controller: 'tenant.views.referral.createReferralStatusLog as vm',
//                    backdrop: 'static',
//                    scope: $scope,
//                    resolve: {
//                        referralServiceType: function () {
//                            return referralServieType;
//                        },
//                        action: function () {
//                            return action;
//                        },
//                        referral: function () {
//                            return $scope.vm.referral;
//                        }
//                    }
//                });
//                modalInstance.result.then(function () {
//                    refreshlist();
//                });
//            };
//            vm.getWidthStyle = function (value) {
//                if (value > 0) {
//                    return {
//                        'width': '65.667%'
//                    }
//                } else {
//                    return {
//                        'width': '100%'
//                    }
//                }
//            };


//            $scope.updateReferralStatus = function (id) {
//                $scope.$emit('UpdateReferralStatus', id);
//            };


//            function refreshlist() {
//                if ($stateParams.id) {
//                    referralService.getAllReferralServiceTypes($stateParams.id).then(function (result) {
//                        vm.referralServiceTypeList = result.data;
//                        vm.loadingRST = false;
//                    });
//                } else {
//                    vm.loadingRST = false;
//                }
//            };
//            function openCreateOrEditReferralServiceType(id, action, referral, status) {
//                var modalInstance = $uibModal.open({
//                    templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType/createOrEditReferralServiceType.cshtml',
//                    controller: 'tenant.views.referral.createOrEditReferralServiceType as vm',
//                    backdrop: 'static',
//                    scope: $scope,
//                    resolve: {
//                        referralServiceTypeId: function () {
//                            return id;
//                        },
//                        action: function () {
//                            return action;
//                        },
//                        referral: function () {
//                            return referral;
//                        },
//                        status: function () {
//                            return status;
//                        }
//                    }
//                });
//                modalInstance.result.then(function () {
//                    refreshlist();
//                });
//            };

//            function openValidationForAdmission(referralValidationObj) {
//                var modalInstance = $uibModal.open({
//                    templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralServiceType/createOrEditReferralServiceType.cshtml',
//                    controller: 'tenant.views.referral.referralRequiredFieldsForAdmit as vm',
//                    backdrop: 'static',
//                    scope: $scope,
//                    size: 'lg',
//                    resolve: {
//                        referralValidationObj: function () {
//                            return referralValidationObj;
//                        },
//                    }
//                });
//                modalInstance.result.then(function () {
//                    refreshlist();
//                });
//            };

//            vm.serviceTypes = [];
//            serviceType.getActiveServiceTypes().then(function (result) {
//                vm.serviceTypes = result.data;
//            });

//            function getServicetypeName(servicetypeId) {
//                var data = $filter('filter')(vm.serviceTypes, function (m) { return m.id === servicetypeId; });
//                if (typeof data != 'undefined' && data != null) {
//                    var dataDescription = data[0];
//                } else {
//                    var dataDescription = null;
//                }
//                if (typeof dataDescription != 'undefined' && dataDescription != null) {
//                    return dataDescription.description;
//                } else {
//                    return "";
//                }
//            }

//            function getAllReferralServiceTypes(id) {
//                referralService.getAllReferralServiceTypes(id).then(function (result) {
//                    vm.referralServiceTypeList = result.data;
//                    vm.loadingRST = true;
//                });
//            };

//            vm.load();
//        }
//    ]);
//})();
