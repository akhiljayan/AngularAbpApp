(function () {
    appModule.controller('tenant.views.referral.socialReportView', [
        '$scope', '$stateParams', '$state', 'abp.services.app.socialReport', 'abp.services.app.referral',
        function ($scope, $stateParams, $state, socialReportService, referralService) {
            var vm = this;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.hasPreAdmission = false;
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.SocialReports'),
                create: abp.auth.hasPermission('Pages.Tenant.SocialReports.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.SocialReports.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.SocialReports.Delete')
            };

            vm.create = function () {
                $state.go('tenant.socialReportNew', {
                    referralId: $stateParams.id
                });
            };

            $scope.$on('loadSocialReportView', function (event, data) {
                vm.load();
            });

            vm.load = function () {
                if (!vm.permissions.view || !$scope.vm.referral) {
                    return;
                }

                hasPreAdmission();

                socialReportService.getSocialReportsByReferralId({
                    id: $scope.vm.referral.id
                }).then(function (result) {
                    vm.data = result.data;
                });
            };

            vm.load();

            function hasPreAdmission() {
                if ($stateParams.id) {
                    referralService.hasPreAdmission(
                        $stateParams.id
                    ).then(function (result) {
                        vm.hasPreAdmission = result.data;
                    });
                }
            }
        }
    ]);
})();