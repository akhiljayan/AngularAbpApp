(function () {
    appModule.controller('tenant.views.reportsConfiguration.index', [
        '$scope', '$timeout', 'abp.services.app.report', '$location', '$anchorScroll', '$filter', '$uibModal',
        function ($scope, $timeout, reportService, $location, $anchorScroll, $filter, $uibModal) {

            $anchorScroll.yOffset = 70;
            var vm = this;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.headingAppend = '';

            //Load function
            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.ReportsConfiguration.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.ReportsConfiguration.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.ReportsConfiguration.View'),
                };
            };
            
            //Create
            vm.create = function () {
                
                if (vm.permissions.create) {
                    openCreateOrEditReport(app.consts.EmptyGuid);
                }
            };

            //Edit
            vm.edit = function (reportId) {
                if (vm.permissions.edit) {
                    openCreateOrEditReport(reportId);
                }
            };

            vm.init();

            vm.loadResults = function (requestParams, status) {                
                if (!status)
                    vm.headingAppend = '- Inactive';

                getAllRecords(requestParams, status);
            };            

            function getAllRecords(requestParams, status) {
                vm.loading = true;
                reportService.getAllReport($.extend({ IsActive: status }, requestParams)).then(function (result) {
                    vm.reportList = result.data;                    
                    vm.loading = false;
                });
            };

            //create edit
            function openCreateOrEditReport(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/reportsConfiguration/createOrEditReportsConfig.cshtml',
                    controller: 'tenant.views.reportsConfiguration.createOrEditReportsConfig as vm',
                    backdrop: 'static',
                    resolve: {
                        reportId: function () {
                            return id;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    var requestParams = { skipCount: 0 };
                    getAllRecords(requestParams, true);
                });
            }

            vm.$onChanges = function (changes) {
                var requestParams = { skipCount: 0 };
                getAllRecords(requestParams, true);      
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
