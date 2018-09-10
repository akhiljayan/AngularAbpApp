(function () {
    appModule.controller('tenant.views.masterdatalookup.createOrEditMasterDataItem', [
        '$scope', '$uibModal', '$uibModalInstance', 'masterType', 'masterTypeItemId', 'action', 'abp.services.app.masterLookUp',
        function ($scope, $uibModal, $uibModalInstance, masterType,   masterTypeItemId , action,  masterLookup) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.masterData = masterType.type;
    
            vm.save = function () {
                if (!$('#masterDataForm').valid())
                    return;
                vm.saving = true;
                vm.masterDataTypeItem.masterTypeId = masterType.id;
                if ($scope.isEmptyGuid(masterTypeItemId)) {
                    masterLookup.create(vm.masterDataTypeItem).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    masterLookup.update(vm.masterDataTypeItem).then(function () {
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
                    create: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.Create'),
                    edit: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.Edit'),
                    view: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.View'),
                    delete: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.Delete')
                };

                if ($scope.isEmptyGuid(masterTypeItemId))
                    return;
           
                masterLookup.getMasterTypeItem(masterTypeItemId)
                    .then(function (result) {
                        vm.masterDataTypeItem = result.data;
                        vm.loading = false;
                    });

                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create))
                    vm.disableSave = true;
            }

            init();

        }
    ]);
})();