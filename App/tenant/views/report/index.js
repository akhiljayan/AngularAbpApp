(function () {
    appModule.controller('tenant.views.report.index', [
        '$scope', '$timeout', '$location', '$anchorScroll', '$filter', 'abp.services.app.dynamicPermission',
        function ($scope, $timeout, $location, $anchorScroll, $filter, dynamicPermissionService) {
            var vm = this;
            vm.appPath = abp.appPath;


            //Load function
            vm.init = function () {
                vm.loading = true; 

                getAllRecords();
            };

            // Generate Report
            vm.openReport = function (report) {
                var reportWindow = window.open();
                var url = window.location.origin + vm.appPath + report.reportUrl;
                
                reportWindow.location = url;
                reportWindow.target = '_blank';
                reportWindow.locationbar.visible = false;
                reportWindow.focus();
            };

            vm.init();

            function getAllRecords() {
                dynamicPermissionService.getAccessGrantedReportList().then(function (result) {
                    vm.reportList = result.data;
                    console.log(vm.reportList);
                    vm.loading = false;
                });
            };
            
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {

                    });
                }, 0);
            }
        }
    ]);
})();
