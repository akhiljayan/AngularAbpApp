(function () {
    appModule.component('medicalappointmentCard', {
        bindings: {
            mode: '<',
            personId: '<'
        },
        controller: [
            'abp.services.app.medicalAppointment', '$state', '$filter',
            function (medicalAppointmentService, $state, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.headingAppend = '- Upcoming';
                    ctrl.view = 5;
                    ctrl.views = app.consts.medicalAppointmentStatus.values;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Create')
                    };
                };

                ctrl.changeView = function (view) {
                    var appendValue = $filter('enumText')(view, 'medicalAppointmentStatus');
                    if (!appendValue) {
                        ctrl.headingAppend = '- Upcoming'
                    }
                    else {
                        ctrl.headingAppend = '- ' + appendValue;
                    }

                    ctrl.view = view;
                    ctrl.key = view.toString();
                    ctrl.load();
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                    ctrl.load();
                };

                ctrl.load = function (requestParams) {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;

                    medicalAppointmentService.getAllMedicalAppointmentByPersonId(
                        $.extend({
                            personId: ctrl.personId,
                            filterStatus: ctrl.view,
                            filter: ctrl.filter,
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-card/medicalappointment-card.cshtml'
    });
})();