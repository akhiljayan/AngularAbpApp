(function () {
    appModule.controller('tenant.views.assesment.settings.assesmentConfig', [
        '$scope', '$uibModal', '$validator', '$uibModalInstance', 'assesmentId', 'abp.services.app.assessment',
        function ($scope, $uibModal, $validator, $uibModalInstance, assesmentId,  appservice) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.monthsInteger = app.consts.monthsInteger;

            vm.save = function () {
                if (!$('#assesmentConfigForm').valid()) {
                    return;
                } else {
                    vm.saving = true;

                    appservice.updateNextReviewMonth(vm.assesment).then(function () {
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
                };

                appservice.get(assesmentId).then(function (result) {
                    vm.assesment = result.data;
                    vm.assesment.nextReviewMonth = { description: result.data.nextReviewMonth, id: result.data.nextReviewMonth };
                    vm.assesmentText = vm.assesment.description + " (" + vm.assesment.name + ")";
                });

                vm.disableSave = false;
            }

            init();

            vm.validationOptions = {
                rules: {
                    code: {
                        maxlengthCheck: []
                    },
                }
            };


        }
    ]);
})();