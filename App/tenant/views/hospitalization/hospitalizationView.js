(function () {
    appModule.controller('tenant.views.hospitalization.hospitalizationView', [
        '$scope', '$state', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', '$stateParams', 'abp.services.app.hospitalization', '$anchorScroll', '$location', 'abp.services.app.user', '$uibModal', '$filter', 'abp.services.app.commonLookup', '$rootScope', 'abp.services.app.person','stateNavigation',
        function ($scope, $state, $uibModal, $timeout, commonFormFunction, masterData, masterLookup, $stateParams, hospitalizationService, $anchorScroll, $location, userService, $uibModal, $filter, commonLookupService, $rootScope, personService, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 100;
            vm.personHeaderisPinned = true;
            vm.appPath = abp.appPath;
            vm.isCreateMode = !$stateParams.id;
            vm.age = 0;
            vm.mode = 'view';
            vm.isNew = 0;
            vm.bioData = {};
            vm.person = {};
            vm.users = [];
            vm.hospitalization = {};
            vm.close = 0;
            //vm.hospitalizationCurrent = {};
            vm.personSelectedFlag = false;
            vm.isDeceased = false;
            vm.result = $scope.DefaultPageSize;
            

            vm.navigationalMenu = [
                    { key: 'General', displayName: 'General', permission: true },
                    { key: 'HospitalizationInfo', displayName: 'Hospitalization Info', permission: true },
                    { key: 'OtherInformation', displayName: 'Other Information', permission: true }
            ];

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;

            commonLookupService.findUsers({ maxResultCount: 100 }).then(function (result) {
                var options = result.data.items;
                vm.careCoordinatorByMaster = options.map(function (option) {
                    return {
                        id: parseInt(option.value),
                        description: option.name
                    }
                });
            });
            vm.personDisabled = false;


            //Close
            //vm.close = function () {
            //    if (typeof $stateParams.personId != 'undefined') {
            //        $rootScope.encounterViewEnabled = true;
            //        $rootScope.entityName = 'Hospitalization';  
            //        $state.go('tenant.personDetail', { id: $stateParams.personId });
            //    } else {
            //        $location.path('/tenant/hospitalization');
            //    }
            //}

            //Navigation to cards
            vm.gotoAnchor = function (key) {
                var offset = 0;
                if (vm.isNew == 0) {
                    offset = 265;
                } else {
                    offset = 175;
                }
                $location.hash(key);
                $anchorScroll.yOffset = offset;
                $anchorScroll();
            };

            //Prepare save
            //vm.prepareSave = function (backToListing) {
                
            //    if (vm.isSavingDisabled == false) {
                    
            //        $scope.$broadcast('check-select-ui-required');

            //        var cardModuleForm = [
            //            $scope.vm.gvm.hospitalizationGeneralForm,
            //            $scope.vm.hvm.hospitalizationInformationForm,
            //            $scope.vm.ovm.otherInfoForm
            //        ];

            //        commonFormFunction.setMultipleFormSubmitted(cardModuleForm);

            //        var isValid = $scope.vm.gvm.hospitalizationGeneralForm.$valid &&
            //            $scope.vm.hvm.hospitalizationInformationForm.$valid &&
            //            $scope.vm.ovm.otherInfoForm.$valid;

            //        if (isValid) {

            //            commonFormFunction.setPristine();

            //            vm.loading = true;
            //            vm.isSavingDisabled = true;
            //            vm.save(backToListing);
            //        };
            //    }
            //};

            ////Final save
            //vm.save = function (backToListing, childscope) {
                
            //    vm.hospitalization.deceasedDate = null;
            //    if (vm.isDeceased) {
            //        vm.hospitalization.deceasedDate = vm.hospitalization.to;
            //    }

            //    vm.isSaving = true;
            //    if ($stateParams.id) {
            //        hospitalizationService.edit(vm.hospitalization).then(function (result) {
            //            if (result) {
            //                childscope.mode = "view";
            //                vm.init();
            //            }
            //        }).finally(function () {
            //            vm.isSavingDisabled = false;
            //            vm.isSaving = false;
            //            vm.loading = false;
            //        });
            //    } else {
            //        //Create
            //        hospitalizationService.create(vm.hospitalization).then(function (result) {
            //            debugger;
            //            $scope.$broadcast('HospitalizationUpdated', { event: $scope.lastEvent, success: true });
            //            abp.notify.info(app.localize('SavedSuccessfully'));
            //            if (backToListing) {
            //                if (typeof $stateParams.personId != 'undefined') {
            //                    $rootScope.encounterViewEnabled = true;
            //                    $rootScope.entityName = 'Hospitalization';
            //                    $location.path('/tenant/person/' + $stateParams.personId);
            //                } else {
            //                    $state.go('tenant.hospitalization');
            //                }
            //            } else {
            //                $location.path('/tenant/hospitalization/' + result.data.id);
            //            }
            //        }).finally(function () {
            //            vm.isSavingDisabled = false;
            //            vm.isSaving = false;
            //            vm.loading = false;
            //        });
            //    }
            //    vm.isSaving = false;
            //    vm.isSavingDisabled = false;
            //};


            vm.prepareSave = function () {
                if (vm.isSavingDisabled == false) {

                    $scope.$broadcast('check-select-ui-required');

                    var cardModuleForm = [
                        $scope.vm.gvm.hospitalizationGeneralForm,
                        $scope.vm.hvm.hospitalizationInformationForm,
                        $scope.vm.ovm.otherInfoForm
                    ];

                    commonFormFunction.setMultipleFormSubmitted(cardModuleForm);

                    var isValid = $scope.vm.gvm.hospitalizationGeneralForm.$valid &&
                        $scope.vm.hvm.hospitalizationInformationForm.$valid &&
                        $scope.vm.ovm.otherInfoForm.$valid;

                    if (isValid) {

                        commonFormFunction.setPristine();

                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save();
                    };
                }
            };
            vm.save = function () {
                vm.hospitalization.deceasedDate = null;
                if (vm.isDeceased) {
                    vm.hospitalization.deceasedDate = vm.hospitalization.to;
                }

                vm.isSaving = true;
                if ($stateParams.id) {
                    hospitalizationService.edit(
                        vm.hospitalization
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.load();
                    }).finally(function () {
                        vm.isSavingDisabled = false;
                    });
                } else {
                    hospitalizationService.create(
                        vm.hospitalization
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        if (!vm.close) {
                            $state.go('tenant.hospitalizationDetail', {
                                id: result.data.id,
                                referralId: $stateParams.referralId,
                                personId: $stateParams.personId
                            });
                        } else {
                            vm.backToPrev();
                        }

                    }).finally(function () {
                        vm.isSavingDisabled = false;
                    });
                }
            }


                vm.saveAndClose = function () {
                    vm.close = 1;
                    vm.prepareSave();
                }

                vm.backToPrev = function () {
                    if ($stateParams.referralId) {
                        stateNavigation.closeToReferral(app.consts.referralTabs.tabs.social, $stateParams.referralId);
                    } else if ($stateParams.personId) {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.personId);
                    } else {
                        $state.go('tenant.hospitalization');
                    }
                };

            //Confirm
            vm.confirm = function () {
                abp.message.confirm(
                    'Please click Ok to continue',
                    'You are about to Confirm the Hospitalization',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            hospitalizationService.validateForHospitalizationConfirm(vm.hospitalization.id).then(function (result) {
                                if (result.data) {
                                    hospitalizationService.confirm(vm.hospitalization.id).then(function (result) {
                                        vm.init();
                                    });
                                } else {
                                    openValidationPopUp("confirm");
                                }
                            });
                        };
                    });
            };

            vm.cancel = function () {
                abp.message.confirm(
                    'Please click Ok to continue',
                    'You are about to Cancel the Hospitalization',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openValidationPopUp("cancel");
                        };
                    });
            }

            vm.delete = function () {
                if (!vm.permissions.delete) {
                    return;
                }

                abp.message.confirm(
                    app.localize('RecordDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            hospitalizationService.delete(
                                vm.hospitalization.id
                            ).then(function () {
                                abp.notify.info("Deleted");
                                $rootScope.close();
                            });
                        }
                    }
                );
            };

            //load after confirm and cancel
            $scope.$on('Created-Updated-Hospitalization', function () {
                vm.init();
            });


            //Load page and data
            vm.load = function () {
                vm.loading = true;
                if ($stateParams.personId) {
                    vm.personDisabled = true;
                }
                if ($stateParams.id) {
                    getHospitalizationObject($stateParams.id);
                } else {
                    vm.isNew = 1;
                    vm.mode = 'edit';
                    getEmptyHospitalizationObject();
                }
            };

            //Init method
            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Hospitalization.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Delete'),
                    confirm: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Confirm'),
                    cancel: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Cancel'),
                    person: abp.auth.hasPermission('Pages.Tenant.Person')
                };
                vm.load();
            };

            //Get description from master data by Id
            vm.getMasterDataDescription = function (Id, masterData) {
                var data = $filter('filter')(masterData, function (m) { return m.id === Id; });
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
            };


            $scope.$on('UpdateHospitalization', function (event, data) {
                if (data.hospitalization) {
                    $scope.lastEvent = event;
                    for (var prop in data.hospitalization) {
                        vm.hospitalization[prop] = data.hospitalization[prop];
                    }
                    vm.save(null,data.scope);
                }
            })

            $scope.$on('UpdateHospitalizationStatus', function (event, data) {
                getReferralObject(data);
            });

            vm.init();
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);



            //Get Hospitalization Object
            function getHospitalizationObject(guid) {
                hospitalizationService.get(guid).then(function (result) {
                    vm.hospitalization = result.data;
                    vm.personSelected(vm.hospitalization.person.id);
                    if (vm.hospitalization.deceasedDate != null)
                        vm.isDeceased = true;
                    broadcastForChild(vm.hospitalization);
                }).finally(function() {
                    vm.loading = false;
                });
            };
 
            //Get empty Hospitalization Object
            function getEmptyHospitalizationObject() {
                hospitalizationService.get($scope.EmptyGuid).then(function (result) {
                    vm.hospitalization = result.data;
                    if ($stateParams.personId != undefined) {
                        vm.hospitalization.person = { id: $stateParams.personId }  ;
                        vm.personSelected($stateParams.personId);
                    }
                    broadcastForChild(vm.hospitalization);
                    $scope.$broadcast('$mapDatetimeToFormat');
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.personSelected = function (personId) {
            }




            //Broadcast referralobject for child cards
            function broadcastForChild(data) {
                $scope.$broadcast('vmHospitalization', data);
                vm.loading = false;
            };
 

            //toString method
            function convertToString(value) {
                return value == null ? '' : value + '';
            };


            //Validation Popup
            function openValidationPopUp(reason) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hospitalization/hospitalizationRequiredFields.cshtml',
                    controller: 'tenant.views.hospitalization.hospitalizationRequiredFields as vm',
                    backdrop: 'static',
                    scope: $scope,
                    resolve: {
                        data: function () {
                            return vm.hospitalization;
                        },
                        action: function () {
                            return reason;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    load();
                });
            };


            //Check id not null
            function isNotNullAndEmpty(value) {
                return value != undefined && value != '';
            };

            //Get description of master data
            function getDescription(master) {
                if (master != null && master.description != null) {
                    return master.description;
                }
                return undefined;
            };

            //Jquery functions
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                    });
                }, 0);
            }
        }
    ]);
})();