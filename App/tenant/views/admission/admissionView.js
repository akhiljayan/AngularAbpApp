(function () {
    appModule.controller('tenant.views.admission.admissionView', [
        '$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'commonFormFunction', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', 'abp.services.app.admission', 'abp.services.app.referral', '$anchorScroll', '$location', 'abp.services.app.user', '$uibModal', '$filter', 'abp.services.app.commonLookup',
        function ($scope, $rootScope, $state, $stateParams, $timeout, commonFormFunction, masterData, masterLookup, admissionService, referralService, $anchorScroll, $location, userService, $uibModal, $filter, commonLookupService) {
            var vm = this;
            $anchorScroll.yOffset = 100;

            $scope.lastEvent = null;

            vm.appPath = abp.appPath;
            vm.loading = false;
            vm.personHeaderisPinned = true;
            vm.isCreateMode = $stateParams.action == 'create' ? true : false;
            vm.age = 0;
            vm.mode = 'view';
            vm.isNew = 0;
            vm.person = {};
            vm.admission = {};
            vm.trueflag = true;
            vm.falseflag = false;

            vm.discharge = {}; 
            vm.users = [];
            vm.modifiedUser = {};
            vm.admitedUser = {};
            vm.dischargedUser = {};
            vm.discgargedDatetime = "";
            vm.minAdmitedOnDate = "";
            vm.stateParams = $stateParams;

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;

            //Get All users for carw codinator
            commonLookupService.findUsers({ maxResultCount: 100 }).then(function (result) {
                var options = result.data.items;
                vm.careCoordinatorByMaster = options.map(function (option) {
                    return {
                        id: parseInt(option.value),
                        description: option.name
                    }
                });
            });

            //Cancel
            vm.cancel = function () {
                console.log($stateParams.close);
                if ($stateParams.close == "main") {
                    $state.go('tenant.admission');
                } else {
                    console.log('tenant.referralDetail');
                    $state.go('tenant.referralDetail', { id: vm.referralServiceType.referral.id});
                }


            }

            vm.close = function () {
                // $location.path('/tenant/referral/' + vm.referralServiceType.referral.id);
                console.log($stateParams.close);
                if ($stateParams.close == "main") {
                    $state.go('tenant.admission');
                } else {
                    console.log('tenant.referralDetail');
                    $state.go('tenant.referralDetail', { id: vm.referralServiceType.referral.id});
                }

            }

            //Show discharge flag
            vm.showDischarge = function () {

                abp.message.confirm(
                    'Please click Ok to continue',
                    'You are about to Discharge "' + vm.person.fullName + '" from "' + vm.referralServiceType.serviceType.description + '"',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.dischargeFlag = true;
                            vm.gotoAnchor('GeneralDischarge');
                        }
                    });
            };

            //Navigation to cards
            vm.gotoAnchor = function (key) {
                var offset = 0;
                if (vm.isNew == 0) {
                    offset = 265;
                } else {
                    offset = 100;
                }
                $location.hash(key);
                $anchorScroll.yOffset = offset;
                $anchorScroll();
            };

            //Prepare save
            vm.prepareSave = function (backToListing) {

                if (vm.isSavingDisabled == false) {

                    commonFormFunction.setFormSubmitted($scope.vm.general.admissionGeneralForm);

                    var isValid = $scope.vm.general.admissionGeneralForm.$valid

                    if (isValid) {

                        commonFormFunction.setPristine();

                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save(backToListing);
                    };
                }
            };

            //Final save
            vm.save = function (backToListing) {

                if ($stateParams.id && ($stateParams.action == 'admitted' || $stateParams.action == 'discharged')) {
                    referralService.updateReferralServiceType(vm.referralServiceType).then(function (result) {
                        admissionService.update(vm.admission).then(function (result) {
                            $scope.$broadcast('AdmissionUpdated', { event: $scope.lastEvent, success: true });
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            vm.load();

                        }).finally(function () {
                            vm.isSavingDisabled = false;
                            vm.loading = false;
                        });
                    });
                } else if ($stateParams.id && $stateParams.action == 'create') {
                    referralService.updateReferralServiceType(vm.referralServiceType).then(function (result) {
                        admissionService.create(vm.admission).then(function (result) {
                            $scope.$broadcast('AdmissionUpdated', { event: $scope.lastEvent, success: true });
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (backToListing) {
                                //$state.go('tenant.admission');
                                $state.go('tenant.personDetail', { id: vm.admission.personId });
                            } else {
                                var action = 'admitted';
                                $state.go('tenant.admissionDetail', { action: action, referralId: $stateParams.referralId, id: result.data.id });
                            }

                        }).finally(function () {
                            vm.loading = false;
                            vm.isSavingDisabled = false;
                        });
                    });
                }
            };

            //Load page and data
            vm.load = function () {

                vm.loading = true;
                if ($stateParams.id && ($stateParams.action == 'admitted' || $stateParams.action == 'discharged')) {
                    getAdmissionObject($stateParams.id);
                    if ($stateParams.action == 'discharged') {
                        vm.dischargeFlag = true;
                    }
                } else if ($stateParams.id && (typeof $stateParams.action == 'undefined' || $stateParams.action == 'create')) {
                    vm.isNew = 1;
                    vm.mode = 'edit';
                    getEmptyAdmissionObject($stateParams.id);
                }
            };

            //Init method
            vm.init = function () {
                vm.permissions = {
                    editAdmission: abp.auth.hasPermission('Pages.Tenant.Admission.Edit_Admission'),
                    editDischarge: abp.auth.hasPermission('Pages.Tenant.Admission.Edit_Discharge'),
                    view: abp.auth.hasPermission('Pages.Tenant.Admission.View'),
                    discharge: abp.auth.hasPermission('Pages.Tenant.Admission.Discharge'),
                    print: abp.auth.hasPermission('Pages.Tenant.Admission.Print')
                };

                vm.navigationalMenu = [
                    { key: 'General', displayName: 'General', permission: true },
                    { key: 'GeneralDischarge', displayName: 'Discharge', permission: true }
                ];

                commonLookupService.getAllUsers().then(function (result) {
                    vm.users = result.data;
                });

                vm.load();
            };

            //Update Admission when editing a particular card and saves
            $scope.$on('UpdateAdmission', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;
                    for (var prop in data) {
                        vm.admission[prop] = data[prop];
                    }
                    vm.save();
                }
            })

            //Update Admission when editing a particular card and saves
            $scope.$on('UpdateAdmissionStatus', function (event, data) {
                getAdmissionObject(data);
            });


            //Initialize controller
            vm.init();
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);

            //Get Admission Object
            function getAdmissionObject(admissionId) {
                admissionService.get(admissionId).then(function (result) {
                    vm.admission = result.data;
                    if (vm.admission.status == app.consts.admissionFilterStatus.Discharged) {
                        vm.dischargeFlag = true;
                    }
                    else {
                        hideNavigationalMenu('Discharge');
                    }
                    referralService.getReferralServiceType(vm.admission.referralServiceTypeId).then(function (result) {
                        vm.referralServiceType = result.data;
                        vm.referral = vm.referralServiceType.referral;
                        vm.person = vm.referralServiceType.referral.person;
                        vm.age = $filter("ageFilter")(vm.person.dateOfBirth);
                        broadcastObjectsToChild();
                        if ($stateParams.action == 'discharged') {
                            admissionService.getDischargeByAdmission(admissionId).then(function (result) {
                                vm.discharge = result.data;
                                $scope.$broadcast('vmScopeDischarge', vm.discharge);
                                getDischargedUserStatus();
                            }).finally(function () {
                                vm.loading = false;
                            });
                        } else {
                            vm.discharge = {};
                            vm.loading = false;
                        }
                        validateDateValue(result.data.referralStatusLogs);
                        getActedUsers();
                    });

                });
            };


            function getActedUsers() {
                vm.modifiedUser = $filter('filter')(vm.users, function (m) { return m.value == vm.admission.lastModifierUserId; })[0];
                vm.admitedUser = $filter('filter')(vm.users, function (m) { return m.value == vm.admission.creatorUserId; })[0];
            }

            function getDischargedUserStatus() {
                vm.dischargedUser = $filter('filter')(vm.users, function (m) { return m.value == vm.discharge.creatorUserId; })[0];;
                vm.discgargedDatetime = vm.discharge.dischargedOn;
            }



            //Get empty Admission Object
            function getEmptyAdmissionObject(referralServiceTypeId) {
                referralService.getReferralServiceType(referralServiceTypeId).then(function (result) {

                    vm.referralServiceType = result.data;
                    vm.referral = vm.referralServiceType.referral;
                    vm.person = vm.referralServiceType.referral.person;
                    vm.age = $filter("ageFilter")(vm.person.dateOfBirth);
                    vm.dischargeFlag = false;
                    validateDateValue(result.data.referralStatusLogs);
                    admissionService.getAdmissionModel({ tenantId: abp.session.tenantId, referralServiceTypeId: referralServiceTypeId }).then(function (result) {
                        vm.admission = result.data;
                        broadcastObjectsToChild();
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };

            //Broadcast objects for child cards
            function broadcastObjectsToChild() {
                var data = { 'vmAdmission': vm.admission, 'vmReferralServiveType': vm.referralServiceType };
                $timeout(function () {
                    $scope.$broadcast('vmScopeProperties', data);
                });
            };
            function validateDateValue(logs) {
                var log = $filter('filter')(logs, function (m) { return m.status === 1; })[0];
                if (log.statusDate == null || log.statusDate == '' || typeof log.statusDate == 'undefined') {
                    vm.minAdmitedOnDate = vm.referralServiceType.referral.referralDate;
                } else {
                    vm.minAdmitedOnDate = log.statusDate;
                }
            }

            /* It's used to hide navigational menu by passing navigation displayName */
            function hideNavigationalMenu(menu) {

                angular.forEach(vm.navigationalMenu, function (value, key) {
                    if (value.displayName == menu) {
                        value.permission = false;
                    }
                });
            }

            //Jquery functions
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                    });

                    function GetValue(selector) {
                        return $(selector).val();
                    }

                    function GetText(selector) {
                        return $(selector).text();
                    }
                }, 0);
            }
        }
    ]);
})();