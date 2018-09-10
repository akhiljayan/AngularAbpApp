(function () {
    appModule.controller('tenant.views.referral.socialBackground', [
        '$scope', '$stateParams', '$validator', 'abp.services.app.referral',
        function ($scope, $stateParams, $validator, referralService) {
            var vm = this;
            vm.mode = $scope.vm.mode;

            vm.edit = function () {
                vm.mode = 'edit';
            };

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function (referral) {
                vm.isSaving = true;
                if (vm.mode == 'edit') {
                    referralService.update(referral).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.isSaving = false;
                    }).finally(function () {
                        vm.close();
                    });
                }
            };

            vm.init = function () {
                $scope.vm.sb = $scope.sb;
            }

            vm.init();
        }
    ]);
})();