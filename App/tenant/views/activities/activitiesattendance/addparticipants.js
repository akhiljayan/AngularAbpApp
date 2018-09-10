(function () {
    appModule.component('addParticipants', {
        bindings: {
            resolve: '<',
            modalInstance: '<',
            onSelect: '&'
        },
        controller: [
            'abp.services.app.activitiesAttendance', 'abp.services.app.membershipBooking',
            function (activitiesService, membershipBookingService) {
                var ctrl = this;
                ctrl.selectedParticipants = [];

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve && changes.resolve.currentValue) {
                        ctrl.activityId = changes.resolve.currentValue.activityId;
                        ctrl.attendanceDate = ctrl.resolve.attendanceDate;
                        ctrl.centrePersonGroupId = changes.resolve.currentValue.centrePersonGroupId;
                        ctrl.eventId = changes.resolve.currentValue.eventId;
                    }
                };

                ctrl.submit = function () {
                    if (ctrl.activityId != undefined) {
                        activitiesService.add({
                            ActivityId: ctrl.activityId,
                            PersonIds: ctrl.selectedParticipants,
                            attendanceDate: ctrl.attendanceDate
                        }).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            ctrl.modalInstance.close();
                        });
                    } else if (ctrl.centrePersonGroupId != undefined) {
                        membershipBookingService.createCentrePersonGroupPersons({
                            id: ctrl.centrePersonGroupId,
                            Persons: ctrl.selectedParticipants
                        }).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            ctrl.modalInstance.close();
                        });
                    }
                    else if (ctrl.eventId != undefined) {
                        membershipBookingService.saveEventRegistration({
                            eventId: ctrl.eventId,
                            persons: ctrl.selectedParticipants
                        }).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            ctrl.modalInstance.close();
                        });
                    }
                };

                ctrl.cancel = function () {
                    ctrl.modalInstance.close();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/activities/activitiesattendance/addparticipants.cshtml'
    })
})();