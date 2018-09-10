(function () {
    appModule.controller('tenant.views.drugFrequencies.createOrEditDrugFrequency', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.drugFrequency',
        function ($scope, $uibModal, $uibModalInstance, drugFrequencyId, drugFrequencyService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !drugFrequencyId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    drugFrequencyService.createDrugFrequency(
                        vm.drugFrequency
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    drugFrequencyService.updateDrugFrequency(
                        vm.drugFrequency
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelDrugFrequency = function () {
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

                drugFrequencyService.getDrugFrequencyForEdit({
                    id: drugFrequencyId
                }).then(function (result) {
                    vm.drugFrequency = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();