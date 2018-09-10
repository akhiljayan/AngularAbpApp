(function (abp) {
    appModule.component('meanstestsCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            admissionId: '<'
        },
        controller: [
            '$state', 'abp.services.app.meansTest',
            function ($state, meansTestService) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.models = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MeansTests.Create'),
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        load();
                    }
                };

                // event handlers
                ctrl.create = function () {
                    var query = {};
                    ctrl.personId && (query.person = ctrl.personId);
                    ctrl.referralId && (query.referral = ctrl.referralId);
                    ctrl.admissionId && (query.admission = ctrl.admissionId);

                    $state.go('tenant.meansTestsNew', query);
                };

                ctrl.edit = function (meansTest) {
                    $state.go('tenant.meansTestsEdit', {
                        id: meansTest.id,
                        referral: meansTest.referralId,
                        person: meansTest.personId
                    });
                };

                // callbacks
                function load() {
                    if (ctrl.personId) {
                        ctrl.loading = true;

                        meansTestService.getMeansTestsByPersonId({
                            personId: ctrl.personId
                        }).then(function (result) {
                            ctrl.models = result.data.items;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    } else if (ctrl.referralId) {
                        ctrl.loading = true;

                        meansTestService.getMeansTestsByReferralId({
                            referralId: ctrl.referralId
                        }).then(function (result) {
                            ctrl.models = result.data.items;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/meanstests/meanstests-card/meanstests-card.cshtml'
    });
})(abp);