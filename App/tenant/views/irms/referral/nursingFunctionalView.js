(function () {
    appModule.controller('tenant.views.irms.nursingFunctionalView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.nursingProcedureList = {
                "feedingTubeTypeDueForChangingOn": "-",
                "feedingTubeTypeSize": "-",
                "feedingTubeNPType": "-",
                "othersFeedingTubeTypeValue": "-",
                "urinaryCatheter": "-",
                "urinaryTypeDueForChangingOn": "-",
                "urinaryCatheterSize": "-",
                "urinaryCatheterFrequency": "-",
                "urinaryCatheterType": "-",
                "othersUrinaryCatheterTypeValue": "-",
                "tracheostomy": "-",
                "tracheostomyDueForChanging": "-",
                "peg": "-",
                "pegDueForChanging": "-",
                "tracheostomy": "-",
                "tracheostomyDueForChanging": "-",
                "colostomy": "-",
                "colostomyDueForChanging": "-",
                "ileostomy": "-",
                "ileostomyDueForChanging": "-",
                "copeLoopNP": "-",
                "copeLoopType": "-",
                "copeLoopNPOthers": "-",
                "pcnnp": "-",
                "pcnnpType": "-",
                "otherProcedure": "-",
            };
            vm.woundList = [];
            vm.injectionList = [];
            vm.functionalStatusList = {
                "prevFeeding": "-",
                "prevFeedingDependence": "-",
                "prevToileting": "-",
                "prevToiletingDependence": "-",
                "prevMobility": "-",
                "prevMobilityAidsNeeded": "-",
                "prevMobilityAssistLevel": "-",
                "prevMobilityEnvironmentAccess": "-",
                "curFeeding": "-",
                "curFeedingDependence": "-",
                "curToileting": "-",
                "curToiletingNeedsAssistance": "-",
                "bowelManagement": "-",
                "otherBowelManagement": "-",
                "curMobility": "-",
                "curAidsNeeded": "-",
                "curAssistLevel": "-",
                "curTransfer": "-",
                "activityTolerance": "-",
                "mentalStatus": "-",
                "othersMentalStatusValue": "-",
                "onsetDate": "-",
                "visualImpairment": "-",
                "visualImpairmentSpecify": "-",
                "hearingImpairment": "-",
                "hearingImpairmentSpecify": "-",
            };
            vm.functionalRespiratoryCareList = {
                "respiratoryCare": "-",
                "othersRespiratoryCareValue": "-",
            };

            parent.vm.setNursingFunctionalNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'NursingProcedure', displayName: app.localize('NursingProcedure'), permission: true },
                    { key: 'FunctionalStatus', displayName: app.localize('FunctionalStatus'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.nursingProcedureList &&
                    vm.referral.nursingProcedureList.length > 0) {
                    vm.nursingProcedureList = vm.referral.nursingProcedureList[0];
                }

                if (vm.referral.woundList &&
                    vm.referral.woundList.length > 0) {
                    vm.woundList = vm.referral.woundList;
                }

                if (vm.referral.injectionList &&
                    vm.referral.injectionList.length > 0) {
                    vm.injectionList = vm.referral.injectionList;
                }

                if (vm.referral.functionalStatusList &&
                    vm.referral.functionalStatusList.length > 0) {
                    vm.functionalStatusList = vm.referral.functionalStatusList[0];
                }

                if (vm.referral.functionalRespiratoryCareList &&
                    vm.referral.functionalRespiratoryCareList.length > 0) {
                    vm.functionalRespiratoryCareList = vm.referral.functionalRespiratoryCareList[0];
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setNursingFunctionalNavigation();
            };

            vm.init();
        }
    ]);
})();