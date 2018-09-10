(function () {
    appModule.controller('tenant.views.drugs.createOrEditDrug', [
        '$scope', '$uibModal', '$uibModalInstance', 'id', 'abp.services.app.drug', 'abp.services.app.drugSource', '$filter',
        function ($scope, $uibModal, $uibModalInstance, drugId, drugService, drugSourceService, $filter) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !drugId;

            vm.drugType = app.consts.drugType.values;
            vm.drugCategories = app.consts.drugCategory.values;

            vm.save = function () {
                vm.saving = true;

                if (vm.isCreateMode) {
                    drugService.createDrug(
                        vm.drug
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    drugService.updateDrug(
                        vm.drug
                    ).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancelDrug = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    activate: abp.auth.hasPermission('Pages.Tenant.Prescriptions'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.Prescriptions')
                };

                drugSourceService.getActiveDrugSources().then(function (result) {
                    vm.drugSources = result.data;
                });

                vm.loading = true;

                drugService.getDrugForEdit({
                    id: drugId
                }).then(function (result) {
                    vm.drug = result.data;
                    if (vm.drug.drugSourceId == app.consts.EmptyGuid) {
                        vm.drug.drugSourceId = null;
                    }
                    if (vm.drug.drugType) {
                        vm.drug.drugType = $filter('enumText')(vm.drugType.value, { name: vm.drug.drugType })[0];
                    }
                    if (vm.drug.drugCategory) {
                        vm.drug.drugCategory = $filter('enumText')(vm.drugCategory.value, { name: vm.drug.drugCategory })[0];
                    }

                }).finally(function () {
                    if (vm.drug.drugCategory != null) {
                        //vm.drug.drugCategory = $filter('enumText')(vm.drug.drugCategory, 'drugCategory').replace(" ", "");
                        vm.drug.drugType = $filter('enumText')(vm.drugType.value, { name: vm.drug.drugType })[0];
                    }
                    if (vm.drug.drugType != null) {
                        //vm.drug.drugType = $filter('enumText')(vm.drug.drugType, 'drugType');
                        vm.drug.drugCategory = $filter('enumText')(vm.drugCategory.value, { name: vm.drug.drugCategory })[0];
                    }
                    vm.loading = false;
                });

                

            }

            init();
        }
    ]);
})();