(function () {
    appModule.controller('tenant.views.centre.createOrEditCentre', [
        '$scope', '$uibModal', '$validator', '$uibModalInstance', 'centreId', 'action', 'abp.services.app.centre', 'abp.services.app.organizationUnit',
        function ($scope, $uibModal, $validator, $uibModalInstance, centreId, action, appservice, appOU) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';


            vm.save = function () {
                if (!$('#centreForm').valid()) {
                    return;
                } else {
                    vm.saving = true;

                    if ($scope.isEmptyGuid(centreId)) {
                        appservice.create(vm.centre).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        appservice.update(vm.centre).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Centre.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Centre.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Centre.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Centre.Delete')
                };

                appservice.get(centreId).then(function (result) {
                    vm.centre = result.data;
                });

                appOU.getOrganizationUnitsFlat().then(function (result) {
                    vm.organizationUnits = result.data;
                });

                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create)) {
                    vm.disableSave = true;
                }
            }

            init();

            vm.validationOptions = {
                rules: {
                    code: {
                        maxlengthCheck: []
                    },
                }
            };

            $validator.addMethod('maxlengthCheck', function (value, element, options) {
                if (value.length > 6) {
                    return false;
                } else {
                    return true;
                }
            }, 'Please enter no more than 6 characters.');

        }
    ]);
})();