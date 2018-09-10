(function () {
    appModule.controller('tenant.views.financialAssistanceTypes.createOrEditFinancialAssistanceType', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.financialAssistanceType',
        function ($scope, $uibModal, $uibModalInstance, financialAssistanceTypeId, financialAssistanceTypeService) {
            var vm = this;
            vm.saving = false;            
            vm.isCreateMode = !financialAssistanceTypeId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    financialAssistanceTypeService.createFinancialAssistanceType(
                        vm.financialAssistanceType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    financialAssistanceTypeService.updateFinancialAssistanceType(
                        vm.financialAssistanceType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelFinancialAssistanceType = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.FinancialAssistanceTypes.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.FinancialAssistanceTypes.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.FinancialAssistanceTypes.Delete'),
                    activate: abp.auth.hasPermission('Pages.Tenant.FinancialAssistanceTypes.Activate'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.FinancialAssistanceTypes.Deactivate')
                };
                
                vm.loading = true;

                financialAssistanceTypeService.getFinancialAssistanceTypeForEdit({
                    id: financialAssistanceTypeId
                }).then(function (result) {
                    vm.financialAssistanceType = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();