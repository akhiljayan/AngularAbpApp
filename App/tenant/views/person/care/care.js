(function () {
    appModule.component('careTabContent', {
        bindings: {
            mode: '<',
            personId: '<'
        },
        controller: [
            '$scope', '$window', 'abp.services.app.person',
            function ($scope, $window, personService) {
                var ctrl = this;
                ctrl.selectedTab = '';     // ctrl.selectedTab = 'PersonProblem';
                ctrl.loads = [];
                ctrl.creates = [];
                ctrl.permissions = {
                    createPersonProblem: abp.auth.hasPermission('Pages.Tenant.PersonProblems.Create'),
                    editPersonProblem: abp.auth.hasPermission('Pages.Tenant.PersonProblems.Edit'),
                    viewPersonProblem: abp.auth.hasPermission('Pages.Tenant.PersonProblems'),
                    createCarePlan: abp.auth.hasPermission('Pages.Tenant.CarePlans.Create'),
                    editCarePlan: abp.auth.hasPermission('Pages.Tenant.CarePlans.Edit'),
                    viewCarePlan: abp.auth.hasPermission('Pages.Tenant.CarePlans')
                };

                ctrl.$onInit = function () {
                    ctrl.loading = false;
                    ctrl.showMenu = true;
                    ctrl.showHeadline = false;
                    ctrl.showPLDetails = false;
                    ctrl.showCPDetails = false;
                    ctrl.selectedPersonProblems = [];
                    ctrl.loadProgressNote = false;

                    showDetails(false);

                    // Set default tab based on permission
                    if (ctrl.permissions.viewPersonProblem) {
                        ctrl.selectedTab = 'PersonProblem';
                    } else if (ctrl.permissions.viewCarePlan) {
                        ctrl.selectedTab = 'CarePlan';
                    }

                    ctrl.showCreateIcon = showCreateIcon();

                    // Default to open view
                    ctrl.selectedPersonProblemViews = [1];
                    ctrl.views[1].isChecked = true;

                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        ctrl.load();
                    }
                };

                ctrl.filterMenuOpened = false;
                ctrl.views = app.consts.personProblemFilter.values;


                ctrl.toggleDropDownMenu = function (event) {
                    ctrl.filterMenuOpened = !ctrl.filterMenuOpened;
                };

                $window.onclick = function () {
                    if (ctrl.filterMenuOpened) {
                        ctrl.filterMenuOpened = false;
                        $scope.$apply();
                    }
                };

                ctrl.onChecked = function (view, $event) {
                    var isExists = ctrl.selectedPersonProblemViews.filter(function (obj) {
                        return obj == view.value;
                    });

                    ////Original
                    //if (isExists.length == 0) {
                    //    ctrl.selectedPersonProblemViews.push(view.value);
                    //} else {
                    //    if (!view.isChecked) {
                    //        var index = ctrl.selectedPersonProblemViews.indexOf(view.value);
                    //        ctrl.selectedPersonProblemViews.splice(index, 1);
                    //    }
                    //}

                    // AllStatus: 0, AllType:5
                    if (view.name == "AllStatus") {
                        if (isExists.length == 0) {
                            //reset Status
                            ctrl.selectedPersonProblemViews = [];

                            for (var i = 0; i < 5; i++) {
                                var isValueExists = ctrl.selectedPersonProblemViews.filter(function (obj) {
                                    return obj == ctrl.views[i].value;
                                });

                                if (isValueExists.length == 0) {
                                    ctrl.views[i].isChecked = true;
                                    ctrl.selectedPersonProblemViews.push(ctrl.views[i].value);
                                }
                            }
                        } else {
                            if (!view.isChecked) {
                                for (var i = 0; i < 5; i++) {
                                    ctrl.views[i].isChecked = false;
                                    var index = ctrl.selectedPersonProblemViews.indexOf(ctrl.views[i].value);
                                    ctrl.selectedPersonProblemViews.splice(index, 1);
                                }
                            }
                        }
                    } else if (view.name == "AllType") {
                        if (isExists.length == 0) {
                            var existingSelectedPersonProblemViews = angular.copy(ctrl.selectedPersonProblemViews);

                            for (var i = view.value; i < ctrl.views.length; i++) {
                                var isValueExists = ctrl.selectedPersonProblemViews.filter(function (obj) {
                                    return obj == ctrl.views[i].value;
                                });

                                if (isValueExists.length == 0) {
                                    ctrl.views[i].isChecked = true;
                                    existingSelectedPersonProblemViews.push(ctrl.views[i].value);
                                }
                            }
                            ctrl.selectedPersonProblemViews = existingSelectedPersonProblemViews;

                        } else {
                            if (!view.isChecked) {
                                for (var i = view.value; i < ctrl.views.length; i++) {
                                    ctrl.views[i].isChecked = false;
                                    var index = ctrl.selectedPersonProblemViews.indexOf(ctrl.views[i].value);
                                    ctrl.selectedPersonProblemViews.splice(index, 1);
                                }
                            }
                        }
                    } else {
                        if (isExists.length == 0) {
                            ctrl.selectedPersonProblemViews.push(view.value);

                            if (view.value > 0 && view.value < 5) {
                                var statusIsAllChecked = false;
                                for (var i = 1; i < 5; i++) {
                                    statusIsAllChecked = ctrl.views[i].isChecked;
                                    if (!statusIsAllChecked) {
                                        break;
                                    }
                                }
                                //Set AllStatus checkbox to true
                                if (statusIsAllChecked) {
                                    ctrl.views[0].isChecked = statusIsAllChecked;
                                    ctrl.selectedPersonProblemViews.push(ctrl.views[0].value);
                                }
                            }

                            if (view.value > 5) {
                                var typeIsAllChecked = false;
                                for (var i = 6; i < ctrl.views.length; i++) {
                                    typeIsAllChecked = ctrl.views[i].isChecked;
                                    if (!typeIsAllChecked) {
                                        break;
                                    }
                                }
                                //Set AllType checkbox to true
                                if (typeIsAllChecked) {
                                    ctrl.views[5].isChecked = typeIsAllChecked;
                                    ctrl.selectedPersonProblemViews.push(ctrl.views[5].value);
                                }
                            }

                        } else {
                            if (!view.isChecked) {
                                var allStatusIndex = ctrl.selectedPersonProblemViews.indexOf(ctrl.views[0].value);

                                if (allStatusIndex >= 0 && view.value < 5) {
                                    ctrl.views[0].isChecked = false;
                                    ctrl.selectedPersonProblemViews.splice(allStatusIndex, 1);
                                }

                                if (ctrl.selectedTab == 'CarePlan') {
                                    var allTypeIndex = ctrl.selectedPersonProblemViews.indexOf(ctrl.views[5].value);
                                    if (allTypeIndex >= 0 && view.value >= 5) {
                                        ctrl.views[5].isChecked = false;
                                        ctrl.selectedPersonProblemViews.splice(allTypeIndex, 1);
                                    }

                                }
                                var index = ctrl.selectedPersonProblemViews.indexOf(view.value);
                                ctrl.selectedPersonProblemViews.splice(index, 1);
                            }
                        }
                    }

                    ctrl.filterMenuOpened = true;
                    ctrl.isSelectedViewChange = !ctrl.isSelectedViewChange; // Force the view to refresh
                    $event.stopPropagation();
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                }

                ctrl.addLoadFunction = function (func, source) {
                    ctrl.loads.push({
                        func: func,
                        source: source
                    });
                };

                ctrl.addCreateFunction = function (func, source) {
                    ctrl.creates.push({
                        func: func,
                        source: source
                    });
                };

                ctrl.load = function () {
                    for (var i = 0, len = ctrl.loads.length; i < len; i++) {
                        var func = ctrl.loads[i].func;
                        var source = ctrl.loads[i].source;

                        if (typeof func === 'function' && source == ctrl.selectedTab) {
                            func();
                            break;
                        }
                    }

                    if (ctrl.personId) {
                        personService.getPerson(
                            ctrl.personId
                        ).then(function (result) {
                            ctrl.isPatient = result.data.isPatient;
                        });
                    }
                };

                ctrl.create = function () {
                    for (var i = 0, len = ctrl.creates.length; i < len; i++) {
                        var func = ctrl.creates[i].func;
                        var source = ctrl.loads[i].source;

                        if (typeof func === 'function' && source == ctrl.selectedTab) {
                            func();
                            return;
                        }
                    }
                };

                ctrl.selectTab = function (tabName) {
                    ctrl.selectedTab = tabName;

                    // Set filter option based on tab name
                    if (ctrl.selectedTab == 'PersonProblem') {
                        ctrl.views = app.consts.personProblemFilter.values;
                    }
                    else if (ctrl.selectedTab == 'CarePlan') {
                        ctrl.views = [].concat(app.consts.personProblemFilter.values,
                            app.consts.carePlanTypeFilter.values);
                    }
                    showDetails(false);
                    ctrl.showCreateIcon = showCreateIcon();
                    ctrl.load();

                    // reset the selected person problem when changing tab
                    ctrl.selectedPersonProblems = [];
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = '';
                    ctrl.isSelectedViewChange = !ctrl.isSelectedViewChange; // Force the view to refresh
                    ctrl.load();
                };

                ctrl.showDetailsBtn = function () {
                    showDetails(true);
                };

                ctrl.selectPersonProblem = function (event) {
                    if (event.isSelected) {
                        if (ctrl.selectedPersonProblems.indexOf(event.id) < 0) {
                            ctrl.selectedPersonProblems.push(event.id);
                        }
                    } else {
                        var index = ctrl.selectedPersonProblems.indexOf(event.id);

                        if (index >= 0) {
                            ctrl.selectedPersonProblems.splice(index, 1);
                        }
                    }

                    ctrl.selectedPersonProblems = angular.copy(ctrl.selectedPersonProblems);
                };

                function showDetails(change) {
                    if (ctrl.selectedTab == 'PersonProblem') {
                        if (!ctrl.showPLDetails) {
                            if (change) {
                                ctrl.showPLDetails = true;
                            }
                        } else {
                            if (change) {
                                ctrl.showPLDetails = false;
                            }
                        }
                        ctrl.showMenu = !ctrl.showPLDetails;
                        ctrl.showHeadline = !ctrl.showMenu;
                    } else {

                        if (!ctrl.showCPDetails) {
                            if (change) {
                                ctrl.showCPDetails = true;
                            }
                        } else {
                            if (change) {
                                ctrl.showCPDetails = false;
                            }
                        }
                        ctrl.showMenu = !ctrl.showCPDetails;
                        ctrl.showHeadline = !ctrl.showMenu;
                    }
                }

                function showCreateIcon() {

                    // For Display Create icon
                    if ((ctrl.permissions.createPersonProblem &&
                        ctrl.selectedTab == "PersonProblem") ||
                        (ctrl.permissions.createCarePlan &&
                            ctrl.selectedTab == "CarePlan")) {
                        return true;
                    }

                    return false;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/person/care/care.cshtml'
    });
})();