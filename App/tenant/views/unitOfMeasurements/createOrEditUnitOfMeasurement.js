(function () {
    appModule.controller('tenant.views.unitOfMeasurements.createOrEditUnitOfMeasurement', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.unitOfMeasurement',
        function ($scope, $uibModal, $uibModalInstance, unitOfMeasurementId, unitOfMeasurementService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !unitOfMeasurementId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    unitOfMeasurementService.createUnitOfMeasurement(
                        vm.unitOfMeasurement
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    unitOfMeasurementService.updateUnitOfMeasurement(
                        vm.unitOfMeasurement
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelUnitOfMeasurement = function () {
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

                unitOfMeasurementService.getUnitOfMeasurementForEdit({
                    id: unitOfMeasurementId
                }).then(function (result) {
                    vm.unitOfMeasurement = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();