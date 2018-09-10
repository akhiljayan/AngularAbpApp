(function () {
    appModule.controller('tenant.views.problems.createOrEditProblem', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.problem',
        function ($scope, $uibModal, $uibModalInstance, problemId, problemService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !problemId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    problemService.createProblem(
                        vm.problem
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    problemService.updateProblem(
                        vm.problem
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelProblem = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    edit: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    delete: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    activate: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.CarePlans')
                };

                vm.loading = true;

                problemService.getProblemForEdit({
                    id: problemId
                }).then(function (result) {
                    vm.problem = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();