(function () {
    appModule.component('medicalappointments', {
        controller: [
            'abp.services.app.medicalAppointment', '$state', '$location', '$anchorScroll', '$filter',
            function (medicalAppointmentService, $state, $location, $anchorScroll, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
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
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                    ctrl.load();
                };

                ctrl.load = function (requestParams) {
                    ctrl.loading = true;

                    medicalAppointmentService.getAllMedicalAppointments(
                        $.extend({
                            filter: ctrl.filter,
                            filterStatus: ctrl.view,
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-list/medicalappointments.cshtml'
    });
})();