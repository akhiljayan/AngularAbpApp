(function () {
    appModule.component('activitiesAttendance', {
        controller: [
            '$uibModal', 'abp.services.app.activitiesAttendance', 'abp.services.app.centre', 'abp.services.app.membershipBooking', '$filter',
            function ($uibModal, activitiesService, centreService, membershipBookingService, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MembershipBookings.Create'),
                        delete: abp.auth.hasPermission('Pages.Tenant.MembershipBookings.Delete'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.MembershipBookings.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.MembershipBookings.Cancel')
                    };

                    ctrl.activities = [];
                    ctrl.isDetailView = true;
                    ctrl.selectedDate = abp.clock.today();

                    // Temporary workaround until date picker issue is fixed
                    var wrongDate = new Date();
                    wrongDate.setHours(0, 0, 0, 0);
                    ctrl.selectedDate = $filter("dateFormat")(wrongDate);
                    // Temporary workaround until date picker issue is fixed

                    ctrl.activitiesAttendanceStatus = app.consts.ActivitiesAttendanceStatus.values;

                    angular.forEach(ctrl.activitiesAttendanceStatus, function (item, index) {
                        item.name = abp.localization.localize(item.localizedName);
                    });

                    centreService.getAllCentresLookUpInUserOU(
                    ).then(function (result) {
                        ctrl.centreList = result.data;
                        ctrl.selectedCentre = ctrl.centreList;

                        ctrl.loadActivityOptions();
                    });

                    ctrl.load();
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = '';
                    ctrl.load();
                };

                ctrl.clearNRICFilter = function () {
                    ctrl.nricFilter = '';
                    ctrl.load();
                };

                ctrl.load = function () {
                    if (ctrl.selectedCentre != undefined && ctrl.selectedCentre.length > 0) {
                        var tempSelectedCentre = [];

                        angular.forEach(ctrl.selectedCentre, function (obj, key) {
                            tempSelectedCentre.push(obj.id);
                        });

                        ctrl.selectedCentreIds = tempSelectedCentre;
                    }

                    activitiesService.getActivities({
                        name: ctrl.filter,
                        attendanceDate: ctrl.selectedDate,
                        registrationDocumentNo: ctrl.nricFilter,
                        centres: ctrl.selectedCentreIds,
                        activities: ctrl.selectedActivity
                    }).then(function (result) {
                        ctrl.activities = result.data;
                    });
                };

                ctrl.countPresentParticipant = function (participants) {
                    var count = 0;

                    for (var i = 0; i < participants.length; i++) {
                        var participant = participants[i];

                        if (participant.isAttended && participant.isConfirmed && !participant.isCancelled) {
                            count++;
                        }
                    }

                    return count;
                };

                ctrl.add = function (activity) {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'addParticipants',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            activityId: function () {
                                return activity.id;
                            },
                            attendanceDate: function () {
                                return ctrl.selectedDate;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        ctrl.load();
                    });
                };

                ctrl.delete = function (activity) {
                    abp.message.confirm(
                        app.localize('SelectedRecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                activitiesService.delete({
                                    ActivityId: activity.id,
                                    Ids: activity.participants.selectedParticipants,
                                    attendanceDate: ctrl.selectedDate
                                }).then(function (result) {
                                    abp.notify.info(app.localize('SavedSuccessfully'));
                                    ctrl.load();
                                });
                            }
                        }
                    );
                };

                ctrl.confirm = function (activity) {
                    abp.message.confirm(
                        app.localize('ActivitiesAttendanceConfirmWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                activitiesService.confirm({
                                    ActivityId: activity.id,
                                    Ids: activity.participants.selectedParticipants,
                                    attendanceDate: ctrl.selectedDate
                                }).then(function (result) {
                                    abp.notify.info(app.localize('SavedSuccessfully'));
                                    ctrl.load();
                                });
                            }
                        }
                    );
                };

                ctrl.cancel = function (activity) {
                    abp.message.confirm(
                        app.localize('ActivitiesAttendanceCancelWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openCancellationModal(activity);
                            }
                        }
                    );
                };

                function openCancellationModal(activity) {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'activitiesAttendanceCancellation',
                        backdrop: 'static'
                    });

                    modalInstance.result.then(function (cancellationReason) {
                        activitiesService.cancel({
                            ActivityId: activity.id,
                            Ids: activity.participants.selectedParticipants,
                            CancellationReason: cancellationReason,
                            attendanceDate: ctrl.selectedDate
                        }).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            ctrl.load();
                        });
                    });
                };

                ctrl.saveAttendance = function (activity) {
                    activitiesService.saveAttendance({
                        ActivityId: activity.id,
                        Ids: activity.participants.selectedParticipants,
                        attendanceDate: ctrl.selectedDate
                    }).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        ctrl.load();
                    });
                };

                ctrl.attendanceDateChanged = function () {
                    ctrl.activities = [];
                };

                ctrl.loadActivityOptions = function () {
                    var centreIds = [];

                    if (ctrl.selectedCentre) {
                        centreIds = ctrl.selectedCentre.map(function (centre) {
                            return centre.id;
                        });
                    }

                    membershipBookingService.getAllActivities({
                        centres: centreIds
                    }).then(function (result) {
                        ctrl.activityEventList = result.data.items;
                    });
                }
            }
        ],
        templateUrl: '~/App/tenant/views/activities/activitiesattendance/activitiesattendance.cshtml'
    });
})();