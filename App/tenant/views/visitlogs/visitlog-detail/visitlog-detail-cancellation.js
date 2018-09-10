(function () {
    appModule.controller('tenant.views.visitLogs.cancelVisitLog', [
        '$scope', '$uibModal', '$uibModalInstance', 'visitLogId', 'permissions',
        function ($scope, $uibModal, $uibModalInstance, visitLogId, permissions) {
            var vm = this;

            vm.saving = false;
            vm.permissions = {};
            vm.visitLog = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                //Cancel Visit Log record
                $uibModalInstance.close(vm.visitLog);
            };

            vm.init = function () {
                vm.permissions = permissions;
                vm.visitLog.id = visitLogId;
            };

            vm.init();
        }
    ]);
})();
