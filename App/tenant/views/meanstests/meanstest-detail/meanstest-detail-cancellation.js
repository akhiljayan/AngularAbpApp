(function () {
    appModule.controller('tenant.views.meansTests.cancelMeansTest', [
        '$scope', '$uibModal', '$uibModalInstance', 'meansTestId', 'permissions',
        function ($scope, $uibModal, $uibModalInstance, meansTestId, permissions) {
            var vm = this;

            vm.saving = false;
            vm.permissions = {};
            vm.meansTest = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                //Cancel Means Test record
                $uibModalInstance.close(vm.meansTest);
            };

            vm.init = function () {
                vm.permissions = permissions;
                vm.meansTest.id = meansTestId;
            };

            vm.init();
        }
    ]);
})();
