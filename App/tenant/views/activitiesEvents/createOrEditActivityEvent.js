(function () {
    appModule.controller('tenant.views.activitiesEvents.createOrEditActivityEvent', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.membershipBooking',
        function ($scope, $uibModal, $uibModalInstance, activityEventId, membershipBookingService) {
            var vm = this;
            vm.isCreateMode = !activityEventId;


            vm.save = function () {
                if (vm.isCreateMode) {
                    membershipBookingService.createActivityEvent(
                        vm.activityEvent
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                    });
                } else {
                    membershipBookingService.updateActivityEvent(
                        vm.activityEvent
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                    });
                }
            };

            vm.cancelActivityEvent = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.ActivitiesEvents.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.ActivitiesEvents.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.ActivitiesEvents.Delete')
                };

                vm.loading = true;

                membershipBookingService.getActivityEventForEdit({
                    id: activityEventId
                }).then(function (result) {
                    vm.activityEvent = result.data;
                    vm.activityEvent.activityEventType = !!vm.activityEvent.activityEventType;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();