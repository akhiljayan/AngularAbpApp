(function () {
    appModule.controller('tenant.views.drugSources.createOrEditDrugSource', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.drugSource',
        function ($scope, $uibModal, $uibModalInstance, drugSourceId, drugSourceService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !drugSourceId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    drugSourceService.createDrugSource(
                        vm.drugSource
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    drugSourceService.updateDrugSource(
                        vm.drugSource
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelDrugSource = function () {
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

                drugSourceService.getDrugSourceForEdit({
                    id: drugSourceId
                }).then(function (result) {
                    vm.drugSource = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();