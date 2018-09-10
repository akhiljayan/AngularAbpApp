(function () {
    appModule.controller('tenant.views.medicalappointment.cancelMedicalAppointment', [
        '$scope', '$uibModal', '$uibModalInstance', 'medicalAppointmentId', 'permissions',
        function ($scope, $uibModal, $uibModalInstance, medicalAppointmentId, permissions) {
            var vm = this;

            vm.saving = false;
            vm.permissions = {};
            vm.medicalAppointment = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                //Cancel Medical Appointment record
                $uibModalInstance.close(vm.medicalAppointment);
            };

            vm.init = function () {
                vm.permissions = permissions;
                vm.medicalAppointment.id = medicalAppointmentId;
            };

            vm.init();
        }
    ]);
})();
