(function () {
    appModule.controller('tenant.views.drug.createOrEditGenericDrug', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'action', 'abp.services.app.genericDrug',
        function ($scope, $uibModal, $uibModalInstance, id, action,  appService) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.action = action;
            
            vm.save = function () {

                vm.saving = true;
                if ($scope.isEmptyGuid(id)) {
                    appService.create(vm.genericDrug).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    appService.update(vm.genericDrug).then(function () {
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


            function init() {
                vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Drug.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Drug.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Drug.View'),
                };

                appService.get(id).then(function(result) {
                    vm.genericDrug = result.data;
                });

                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create))
                    vm.disableSave = true;
            }

            init();

        }
    ]);
})();