(function () {
    appModule.controller('tenant.views.referral.triageInfoView', [
        '$scope', '$timeout', '$stateParams', 'abp.services.app.referral',
        function ($scope, $timeout, $stateParams, referralService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};
            vm.selectedDt = '';

            vm.edit = function () {
                vm.mode = 'edit';
                vm.person = _.pick($scope.vm.person, [
                    'highestEducationId', 'lastOccupationId', 'liftLandingId', 'livingArrangementId',
                    'remarks'
                ]);
            };
            vm.close = function () {
                vm.mode = 'view';
            };
            vm.init = function () {
                $scope.vm.triage = $scope.triage;
                $scope.triage.person = vm.person;
            };
            vm.save = function (referral) {
                $scope.$emit('UpdateReferral', referral);
            };

            $scope.$on('ReferralUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });
            $scope.$on('PersonUpdated', function (event, data) {
                if (event.targetScope == $scope) {
                    if (data.success) {
                        vm.close();
                    }
                }
            });

            vm.init();
        }
    ]);

})();