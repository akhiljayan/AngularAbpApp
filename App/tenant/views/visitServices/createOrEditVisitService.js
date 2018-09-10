(function () {
    appModule.controller('tenant.views.visitServices.createOrEditVisitService', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.visitService', 'abp.services.app.serviceType',
        function ($scope, $uibModal, $uibModalInstance, visitServiceId, visitServiceService, serviceTypeService) {
            var vm = this;
            vm.saving = false;            
            vm.isCreateMode = !visitServiceId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    visitServiceService.createVisitService(
                        vm.visitService
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    visitServiceService.updateVisitService(
                        vm.visitService
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelVisitService = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    edit: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    delete: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    activate: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.VisitLogs')
                };
                
                serviceTypeService.getActiveServiceTypes().then(function (result) {
                    vm.serviceTypes = result.data;
                });

                vm.loading = true;

                visitServiceService.getVisitServiceForEdit({
                    id: visitServiceId
                }).then(function (result) {
                    vm.visitService = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();