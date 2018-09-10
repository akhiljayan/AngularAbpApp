(function () {
    appModule.controller('tenant.views.activities.createOrEditActivity', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.membershipBooking', 'abp.services.app.centre',
        function ($scope, $uibModal, $uibModalInstance, activityId, membershipBookingService, centre) {
            var vm = this;
            vm.isCreateMode = !activityId;

            vm.save = function () {
                if (vm.isCreateMode) {
                    membershipBookingService.createActivity(
                        vm.activity
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {

                    });
                }
                else {
                    membershipBookingService.updateActivity(
                        vm.activity
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {

                    });
                }
            };

            vm.cancelActivity = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Activities.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Activities.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Activities.Delete')
                };

                vm.loading = true;

                membershipBookingService.getActivityForEdit({
                    id: activityId
                }).then(function (result) {
                    vm.activity = result.data;
                }).finally(function () {
                    vm.loading = false;
                });

                loadMasterTable();
            }

            function loadMasterTable() {
                centre.getAllCentresLookUpInUserOU(
                ).then(function (result) {
                    vm.centrelist = result.data;
                });

                membershipBookingService.getActiveActivitiesEvents({
                }).then(function (result) {
                    vm.activitiesEventsList = result.data.items;
                });
            };

            vm.endDateTimeValidator = function (startDateTime, endDateTime) {
                if (!endDateTime) {
                    return true;
                }

                endDateTime = Date.parse(endDateTime);

                if (startDateTime) {
                    startDateTime = Date.parse(startDateTime);

                    if (startDateTime > endDateTime) {
                        return "End Date Time must be on or later than Start Date Time.";
                    }
                }

                return true;
            };

            init();
        }
    ]);
})();