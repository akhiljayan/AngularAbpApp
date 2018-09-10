(function () {
    appModule.controller('tenant.views.goals.createOrEditGoal', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.goal',
        function ($scope, $uibModal, $uibModalInstance, goalId, goalService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !goalId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    goalService.createGoal(
                        vm.goal
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    goalService.updateGoal(
                        vm.goal
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelGoal = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    edit: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    delete: abp.auth.hasPermission('Pages.Tenant.CarePlans')
                };

                vm.loading = true;

                goalService.getGoalForEdit({
                    id: goalId
                }).then(function (result) {
                    vm.goal = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();