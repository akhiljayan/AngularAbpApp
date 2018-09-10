(function () {
    appModule.component('financialassistanceNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.financialAssistance', '$state', '$stateParams',
            function (financialAssistanceService, $state, $stateParams) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {
                        personId: $stateParams.person,
                        referralId: $stateParams.referral,
                        beneficiary: 'Person'
                    };
                };

                ctrl.createFinancialAssistance = function (event) {
                    financialAssistanceService.createFinancialAssistance(
                        ctrl.model
                    ).then(function (result) {
                        event.success && event.success(result.data);
                    }).finally(function (result) {
                        event.final && event.final();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/financialassistances/financialassistance-new/financialassistance-new.cshtml'
    });
})();