(function () {
    appModule.controller('tenant.views.carePlanTypes.createOrEditCarePlanType', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.carePlanType',
        function ($scope, $uibModal, $uibModalInstance, carePlanTypeId, carePlanTypeService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !carePlanTypeId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    carePlanTypeService.createCarePlanType(
                        vm.carePlanType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    carePlanTypeService.updateCarePlanType(
                        vm.carePlanType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelCarePlanType = function () {
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

                carePlanTypeService.getCarePlanTypeForEdit({
                    id: carePlanTypeId
                }).then(function (result) {
                    vm.carePlanType = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();