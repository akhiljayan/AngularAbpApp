(function () {
    appModule.controller('tenant.views.referral.generalView', [
        '$scope', '$stateParams', 'abp.services.app.referral',
        function ($scope, $stateParams, referralService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};

            //close card
            vm.close = function () {
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
                vm.mode = 'edit';
                vm.person = _.pick($scope.vm.person, [
                    'highestEducationId', 'lastOccupationId', 'liftLandingId', 'livingArrangementId',
                    'remarks'
                ]);
            };
            //save card
            vm.save = function (referral) {
                $scope.$emit('UpdateReferral', referral);
            };
            //init method
            vm.init = function () {
                $scope.vm.generalReferral = $scope.generalReferral;
                $scope.generalReferral.person = vm.person;
            }

            //brodcast,on and emit functions
            $scope.$on('vmReferral', function (events, data) {
                vm.referral = data;
            });
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

            //init call
            vm.init();
        }
    ]);
})();