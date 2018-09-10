(function () {
    appModule.component('eventPersonsAdd', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', 'abp.services.app.person', '$filter',
            function (membershipBookingService, personService, $filter) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.heading = "All";
                ctrl.checkedAll = false;

                ctrl.$onInit = function () {
                    console.log(ctrl.resolve);
                    ctrl.filterText = "";
                    ctrl.selectedPersonList = [];
                    ctrl.existingPersonList = ctrl.resolve.selectedPersons;
                    ctrl.mode = 'new';
                    ctrl.loadAll();
                    ctrl.getAllGroups();
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        var resolve = ctrl.resolve;
                        ctrl.selectedPersonList = [];
                        ctrl.existingPersonList = ctrl.resolve.selectedPersons;
                    }
                };

                ctrl.cancel = function () {
                    ctrl.modalInstance.dismiss();
                };

                ctrl.loadAll = function () {
                    ctrl.heading = "All";
                    ctrl.filter = "all";
                    ctrl.personListLoading = true;
                    membershipBookingService.getAllPersonsForEventRegistration(ctrl.filterText).then(function (result) {
                        ctrl.allPersons = result.data;
                        ctrl.getAll();
                        ctrl.personListLoading = false;
                    }).finally(function (result) {
                        ctrl.personListLoading = false;
                    });
                };

                ctrl.removeSelectedPerson = function (id) {
                    var person = $filter('filter')(ctrl.allPersons, function (m) { return m.personId == id; })[0];
                    ctrl.selectedPerson(person);
                };

                ctrl.selectedPerson = function (person) {
                    var foundInExisting = ctrl.existingPersonList.indexOf(person.personId) > -1;
                    if (!foundInExisting) {
                        person.selected = !person.selected;
                        var found = ctrl.selectedPersonList.indexOf(person.personId) > -1;
                        if (!found && person.selected) {
                            ctrl.selectedPersonList.push(person.personId);
                        }
                        else if (found && !person.selected) {
                            var index = ctrl.selectedPersonList.indexOf(person.personId);
                            ctrl.selectedPersonList.splice(index, 1);
                        }
                    } else {
                        return;
                    }
                };

                ctrl.getAllGroups = function () {
                    membershipBookingService.getAllUserCenterPersonGroups().then(function (result) {
                        ctrl.groups = result.data;
                    });
                };

                ctrl.getPersonByGroup = function (grpid, grpname) {
                    ctrl.filter = "grp";
                    ctrl.heading = grpname;
                    var param = {
                        groupId: grpid,
                        filter: ctrl.filterText
                    };
                    membershipBookingService.getPersonsForGroup(param).then(function (result) {
                        ctrl.persons = [];
                        ctrl.persons = result.data;
                        angular.forEach(ctrl.persons, function (person, key) {
                            if (ctrl.selectedPersonList.indexOf(person.personId) !== -1 || ctrl.existingPersonList.indexOf(person.personId) !== -1) {
                                person.selected = true;
                            } else {
                                person.selected = false;
                            }
                        });
                    });
                };

                ctrl.getAll = function () {
                    ctrl.filter = "all";
                    ctrl.heading = "All";
                    ctrl.persons = [];
                    ctrl.persons = ctrl.allPersons;
                    angular.forEach(ctrl.persons, function (person, key) {
                        if (ctrl.selectedPersonList.indexOf(person.personId) !== -1 || ctrl.existingPersonList.indexOf(person.personId) !== -1) {
                            person.selected = true;
                        } else {
                            person.selected = false;
                        }
                    });
                };

                ctrl.searchValue = function () {
                    if (ctrl.filter == "all") {
                        ctrl.loadAll();
                    } else {
                        ctrl.getPersonByGroup();
                    }
                };

                ctrl.selectAll = function () {
                    ctrl.checkedAll = true;
                    angular.forEach(ctrl.persons, function (person, key) {
                        var found = ctrl.selectedPersonList.indexOf(person.personId) > -1 || ctrl.existingPersonList.indexOf(person.personId) > -1;
                        if (!found) {
                            person.selected = true;
                            ctrl.selectedPersonList.push(person.personId);
                        }
                    });
                };

                ctrl.unSelectAll = function () {
                    ctrl.checkedAll = true;
                    angular.forEach(ctrl.persons, function (person, key) {
                        var foundInSelected = ctrl.selectedPersonList.indexOf(person.personId) > -1;
                        var foundInExisting = ctrl.existingPersonList.indexOf(person.personId) > -1;
                        if (foundInSelected && !foundInExisting) {
                            person.selected = false;
                            var index = ctrl.selectedPersonList.indexOf(person.personId);
                            ctrl.selectedPersonList.splice(index, 1);
                        }
                    });
                };

                ctrl.saveRegistration = function () {
                    if (ctrl.selectedPersonList.length > 0) {
                        var saveparam = {
                            persons: ctrl.selectedPersonList,
                            eventId: ctrl.resolve.eventId
                        }
                        membershipBookingService.saveEventRegistration(saveparam).then(function (result) {
                            if (result.data) {
                                abp.notify.info(app.localize('Registration Done Successfully.'));
                                ctrl.modalInstance.close();
                            }
                        });
                    } else {
                        abp.message.info('Please select at least one person');
                    }

                };


            }
        ],
        templateUrl: '~/App/tenant/views/event/event-detail/components/event-persons-add.cshtml'
    });
})();