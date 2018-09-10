(function () {
    appModule.controller('tenant.views.centreServiceType.createOrEditMutuallyExclusiveServiceType', [
        '$scope', '$uibModal', '$uibModalInstance', 'meServiceTypeId', 'action', 'abp.services.app.mutuallyExclusiveServiceType', 'abp.services.app.serviceType',
        function ($scope, $uibModal, $uibModalInstance, meServiceTypeId, action, appService, serviceType) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';

            vm.action = action;


            vm.save = function () {
                //if (!$('#serviceTypeForm').valid())
                //    return;
                vm.saving = true;
                if ($scope.isEmptyGuid(meServiceTypeId)) {

                    appService.create(vm.mutuallyExclusiveServiceType).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    appService.update(vm.mutuallyExclusiveServiceType).then(function () {
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

                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.Delete')
                };

                

                appService.getMutuallyExclusiveServiceTypeById(meServiceTypeId).then(function (result) {
                    vm.mutuallyExclusiveServiceType = result.data;
                });

                serviceType.getActiveServiceTypes().then(function (result) {
                    vm.serviceTypes = result.data;
                });

                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create))
                    vm.disableSave = true;
            }

            init();

        }
    ]);
})();