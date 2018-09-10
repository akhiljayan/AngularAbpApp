(function () {
    appModule.component('financialassistanceEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.financialAssistance', '$stateParams',
            function (financialAssistanceService, $stateParams) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateFinancialAssistance = function (event) {
                    var data = angular.copy(event.data);
                    _.defaults(data, ctrl.model);

                    financialAssistanceService.updateFinancialAssistance(
                        data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.confirmFinancialAssistance = function (event) {
                    financialAssistanceService.confirmFinancialAssistance(
                        event.data
                    ).then(function (result) {
                        event.success && event.success(event.data.id);
                        load();
                    });
                };

                ctrl.cancelFinancialAssistance = function (event) {
                    financialAssistanceService.cancelFinancialAssistance(
                        event.data
                    ).then(function (result) {
                        event.success && event.success(event.data.id);
                        load();
                    });
                };

                function load() {
                    ctrl.loading = true;

                    financialAssistanceService.getFinancialAssistanceForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.mode = (ctrl.model.isConfirmed || ctrl.model.isCancelled)
                            ? 'readonly'
                            : 'view';
                        ctrl.loading = false;
                    });
                }
            }
        ],
        templateUrl: '~/App/tenant/views/financialassistances/financialassistance-edit/financialassistance-edit.cshtml'
    });
})();