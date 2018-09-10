(function () {
    appModule.controller('tenant.views.transport.specialArrangements.createOrEditSpecialArrangement', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.transportSpecialArrangement',
        function ($scope, $uibModal, $uibModalInstance, transportSpecialArrangementsId, transportSpecialArrangementService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !transportSpecialArrangementsId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    transportSpecialArrangementService.createTransportSpecialArrangement(
                        vm.transportSpecialArrangement
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    transportSpecialArrangementService.updateTransportSpecialArrangement(
                        vm.transportSpecialArrangement
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelTransportSpecialArrangement = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.TransportSpecialArrangements.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.TransportSpecialArrangements.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.TransportSpecialArrangements.Delete'),
                    activate: abp.auth.hasPermission('Pages.Tenant.TransportSpecialArrangements.Activate'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.TransportSpecialArrangements.Deactivate')
                };

                vm.loading = true;

                transportSpecialArrangementService.getTransportSpecialArrangementForEdit({
                    id: transportSpecialArrangementsId
                }).then(function (result) {
                    vm.transportSpecialArrangement = result.data;
                    vm.transportSpecialArrangement.type = app.consts.specialArrangementType.values[result.data.type].localizedName;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();