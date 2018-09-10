(function () {
    appModule.component('meanstestNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.meansTest', '$stateParams',
            function (meansTestService, $stateParams) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {
                        personId: $stateParams.person,
                        referralId: $stateParams.referral,
                        referralServiceTypeId: $stateParams.referralservicetype,
                        admissionId: $stateParams.admission,
                        noOfHouseholdFamilyMembers: 1,
                        hasFinancialAssistance: false,
                        isDeviated: false,
                        meansTestType: "MeansTest"
                    };
                };

                ctrl.createMeansTest = function (event) {
                    meansTestService.createMeansTest(
                        ctrl.model
                    ).then(function (result) {
                        event.success && event.success(result.data);
                    }).finally(function (result) {
                        event.final && event.final();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/meanstests/meanstest-new/meanstest-new.cshtml'
    });
})();