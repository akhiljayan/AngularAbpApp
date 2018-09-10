(function () {
    appModule.controller('tenant.views.irms.homeHelpOthersView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.homeHelpList = {
                "liftLandingDesc": "-",
                "liftLandingKerbDesc": "-",
                "foodAmenitiesDesc": "-",
                "commonCorridorDesc": "-",
                "kitchenKerbDesc": "-",
                "toiletKerbDesc": "-",
                "homeModifiedDesc": "-",
                "transportDesc": "-",
                "publicTransportDesc": "-",
                "others": "-"
            };

            vm.othersList = [];

            parent.vm.setHomeHelpOthersNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'HomeHelp', displayName: app.localize('HomeHelp'), permission: true },
                    { key: 'Others', displayName: app.localize('Others'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.homeHelpList &&
                    vm.referral.homeHelpList.length > 0) {
                    vm.homeHelpList = vm.referral.homeHelpList[0];
                }

                vm.othersList = vm.referral.othersList;

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setHomeHelpOthersNavigation();
            };

            vm.init();
        }
    ]);
})();