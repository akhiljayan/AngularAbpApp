(function () {
    appModule.component('centreEventEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', '$stateParams', '$state',
            function (membershipBookingService, $stateParams, $state) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateCentreEvent = function (event) {
                    membershipBookingService.updateCentreEvent(
                        $.extend(event.model, event.imageparams)
                    ).then(function (result) {
                        event.success && event.success();
                        $state.reload();
                    });
                };


                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;
                    membershipBookingService.getCentreEventForEdit($stateParams.id).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.mode = 'view';
                    }).finally(function () {
                        ctrl.loading = false;
                    });

                    ctrl.mode = 'view';
                    ctrl.model = {};
                }
            }
        ],
        templateUrl: '~/App/tenant/views/event/event-edit/event-edit.cshtml'
    });
})();