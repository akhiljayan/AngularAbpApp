(function (_) {
    appModule.component('medicalappointmentDetailGeneralCard', {
        require: {
            parentCtrl: '^medicalappointmentDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&',
            onReload: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$stateParams', 'abp.services.app.medicalAppointment', '$filter',
            function ($stateParams, medicalAppointmentService, $filter) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.$stateParams = $stateParams;

                    ctrl.parentCtrl.addForm(submitForm);
                };



                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.workingModel = ctrl.model;
                    }
                };

                ctrl.save = function (event) {                   
                    ctrl.onUpdate({
                        event: {
                            data: ctrl.workingModel,
                            success: closeEditMode
                        }
                    });

                    event.preventDefault();
                };

                ctrl.cancel = function () {
                    closeEditMode();
                };


                ctrl.onChangeAppointmentType = function (selected) {
                    
                    if (selected != null && selected.description == 'Specialist Outpatient Clinic') {
                        ctrl.isAppointmentTypeSOC = true;
                    } else {
                        ctrl.isAppointmentTypeSOC = false;
                        ctrl.workingModel.specialistOutpatientClinicId = null;
                    }                    
                };
                
                // callbacks
                function closeEditMode() {
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                function submitForm() {
                    ctrl.form.submitted = true;

                    /*
                        Add this statement to not show popout dialog
                        Your changes have not been saved. Leave anyway?
                        when click Save with all mandatory fields are filled
                    */
                    if (ctrl.form.$valid) {
                        ctrl.form.$setPristine();
                    }

                    return ctrl.form.$valid;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-detail/medicalappointment-detail-general-card.cshtml'
    });
})(_);