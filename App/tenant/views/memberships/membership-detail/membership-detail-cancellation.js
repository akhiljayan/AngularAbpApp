(function () {
    appModule.controller('tenant.views.memberships.cancelMembership', [
        '$scope', '$uibModal', '$uibModalInstance', 'membershipId', 'permissions', 'abp.services.app.masterLookUp',
        function ($scope, $uibModal, $uibModalInstance, membershipId, permissions, masterLookup) {
            var vm = this;

            vm.saving = false;
            vm.permissions = {};
            vm.membership = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                $uibModalInstance.close(vm.membership);
            };

            vm.init = function () {
                vm.permissions = permissions;
                vm.membership.id = membershipId;
                masterLookup.getMasterTypeItems({
                    type: 'Termination Reason of Member'
                }).then(function (result) {
                    vm.terminationreason = result.data;
                    });
                vm.showOtherTerminationSpecify = false;
                vm.initialiseOtherTerminationSpecify()
            };

            vm.initialiseOtherTerminationSpecify = function (value) {
                if (value != 'Others') {
                    vm.membership.othersTerminationReason = null;
                    vm.showOtherTerminationSpecify = false;
                }
                else {
                    vm.showOtherTerminationSpecify = true;
                }
            };

            vm.init();
        }
    ]);
})();
