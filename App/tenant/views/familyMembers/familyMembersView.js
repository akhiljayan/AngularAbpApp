(function () {
    appModule.controller('tenant.views.familyMembers.familyMembersView', [
        '$scope', '$rootScope', '$timeout', '$stateParams', 'commonFormFunction', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', 'abp.services.app.commonLookup', '$anchorScroll', '$location', 'abp.services.app.user', 'abp.services.app.familyMember', '$uibModal', 'abp.services.app.person', '$state', 'stateNavigation',
        function ($scope, $rootScope, $timeout, $stateParams, commonFormFunction, masterData, masterLookup, commonLookupService, $anchorScroll, $location, userService, familyMemberService, $uibModal, personService, $state, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 265;

            $scope.page = 0;
            vm.personHeaderisPinned = true;
            vm.appPath = abp.appPath;
            vm.showFamilyDetails = 0;
            vm.showDeleteBtn = 0;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.familyMemberAge = 0;
            vm.personDisabled = 0;
            vm.familyMember = {};
            vm.familyMember.familyMemberPerson = {};
            vm.isCreateMode = !$stateParams.familyId;
            vm.loading = false;
            vm.close = 0;
            vm.result = $scope.DefaultPageSize;

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;

            /*---Use in BioData,Contact Info, Other Info---*/
            vm.person = {};
            vm.mode = "view";
            vm.isNew = 0;
            vm.isFamilyMembers = 1;

            vm.navigationalMenu = [
                { key: 'General', displayName: 'General', permission: true },
                { key: 'BioData', displayName: 'BioData', permission: true },
                { key: 'ContactInformation', displayName: 'Contact Information', permission: true },
                { key: 'OtherInformation', displayName: 'Other Information', permission: true },
                { key: 'DetailsInformation', displayName: 'Details Information', permission: true }
            ];

            /*---Use in BioData,Contact Info, Other Info---*/

            // masters
            //vm.salutationMaster = [];
            //vm.genderMaster = [];
            //vm.countryMaster = [];
            //vm.raceMaster = [];
            //vm.citizenshipMaster = [];
            //vm.highestEducationMaster = [];
            //vm.nationalityMaster = [];
            //vm.religionMaster = [];
            //vm.occupationMaster = [];
            //vm.ownershipMaster = [];
            //vm.typesOfAccommodationMaster = [];
            //vm.maritalStatusMaster = [];
            //vm.liftLandingMaster = [];
            //vm.livingArrangementMaster = [];
            //vm.relationshipMaster = []
            //vm.emergencyContactPersonMaster = [];
            //vm.financialContactPersonMaster = [];
            //vm.caregiverTrainingProviderMaster = [];

            vm.familyMemberMaster = [];
            vm.patientMaster = [];
            vm.chineseHoroscopeMaster = [];
            vm.registrationDocumentMaster = [];
            vm.caregiverTrainedByMaster = [];

            vm.callbackChineseHoroscope = function (result) {
                vm.chineseHoroscopeMaster = result.data;
            }

            vm.callbackRegistrationDocument = function (result) {
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
            }
            var fetchPerson = function (search, page, result, concat, id) {
                commonLookupService.findActivePatient(
                    {
                        id: id,
                        filter: search,
                        skipCount: page,
                        maxResultCount: result
                    }
                ).then(function (result) {
                    if (concat) {
                        vm.patientMaster = vm.patientMaster.concat(result.data.items);
                    } else {
                        vm.patientMaster = result.data.items;
                    }

                });
            }
            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Delete'),
                    //activate: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Activate'),
                    //deactivate: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Deactivate')
                };

                // Drop Down Master Data 
                //masterData.getMasterDataTypeItems({
                //    type: 'Salutation'
                //}).then(function (result) {
                //    vm.salutationMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'Gender'
                //}).then(function (result) {
                //    vm.genderMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'OwnerShip'
                //}).then(function (result) {
                //    vm.ownershipMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'RegistrationDocument'
                //}).then(function (result) {
                //    vm.registrationDocumentMaster = result.data;

                //    var nricBlueItem = result.data.filter(function (item) { return item.description == 'NRIC Blue'; });
                //    var nricPinkItem = result.data.filter(function (item) { return item.description == 'NRIC Pink'; });
                //    var finItem = result.data.filter(function (item) { return item.description == 'Fin'; });
                //    var notApplicableItem = result.data.filter(function (item) { return item.description == 'N/A'; });

                //    regDocumentTypes = {
                //        nricBlue: nricBlueItem.length > 0 ? nricBlueItem[0].id : '',
                //        nricPink: nricPinkItem.length > 0 ? nricPinkItem[0].id : '',
                //        fin: finItem.length > 0 ? finItem[0].id : '',
                //        notApplicable: notApplicableItem.length > 0 ? notApplicableItem[0].id : ''
                //    };
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'LiftLanding'
                //}).then(function (result) {
                //    vm.liftLandingMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'LivingArrangement'
                //}).then(function (result) {
                //    vm.livingArrangementMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'MarialStatus'
                //}).then(function (result) {
                //    vm.maritalStatusMaster = result.data;
                //});

                // Lookup Master Data
                //masterLookup.getMasterTypeItems({
                //    type: 'Country'
                //}).then(function (result) {
                //    vm.countryMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Race'
                //}).then(function (result) {
                //    vm.raceMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Citizenship'
                //}).then(function (result) {
                //    vm.citizenshipMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'HighestEducation'
                //}).then(function (result) {
                //    vm.highestEducationMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Nationality'
                //}).then(function (result) {
                //    vm.nationalityMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Religion'
                //}).then(function (result) {
                //    vm.religionMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Occupation'
                //}).then(function (result) {
                //    vm.occupationMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'TypesOfAccommodation'
                //}).then(function (result) {
                //    vm.typesOfAccommodationMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'FamilyMemberLookup'
                //}).then(function (result) {
                //    vm.familyMemberMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Relationship'
                //}).then(function (result) {
                //    vm.relationshipMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'FamilyMemberLookup'
                //}).then(function (result) {
                //    vm.patientMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'EmergencyContactPerson'
                //}).then(function (result) {
                //    vm.emergencyContactPersonMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'FinancialGuarantor'
                //}).then(function (result) {
                //    vm.financialContactPersonMaster = result.data;
                //});

                //masterLookup.getMasterTypeItems({
                //    type: 'Caregiver Training Provider'
                //}).then(function (result) {
                //    vm.caregiverTrainingProviderMaster = result.data;
                //});

                //masterData.getMasterDataTypeItems({
                //    type: 'ChineseHoroscope'
                //}).then(function (result) {
                //    vm.chineseHoroscopeMaster = result.data;
                //});

                commonLookupService.findUsers({ maxResultCount: 100 }).then(function (result) {
                    var options = result.data.items;
                    vm.caregiverTrainedByMaster = options.map(function (option) {
                        return {
                            id: option.value,
                            description: option.name
                        }
                    });
                });

                commonLookupService.findAllPersons().then(function (result) {
                    vm.familyMemberMaster = result.data.items;
                });


                vm.load();
            };

            vm.load = function () {
                vm.loading = true;
                if ($stateParams.personId) {
                    vm.familyMember.personId = $stateParams.personId;
                    vm.familyMember.referralId = $stateParams.referralId;
                    vm.personDisabled = 1;
                }

                if (!$stateParams.familyId) {
                    //New Added for disable to display Save, Cancel button
                    vm.isNew = 1;
                    vm.mode = 'edit';
                    vm.loading = false;

                    fetchPerson('', 0, vm.result, false, vm.familyMember.personId || $scope.EmptyGuid);


                } else {
                    vm.personDisabled = 1;
                    vm.showFamilyDetails = 1;
                    vm.showDeleteBtn = vm.permissions.delete && 1;

                    familyMemberService.getFamilyMemberByGuid(
                        $stateParams.familyId
                    ).then(function (result) {
                        var data = result.data;

                        // TODO: Workaround for integer value option
                        if (data.caregiverTrainedById) {
                            data.caregiverTrainedById = data.caregiverTrainedById + '';
                        }

                        vm.familyMember = data;
                        //vm.age = vm.calculateAge(vm.familyMember.familyMemberPerson.dateOfBirth);

                        //vm.person use in BioData, Contact Info, Other Info
                        vm.person = vm.familyMember.familyMemberPerson;

                        fetchPerson('', 0, vm.result, false, vm.familyMember.personId);

                        $scope.$broadcast('familyLoadBioDataView', null);
                        $scope.$broadcast('familyLoadContactInfoView', null);
                        $scope.$broadcast('familyLoadOtherInfoView', null);
                        $scope.$broadcast('familyLoadDetailsinfoView', null);
                        $scope.$broadcast('familyLoadGeneralView', null);


                        vm.loading = false;
                    });
                }
            };

            vm.backToPrev = function () {
                if ($stateParams.referralId) {
                    stateNavigation.closeToReferral(app.consts.referralTabs.tabs.social, $stateParams.referralId);
                } else if ($stateParams.personId && typeof $stateParams.membershipId == 'undefined') {
                    stateNavigation.closeToPerson(app.consts.personTabs.tabs.personDetails, $stateParams.personId);
                } else if ($stateParams.membershipId && $stateParams.personId) {
                    $rootScope.socialViewEnabled = true;
                    $rootScope.entityName = 'FamilyMembersCaregiver';

                    $state.go('tenant.membershipsEdit', {
                        membershipId: $stateParams.membershipId
                    });
                } else {
                    $state.go('tenant.familyMembers');
                }
            };

            vm.prepareSave = function () {

                if (vm.isSavingDisabled == false) {

                    $scope.$broadcast('check-select-ui-required');

                    var cardModuleForm = [
                        $scope.vm.generalData.generalDataForm,
                        $scope.vm.detailsInfo.detailsInfoForm,
                        $scope.vm.bioData.bioDataForm,
                        $scope.vm.contactInfoCtrl.contactInfoForm,
                        $scope.vm.otherInformation.otherInformationForm
                    ];

                    commonFormFunction.setMultipleFormSubmitted(cardModuleForm);

                    var isValid = $scope.vm.generalData.generalDataForm.$valid &&
                        $scope.vm.detailsInfo.detailsInfoForm.$valid &&
                        $scope.vm.bioData.bioDataForm.$valid &&
                        $scope.vm.contactInfoCtrl.contactInfoForm.$valid &&
                        $scope.vm.otherInformation.otherInformationForm.$valid;

                    if (isValid) {

                        commonFormFunction.setPristine();

                        if (vm.person.id) {
                            vm.familyMember.familyMemberPerson.id = vm.person.id;
                            vm.familyMember.familyMemberPerson.tenantId = vm.person.tenantId;
                            vm.familyMember.familyMemberPerson.isActive = vm.person.isActive;
                        }

                        if ($scope.vm.generalData.familyMember) {
                            for (var prop in $scope.vm.generalData.familyMember) {
                                vm.familyMember[prop] = $scope.vm.generalData.familyMember[prop];
                            }
                        }

                        if ($scope.vm.bioData.person) {
                            for (var prop in $scope.vm.bioData.person) {
                                vm.familyMember.familyMemberPerson[prop] = $scope.vm.bioData.person[prop];
                            }

                            if ('registrationDocumentType' in vm.familyMember.familyMemberPerson) {
                                //Remove registrationDocumentType
                                delete vm.familyMember.familyMemberPerson['registrationDocumentType'];
                            }
                        }

                        if ($scope.vm.contactInfoCtrl.person) {
                            for (var prop in $scope.vm.contactInfoCtrl.person) {
                                vm.familyMember.familyMemberPerson[prop] = $scope.vm.contactInfoCtrl.person[prop];
                            }
                        }

                        if ($scope.vm.otherInformation.person) {
                            for (var prop in $scope.vm.otherInformation.person) {
                                vm.familyMember.familyMemberPerson[prop] = $scope.vm.otherInformation.person[prop];
                            }
                        }

                        if ($scope.vm.detailsInfo.familyMember) {
                            for (var prop in $scope.vm.detailsInfo.familyMember) {
                                vm.familyMember[prop] = $scope.vm.detailsInfo.familyMember[prop];
                            }
                        }

                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save();
                    }
                }
            };

            vm.save = function () {
                if (vm.familyMember.id) {
                    familyMemberService.updateFamilyMember(
                        vm.familyMember
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.load();
                    }).finally(function () {
                        vm.isSavingDisabled = false;
                    });
                } else {
                    familyMemberService.createFamilyMember(
                        vm.familyMember
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        if (!vm.close) {
                            $state.go('tenant.familyMembersDetail', {
                                familyId: result.data,
                                referralId: $stateParams.referralId,
                                personId: $stateParams.personId,
                                membershipId: $stateParams.membershipId
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

            $scope.$on('UpdateFamilyMember', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;

                    for (var prop in data) {
                        vm.familyMember[prop] = data[prop];
                    }

                    vm.updateFamilyMember();
                }
            });

            $scope.$on('UpdatePerson', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;

                    for (var prop in data) {
                        vm.person[prop] = data[prop];
                    }

                    vm.updatePerson();
                }
            });

            vm.updateFamilyMember = function () {
                familyMemberService.updateFamilyMember(
                    vm.familyMember
                ).then(function (result) {
                    $scope.$broadcast('FamilyMemberUpdated', { event: $scope.lastEvent, success: true });
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.load();
                });
            }

            vm.updatePerson = function () {
                personService.updatePerson(
                    vm.person
                ).then(function (result) {
                    $scope.$broadcast('PersonUpdated', { event: $scope.lastEvent, success: true });
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.load();
                });
            }

            vm.delete = function () {
                abp.message.confirm(
                    app.localize('RecordDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            familyMemberService.deleteFamilyMember(
                                vm.familyMember.id
                            ).then(function () {
                                if ($stateParams.referralId) {
                                    $state.go('tenant.referralDetail', {
                                        id: $stateParams.referralId
                                    });
                                } else if ($stateParams.personId && typeof $stateParams.membershipId == 'undefined') {
                                    $state.go('tenant.personDetail', {
                                        id: $stateParams.personId
                                    });
                                } else if ($stateParams.membershipId && $stateParams.personId) {
                                    $state.go('tenant.membershipsEdit', {
                                        membershipId: $stateParams.membershipId
                                    });
                                } else {
                                    $state.go('tenant.familyMembers');
                                }
                            });
                        }
                    }
                );
            };

            vm.gotoAnchor = function (key) {
                $location.hash(key);
                $anchorScroll();
            };

            $scope.$on('FamilyMemberChanged', function (event, data) {
                var selectedPersonId = data.selectedId;

                if (selectedPersonId == null) {
                    selectedPersonId = $scope.EmptyGuid;
                }

                personService.getPerson(
                    selectedPersonId
                ).then(function (result) {
                    vm.person = result.data;

                    vm.familyMember.familyMemberPerson = result.data;

                    if (vm.familyMember.familyMemberPerson.id == null) {
                        vm.showFamilyDetails = false;
                        vm.familyMember.familyMemberPersonId = null;
                        vm.familyMember.isLegalNextOfKin = null;
                        vm.familyMember.relationshipId = null;

                        $scope.$broadcast('familyLoadGeneralView', null);
                    }
                    else {
                        vm.showFamilyDetails = true;
                    }

                    $scope.$broadcast('familyLoadBioDataView', null);
                    $scope.$broadcast('familyLoadContactInfoView', null);
                    $scope.$broadcast('familyLoadOtherInfoView', null);
                });
            });

            $scope.$on('RegistrationDocumentNumberOnBlur', function (event, data) {
                personService.getPersonByNric(
                    data
                ).then(function (result) {
                    if (result.data) {
                        vm.person = result.data;
                        vm.familyMember.familyMemberPerson = result.data;
                        vm.generalData.familyMember.familyMemberPersonId = vm.person.id;

                        $scope.$broadcast('familyLoadBioDataView', null);
                        $scope.$broadcast('familyLoadContactInfoView', null);
                        $scope.$broadcast('familyLoadOtherInfoView', null);
                    } else {
                        abp.notify.info(app.localize('RecordNotFoundMessage'));
                    }
                });
            });

            //Page Load
            vm.init();

            // TODO: Use filter?
            $scope.vm.returnBoolValue = function (value) {
                if (value == true)
                    return 'Yes';
                else if (value == false)
                    return 'No';
                else
                    return '-';
            }

            $scope.displayEmergencyContactFormat = function (value) {
                if (value != null) {
                    return value.description + ' (' + value.code + ')';
                }
                else {
                    return "-";
                }
            }




        }
    ]);
})();