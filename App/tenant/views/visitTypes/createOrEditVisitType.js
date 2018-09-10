(function () {
    appModule.controller('tenant.views.visitTypes.createOrEditVisitType', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.visitType', 'abp.services.app.serviceType',
        function ($scope, $uibModal, $uibModalInstance, visitTypeId, visitTypeService, serviceTypeService) {
            var vm = this;
            vm.saving = false;            
            vm.isCreateMode = !visitTypeId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    visitTypeService.createVisitType(
                        vm.visitType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    visitTypeService.updateVisitType(
                        vm.visitType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelVisitType = function () {
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

                visitTypeService.getVisitTypeForEdit({
                    id: visitTypeId
                }).then(function (result) {
                    vm.visitType = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();