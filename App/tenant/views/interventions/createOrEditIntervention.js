(function () {
    appModule.controller('tenant.views.interventions.createOrEditIntervention', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.intervention',
        function ($scope, $uibModal, $uibModalInstance, interventionId, interventionService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !interventionId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    interventionService.createIntervention(
                        vm.intervention
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    interventionService.updateIntervention(
                        vm.intervention
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelIntervention = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    edit: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    delete: abp.auth.hasPermission('Pages.Tenant.CarePlans')
                };

                vm.loading = true;

                interventionService.getInterventionForEdit({
                    id: interventionId
                }).then(function (result) {
                    vm.intervention = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();