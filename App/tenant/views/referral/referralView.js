(function () {
    appModule.controller('tenant.views.referral.referralView', [
        '$scope', '$rootScope', '$timeout', 'commonFormFunction', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', '$stateParams', 'abp.services.app.referral', '$anchorScroll', '$location', 'abp.services.app.user', '$uibModal', '$filter', 'abp.services.app.commonLookup', '$rootScope','stateNavigation',
        function ($scope, $rootScope, $timeout, commonFormFunction, masterData, masterLookup, $stateParams, referralService, $anchorScroll, $location, userService, $uibModal, $filter, commonLookupService, $rootScope, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 100;
            vm.personHeaderisPinned = true;
            $scope.lastEvent = null;

            $scope.referralViewEnabled = false;
            $scope.socialViewEnabled = false;           //For Dynamic change view to Social Tab
            $scope.financialViewEnabled = false;           //For Dynamic change view to Financial Tab
            $scope.attachmentViewEnabled = false;
            $scope.medicalViewEnabled = false;

            vm.appPath = abp.appPath;
            vm.loading = false;
            vm.isCreateMode = !$stateParams.id;
            vm.age = 0;
            vm.mode = 'view';
            vm.isNew = 0;
            vm.bioData = {};
            vm.person = {};
            vm.referral = {};
            vm.navigationalMenu = [];

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;

            vm.cancel = function () {
                $rootScope.close();
            }

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
                $location.path('/tenant/referral');
            }

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
            vm.prepareSave = function (backToListing) {

                if (vm.isSavingDisabled == false) {

                    var cardModuleForm = [
                        $scope.vm.bioData.bioDataForm,
                        $scope.vm.contactInfoCtrl.contactInfoForm,
                        $scope.vm.otherInformation.otherInformationForm,
                        $scope.vm.referralInfo.referralInfoForm
                    ];

                    commonFormFunction.setMultipleFormSubmitted(cardModuleForm);

                    var isValid = $scope.vm.bioData.bioDataForm.$valid &&
                        $scope.vm.contactInfoCtrl.contactInfoForm.$valid &&
                        $scope.vm.otherInformation.otherInformationForm.$valid &&
                        $scope.vm.referralInfo.referralInfoForm.$valid;

                    if (isValid) {

                        commonFormFunction.setPristine();

                        if ($scope.vm.bioData.person) {
                            vm.referral.person = $scope.vm.bioData.person;
                        }
                        if ($scope.vm.contactInfoCtrl.person) {
                            for (var prop in $scope.vm.contactInfoCtrl.person) {
                                vm.referral.person[prop] = $scope.vm.contactInfoCtrl.person[prop];
                            }
                        }
                        if ($scope.vm.otherInformation.person) {
                            for (var prop in $scope.vm.otherInformation.person) {
                                vm.referral.person[prop] = $scope.vm.otherInformation.person[prop];
                            }
                        }

                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save(backToListing);
                    }
                }
            };

            //Final save
            vm.save = function (backToListing) {
                vm.isSaving = true;
                //vm.referral.referralDate = '2018-08-01T00:00+800';
                if ($stateParams.id) {
                    referralService.update(
                        vm.referral
                    ).then(function (result) {
                        //$scope.$broadcast('PersonUpdated', { event: $scope.lastEvent, success: true });
                        $scope.$broadcast('ReferralUpdated', { event: $scope.lastEvent, success: true });
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.init();

                    }).finally(function () {
                        vm.isSaving = false;
                        vm.isSavingDisabled = false;
                    });
                } else {
                    referralService.create(
                        vm.referral
                    ).then(function (result) {
                        //$scope.$broadcast('PersonUpdated', { event: $scope.lastEvent, success: true });
                        $scope.$broadcast('ReferralUpdated', { event: $scope.lastEvent, success: true });
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        if (backToListing) {
                            $location.path('/tenant/referral');
                        } else {
                            $location.path('/tenant/referral/' + result.data.id);
                        }
                    }).finally(function () {
                        vm.isSaving = false;
                        vm.isSavingDisabled = false;
                    });
                }
            };


            //Load page and data
            vm.load = function () {
                vm.loading = true;
                vm.referralTabs = stateNavigation.getTargetReferralTab();

                vm.setCardNavigation(vm.referralTabs);
                //if (!$rootScope.entityName) {
                //    $scope.referralViewEnabled = true;
                //}
                //else {
                //    if ($rootScope.referralViewEnabled) {
                //        $scope.referralViewEnabled = $rootScope.referralViewEnabled;
                //        delete $rootScope.referralViewEnabled;
                //    } else if ($rootScope.socialViewEnabled) {
                //        $scope.socialViewEnabled = $rootScope.socialViewEnabled;
                //        delete $rootScope.socialViewEnabled;
                //    } else if ($rootScope.financialViewEnabled) {
                //        $scope.financialViewEnabled = $rootScope.financialViewEnabled;
                //        delete $rootScope.financialViewEnabled;
                //    } else if ($rootScope.attachmentViewEnabled) {
                //        $scope.attachmentViewEnabled = $rootScope.attachmentViewEnabled;
                //        delete $rootScope.attachmentViewEnabled;
                //    } else if ($rootScope.medicalViewEnabled) {
                //        $scope.medicalViewEnabled = $rootScope.medicalViewEnabled;
                //        delete $rootScope.medicalViewEnabled;
                //    }

                //    setTimeout(function () {
                //        vm.gotoAnchor($rootScope.entityName);
                //        delete $rootScope.entityName;
                //    }, 2000);
                //}

                if ($stateParams.id) {
                    vm.loading = true;
                    getReferralObject($stateParams.id);
                    vm.setCardNavigation(vm.referralTabs);
                } else {
                    vm.isNew = 1;
                    vm.mode = 'edit';
                    getEmptyReferralObject();
                    vm.setCardNavigation(vm.referralTabs);
                }
            };

            //Init method
            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Referral.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Referral.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Referral.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Referral.Delete'),
                    activate: abp.auth.hasPermission('Pages.Tenant.Referral.Activate'),
                    deActivate: abp.auth.hasPermission('Pages.Tenant.Referral.DeActivate')
                };
                loadAllMasterData();
                loadAllMasterLookups();
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

            //Bind Person
            vm.bindPersonReferral = function () {
                vm.referral.person = vm.person;
            }


            $scope.$on('UpdateReferral', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;
                    for (var prop in data) {
                        vm.referral[prop] = data[prop];
                    }
                    vm.save();
                }
            })

            $scope.$on('UpdatePerson', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;
                    for (var prop in data) {
                        vm.referral.person[prop] = data[prop];
                    }
                    vm.save();
                }
            });

            $scope.$on('UpdateReferralStatus', function (event, data) {
                getReferralObject(data);
            });



            vm.setCardNavigation = function (referralTabs) {
                if (referralTabs.referral) {
                    vm.navigationalMenu = [
                        { key: 'BioData', displayName: 'Bio Data' },
                        { key: 'ContactInformation', displayName: 'Contact Information' },
                        { key: 'OtherInformation', displayName: 'Other Information' },
                        { key: 'TrigeInfo', displayName: 'Triage Information' },
                        { key: 'General', displayName: 'General' },
                        { key: 'ReferralServiceType', displayName: 'Referral Service Type' },
                        { key: 'ReferralInformation', displayName: 'Referral Information' },
                    ];
                } else if (referralTabs.social) {
                    vm.navigationalMenu = [
                        { key: 'SocialBackground', displayName: 'Social Background' },
                        { key: 'FamilyMember', displayName: 'Family Member/Caregivers' },
                        { key: 'Genogram', displayName: 'Genogram', permission: abp.auth.hasPermission('Pages.Tenant.Genogram') },
                        { key: 'SocialReport', displayName: 'Social Report' }
                    ];
                } else if (referralTabs.medical) {
                    vm.navigationalMenu = [
                        { key: 'FunctionalStatus', displayName: 'Functional Status' },
                        { key: 'RAF', displayName: 'RAF' },
                        { key: 'Allergies', displayName: 'Allergies' },
                        { key: 'Diagnosis', displayName: 'Diagnosis' },
                        { key: 'medicalhistories', displayName: 'Medical History' },
                        { key: 'medicationhistories', displayName: 'Medication History' },
                        { key: 'specialcares', displayName: 'Special Care' },
                        { key: 'medicalalerts', displayName: 'Medical Alerts' },
                        { key: 'Investigations', displayName: 'Investigations' }
                    ];
                } else if (referralTabs.financial) {
                    vm.navigationalMenu = [
                        { key: 'MeansTesting', displayName: 'Means Testing' },
                        { key: 'FinancialAssistance', displayName: 'Financial Assistance' }
                    ];
                }
            };




            //Master variables
            vm.salutationMaster = [];
            vm.genderMaster = [];
            vm.countryMaster = [];
            vm.raceMaster = [];
            vm.citizenshipMaster = [];
            vm.highestEducationMaster = [];
            vm.nationalityMaster = [];
            vm.religionMaster = [];
            vm.occupationMaster = [];
            vm.ownershipMaster = [];
            vm.typesOfAccommodationMaster = [];
            vm.maritalStatusMaster = [];
            vm.registrationDocumentMaster = [];
            vm.liftLandingMaster = [];
            vm.livingArrangementMaster = [];
            vm.previousFeedingStatusMaster = [];
            vm.currentFeedingMaster = [];
            vm.previousToiletingMaster = [];
            vm.currentToiletingMaster = [];
            vm.previousMobilityMaster = [];
            vm.currentMobilityMaster = [];
            vm.rafSourceMaster = [];
            vm.rafCategoryMaster = [];
            vm.referredByMaster = [];
            vm.currentLocationMaster = [];
            vm.hospitalsMaster = [];
            vm.patientAcuityMaster = [];



            vm.init();
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);

            //Get Referral Object
            function getReferralObject(guid) {
                referralService.get(guid).then(function (result) {
                    vm.referral = result.data;
                    broadcastForChild(result.data);
                    vm.person = result.data.person;
                    vm.age = $filter("ageFilter")(vm.person.dateOfBirth);
                    //TODO: Improve logic
                    setBioDatafieldCard();
                    $scope.$broadcast('loadBioDataView', null);
                    $scope.$broadcast('loadSocialReportView', null);
                    vm.loading = false;
                });
            };

            //Get empty Referral Object
            function getEmptyReferralObject() {
                referralService.get($scope.EmptyGuid).then(function (result) {
                    vm.loading = false;
                    vm.referral = result.data;
                    broadcastForChild(vm.referral);
                });
            };

            //Broadcast referralobject for child cards
            function broadcastForChild(data) {
                $scope.$broadcast('vmReferral', data);
            }


            //Biodata view card data
            function setBioDatafieldCard() {
                if (vm.person.nricAddress) {
                    var part1 = [
                        vm.person.nricAddress.blockNo,
                        vm.person.nricAddress.unitNo,
                        vm.person.nricAddress.bulidingName
                    ].filter(isNotNullAndEmpty).join(" ");
                    var part2 = [vm.person.nricAddress.streetName].filter(isNotNullAndEmpty).join(" ");
                    var part3 = [getDescription(vm.person.nricAddress.country), vm.person.nricAddress.postalCode];
                    var line1 = [
                        ([part1, part2].filter(isNotNullAndEmpty).join(', ')),
                        part3.filter(isNotNullAndEmpty).join(' ')
                    ].filter(isNotNullAndEmpty).join('<br />');
                    var line2 = [
                        getDescription(vm.person.nricAddress.ownership),
                        getDescription(vm.person.nricAddress.typeOfAccommodation)
                    ].filter(isNotNullAndEmpty).join(" &bull; ");
                    vm.person.nricAddress.line1 = line1;
                    vm.person.nricAddress.line2 = line2;
                }
                if (vm.person.residentialAddress) {
                    var part1 = [
                        vm.person.residentialAddress.blockNo,
                        vm.person.residentialAddress.unitNo,
                        vm.person.residentialAddress.bulidingName
                    ].filter(isNotNullAndEmpty).join(" ");
                    var part2 = [vm.person.residentialAddress.streetName].filter(isNotNullAndEmpty).join(" ");
                    var part3 = [getDescription(vm.person.residentialAddress.country), vm.person.residentialAddress.postalCode];
                    var line1 = [
                        ([part1, part2].filter(isNotNullAndEmpty).join(', ')),
                        part3.filter(isNotNullAndEmpty).join(' ')
                    ].filter(isNotNullAndEmpty).join('<br />');
                    var line2 = [
                        getDescription(vm.person.residentialAddress.ownership),
                        getDescription(vm.person.residentialAddress.typeOfAccommodation)
                    ].filter(isNotNullAndEmpty).join(" &bull; ");
                    vm.person.residentialAddress.line1 = line1;
                    vm.person.residentialAddress.line2 = line2;
                }
                if (vm.person.billingAddress) {
                    var part1 = [
                        vm.person.billingAddress.blockNo,
                        vm.person.billingAddress.unitNo,
                        vm.person.billingAddress.bulidingName
                    ].filter(isNotNullAndEmpty).join(" ");
                    var part2 = [vm.person.billingAddress.streetName].filter(isNotNullAndEmpty).join(" ");
                    var part3 = [getDescription(vm.person.billingAddress.country), vm.person.billingAddress.postalCode];
                    var line1 = [
                        ([part1, part2].filter(isNotNullAndEmpty).join(', ')),
                        part3.filter(isNotNullAndEmpty).join(' ')
                    ].filter(isNotNullAndEmpty).join('<br />');
                    var line2 = [
                        getDescription(vm.person.billingAddress.ownership),
                        getDescription(vm.person.billingAddress.typeOfAccommodation)
                    ].filter(isNotNullAndEmpty).join(" &bull; ");
                    vm.person.billingAddress.line1 = line1;
                    vm.person.billingAddress.line2 = line2;
                }
            };

            //toString method
            function convertToString(value) {
                return value == null ? '' : value + '';
            }



            //Check id not null
            function isNotNullAndEmpty(value) {
                return value != undefined && value != '';
            }

            //Get description of master data
            function getDescription(master) {
                if (master != null && master.description != null) {
                    return master.description;
                }
                return undefined;
            }

            //Drop Down Master Data 
            function loadAllMasterData() {
                masterData.getMasterDataTypeItems({
                    type: 'Salutation'
                }).then(function (result) {
                    vm.salutationMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'Gender'
                }).then(function (result) {
                    vm.genderMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'OwnerShip'
                }).then(function (result) {
                    vm.ownershipMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'RegistrationDocument'
                }).then(function (result) {
                    vm.registrationDocumentMaster = result.data;
                    var nricBlueItem = result.data.filter(function (item) { return item.description == 'NRIC Blue'; });
                    var nricPinkItem = result.data.filter(function (item) { return item.description == 'NRIC Pink'; });
                    var finItem = result.data.filter(function (item) { return item.description == 'Fin'; });
                    var notApplicableItem = result.data.filter(function (item) { return item.description == 'N/A'; });
                    regDocumentTypes = {
                        nricBlue: nricBlueItem.length > 0 ? nricBlueItem[0].id : '',
                        nricPink: nricPinkItem.length > 0 ? nricPinkItem[0].id : '',
                        fin: finItem.length > 0 ? finItem[0].id : '',
                        notApplicable: notApplicableItem.length > 0 ? notApplicableItem[0].id : ''
                    };
                });

                masterData.getMasterDataTypeItems({
                    type: 'LiftLanding'
                }).then(function (result) {
                    vm.liftLandingMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'LivingArrangement'
                }).then(function (result) {
                    vm.livingArrangementMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'MarialStatus'
                }).then(function (result) {
                    vm.maritalStatusMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'PreviousFeedingStatus'
                }).then(function (result) {
                    vm.previousFeedingStatusMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'CurrentFeeding'
                }).then(function (result) {
                    vm.currentFeedingMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'PreviousToileting'
                }).then(function (result) {
                    vm.previousToiletingMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'CurrentToileting'
                }).then(function (result) {
                    vm.currentToiletingMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'PreviousMobility'
                }).then(function (result) {
                    vm.previousMobilityMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'CurrentMobility'
                }).then(function (result) {
                    vm.currentMobilityMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'ResidentAssessmentFormSource'
                }).then(function (result) {
                    vm.rafSourceMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'ResidentAssessmentFormCategory'
                }).then(function (result) {
                    vm.rafCategoryMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'ReferredBy'
                }).then(function (result) {
                    vm.referredByMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'CurrentLocation'
                }).then(function (result) {
                    vm.currentLocationMaster = result.data;
                });

                masterData.getMasterDataTypeItems({
                    type: 'PatientAcuity'
                }).then(function (result) {
                    vm.patientAcuityMaster = result.data;
                });
            };

            // Lookup Master Data
            function loadAllMasterLookups() {
                masterLookup.getMasterTypeItems({
                    type: 'Country'
                }).then(function (result) {
                    vm.countryMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Race'
                }).then(function (result) {
                    vm.raceMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Citizenship'
                }).then(function (result) {
                    vm.citizenshipMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Highest Education'
                }).then(function (result) {
                    vm.highestEducationMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Nationality'
                }).then(function (result) {
                    vm.nationalityMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Religion'
                }).then(function (result) {
                    vm.religionMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Occupation'
                }).then(function (result) {
                    vm.occupationMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Type Of Accommodation'
                }).then(function (result) {
                    vm.typesOfAccommodationMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Hospital'
                }).then(function (result) {
                    vm.hospitalsMaster = result.data;
                });
            };
            //Jquery functions
            function bindJqueryEvents() {
                $timeout(function () { }, 0);
            };
        }
    ]);
})();