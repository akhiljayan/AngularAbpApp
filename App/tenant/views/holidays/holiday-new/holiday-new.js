(function () {
    appModule.controller('tenant.views.holidays.holidayNew', [
        '$scope', '$uibModal', 'commonFormFunction', '$uibModalInstance', 'holidayId', 'action', 'abp.services.app.holiday',
        function ($scope, $uibModal, commonFormFunction, $uibModalInstance, holidayId, action, appService) {
      
            var vm = this;
            vm.todaysDate = new Date();
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.isVisitLogRequiredShow = false;
            vm.save = function (event) {

                if (!vm.holidayForm.$valid)
                    return;

                vm.saving = true;

                if ($scope.isEmptyGuid(holidayId)) {
                    appService.create(vm.holiday).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    appService.update(vm.holiday).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }

                event.preventDefault();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                console.log(vm);
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Holiday.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Holiday.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Holiday.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Holiday.Delete')
                };

                load();
            }

            function load() {
                appService.getHolidayById(holidayId).then(function (result) {

                    vm.holiday = result.data;

                    if ($scope.isEmptyGuid(holidayId)) {
                        vm.holiday.holidayDescriptionId = null;
                    }
                    
                });
            }

            init();

        }
    ]);
})();