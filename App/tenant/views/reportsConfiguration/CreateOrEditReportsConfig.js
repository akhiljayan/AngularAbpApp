(function () {
    appModule.controller('tenant.views.reportsConfiguration.createOrEditReportsConfig', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'reportId', 'abp.services.app.report',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, reportId, reportService) {
            
            var vm = this;
            vm.saving = false;
            vm.reportId = reportId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;

            vm.save = function (report) {
                if (!vm.saving) {
                    vm.saving = true;                   

                    if ($scope.isEmptyGuid(reportId)) {
                        reportService.createReport(report).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        reportService.updateReport(report).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {

                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.ReportsConfiguration.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.ReportsConfiguration.Edit'),
                };
                vm.disableSave = false;
                vm.report = { isActive: true };
                if (vm.reportId != app.consts.EmptyGuid) {
                    vm.editMode = true;
                }
                reportService.getReport(vm.reportId).then(function (result) {
                    vm.report = result.data;
                    console.log(vm.report);
                });
            };
            
            init();
        }]);
})();