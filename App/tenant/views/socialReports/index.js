(function () {
    appModule.controller('tenant.views.socialReports.index', [
        '$scope', 'abp.services.app.socialReport', '$location', '$anchorScroll',
        function ($scope, socialReportService, $location, $anchorScroll) {
            var vm = this;
            $anchorScroll.yOffset = 265;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.loading = false;
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.SocialReports.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.SocialReports.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.SocialReports.Delete')
            };

            vm.clearFilter = function () {
                vm.filter = null;
                vm.load();
            };

            vm.gotoAnchor = function (key) {
                //$location.hash(key);
                $anchorScroll(key);
            };

            vm.load = function (requestParams) {
                vm.loading = true;
                vm.key = getFilterKeys();

                socialReportService.getSocialReports(
                    $.extend({
                        filter: vm.filter
                    }, requestParams)
                ).then(function (result) {
                    vm.data = result.data;
                    vm.gotoAnchor("socialReports");
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getFilterKeys() {
                return vm.filter;
            }
        }
    ]);
})();