(function () {
    appModule.component('medicalappointment', {
        bindings: {
            model: '<',
            showDetails: '='
        },
        controller: [
            '$filter',
            function ($filter) {
                var ctrl = this;

            }
        ],
        templateUrl: '~/App/tenant/views/medicalappointment/medicalappointment-list/medicalappointment.cshtml'
    });
})();
