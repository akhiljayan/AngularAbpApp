(function () {
    appModule.controller('tenant.views.irms.therapyView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.otList = {
                "grooming": "-",
                "showering": "-",
                "toileting": "-",
                "feeding": "-",
                "ubDressing": "-",
                "lbDressing": "-",
                "wheelchairMobility": "-",
                "patientFunctioning": "-",
                "otherRemarks": "-",
                "careGiver": "-",
                "admScoreFIN": "-",
                "disScoreFIN": "-",
                "admScoreMBI": "-",
                "dischargeScoreMBI": "-",
            };
            vm.ptList = {
                "bedMobilityStatus": "-",
                "bedMobility": "-",
                "ambulation": "-",
                "walkingAid": "-",
                "walkingAidOthers": "-",
                "transfer": "-",
                "staticStanding": "-",
                "dynamicStanding": "-",
                "staticSitting": "-",
                "dynamicSittingDirection": "-",
                "exerciseTolerance": "-",
                "rightArms": "-",
                "rightLegs": "-",
                "leftArms": "-",
                "leftLegs": "-",
                "careGiver": "-",
                "otherRemarks": "-",
                "admissionScoreFIM": "-",
                "dischargeScoreFIM": "-",
                "admissionScoreMBI": "-",
                "dischargeScoreMBI": "-",
            };
            vm.ptSpecialPrecautionList = [];
            vm.stList = {
                "comprehension": "-",
                "verbalExpression": "-",
                "speech": "-",
                "voice": "-",
                "otherRemarks": "-",
            };
            vm.stFeedingStatusList = [];

            parent.vm.setTherapyNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'OccupationalTherapy', displayName: app.localize('OccupationalTherapy'), permission: true },
                    { key: 'Physiotherapy', displayName: app.localize('Physiotherapy'), permission: true },
                    { key: 'SpeechTherapy', displayName: app.localize('SpeechTherapy'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.otList &&
                    vm.referral.otList.length > 0) {
                    vm.otList = vm.referral.otList[0];
                }

                if (vm.referral.ptList &&
                    vm.referral.ptList.length > 0) {
                    vm.ptList = vm.referral.ptList[0];
                }

                if (vm.referral.ptSpecialPrecautionList &&
                    vm.referral.ptSpecialPrecautionList.length > 0) {
                    vm.ptSpecialPrecautionList = vm.referral.ptSpecialPrecautionList;
                }

                if (vm.referral.stList &&
                    vm.referral.stList.length > 0) {
                    vm.stList = vm.referral.stList[0];
                }

                if (vm.referral.stFeedingStatusList &&
                    vm.referral.stFeedingStatusList.length > 0) {
                    vm.stFeedingStatusList = vm.referral.stFeedingStatusList;
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setTherapyNavigation();
            };

            vm.init();
        }
    ]);
})();