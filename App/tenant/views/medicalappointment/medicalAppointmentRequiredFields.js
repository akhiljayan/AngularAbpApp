(function () {
    appModule.controller('tenant.views.medicalappointment.medicalAppointmentRequiredFields', [
        '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'data', 'action', 'abp.services.app.medicalAppointment',
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, masterLookup, data, action, medicalAppointmentService) {
            var vm = this;
            vm.saving = false;
            vm.medicalAppointment = data;
            vm.action = action;
            vm.editMode = false;

            vm.save = function () {
                if (!vm.saving) {
                    vm.saving = true;
                    medicalAppointmentService.edit(vm.medicalAppointment).then(function (result) {
                        if (action == "cancel") {
                            medicalAppointmentService.cancel(result.data.id, vm.medicalAppointment.cancellationReason).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.isSaving = false;
                            });
                        } else if (action == "confirm") {
                            medicalAppointmentService.confirm(result.data.id).then(function (result) {
                                emitAfterSave();
                            }).finally(function () {
                                vm.isSaving = false;
                            });
                        }
                    });
                }
                
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-MedicalAppointment');
                $uibModalInstance.close();
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                
            }


            init();
        }
    ]);
})();