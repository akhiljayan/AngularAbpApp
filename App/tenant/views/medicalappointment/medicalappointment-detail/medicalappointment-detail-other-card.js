(function (_) {
    appModule.component('medicalappointmentDetailOtherCard', {
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

                    ctrl.appointmentStatusList = app.consts.medicalAppointmentStatusType.values;
                    ctrl.followUpList = app.consts.medicalAppointmentFollowUpType.values;

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
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-detail/medicalappointment-detail-other-card.cshtml'
    });
})(_);