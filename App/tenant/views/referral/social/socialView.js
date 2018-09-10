(function () {
    appModule.controller('tenant.views.referral.socialView', [
        '$scope', '$stateParams',
        function ($scope, $stateParams) {
            var social = this;
            var parent = $scope.$parent;
            social.mode = $scope.social.mode;

            parent.vm.setSocialNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'SocialBackground', displayName: 'Social Background' },
                    { key: 'FamilyMember', displayName: 'Family Member/Caregivers' },
                    { key: 'Genogram', displayName: 'Genogram', permission: abp.auth.hasPermission('Pages.Tenant.Genogram') },
                    { key: 'SocialReport', displayName: 'Social Report' }
                ];
            }
            
        }
    ]);
})();