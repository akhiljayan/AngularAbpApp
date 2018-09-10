(function () {
    appModule.controller('tenant.views.financialAssistances.cancelFinancialAssistance', [
        '$scope', '$uibModal', '$uibModalInstance', 'financialAssistanceId', 'permissions',
        function ($scope, $uibModal, $uibModalInstance, financialAssistanceId, permissions) {
            var vm = this;

            vm.saving = false;
            vm.permissions = {};
            vm.financialAssistance = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                //Cancel Financial Assistance record
                $uibModalInstance.close(vm.financialAssistance);
            };

            vm.init = function () {
                vm.permissions = permissions;
                vm.financialAssistance.id = financialAssistanceId;
            };

            vm.init();
        }
    ]);
})();
