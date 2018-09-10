(function () {
    appModule.controller('tenant.views.person.personView', [
        '$scope', '$rootScope', '$timeout', '$filter', 'commonFormFunction', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', 'abp.services.app.userFavourite', '$stateParams', 'abp.services.app.person', '$anchorScroll', '$location', 'abp.services.app.user', '$uibModal', '$rootScope', '$previousState', '$state', 'stateNavigation',
        function ($scope, $rootScope, $timeout, $filter, commonFormFunction, masterData, masterLookup, userFavouriteService, $stateParams, personService, $anchorScroll, $location, userService, $uibModal, $rootScope, $previousState, $state, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 265;
            vm.appPath = abp.appPath;
            vm.personHeaderisPinned = true;
            vm.loading = false;
            vm.isCreateMode = !$stateParams.id;
            vm.age = 0;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.mode = 'view';
            vm.isNew = 0;
            vm.bioData = {};
            vm.person = {};
            vm.hasAllergy = false;
            vm.navigationalMenu = [];
            vm.personTabs = {};

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;
            vm.appPath = abp.appPath;

            $scope.personDetailsViewEnabled = false;
            $scope.careViewEnabled = false;
            $scope.encounterViewEnabled = false;
            $scope.profileViewEnabled = false;
            $scope.attachmentViewEnabled = false;


            vm.isWatched = false;
            vm.isInCareList = false;

            vm.gotoAnchor = function (key) {
                $location.hash(key);
                $anchorScroll();
            };

            //TODO: Apply this to all
            //Suggestion, put this method in rootScope
            vm.cancel = function () {
                //$rootScope.close();
                var parentIsFunction = typeof $state.current.ncyBreadcrumb.parent === 'function';
                if (parentIsFunction) {
                    var previousState = $state.current.ncyBreadcrumb.parent(null, $stateParams, null);
                } else {
                    var previousState = $state.current.ncyBreadcrumb.parent;
                }
                if (previousState) {
                    $state.go(previousState);
                } else {
                    $rootScope.close();
                }
            }

            vm.prepareSave = function () {
                if (vm.isSavingDisabled == false) {
                    var cardModuleForm = [
                        $scope.vm.bioData.bioDataForm,
                        $scope.vm.contactInfoCtrl.contactInfoForm,
                        $scope.vm.otherInformation.otherInformationForm
                    ];
                    commonFormFunction.setMultipleFormSubmitted(cardModuleForm);
                    //$scope.vm.personTagCtrl.
                    var isValid = $scope.vm.bioData.bioDataForm.$valid &&
                        $scope.vm.contactInfoCtrl.contactInfoForm.$valid &&
                        $scope.vm.otherInformation.otherInformationForm.$valid;
                    if (isValid) {
                        commonFormFunction.setPristine();
                        if ($scope.vm.bioData.person) {
                            for (var prop in $scope.vm.bioData.person) {
                                vm.person[prop] = $scope.vm.bioData.person[prop];
                            }
                        }
                        if ($scope.vm.contactInfoCtrl.person) {
                            for (var prop in $scope.vm.contactInfoCtrl.person) {
                                vm.person[prop] = $scope.vm.contactInfoCtrl.person[prop];
                            }
                        }
                        if ($scope.vm.otherInformation.person) {
                            for (var prop in $scope.vm.otherInformation.person) {
                                vm.person[prop] = $scope.vm.otherInformation.person[prop];
                            }
                        }
                        if ($scope.vm.social.person) {
                            for (var prop in $scope.vm.social.person) {
                                vm.person[prop] = $scope.vm.social.person[prop];
                            }
                        }
                        if ($scope.vm.personTagCtrl.person) {
                            for (var prop in $scope.vm.personTagCtrl.person) {
                                var value = $scope.vm.personTagCtrl.person[prop];
                                vm.person[prop] = $scope.vm.personTagCtrl.person[prop];
                            }
                        }
                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save();
                    }
                }
            }

            vm.load = function () {
                vm.loading = true;
                //if (!$rootScope.entityName) {
                //    // $scope.careViewEnabled = true;
                //} else {
                //    if ($rootScope.personDetailsViewEnabled) {
                //        $scope.personDetailsViewEnabled = $rootScope.personDetailsViewEnabled;
                //        delete $rootScope.personDetailsViewEnabled;
                //    } else if ($rootScope.encounterViewEnabled) {
                //        $scope.encounterViewEnabled = $rootScope.encounterViewEnabled;
                //        delete $rootScope.encounterViewEnabled;
                //    } else if ($rootScope.profileViewEnabled) {
                //        $scope.profileViewEnabled = $rootScope.profileViewEnabled;
                //        delete $rootScope.profileViewEnabled;
                //    }

                //    setTimeout(function () {
                //        vm.gotoAnchor($rootScope.entityName);
                //        delete $rootScope.entityName;
                //    }, 2000);
                //}

                if ($stateParams.id) {
                    if ($stateParams.isNotPatient) {
                        vm.personTabs = stateNavigation.setDefaultTab(app.consts.personTabs.tabs.personDetails);
                    } else {
                        vm.personTabs = stateNavigation.getTargetPersonTab();
                    }
                    vm.setCardNavigation(vm.personTabs);
                    vm.loading = true;
                    personService.getPersonForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        vm.setCardNavigation(vm.personTabs);
                        var data = result.data;
                        // bind to person
                        vm.person = data;
                        vm.age = $filter("ageFilter")(vm.person.dateOfBirth);

                        // TODO: Improve logic
                        if (vm.person.nricAddress) {
                            prepareAddressLines('nricAddress');
                        }
                        if (vm.person.residentialAddress) {
                            prepareAddressLines('residentialAddress');
                        }
                        if (vm.person.billingAddress) {
                            prepareAddressLines('billingAddress');
                        }

                        $scope.$broadcast('loadBioDataView', null);
                        vm.loading = false;
                    });

                    personWatchedOrCared();

                    personService.personHasAllergy($stateParams.id).then(function (result) {
                        vm.hasAllergy = result.data;
                    });
                } else {
                    vm.personTabs = stateNavigation.setDefaultTab(app.consts.personTabs.tabs.personDetails);
                    vm.isNew = 1;
                    vm.mode = 'edit';
                    vm.loading = false;

                    personService.getPersonForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        vm.setCardNavigation(vm.personTabs);
                        // bind to person
                        vm.person = result.data;

                        $scope.$broadcast('SetPersonDefaults', vm.person);
                    }).finally(function () {
                        vm.loading = false;
                    });

                    // Default to Person Details Tab
                    $scope.personDetailsViewEnabled = true;
                }
            };

            vm.watchPerson = function (id) {
                userFavouriteService.addPersonToWatchList(id).then(function (result) {
                    abp.notify.info(app.localize('AddedPersonToWatchList'));
                    vm.isWatched = true;
                }).finally(function () {
                    $rootScope.$broadcast('refreshPersonWatchList');
                    personWatchedOrCared();
                });
            };

            vm.unWatchPerson = function (id) {
                userFavouriteService.removePersonFromWatchList(id).then(function (result) {
                    abp.notify.info(app.localize('RemovedPersonFromWatchList'));
                    vm.isWatched = false;
                }).finally(function () {
                    $rootScope.$broadcast('refreshPersonWatchList');
                    personWatchedOrCared();
                });
            };

            vm.addToCareList = function (id) {
                userFavouriteService.addPersonToCareList(id).then(function (result) {
                    abp.notify.info(app.localize('AddedPersonToMyCareList'));
                    vm.isInCareList = true;
                }).finally(function () {
                    personWatchedOrCared();
                });

            };

            vm.removeFromCareList = function (id) {
                userFavouriteService.removePersonFromCareList(id).then(function (result) {
                    abp.notify.info(app.localize('RemovedPersonFromMyCareList'));
                    vm.isInCareList = false;
                }).finally(function () {
                    personWatchedOrCared();
                });
            };

            function personWatchedOrCared() {
                userFavouriteService.isPersonInUserWatchedCared($stateParams.id).then(function (result) {
                    vm.isWatched = result.data.isPersonWatched;
                    vm.isInCareList = result.data.isPersonCared;
                });
            };

            // TODO: use template?
            function prepareAddressLines(type) {
                var part1 = [
                    vm.person[type].blockNo,
                    vm.person[type].unitNo,
                    vm.person[type].bulidingName
                ].filter(isNotNullAndEmpty).join(", ");

                var part2 = [vm.person[type].streetName].filter(isNotNullAndEmpty).join(" ");
                var part3 = [getDescription(vm.person[type].country), vm.person[type].postalCode];

                var line1 = [
                    ([part1, part2].filter(isNotNullAndEmpty).join(', ')),
                    part3.filter(isNotNullAndEmpty).join(' ')
                ].filter(isNotNullAndEmpty).join('<br />');
                var line2 = [
                    getDescription(vm.person[type].ownership),
                    getDescription(vm.person[type].typeOfAccommodation)
                ].filter(isNotNullAndEmpty).join(" &bull; ");

                vm.person[type].line1 = line1;
                vm.person[type].line2 = line2;
            }

            function isNotNullAndEmpty(value) {
                return value != undefined && value != '';
            }

            function getDescription(master) {
                if (master != null && master.description != null) {
                    return master.description;
                }

                return undefined;
            }

            $scope.lastEvent = null;

            $scope.$on('UpdatePerson', function (event, data) {
                if (data) {
                    $scope.lastEvent = event;

                    for (var prop in data) {
                        vm.person[prop] = data[prop];
                    }

                    vm.save();
                }
            });

            vm.save = function (backToListing) {

                if ($stateParams.id) {
                    personService.updatePerson(
                        vm.person
                    ).then(function (result) {
                        $scope.$broadcast('PersonUpdated', { event: $scope.lastEvent, success: true });
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.load();
                    }).finally(function () {
                        vm.loading = false;
                        vm.isSavingDisabled = false;
                    });
                } else {
                    personService.createPerson(
                        vm.person
                    ).then(function (result) {
                        $scope.$broadcast('PersonUpdated', { event: $scope.lastEvent, success: true });
                        abp.notify.info(app.localize('SavedSuccessfully'));

                        if (backToListing) {
                            $location.path('/tenant/person');
                        } else {
                            $location.path('/tenant/person/' + result.data);
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.isSavingDisabled = false;
                    });
                }
            };

            vm.openCreateOrEditModal = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/person/createOrEditCourseSkill.cshtml',
                    controller: 'tenant.views.person.createOrEditCourseSkill as vm',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return id;
                        },
                        // Workaround to update life long learning
                        person: function () {
                            return vm.person;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //vm.load();
                });
            };

            function convertToString(value) {
                return value == null ? '' : value + '';
            }

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

            // masters
            vm.chineseHoroscopeMaster = [];
            vm.registrationDocumentMaster = [];

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

            vm.delete = function () {
                if (!vm.permissions.delete) {
                    return;
                }

                abp.message.confirm(
                    app.localize('RecordDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            personService.deletePerson(
                                vm.person.id
                            ).then(function () {
                                abp.notify.info("Deleted");
                            });
                        }
                    }
                );
            };

            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Person.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Person.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Person.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Person.Delete'),
                    //activate: abp.auth.hasPermission('Pages.Tenant.Person.Activate'),
                    //deActivate: abp.auth.hasPermission('Pages.Tenant.Person.DeActivate'),
                    createFamilyMember: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Create')
                    //meansTests: abp.auth.hasPermission('Pages.Tenant.MeansTests'),
                    //financialAssistances: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances'),
                    //visitLogs: abp.auth.hasPermission('Pages.Tenant.VisitLogs')
                };

                vm.load();
            };

            vm.setCardNavigation = function (personTabs) {
                if (personTabs.care) {
                    vm.navigationalMenu = [
                        { key: 'OwnNotes', displayName: 'Own Notes', permission: true },
                        { key: 'SharedNotes', displayName: 'Shared Notes', permission: true },
                        { key: 'PersonProblems', displayName: 'Problem List / Care Plan', permission: (abp.auth.hasPermission('Pages.Tenant.PersonProblems') || abp.auth.hasPermission('Pages.Tenant.CarePlans')) },
                        { key: 'ProgressNote', displayName: 'Progress Note', permission: abp.auth.hasPermission('Pages.Tenant.ProgressNotes') }
                    ];
                } else if (personTabs.encounter) {
                    vm.navigationalMenu = [
                        { key: 'VisitLogs', displayName: 'Visit Logs', permission: abp.auth.hasPermission('Pages.Tenant.VisitLogs') },
                        { key: 'Hospitalization', displayName: 'Hospitalization', permission: abp.auth.hasPermission('Pages.Tenant.Hospitalization') },
                        { key: 'MedicalAppointment', displayName: 'Medical Appointment', permission: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment') }
                    ];
                } else if (personTabs.personDetails) {
                    vm.navigationalMenu = [
                        { key: 'BioData', displayName: 'Bio Data', permission: true },
                        { key: 'ContactInformation', displayName: 'Contact Information', permission: true },
                        { key: 'OtherInformation', displayName: 'Other Information', permission: true },
                        { key: 'LanguageDialect', displayName: 'Language Dialect', permission: abp.auth.hasPermission('Pages.Tenant.LanguageDialects') },
                        { key: 'MeansTesting', displayName: 'Means Testing', permission: abp.auth.hasPermission('Pages.Tenant.MeansTests') },
                        { key: 'FinancialAssistance', displayName: 'Financial Assistance', permission: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances') },
                        { key: 'FamilyMembersCaregiver', displayName: 'Family Members Caregiver', permission: true },
                        { key: 'Social', displayName: 'Social', permission: true },
                        { key: 'Genogram', displayName: 'Genogram', permission: (abp.auth.hasPermission('Pages.Tenant.Genogram')) },
                        { key: 'SocialReports', displayName: 'Social Reports', permission: abp.auth.hasPermission('Pages.Tenant.SocialReports') },
                        { key: 'LifeEvent', displayName: 'Life Event', permission: true },
                        { key: 'HashSymbolTags', displayName: '# Tags', permission: true },

                    ];
                } else if (personTabs.profile) {
                    vm.navigationalMenu = [
                        { key: 'Allergies', displayName: 'Allergies', permission: abp.auth.hasPermission('Pages.Tenant.Allergies') },
                        { key: 'Prescription', displayName: 'Prescription', permission: abp.auth.hasPermission('Pages.Tenant.Prescriptions') },
                        { key: 'Investigations', displayName: 'Investigations', permission: abp.auth.hasPermission('Pages.Tenant.Investigations') },
                        { key: 'Diagnosis', displayName: 'Diagnosis', permission: abp.auth.hasPermission('Pages.Tenant.Diagnosis') },
                        { key: 'Raisoft', displayName: 'Assessment - interRAI', permission: abp.auth.hasPermission('Pages.Tenant.Raisoft') },
                        { key: 'Assessment', displayName: 'Assessment', permission: abp.auth.hasPermission('Pages.Tenant.Assessment') },
                        { key: 'medicalhistories', displayName: 'Medical History', permission: abp.auth.hasPermission('Pages.Tenant.MedicalHistory') },
                        { key: 'specialcares', displayName: 'Special Cares', permission: abp.auth.hasPermission('Pages.Tenant.SpecialCare') },
                        { key: 'VitalSign', displayName: 'Vital Sign', permission: abp.auth.hasPermission('Pages.Tenant.VitalSign') },
                        { key: 'MedicalAlert', displayName: 'Medical Alert', permission: abp.auth.hasPermission('Pages.Tenant.MedicalAlert') }
                    ];
                } else if (personTabs.episode) {
                    vm.navigationalMenu = [
                        { key: 'Episode', displayName: 'Episode', permission: true },
                    ];
                }
            };

            vm.init();


            $scope.$watch('$viewContentLoaded', bindJqueryEvents);

            function bindJqueryEvents() {
                $timeout(function () { }, 0);
            };

            vm.addFamilyMembers = function () {
                $location.path('/tenant/familyMembers/');
            };

            vm.printPatientLabel = function () {
                personService.printPatientLabel(
                    $stateParams.id
                ).then(function (result) {
                    var url = result.data;
                    url = window.location.origin + vm.appPath + url;

                    var reportWindow = window.open();
                    reportWindow.location = url;
                    reportWindow.target = '_blank';
                    reportWindow.locationbar.visible = false;
                    reportWindow.focus();
                });
            };
        }
    ]);
})();