(function () {
    appModule.controller('tenant.views.socialReports.socialReportsView', [
        '$scope', '$rootScope', '$stateParams', '$timeout', 'commonFormFunction', 'abp.services.app.socialReport', 'abp.services.app.commonLookup', 'abp.services.app.masterData', 'abp.services.app.user', '$anchorScroll', '$location', '$uibModal', '$state', 'stateNavigation',
        function ($scope, $rootScope, $stateParams, $timeout, commonFormFunction, socialReportService, commonLookupService, masterData, userService, $anchorScroll, $location, $uibModal, $state, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 265;
            $scope.page = 0;
            vm.personHeaderisPinned = true;
            vm.appPath = abp.appPath;
            vm.loading = false;
            vm.mode = 'view';
            vm.isNew = !$stateParams.socialId;
            vm.disabled = 0;
            vm.changePersonFlag = 1;
            vm.close = 0;
            vm.result = $scope.DefaultPageSize;
            vm.checkPersonWithAdmission = false;

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;

            vm.socialReport = {};

            vm.gotoAnchor = function (key) {
                $location.hash(key);
                $anchorScroll();
            };

            vm.navigationalMenu = [
                { key: 'General', displayName: 'General', permission: true },
                { key: 'Note', displayName: 'Note', permission: true },
                { key: 'AboutMe', displayName: 'About Me', permission: true }
            ];

            vm.cancel = function () {
                if ($stateParams.personId) {
                    stateNavigation.closeToPerson(app.consts.personTabs.tabs.personDetails, $stateParams.personId);
                } else if ($stateParams.referralId) {
                    stateNavigation.closeToReferral(app.consts.referralTabs.tabs.social, $stateParams.referralId);
                } else {
                    $state.go('tenant.socialReports');
                }
            }

            vm.prepareSave = function () {
                if (vm.isSavingDisabled == false) {
                    $scope.$broadcast('check-select-ui-required');

                    var cardModuleForm = [
                        vm.generalCtrl.generalForm,
                        vm.aboutMeCtrl.aboutMeCtrlForm,
                        vm.noteCtrl.noteCtrlForm
                    ];

                    commonFormFunction.setMultipleFormSubmitted(cardModuleForm);

                    var isValid = vm.generalCtrl.generalForm.$valid &&
                        vm.aboutMeCtrl.aboutMeCtrlForm.$valid &&
                        vm.noteCtrl.noteCtrlForm.$valid;

                    if (isValid) {
                        commonFormFunction.setPristine();

                        if (vm.aboutMeCtrl.socialReport) {
                            for (var prop in vm.aboutMeCtrl.socialReport) {
                                vm.socialReport[prop] = vm.aboutMeCtrl.socialReport[prop];
                            }
                        }

                        if (vm.generalCtrl.socialReport) {
                            for (var prop in vm.generalCtrl.socialReport) {
                                vm.socialReport[prop] = vm.generalCtrl.socialReport[prop];
                            }
                        }

                        if (vm.noteCtrl.socialReport) {
                            for (var prop in vm.noteCtrl.socialReport) {
                                vm.socialReport[prop] = vm.noteCtrl.socialReport[prop];
                            }
                        }

                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save();
                    }
                }
            };

            vm.onChangePerson = function (personId) {
                if (personId) {
                    vm.load(personId);
                } else {
                    vm.load();
                }
            };

            vm.load = function (personId) {
                vm.loading = true;

                var paramSocialId = "";
                var paramReferralId = "";
                var paramPersonId = "";

                if (!personId) {
                    var personId = "";
                }

                if ($stateParams.socialId) {
                    paramSocialId = $stateParams.socialId;
                }

                if ($stateParams.referralId) {
                    paramReferralId = $stateParams.referralId;

                    if (!$stateParams.socialId) {
                        vm.mode = 'edit';
                    }
                }

                if ($stateParams.personId) {
                    personId = $stateParams.personId;

                    if (!$stateParams.socialId) {
                        vm.mode = 'edit';
                    }
                }

                if (paramSocialId || paramReferralId || personId) {
                    if (personId) {
                        vm.checkPersonWithAdmission = true;
                        if (!$stateParams.personId) {
                            vm.disabled = 0;
                            vm.mode = 'edit';
                        } else {
                            // For create Social Report via Person
                            vm.disabled = 1;
                        }
                    } else {
                        vm.disabled = 1;
                        vm.checkPersonWithAdmission = false;
                    }

                    socialReportService.getSocialReportForEdit({
                        id: paramSocialId,
                        referralId: paramReferralId,
                        personId: personId
                    }).then(function (result) {
                        var data = result.data;

                        // TODO: Workaround for integer value option
                        if (data.reportedById) {
                            data.reportedById = data.reportedById + '';
                        }

                        vm.socialReport = data;

                        // For set view mode when have paramPersonId and socialId
                        if ($stateParams.personId && $stateParams.socialId) {
                            personId = null;
                        }

                        if ((!paramSocialId && paramReferralId) || personId) {
                            $scope.$broadcast('loadGeneralView', data);
                            $scope.$broadcast('loadAboutMeView', data);
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    vm.checkPersonWithAdmission = true;
                    socialReportService.getSocialReportForEdit({
                    }).then(function (result) {
                        var data = result.data;

                        // TODO: Workaround for integer value option
                        if (data.reportedById) {
                            data.reportedById = data.reportedById + '';
                        }

                        vm.socialReport = data;
                        $scope.$broadcast('loadGeneralView', data);
                        $scope.$broadcast('loadAboutMeView', data);
                    }).finally(function () {
                        vm.loading = false;
                    });

                    vm.mode = 'edit';
                }
            };

            $scope.lastEvent = null;

            $scope.$on('UpdateSocialReport', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;

                    for (var prop in data) {
                        vm.socialReport[prop] = data[prop];
                    }

                    vm.save();
                }
            });

            vm.saveAndClose = function () {
                vm.close = 1;
                vm.prepareSave();
            }

            vm.save = function (backToListing) {
                if ($stateParams.socialId) {
                    socialReportService.updateSocialReport(
                        vm.socialReport
                    ).then(function (result) {
                        $scope.$broadcast('SocialReportUpdated', { event: $scope.lastEvent, success: true });
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.load();
                    }).finally(function () {
                        vm.loading = false;
                        vm.isSavingDisabled = false;
                    });
                } else {
                    socialReportService.createSocialReport(
                        vm.socialReport
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));

                        if (!vm.close) {
                            if ($stateParams.referralId)
                                $location.path('/tenant/socialReport/' + result.data + '/' + $stateParams.referralId);
                            else
                                $location.path('/tenant/socialReport/' + result.data);
                        } else {
                            vm.cancel();
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.isSavingDisabled = false;
                    });
                }
            };

            vm.delete = function () {
                abp.message.confirm(
                    app.localize('RecordDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            socialReportService.deleteSocialReport({
                                id: vm.socialReport.id
                            }).then(function () {
                                vm.cancel();
                            });
                        }
                    }
                );
            };

            // Initialize Masters
            vm.reportTypeMaster = [];
            vm.personMaster = [];
            vm.byReferralMaster = [];
            vm.reportedByMaster = [];

            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.SocialReports.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.SocialReports.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.SocialReports.Delete'),
                    ManageConfidentialNotes: abp.auth.hasPermission('Pages.Tenant.SocialReports.ManageConfidentialNotes')
                };

                // Drop Down Master Data 
                masterData.getMasterDataTypeItems({
                    type: 'SocialReportType'
                }).then(function (result) {
                    vm.reportTypeMaster = result.data;
                });

                // Custom Lookup

                commonLookupService.findReferrals({
                }).then(function (result) {
                    var options = result.data.items;
                    vm.byReferralMaster = options.map(function (option) {
                        return {
                            id: option.value,
                            description: option.name
                        }
                    });
                });

                commonLookupService.findUsers({ maxResultCount: 100 }).then(function (result) {
                    var options = result.data.items;

                    vm.reportedByMaster = options.map(function (option) {
                        return {
                            id: option.value,
                            description: option.name
                        }
                    });
                });

                vm.load();
            };

            vm.init();
        }
    ]);
})();