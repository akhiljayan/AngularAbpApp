(function () {
    appModule.controller('tenant.views.irms.healthView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.healthInformationList = {
                "hypertension": "-",
                "hyperlipidemia": "-",
                "diabeteMellitus": "-",
                "stroke": "-",
                "dementia": "-",
                "dementiaSpecify": "-",
                "psychiatricCondition": "-",
                "psychiatricConditionSpecify": "-",
                "heartDisease": "-",
                "renalDisease": "-",
                "reasonforAdmission": "-",
                "infectiousDisease": "-",
                "copd": "-",
                "others": "-"
            };

            vm.hitInfectiousDisease1List = {
                "infectious_Hepatitis": "-"
            };

            vm.hitInfectiousDisease2List = {
                "infectiousDiseasesOther": "-",
                "infectiousDiseasesOtherSpecify": "-",
                "mrsa": "-",
                "vre": "-",
                "ptb": "-"
            };

            vm.hitPrecautionRequiredList = {
                "precautionRequired": "-",
                "precautionRequiredOthersSpecify": "-"
            };

            parent.vm.setHealthNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'HealthInformation', displayName: app.localize('HealthInformation'), permission: true },
                    { key: 'HealthInfectiousDisease', displayName: app.localize('InfectiousDisease'), permission: true },
                    { key: 'HealthOtherInfectiousDisease', displayName: app.localize('OtherInfectiousDisease'), permission: true },
                    { key: 'HealthPrecautionRequired', displayName: app.localize('PrecautionRequired'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.healthInformationList &&
                    vm.referral.healthInformationList.length > 0) {
                    vm.healthInformationList = vm.referral.healthInformationList[0];
                }

                if (vm.referral.hitInfectiousDisease1List &&
                    vm.referral.hitInfectiousDisease1List.length > 0) {
                    vm.hitInfectiousDisease1List = vm.referral.hitInfectiousDisease1List[0];
                }

                if (vm.referral.hitInfectiousDisease2List &&
                    vm.referral.hitInfectiousDisease2List.length > 0) {
                    vm.hitInfectiousDisease2List = vm.referral.hitInfectiousDisease2List[0];
                }

                if (vm.referral.hitPrecautionRequiredList &&
                    vm.referral.hitPrecautionRequiredList.length > 0) {
                    vm.hitPrecautionRequiredList = vm.referral.hitPrecautionRequiredList[0];
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setHealthNavigation();
            };

            vm.init();
        }
    ]);
})();