(function () {
    appModule.controller('tenant.views.dashboard.carebord', [
        '$scope', '$uibModal', 
        function ($scope, $uibModal) {
            var vm = this;
            vm.appPath = abp.appPath;
            vm.isPersonSelected = false;
            vm.patientIdTimeLine = '',
            vm.personFullname = '';
            vm.isPatient = false;
            vm.timelineLoading = false;
            vm.init = function () {
                vm.permissions = {
                };
            };

            vm.init();

        }
    ]);
})();