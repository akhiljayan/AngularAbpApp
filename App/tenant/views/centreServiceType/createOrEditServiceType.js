(function () {
    appModule.controller('tenant.views.centreServiceType.createOrEditServiceType', [
        '$scope', '$uibModal', 'commonFormFunction', '$uibModalInstance', 'serviceTypeId', 'action', 'abp.services.app.serviceType',
        function ($scope, $uibModal,commonFormFunction, $uibModalInstance, serviceTypeId , action,  serviceType) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.isVisitLogRequiredShow = false;
            vm.save = function (event) {
            
                if (!vm.serviceTypeForm.$valid)
                    return;
 
                vm.saving = true;
                //vm.serviceType.categoryId = masterType.id;
                if ($scope.isEmptyGuid(serviceTypeId)) {
                    serviceType.create(vm.serviceType).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    serviceType.update(vm.serviceType).then(function () {
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
                console.log(vm);
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.ServiceType.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.ServiceType.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.ServiceType.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.ServiceType.Delete')
                };

                serviceType.getServiceTypeCategories().then(function (result) {
                    vm.serviceTypeCategories = result.data;
                });


                serviceType.getServiceTypeById(serviceTypeId).then(function (result) {
                    vm.serviceType = result.data;
                });


            }

            init();

        }
    ]);
})();