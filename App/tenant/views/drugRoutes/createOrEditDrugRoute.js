(function () {
    appModule.controller('tenant.views.drugRoutes.createOrEditDrugRoute', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.drugRoute',
        function ($scope, $uibModal, $uibModalInstance, drugRouteId, drugRouteService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !drugRouteId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    drugRouteService.createDrugRoute(
                        vm.drugRoute
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    drugRouteService.updateDrugRoute(
                        vm.drugRoute
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelDrugRoute = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    activate: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.Prescriptions')
                };

                vm.loading = true;

                drugRouteService.getDrugRouteForEdit({
                    id: drugRouteId
                }).then(function (result) {
                    vm.drugRoute = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();