(function () {
    appModule.controller('tenant.views.progressNoteTypes.createOrEditProgressNoteType', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.progressNoteType',
        function ($scope, $uibModal, $uibModalInstance, progressNoteTypeId, progressNoteTypeService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !progressNoteTypeId;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    progressNoteTypeService.createProgressNoteType(
                        vm.progressNoteType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    progressNoteTypeService.updateProgressNoteType(
                        vm.progressNoteType
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelProgressNoteType = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.ProgressNotes'),
                    edit: abp.auth.hasPermission('Pages.Tenant.ProgressNotes'),
                    delete: abp.auth.hasPermission('Pages.Tenant.ProgressNotes')
                };

                vm.loading = true;

                progressNoteTypeService.getProgressNoteTypeForEdit({
                    id: progressNoteTypeId
                }).then(function (result) {
                    vm.progressNoteType = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
})();