(function () {
    appModule.component('investigationNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.investigation', '$stateParams',
            function (investigationService, $stateParams) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {
                        personId: $stateParams.person,
                        referralId: $stateParams.referral,
                    };
                };

                ctrl.createInvestigation = function (event) {
                    investigationService.createInvestigation(
                        ctrl.model
                    ).then(function (result) {
                        event.success && event.success(result.data);
                    }).finally(function (result) {
                        event.final && event.final();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/investigations/investigation-new/investigation-new.cshtml'
    });
})();