(function () {
    appModule.component('medicalappointmentEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.medicalAppointment', '$stateParams', '$state', 'stateNavigation',
            function (medicalAppointmentService, $stateParams, $state, stateNavigation) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {                    
                    load();
                };

                ctrl.updateMedicalAppointment = function (event) {
                    var data = angular.copy(event.data);
                    _.defaults(data, ctrl.model);

                    medicalAppointmentService.updateMedicalAppointment(
                        data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.confirmMedicalAppointment = function (event) {
                    medicalAppointmentService.confirmMedicalAppointment(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.cancelMedicalAppointment = function (event) {
                    medicalAppointmentService.cancelMedicalAppointment(
                        event.data.id,
                        event.data.cancellationReason
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.deleteMedicalAppointment = function (event) {
                    medicalAppointmentService.deleteMedicalAppointment(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        if ($stateParams.personId) {
                            stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.personId);
                        } else {
                            $state.go('tenant.medicalappointments');
                        }
                    });
                };

                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;
                    medicalAppointmentService.getMedicalAppointment($stateParams.id).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.mode = (ctrl.model.isConfirmed || ctrl.model.isCancelled)
                            ? 'readonly'
                            : 'view';
                        ctrl.loading = false;
                    });
                    ctrl.mode = 'view';
                    ctrl.model = {};
                }
            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-edit/medicalappointment-edit.cshtml'
    });
})();