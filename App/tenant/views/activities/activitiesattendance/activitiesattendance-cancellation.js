(function () {
    appModule.component('activitiesAttendanceCancellation', {
        bindings: {
            modalInstance: '<'
        },
        controllerAs: 'vm',
        controller: function (commonFormFunction) {
            var ctrl = this;

            ctrl.save = function () {
                ctrl.modalInstance.close(ctrl.cancellationReason);
            };

            ctrl.cancel = function () {
                ctrl.modalInstance.close();
            };
        },
        templateUrl: '~/App/tenant/views/activities/activitiesattendance/activitiesattendance-cancellation.cshtml'
    })
})();