(function () {
    appModule.controller('tenant.views.irms.rafView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.rafList = {
                "mobility": "-",
                "toileting": "-",
                "feeding": "-",
                "personalGroomingHygiene": "-",
                "socialEmotionalNeeds": "-",
                "confusion": "-",
                "psychiatricProblems": "-",
                "behaviorProblems": "-",
                "total": "-",
                "category": "-",
                "latestAssessmentDate": "-",
                "treatment": "-",
                "treatmentOraltropical": "-",
                "treatmentInjection": "-",
                "treatmentPhysiotherapy": "-",
                "treatmentSpecialProcedure": "-",
                "treatmentSpecialProceduresMins": "-",
                "message": "-",
            };

            parent.vm.setRAFNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'RAF', displayName: app.localize('RAF'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.rafList &&
                    vm.referral.rafList.length > 0) {
                    vm.rafList = vm.referral.rafList[0];
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setRAFNavigation();
            };

            vm.init();
        }
    ]);
})();