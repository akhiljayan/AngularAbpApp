(function () {
    appModule.controller('tenant.views.auditlog.fileDetail', [
        '$scope', '$stateParams', '$http', 'appSession', '$uibModal', '$uibModalInstance', 'auditLog', 'abp.services.app.customAuditLog',
        function ($scope, $stateParams, $http, appSession, $uibModal, $uibModalInstance, auditLog, auditLogService) {
            var vm = this;
            vm.auditLog = auditLog;
            console.log(auditLog);

            vm.$onInit = function () {
                vm.permissions = {
                    view: abp.auth.hasPermission('Pages.Tenant.AuditLog.View')
                };

                vm.getFileAuditingDetail();
            };

            vm.getFileAuditingDetail = function () {
                vm.loading = true;
                console.log(vm.auditLog.auditEntryID);
                auditLogService.getAuditFileDetails({ auditEntryID: vm.auditLog.auditEntryID }).then(function (result) {
                    vm.detail = result.data;
                    vm.loading = false;
                });
            };

            vm.camelCaseToWords = function (str) {
                if (str != undefined) {
                    var eventName = $.splitCamelCase(str);
                    return eventName.replace("Entity", "");
                } else {
                    return '';
                }
            };

            vm.close = function () {
                $uibModalInstance.close();
            };
        }
    ]);
})();
