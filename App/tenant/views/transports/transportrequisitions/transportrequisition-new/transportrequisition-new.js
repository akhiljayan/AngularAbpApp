(function () {
    appModule.component('transportrequisitionNew', {
        controller: [
            'abp.services.app.transportRequisition',
            function (transportRequisitionService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.model = {};
                    ctrl.defaults();
                };

                ctrl.defaults = function () {
                    abp.ui.setBusy();

                    transportRequisitionService.getTransportRequisitionForEdit({
                        id: null
                    }).then(function (result) {
                        ctrl.model = result.data;

                        var currentDateTime = abp.clock.now();
                        currentDateTime.setSeconds(0, 0);

                        ctrl.model.tripType = "TwoWays";
                        ctrl.model.appointmentDateTime = currentDateTime;
                        ctrl.model.requestForId = '';
                        ctrl.model.transportTypeId = '';

                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.createTransportRequisition = function (event) {
                    abp.ui.setBusy();

                    transportRequisitionService.createTransportRequisition(
                        event.model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success(result.data);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };
            }
        ],
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-new/transportrequisition-new.cshtml"
    });
})();