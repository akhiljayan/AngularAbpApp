(function () {
    appModule.component('personCareList', {
        bindings: {
            isPersonSelected: '=',
            patientIdTimeLine: '=',
            personFullname: '=',
            isPatient: '=',
            timelineLoading: '='
        },
        controllerAs: 'vm',
        controller: ['$scope', '$rootScope', '$location', '$anchorScroll', '$timeout', '$filter', '$state', '$uibModal', 'abp.services.app.person', 'abp.services.app.userFavourite', 'abp.services.app.masterLookUp', 'sliderState',
            function ($scope, $rootScope, $location, $anchorScroll, $timeout, $filter, $state, $uibModal, personService, userFavouriteService, lookUpService, sliderState) {
                var vm = this;
                vm.filter = null;
                vm.careList = true;
                vm.selectedPerson = '';
                vm.loadingData = false;
                vm.view = 0;
                vm.appPath = abp.appPath;
                vm.totalHospitalized = 0;
                $anchorScroll.yOffset = 70;

                vm.Allfilters = app.consts.careBoardFilters;
                vm.serviceTypeStatus = app.consts.referralServiceTypeStatus;

                vm.mainFilters = app.consts.careBoardFilters.mainFilters;
                vm.personFilters = app.consts.careBoardFilters.personRelatedFilters;
                vm.heading = '';
                vm.icon = '';

                vm.personTotal = 0;
                vm.pageSizes = [5, 10, 20, 50, 100];
                vm.pageSize = 50;
                vm.requestParams = { maxResultCount: vm.pageSize, skipCount: 0 };
                vm.currentPage = 1;
                vm.recordFrom = 0;
                vm.recordTo = 0;


                vm.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                vm.$onInit = function () {
                    vm.permissions = {
                        personCreate: abp.auth.hasPermission('Pages.Tenant.Person.Create'),
                    };
                    var personFilter = $state.current.filter;
                    if (personFilter) {
                        if (personFilter.filterType == "MainFilter") {
                            vm.changeMainFilter(personFilter.filter);
                        } else {
                            vm.changePersonView(personFilter.filter);
                        }
                    } else {
                        userFavouriteService.ifUserHasMyCareList().then(function (result) {
                            if (result.data) {
                                vm.boardfilter = app.consts.careBoardFilters.mainFilters.MyCareList;
                            } else {
                                vm.view = app.consts.careBoardFilters.personRelatedFilters.Admitted;
                                vm.boardfilter = app.consts.careBoardFilters.mainFilters.AllPersons;
                            }
                            vm.loadData();
                        });
                    }
                };

                vm.loadData = function () {
                    if (vm.boardfilter == app.consts.careBoardFilters.mainFilters.MyCareList) {
                        vm.loadMyCareList();
                    }
                    else if (vm.boardfilter == app.consts.careBoardFilters.mainFilters.AllPersons) {
                        if (vm.view) {
                            if (vm.view == app.consts.careBoardFilters.personRelatedFilters.Admitted) {
                                vm.loadAdmittedPersons();
                            } else if (vm.view == app.consts.careBoardFilters.personRelatedFilters.HospitalizationList) {
                                vm.loadHospitalizationList();
                            } else if (vm.view == app.consts.careBoardFilters.personRelatedFilters.Members) {
                                vm.loadAllMembers();
                            }                                
                        }
                        else {
                            vm.loadPersons();
                        }

                    }
                };

                vm.loadMyCareList = function () {
                    vm.loading = true;
                    userFavouriteService.getUserPersonCarePagedResults($.extend({
                        filter: vm.filter,
                    }, vm.requestParams)).then(function (result) {
                        vm.heading = 'My Care List';
                        vm.icon = $filter('filter')(vm.mainFilters.values, { value: vm.mainFilters.MyCareList })[0].icon;
                        vm.careList = true;
                        vm.persons = result.data.items;
                        vm.personTotal = result.data.totalCount;

                        vm.changeFromToCount();

                        if (vm.personTotal > 0) {
                            for (var i = 0; i < vm.personTotal; i++) {
                                vm.persons[i].isNotWatched = false;
                                vm.persons[i].isWatched = false;
                                vm.persons[i].isNotInCareList = false;
                                vm.persons[i].isInCareList = false;
                                // Only check for this particular Person if he/she is a patient
                                if (vm.persons[i].isPatient == true) {
                                    // Check the Watched Person List if this particular Person is in the user's Watch List or not
                                    var filteredItem = $filter('filter')($rootScope.watchedPersonList, { id: vm.persons[i].personId }, true);
                                    var filtredPersonCareList = $filter('filter')($rootScope.userPersonCareList, { personId: vm.persons[i].personId }, true);
                                    if (filteredItem.length == 0) { // If not found in Watch List
                                        vm.persons[i].isNotWatched = true;
                                    } else { // If found in Watch List
                                        vm.persons[i].isWatched = true;
                                    }
                                    if (filtredPersonCareList == 0) {
                                        vm.persons[i].isInCareList = false;
                                    } else {
                                        vm.persons[i].isInCareList = true;
                                    }
                                }
                            }
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.loadingData = false;
                    });
                };

                vm.loadPersons = function () {
                    vm.loading = true;
                    if (vm.view) {
                        vm.viewText = $filter('filter')(vm.personFilters.values, { value: vm.view })[0];
                        vm.heading = 'Person - ' + vm.viewText.description;
                        vm.icon = vm.viewText.icon;
                    } else {
                        vm.heading = 'All Person';
                        vm.icon = $filter('filter')(vm.mainFilters.values, { value: vm.mainFilters.AllPersons })[0].icon;
                    }

                    personService.getPersonsInCareBord($.extend({ filter: vm.filter, view: vm.view }, vm.requestParams)).then(function (result) {
                        vm.personTotal = result.data.totalCount;
                        vm.persons = result.data.items;

                        vm.changeFromToCount();

                        if (vm.personTotal > 0) {
                            for (var i = 0; i < vm.personTotal; i++) {
                                vm.persons[i].isNotWatched = false;
                                vm.persons[i].isWatched = false;
                                vm.persons[i].isNotInCareList = false;
                                vm.persons[i].isInCareList = false;
                                // Only check for this particular Person if he/she is a patient
                                if (vm.persons[i].isPatient == true) {
                                    // Check the Watched Person List if this particular Person is in the user's Watch List or not
                                    var filteredItem = $filter('filter')($rootScope.watchedPersonList, { id: vm.persons[i].id }, true);
                                    var filtredPersonCareList = $filter('filter')($rootScope.userPersonCareList, { personId: vm.persons[i].id }, true);
                                    if (filteredItem.length == 0) { // If not found in Watch List
                                        vm.persons[i].isNotWatched = true;
                                    } else { // If found in Watch List
                                        vm.persons[i].isWatched = true;
                                    }
                                    if (filtredPersonCareList == 0) {
                                        vm.persons[i].isInCareList = false;
                                    } else {
                                        vm.persons[i].isInCareList = true;
                                    }
                                }
                            }
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.loadingData = false;
                    });
                };

                vm.loadAdmittedPersons = function () {
                    vm.loading = true;
                    if (vm.view) {
                        vm.viewText = $filter('filter')(vm.personFilters.values, { value: vm.view })[0];
                        vm.heading = 'Person - ' + vm.viewText.description;
                        vm.icon = vm.viewText.icon;
                    }
                    personService.getAdmittedPersonsInCareBord($.extend({ filter: vm.filter, view: vm.view }, vm.requestParams)).then(function (result) {
                        vm.personTotal = result.data.totalCount;
                        vm.persons = result.data.items;

                        vm.changeFromToCount();

                        if (vm.personTotal > 0) {
                            for (var i = 0; i < vm.personTotal; i++) {
                                vm.persons[i].isNotWatched = false;
                                vm.persons[i].isWatched = false;
                                vm.persons[i].isNotInCareList = false;
                                vm.persons[i].isInCareList = false;
                                // Only check for this particular Person if he/she is a patient
                                if (vm.persons[i].isPatient == true) {
                                    // Check the Watched Person List if this particular Person is in the user's Watch List or not
                                    var filteredItem = $filter('filter')($rootScope.watchedPersonList, { id: vm.persons[i].id }, true);
                                    var filtredPersonCareList = $filter('filter')($rootScope.userPersonCareList, { personId: vm.persons[i].id }, true);
                                    if (filteredItem.length == 0) { // If not found in Watch List
                                        vm.persons[i].isNotWatched = true;
                                    } else { // If found in Watch List
                                        vm.persons[i].isWatched = true;
                                    }
                                    if (filtredPersonCareList == 0) {
                                        vm.persons[i].isInCareList = false;
                                    } else {
                                        vm.persons[i].isInCareList = true;
                                    }
                                }
                            }
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.loadingData = false;
                    });
                };

                vm.loadHospitalizationList = function () {
                    vm.loading = true;
                    if (vm.view) {
                        vm.viewText = $filter('filter')(vm.personFilters.values, { value: vm.view })[0];
                        vm.heading = vm.viewText.description;
                        vm.icon = vm.viewText.icon;
                    }
                    personService.getHospitalizedPersonsInCareBord($.extend({ filter: vm.filter, view: vm.view }, vm.requestParams)).then(function (result) {
                        vm.personTotal = result.data.totalCount;
                        vm.persons = result.data.items;

                        vm.changeFromToCount();

                        if (vm.personTotal > 0) {
                            for (var i = 0; i < vm.personTotal; i++) {
                                vm.persons[i].isNotWatched = false;
                                vm.persons[i].isWatched = false;
                                vm.persons[i].isNotInCareList = false;
                                vm.persons[i].isInCareList = false;
                                // Only check for this particular Person if he/she is a patient
                                if (vm.persons[i].isPatient == true) {
                                    // Check the Watched Person List if this particular Person is in the user's Watch List or not
                                    var filteredItem = $filter('filter')($rootScope.watchedPersonList, { id: vm.persons[i].id }, true);
                                    var filtredPersonCareList = $filter('filter')($rootScope.userPersonCareList, { personId: vm.persons[i].id }, true);
                                    if (filteredItem.length == 0) { // If not found in Watch List
                                        vm.persons[i].isNotWatched = true;
                                    } else { // If found in Watch List
                                        vm.persons[i].isWatched = true;
                                    }
                                    if (filtredPersonCareList == 0) {
                                        vm.persons[i].isInCareList = false;
                                    } else {
                                        vm.persons[i].isInCareList = true;
                                    }
                                }
                            }
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.loadingData = false;
                    });
                };

                vm.loadAllMembers = function () {
                    vm.loading = true;
                    if (vm.view) {
                        vm.viewText = $filter('filter')(vm.personFilters.values, { value: vm.view })[0];
                        vm.heading = vm.viewText.description;
                        vm.icon = vm.viewText.icon;
                    }
                    personService.getMemberPersonsInCareBord($.extend({ filter: vm.filter, view: vm.view }, vm.requestParams)).then(function (result) {
                        vm.personTotal = result.data.totalCount;
                        vm.persons = result.data.items;

                        vm.changeFromToCount();

                        if (vm.personTotal > 0) {
                            for (var i = 0; i < vm.personTotal; i++) {
                                vm.persons[i].isNotWatched = false;
                                vm.persons[i].isWatched = false;
                                vm.persons[i].isNotInCareList = false;
                                vm.persons[i].isInCareList = false;
                                // Only check for this particular Person if he/she is a patient
                                if (vm.persons[i].isPatient == true) {
                                    // Check the Watched Person List if this particular Person is in the user's Watch List or not
                                    var filteredItem = $filter('filter')($rootScope.watchedPersonList, { id: vm.persons[i].id }, true);
                                    var filtredPersonCareList = $filter('filter')($rootScope.userPersonCareList, { personId: vm.persons[i].id }, true);
                                    if (filteredItem.length == 0) { // If not found in Watch List
                                        vm.persons[i].isNotWatched = true;
                                    } else { // If found in Watch List
                                        vm.persons[i].isWatched = true;
                                    }
                                    if (filtredPersonCareList == 0) {
                                        vm.persons[i].isInCareList = false;
                                    } else {
                                        vm.persons[i].isInCareList = true;
                                    }
                                }
                            }
                        }
                    }).finally(function () {
                        vm.loading = false;
                        vm.loadingData = false;
                    });
                };

                vm.create = function () {
                    $state.go('tenant.personDetailNew');
                };

                vm.changePersonView = function (viewChange) {
                    $state.current.filter = { filterType: "PersonView", filter: viewChange };

                    vm.persons = [];
                    vm.loadingData = true;
                    vm.loading = true;
                    vm.boardfilter = app.consts.careBoardFilters.mainFilters.AllPersons;
                    vm.view = viewChange;
                    vm.reset();
                };

                vm.changeMainFilter = function (filterChange) {
                    $state.current.filter = { filterType: "MainFilter", filter: filterChange };
                    vm.persons = [];
                    vm.loadingData = true;
                    vm.loading = true;
                    vm.boardfilter = filterChange;
                    vm.view = 0;
                    vm.filter = '';
                    vm.reset();
                };

                vm.pageChanged = function () {
                    vm.requestParams.maxResultCount = vm.pageSize;
                    vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
                    vm.loadData();
                    vm.gotoAnchor("person-list");
                };

                vm.changeFromToCount = function () {
                    vm.recordFrom = Math.min(vm.personTotal, (vm.currentPage - 1) * vm.pageSize + 1);
                    vm.recordTo = Math.min(vm.personTotal, vm.currentPage * vm.pageSize);
                };

                vm.reset = function () {
                    vm.currentPage = 1;
                    vm.pageChanged();
                };

                vm.clearFilter = function () {
                    vm.filter = null;
                    vm.init();
                };

                vm.personSelected = function (id) {
                    vm.selectedPerson = id;
                    sliderState.setPerson(id);
                    sliderState.isCurrentStateChangeIsFromSlider = true;
                };

                vm.viewPatient = function (id, isPatient) {
                    vm.selectedPerson = id;
                    sliderState.setPerson(id);
                    sliderState.isCurrentStateChangeIsFromSlider = true;
                    if (!isPatient) {
                        $state.go('tenant.personDetail', { id: id, isNotPatient: "true" });
                    } else {
                        $state.go('tenant.personDetail', { id: id });
                    }

                }

                vm.getLookUpItemName = function (guid) {
                    var desc = '';
                    lookUpService.getMasterTypeItemValue(guid).then(function (result) {
                        desc = result.data;
                    });

                    return desc;
                }

                vm.refreshPersonWatch = function (id, isWatched) {
                    if (vm.personTotal > 0) {
                        for (var i = 0; i < vm.personTotal; i++) {
                            if (vm.persons[i].id == id &&
                                vm.persons[i].isPatient == true) {
                                vm.persons[i].isWatched = false;
                                vm.persons[i].isNotWatched = false;
                                if (isWatched == false) {
                                    vm.persons[i].isNotWatched = true;
                                } else {
                                    vm.persons[i].isWatched = true;
                                }
                            }
                        }
                    }
                };

                vm.refreshPersonCareList = function (id, isInCareList) {
                    if (vm.personTotal > 0) {
                        for (var i = 0; i < vm.personTotal; i++) {
                            if (vm.persons[i].id == id && vm.persons[i].isPatient == true) {
                                if (isInCareList == false) {
                                    vm.persons[i].isInCareList = false;
                                } else {
                                    vm.persons[i].isInCareList = true;
                                }
                            }
                        }
                    }
                };

                vm.watch = function (data) {
                    var id = "";
                    if (vm.boardfilter == vm.Allfilters.mainFilters.AllPersons) {
                        id = data.id;
                    } else {
                        id = data.personId;
                    }
                    userFavouriteService.addPersonToWatchList(id).then(function (result) {
                        //abp.message.success(app.localize('AddedPersonToWatchList'));
                        abp.notify.info(app.localize('AddedPersonToWatchList'));
                        data.isWatched = false;
                        data.isNotWatched = true;
                        vm.loadData();
                        vm.refreshPersonWatch(id, true);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonWatchList');
                    });
                };

                vm.unwatch = function (data) {
                    var id = "";
                    if (vm.boardfilter == vm.Allfilters.mainFilters.AllPersons) {
                        id = data.id;
                    } else {
                        id = data.personId;
                    }

                    userFavouriteService.removePersonFromWatchList(id).then(function (result) {
                        //abp.message.success(app.localize('RemovedPersonFromWatchList'));
                        abp.notify.info(app.localize('RemovedPersonFromWatchList'));
                        data.isWatched = true;
                        data.isNotWatched = false;
                        vm.loadData();
                        vm.refreshPersonWatch(id, false);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonWatchList');
                    });
                };

                vm.addToCareList = function (data) {
                    userFavouriteService.addPersonToCareList(data.id).then(function (result) {
                        //abp.message.success(app.localize('AddedPersonToMyCareList'));
                        abp.notify.info(app.localize('AddedPersonToMyCareList'));
                        data.isInCareList = true;
                        vm.refreshPersonCareList(data.id, true);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonCareList');
                    });
                };

                vm.removeFromCareList = function (data) {
                    var id = "";
                    if (vm.boardfilter == vm.Allfilters.mainFilters.AllPersons) {
                        id = data.id;
                    } else {
                        id = data.personId;
                    }

                    userFavouriteService.removePersonFromCareList(id).then(function (result) {
                        //abp.message.success(app.localize('RemovedPersonFromMyCareList'));
                        abp.notify.info(app.localize('RemovedPersonFromMyCareList'));
                        data.isInCareList = false;
                        vm.loadData();
                        vm.refreshPersonCareList(id, false);

                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonCareList');
                    });
                };

                vm.viewTimeLine = function (patientId, fullname, isPatient) {
                    if (isPatient == true) {
                        vm.gotoAnchor("person-list");
                        vm.isPersonSelected = true;
                        vm.patientIdTimeLine = patientId;
                        vm.personFullname = fullname;
                        vm.isPatient = isPatient;
                        vm.timelineLoading = true;
                    }
                };


                vm.openHosp = [];
                vm.loadViewHospitalization = function (id) {
                    //if (vm.accordion.current == id) {
                    //    vm.accordion.current = null;
                    //} else {
                    //    vm.accordion.current = id;
                    //}
                    if (vm.openHosp.indexOf(id) != -1) { //exists
                        var index = vm.openHosp.indexOf(id);
                        vm.openHosp.splice(index, 1);
                    } else {
                        vm.openHosp.push(id);
                    }
                };

                vm.showContextMenu = function (event) {
                    var element = event.currentTarget;
                    event.stopPropagation();
                    event.preventDefault();
                    $timeout(function () {
                        console.log(element);
                        angular.element(element).triggerHandler('click');
                    });
                    //var element = $("#drop-down-" + pid);
                    //element.toggle();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/dashboard/CareBoard/myCareList/personCareList.cshtml'
    });
})(_);