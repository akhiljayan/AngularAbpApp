(function () {
    appModule.controller('host.views.masterdata.createOrEditMasterDataItem', [
        '$scope', '$uibModal', '$uibModalInstance', 'masterType', 'masterTypeItemId', 'action', 'abp.services.app.masterData',
        function ($scope, $uibModal, $uibModalInstance, masterType,   masterTypeItemId , action,  masterData) {
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
                vm.masterDataTypeItem.masterDataTypeId = masterType.id;
                if ($scope.isEmptyGuid(masterTypeItemId)) {
                    masterData.create(vm.masterDataTypeItem).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    masterData.update(vm.masterDataTypeItem).then(function () {
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
                    create: abp.auth.hasPermission('Pages.Administration.Host.MasterData.Create'),
                    edit: abp.auth.hasPermission('Pages.Administration.Host.MasterData.Edit'),
                    view: abp.auth.hasPermission('Pages.Administration.Host.MasterData.View'),
                    delete: abp.auth.hasPermission('Pages.Administration.Host.MasterData.Delete')
                };

                if ($scope.isEmptyGuid(masterTypeItemId))
                    return;
           
                masterData.getMasterTypeItem(masterTypeItemId)
                    .then(function (result) {
                        vm.masterDataTypeItem = result.data;
                        vm.loading = false;
                    });

                vm.masterDataTypeItem.disabled = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create))
                    vm.masterDataTypeItem.disabled = true;

            }

            init();

        }
    ]);
})();