(function () {
    appModule.controller('tenant.views.vitalSigns.vitalSignView', [
        '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'vitalSignId', 'abp.services.app.vitalSign', 
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, vitalSignId, vitalSignService ) {
            var vm = this;
            vm.vitalSignId = vitalSignId;
            vm.luekocytesValue = app.consts.urineLuekocytes.values;
            vm.nitriteValue = app.consts.urineNitrite.values;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.GetBmiValue = function (weight, height) {
                var bmi;
                if (weight && height) {
                    bmi = $.roundDecimal((weight / ((height * height) / 10000)), 2);
                } else {
                    bmi = "-";
                }
                return bmi;
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.VitalSign.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.VitalSign.Edit'),
                };

                vitalSignService.getVitalSignById(vm.vitalSignId).then(function (result) {
                    
                    vm.vitalSign = result.data;
                });
            };

            init();

        }]);
})();