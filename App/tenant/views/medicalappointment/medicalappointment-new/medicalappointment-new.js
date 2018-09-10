(function () {
    appModule.component('medicalappointmentNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.medicalAppointment', '$stateParams',
            function (medicalAppointmentService, $stateParams) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    /*
                        Set seconds and milliseconds to 0 for resolve visit date time overlap issue
                        By default abp.clock.now() will generate seconds and milliseconds
                        and select from date time picker, the seconds and milliseconds will default to 0
                    */
                    var currentDateTime = abp.clock.now();

                    ctrl.mode = 'new';
                    ctrl.model = {
                        personId: $stateParams.personId,
                        appointmentDateTime: currentDateTime,
                        status: 0,
                        followUp: 0,
                    };              
                };

                ctrl.createMedicalAppointment = function (event) {
                    
                    medicalAppointmentService.createMedicalAppointment(
                        event.model
                    ).then(function (result) {
                        event.success && event.success(result.data.id);
                    }).finally(function (result) {
                        event.final && event.final();
                    });
                };

                function load() {
                    ctrl.loading = true;
                    var id = app.consts.EmptyGuid;
                    medicalAppointmentService.getMedicalAppointment(id).then(function (result) {         
                        
                        ctrl.model = result.data;
                        ctrl.model.personId = $stateParams.personId == undefined ? null : $stateParams.personId;                        
                        ctrl.loading = false;
                    });
                }
            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-new/medicalappointment-new.cshtml'
    });
})();