(function (_) {
    appModule.component('addParticipantWithSelectList', {
        bindings: {
            selectedPersonList: '=',
            filterText: '<',
            selectAll: '<',
            activityId: '<',
            eventId: '<',
            personGroupId: '<',
            attendanceDate: '<'
        },
        controller: [
            'abp.services.app.centre', 'abp.services.app.membershipBooking', '$timeout', 'abp.services.app.activitiesAttendance',
            function (centreService, membershipBookingService, $timeout, activitiesService) {
                var ctrl = this;
                ctrl.selectAll = undefined;
                ctrl.selectedPersonObj = [];
                ctrl.personGroups = [];

                ctrl.$onInit = function () {
                    ctrl.centre = [];
                    ctrl.personGroup = [];
                    ctrl.load();

                    centreService.getAllCentresLookUpInUserOU(
                    ).then(function (result) {
                        ctrl.centres = result.data;

                        angular.forEach(ctrl.centres, function (obj, key) {
                            obj.isChecked = true;
                            ctrl.centre.push(obj.id);
                        });
                    });

                    membershipBookingService.getAllCentrePersonGroups({
                    }).then(function (result) {
                        ctrl.personGroupsMaster = result.data.items;

                        ctrl.personGroupsMaster.map(function (item) {
                            ctrl.personGroups.push({
                                "id": item.id,
                                "description": item.groupDescription
                            });
                        });
                    });
                };

                ctrl.selectCentre = function (centre) {
                    ctrl.selectAll = undefined;

                    $timeout(function () {
                        centre.isChecked = !centre.isChecked;

                        if (centre.isChecked) {
                            var index = ctrl.centre.indexOf(centre.id);

                            if (index < 0) {
                                ctrl.centre.push(centre.id);
                            }
                        } else {
                            var index = ctrl.centre.indexOf(centre.id);

                            if (index >= 0) {
                                ctrl.centre.splice(index, 1);
                            }
                        }

                        ctrl.load();
                    });

                    event.preventDefault();
                    event.stopPropagation();
                };

                ctrl.selectPersonGroup = function (personGroup) {
                    ctrl.selectAll = undefined;

                    $timeout(function () {
                        personGroup.isChecked = !personGroup.isChecked;

                        if (personGroup.isChecked) {
                            var index = ctrl.personGroup.indexOf(personGroup.id);

                            if (index < 0) {
                                ctrl.personGroup.push(personGroup.id);
                            }
                        } else {
                            var index = ctrl.personGroup.indexOf(personGroup.id);

                            if (index >= 0) {
                                ctrl.personGroup.splice(index, 1);
                            }
                        }

                        ctrl.load();
                    });

                    event.preventDefault();
                    event.stopPropagation();
                };

                ctrl.load = function () {
                    activitiesService.getParticipants({
                        CentreId: ctrl.centre,
                        PersonGroupId: ctrl.personGroup,
                        selectedPersonGroupId: ctrl.personGroupId,
                        Filter: ctrl.filterText,
                        activityId: ctrl.activityId,
                        eventId: ctrl.eventId,
                        attendanceDate: ctrl.attendanceDate
                    }).then(function (result) {
                        ctrl.personModel = result.data;
                    });
                };

                ctrl.clearFilter = function () {
                    ctrl.filterText = '';
                };

                ctrl.findSamePerson = function (personId, isSelected) {
                    for (var i = 0; i < ctrl.personModel.length; i++) {
                        var participants = ctrl.personModel[i].participants;

                        for (var j = 0; j < participants.length; j++) {
                            var person = participants[j];

                            if (person.id == personId) {
                                person.selected = isSelected;
                                break;
                            }
                        }
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/centrePersonGroups/addParticipantWithSelectList.cshtml'
    });
})(_);