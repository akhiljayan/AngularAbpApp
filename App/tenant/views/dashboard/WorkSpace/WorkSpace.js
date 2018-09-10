(function () {
    appModule.controller('tenant.views.dashboard.workspace', [
        '$scope', 'abp.services.app.bulletin', '$uibModal', 'abp.services.app.commonLookup', 'abp.services.app.masterLookUp',
        function ($scope, bulletinService, $uibModal, commonLookupService, masterLookup) {
            var vm = this;

            vm.init = function () {
                vm.appPath = abp.appPath;
            };

            vm.init();
        }
    ]);
})();