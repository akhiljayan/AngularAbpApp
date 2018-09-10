(function () {
    appModule.controller('tenant.views.referral.referralGenerralView', [
        '$scope', '$stateParams',
        function ($scope, $stateParams) {
            var referralGeneral = this;
            var parent = $scope.$parent;
            referralGeneral.mode = $scope.$parent.vm.mode;

            parent.vm.setReferralGeneralNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'BioData', displayName: 'Bio Data' },
                    { key: 'ContactInformation', displayName: 'Contact Information' },
                    { key: 'OtherInformation', displayName: 'Other Information' },
                    { key: 'TrigeInfo', displayName: 'Triage Information' },
                    { key: 'General', displayName: 'General' },
                    { key: 'ReferralServiceType', displayName: 'Referral Service Type' },
                    { key: 'ReferralInformation', displayName: 'Referral Information' },
                ];
            }

            //referralGeneral.init = function () {
            //    parent.vm.setReferralGeneralNavigation();
            //}

            //referralGeneral.init();
            
        }
    ]);
})();