(function () {
    appModule.component('transportrequisitionEdit', {
        controller: [
            'abp.services.app.transportRequisition', '$stateParams', '$state', 
            function (transportRequisitionService, $stateParams, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.model = {
                        id: $stateParams.id
                    };

                    ctrl.load($stateParams.id);
                };

                ctrl.updateTransportRequisition = function (event) {
                    abp.ui.setBusy();

                    var data = angular.copy(event.model);
                    _.defaults(data, ctrl.model);

                    transportRequisitionService.updateTransportRequisition(
                        data
                    ).then(function (result) {
                        event.success && event.success();
                        ctrl.load(ctrl.model.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.confirmTransportRequisition = function (event) {
                    abp.ui.setBusy();

                    transportRequisitionService.confirmTransportRequisition({
                        id: event.data
                    }).then(function (result) {
                        ctrl.load(ctrl.model.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.cancelTransportRequisition = function (event) {
                    abp.ui.setBusy();

                    transportRequisitionService.cancelTransportRequisition(
                        event.data
                    ).then(function (result) {
                        ctrl.load(ctrl.model.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.deleteTransportRequisition = function (event) {
                    abp.ui.setBusy();

                    transportRequisitionService.deleteTransportRequisition(
                        event.data
                    ).then(function (result) {
                        abp.notify.info('Deleted');

                        $state.go('tenant.transportrequisitions');
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.completeTransportRequisition = function (event) {
                    abp.ui.setBusy();

                    var data = angular.copy(event.model);
                    _.defaults(data, ctrl.model);

                    transportRequisitionService.completeTransportRequisition(
                        data
                    ).then(function (result) {
                        ctrl.load(ctrl.model.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.load = function (id) {
                    if (!id) {
                        return;
                    }

                    abp.ui.setBusy();

                    transportRequisitionService.getTransportRequisitionForEdit({
                        id: id
                    }).then(function (result) {
                        ctrl.model = result.data;
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/transports/transportrequisitions/transportrequisition-edit/transportrequisition-edit.cshtml'
    });
})();