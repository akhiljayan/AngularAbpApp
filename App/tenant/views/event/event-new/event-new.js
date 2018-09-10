(function () {
    appModule.component('centreEventNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', '$state',
            function (membershipBookingService, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {};
                };


                ctrl.createCentreEvent = function (event) {
                    abp.ui.setBusy();
                    membershipBookingService.createCentreEvent($.extend(event.model, event.imageparams)).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $state.go('tenant.editCentreEvent', {id: result.data});
                        event.success && event.success();
                        
                    }).finally(function (result) {
                        abp.ui.clearBusy();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/event/event-new/event-new.cshtml'
    });
})();