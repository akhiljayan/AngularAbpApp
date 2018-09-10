(function () {
    appModule.controller('tenant.views.person.index', [
        '$scope', 'sliderState', '$rootScope', '$location', '$anchorScroll', '$state', '$filter', 'abp.services.app.person', 'abp.services.app.userFavourite',
        function ($scope, sliderState, $rootScope, $location, $anchorScroll, $state, $filter, personService, userFavouriteService) {
            var vm = this;
            $anchorScroll.yOffset = 265;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.persons = [];
            vm.mockServices = [];
            vm.loading = false;
            vm.serviceTypeStatus = app.consts.referralServiceTypeStatus;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Person.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.Person.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Person.View'),
                delete: abp.auth.hasPermission('Pages.Tenant.Person.Delete'),
                //activate: abp.auth.hasPermission('Pages.Tenant.Person.Activate'),
                //deActivate: abp.auth.hasPermission('Pages.Tenant.Person.DeActivate'),

                mycarelist: abp.auth.hasPermission('Pages.Tenant.MyCareList')
            };
            vm.view = 0;

            vm.create = function () {
                $state.go('tenant.personDetailNew');
            };

            vm.clearFilter = function () {
                vm.filter = null;
                vm.load();
            };

            vm.view = function (id) {
                sliderState.setPerson(id);
                sliderState.isCurrentStateChangeIsFromSlider = true;
                $state.go('tenant.personDetail', { id: id });
            };

            vm.changeView = function (view) {
                vm.view = view;
                vm.load();
            };

            vm.refreshPersonWatch = function (id, isWatched) {

                if (vm.data.totalCount > 0) {

                    for (var i = 0; i < vm.data.totalCount; i++) {

                        if (vm.data.items[i].id == id &&
                            vm.data.items[i].isPatient == true) {

                            vm.data.items[i].isWatched = false;
                            vm.data.items[i].isNotWatched = false;

                            if (isWatched == false) {
                                vm.data.items[i].isNotWatched = true;
                            } else {
                                vm.data.items[i].isWatched = true;
                            }
                        }
                    }
                }
            };

            vm.refreshPersonCareList = function (id, isInCareList) {

                if (vm.data.totalCount > 0) {

                    for (var i = 0; i < vm.data.totalCount; i++) {

                        if (vm.data.items[i].id == id && vm.data.items[i].isPatient == true) {
                            if (isInCareList == false) {
                                vm.data.items[i].isInCareList = false;
                            } else {
                                vm.data.items[i].isInCareList = true;
                            }
                        }
                    }
                }
            };

            vm.watch = function (data) {

                userFavouriteService.addPersonToWatchList(data.id)
                    .then(function (result) {
                        abp.message.success(app.localize('AddedPersonToWatchList'));

                        data.isWatched = false;
                        data.isNotWatched = true;
                        vm.refreshPersonWatch(data.id, true);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonWatchList');
                    });
            };

            vm.unwatch = function (data) {

                userFavouriteService.removePersonFromWatchList(data.id)
                    .then(function (result) {
                        abp.message.success(app.localize('RemovedPersonFromWatchList'));

                        data.isWatched = true;
                        data.isNotWatched = false;
                        vm.refreshPersonWatch(data.id, false);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonWatchList');
                    });
            };

            vm.addToCareList = function (data) {
                userFavouriteService.addPersonToCareList(data.id)
                    .then(function (result) {
                        abp.message.success(app.localize('AddedPersonToMyCareList'));
                        data.isInCareList = true;
                        vm.refreshPersonCareList(data.id, true);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonCareList');
                    });
            };

            vm.removeFromCareList = function (data) {
                userFavouriteService.removePersonFromCareList(data.id)
                    .then(function (result) {
                        abp.message.success(app.localize('RemovedPersonFromMyCareList'));
                        data.isInCareList = false;
                        vm.refreshPersonCareList(data.id, false);
                    }).finally(function () {
                        $rootScope.$broadcast('refreshPersonCareList');
                    });
            };

            vm.gotoAnchor = function (key) {
                $location.hash(key);
                $anchorScroll();
            };

            vm.load = function (requestParams) {

                vm.loading = true;
                if (vm.view == app.consts.personViews.All) {
                    vm.filterStatus = 'all';
                    vm.filterStatusTitle = abp.localization.localize('All');
                } else if (vm.view == app.consts.personViews.Inactive) {
                    vm.filterStatus = 'inactive';
                    vm.filterStatusTitle = abp.localization.localize('Inactive');
                } else if (vm.view == app.consts.personViews.Active) {
                    vm.filterStatus = 'active';
                    vm.filterStatusTitle = abp.localization.localize('Active');
                }

                vm.key = getFilterKeys();

                personService.getPersonsInCareBord(
                    $.extend({
                        filter: vm.filter,
                        view: vm.view
                    }, requestParams)
                ).then(function (result) {

                    vm.data = result.data;

                    if (vm.data.totalCount > 0) {

                        for (var i = 0; i < vm.data.totalCount; i++) {

                            vm.data.items[i].isNotWatched = false;
                            vm.data.items[i].isWatched = false;

                            vm.data.items[i].isNotInCareList = false;
                            vm.data.items[i].isInCareList = false;

                            // Only check for this particular Person if he/she is a patient
                            if (vm.data.items[i].isPatient == true) {

                                // Check the Watched Person List if this particular Person is in the user's Watch List or not
                                var filteredItem = $filter('filter')($rootScope.watchedPersonList, { id: vm.data.items[i].id }, true);
                                var filtredPersonCareList = $filter('filter')($rootScope.userPersonCareList, { personId: vm.data.items[i].id }, true);
                                if (filteredItem.length == 0) { // If not found in Watch List
                                    vm.data.items[i].isNotWatched = true;
                                } else { // If found in Watch List
                                    vm.data.items[i].isWatched = true;
                                }

                                if (filtredPersonCareList == 0) {
                                    vm.data.items[i].isInCareList = false;
                                } else {
                                    vm.data.items[i].isInCareList = true;
                                }
                            }
                        }
                    }

                    vm.gotoAnchor('personIndex');
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getFilterKeys() {
                var key = "";

                key = key.concat(vm.filterStatus, vm.filter);

                return key;
            }
        }
    ]);
})();
