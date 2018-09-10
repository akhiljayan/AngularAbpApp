(function () {
    appModule.component('personRegistration', {
        bindings: {
            mode: '<',
            model: '<',
            showDelete: '&',
            permissions: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', '$stateParams', '$state', '$uibModal', '$timeout', '$filter',
            function (membershipBookingService, $stateParams, $state, $uibModal, $timeout, $filter) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.loading = false;
                ctrl.registeredPersons = [];

                ctrl.$onInit = function () {
                    ctrl.selectedPersons = [];
                    load();
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.model = angular.copy(ctrl.model);
                        ctrl.selectedPersons = [];
                        ctrl.selectedEventPersonIds = [];
                        ctrl.load();
                    }
                };

                ctrl.load = function () {
                    ctrl.selectCancelPerson = false;
                    ctrl.selectedPersons = [];
                    ctrl.selectedEventPersonIds = [];
                    load();
                };

                ctrl.selectAll = function () {
                    angular.forEach(ctrl.registeredEventPersons, function (per, key) {
                        var found = ctrl.selectedPersons.indexOf(per.person.id) > -1;
                        if (!found) {
                            per.person.selected = true;
                            ctrl.selectedEventPersonIds.push(per.id);
                            ctrl.selectedPersons.push(per.person.id);
                        }
                    });
                };

                ctrl.deselectAll = function () {
                    angular.forEach(ctrl.registeredEventPersons, function (per, key) {
                        var found = ctrl.selectedPersons.indexOf(per.person.id) > -1;
                        if (found) {
                            per.person.selected = false;
                            var index = ctrl.selectedPersons.indexOf(per.person.id);
                            var index1 = ctrl.selectedEventPersonIds.indexOf(per.id);
                            ctrl.selectedPersons.splice(index, 1);
                            ctrl.selectedEventPersonIds.splice(index1, 1);
                        }
                    });
                };

                ctrl.remove = function () {
                    var param = {
                        eventId: ctrl.model.id,
                        eventPersonIds: ctrl.selectedEventPersonIds
                    };
                    abp.message.confirm(
                        'The system will remove the selected person(s). To continue, click Ok',
                        'Are you sure ?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                membershipBookingService.removeRegistredPerson(param).then(function (result) {
                                    abp.notify.info(app.localize('Selected Person(s) removed Successfully.'));
                                    ctrl.load();
                                });
                            }
                        });
                };

                ctrl.addPersonToEvent = function () {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'addParticipants',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            eventId: function () {
                                return ctrl.model.id;
                            },
                            attendanceDate: function () {
                                return new Date();
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        $state.reload();
                    });
                }

                ctrl.confirm = function () {
                    abp.message.confirm(
                        app.localize('EventAttendanceConfirmWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                console.dir(ctrl.model);
                                console.dir(ctrl.selectedParticipants);
                                membershipBookingService.confirmEventPerson({
                                    eventId: ctrl.model.id,
                                    eventPersonIds: ctrl.selectedEventPersonIds
                                }).then(function (result) {
                                    abp.notify.info(app.localize('SavedSuccessfully'));
                                    ctrl.load();
                                });
                            }
                        }
                    );
                }

                ctrl.cancel = function () {
                    abp.message.confirm(
                        app.localize('ActivitiesAttendanceCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var titleName = app.localize('CancelEventAttendance');
                                var moduleName = app.localize('EventBookingAttendance');
                                openCancellationModal(titleName, moduleName);
                            }
                        }
                    );
                }

                function openCancellationModal(titleName, moduleName) {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'cancellationReasonModal',  //common cancellation Model
                        backdrop: 'static',
                        resolve: {
                            titleName: function () {
                                return titleName;
                            },
                            moduleName: function () {
                                return moduleName;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancellationReason) {
                        if (cancellationReason != null) {
                            membershipBookingService.cancelEventPerson({
                                eventId: ctrl.model.id,
                                eventPersonIds: ctrl.selectedEventPersonIds,
                                CancellationReason: cancellationReason,
                                attendanceDate: ctrl.selectedDate
                            }).then(function (result) {
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                ctrl.load();
                            });
                        }
                    });
                };

                ctrl.saveAttendance = function () {
                    membershipBookingService.saveEventPersonAttendance({
                        eventId: ctrl.model.id,
                        eventPersonIds: ctrl.selectedEventPersonIds,
                    }).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        ctrl.load();
                    });
                }

                ctrl.selectedPerson = function (person, id) {
                    person.selected = !person.selected;
                    var found = ctrl.selectedPersons.indexOf(person.id) > -1;
                    if (!found && person.selected) {
                        ctrl.selectedPersons.push(person.id);
                        ctrl.selectedEventPersonIds.push(id);
                    }
                    else if (found && !person.selected) {
                        var index = ctrl.selectedPersons.indexOf(person.id);
                        var index1 = ctrl.selectedEventPersonIds.indexOf(id);
                        ctrl.selectedPersons.splice(index, 1);
                        ctrl.selectedEventPersonIds.splice(index1, 1);
                    }

                    var tempPerson;
                    ctrl.selectCancelPerson = false;
                    for (var i = 0; i < ctrl.selectedPersons.length; i++) {
                        tempPerson = ctrl.registeredEventPersons[ctrl.registeredPersons.indexOf(ctrl.selectedPersons[i])];
                        if (tempPerson.isCancelled) {
                            ctrl.selectCancelPerson = true;
                            break;
                        }
                    }
                };

                ctrl.showDeleteForEvent = function () {
                    ctrl.showDelete({
                        $event: {
                            flag: true,
                        }
                    });
                };

                function load() {
                    ctrl.loading = true;
                    if (ctrl.model.id) {
                        membershipBookingService.getRegistredEventPersons(ctrl.model.id).then(function (result) {
                            ctrl.registeredEventPersons = result.data;
                            ctrl.registeredPersons = [];
                            angular.forEach(ctrl.registeredEventPersons, function (person, key) {
                                var found = ctrl.registeredPersons.indexOf(person.personId) > -1;
                                if (!found) {
                                    ctrl.registeredPersons.push(person.personId);
                                }
                            });

                            var activePersons = $filter('filter')(result.data, { 'isCancelled': false }).length;
                            if (activePersons == 0) {
                                ctrl.showDeleteForEvent();
                            }
                            ctrl.loading = false;
                        });
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/event/event-detail/components/person-registration.cshtml'
    });
})();

