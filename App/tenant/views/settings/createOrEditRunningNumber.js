(function () {
    appModule.controller('tenant.views.runningnumber.createOrEditRunningNumber', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'action', 'abp.services.app.runningNumber',
        function ($scope, $uibModal, $uibModalInstance, id, action,  runningNumber) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.action = action;
            
            vm.save = function () {

                vm.saving = true;
                if ($scope.isEmptyGuid(id)) {
                    runningNumber.create(vm.runningnumber).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    runningNumber.update(vm.runningnumber).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.runningNoRefChange = function () {
               if (vm.selectedReference != "Others") {
                   vm.runningnumber.reference = vm.selectedReference;
               }
            };

            vm.prefixChange = function () {
                vm.prefixSetup = vm.runningnumber.resetNumberIfValueGreaterThan.toString().substr(1).replace(new RegExp(/[0-9]/g), "0");
            };

            function init() {
                vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.RunningNumber.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.RunningNumber.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.RunningNumber.View'),
                };
                vm.padding = app.consts.runningNumberPadding.values;
                vm.runningNumReference = app.consts.runningNumberReference.values;

                runningNumber.get(id).then(function(result) {
                    vm.runningnumber = result.data;
                    vm.prefixChange();
                });

                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create))
                    vm.disableSave = true;
            }

            init();

        }
    ]);
})();