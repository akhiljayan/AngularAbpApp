(function () {
    appModule.component('cancelTransportRequisition', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: function () {
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.saving = false;
            };

            ctrl.$onChanges = function (changes) {
                if (changes.resolve) {
                    ctrl.workingModel = {
                        id: ctrl.resolve.transportRequisitionId
                    };

                    ctrl.permissions = ctrl.resolve.permissions;
                }
            };

            ctrl.cancel = function () {
                ctrl.modalInstance.dismiss();
            };

            ctrl.save = function () {
                if (!ctrl.saving) {
                    ctrl.saving = true;

                    //Cancel Transport Requisition record
                    ctrl.modalInstance.close(ctrl.workingModel);

                    ctrl.saving = false;
                }
            };
        },
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail-cancellation.cshtml"
    });
})();