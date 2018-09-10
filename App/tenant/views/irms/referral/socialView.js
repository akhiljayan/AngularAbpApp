(function () {
    appModule.controller('tenant.views.irms.socialView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.socialReportList = {
                "socialbackground": "-",
                "functionalStatusAndCareNeed": "-",
                "socialCriteriaAssessment": "-",
                "financialAssessment": "-",
                "additionalAssistance": "-",
                "recommendation": "-"
            };

            parent.vm.setSocialNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'SocialBackground', displayName: app.localize('SocialBackground'), permission: true },
                    { key: 'PremorbidConditionADLFunctionalStatusAndCareNeed', displayName: app.localize('PremorbidConditionADLFunctionalStatusAndCareNeed'), permission: true },
                    { key: 'SocialCriteriaAssessment', displayName: app.localize('SocialCriteriaAssessment'), permission: true },
                    { key: 'FinancialBackgroundFinancialAssessment', displayName: app.localize('FinancialBackgroundFinancialAssessment'), permission: true },
                    { key: 'AdditionalAssistance', displayName: app.localize('AdditionalAssistance'), permission: true },
                    { key: 'Recommendation', displayName: app.localize('Recommendation'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.socialReportList &&
                    vm.referral.socialReportList.length > 0) {
                    vm.socialReportList = vm.referral.socialReportList[0];
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setSocialNavigation();
            };

            vm.init();
        }
    ]);
})();