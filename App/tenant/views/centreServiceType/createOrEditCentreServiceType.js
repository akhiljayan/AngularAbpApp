(function () {
    appModule.controller('tenant.views.centreServiceType.createOrEditCentreServiceType', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'action', 'abp.services.app.centreServices', 'abp.services.app.centre', 'abp.services.app.serviceType',
        function ($scope, $uibModal, $uibModalInstance, id, action,  centreService, centre, serviceType) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';

            vm.save = function (event) {
                if (!$('#centreServiceTypeForm').valid())
                    return;
                vm.saving = true;

                if ($scope.isEmptyGuid(id)) {
                    centreService.addServiceToCentre(vm.centreServiceType).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    centreService.update(vm.centreServiceType).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                event.preventDefault();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
               
                console.log(vm);
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Delete')
                };

                centre.getAllActiveCentresForLookup().then(function (result) {
                    vm.centrelist = result.data;
                });
               

                serviceType.getActiveServiceTypes().then(function (result) {
                    vm.serviceTypes = result.data;
                });
                centreService.getCentreServiceTypeById(id).then(function (result) {
                    vm.centreServiceType = result.data;
                });
               
                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create)) {
                    vm.disableSave = true;
                }
                    
             
            }

            init();

        }
    ]);
})();