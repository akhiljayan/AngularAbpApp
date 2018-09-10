(function (abp) {
    appModule.component('financialassistancesCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            admissionId: '<'
        },
        controller: [
            '$state', 'abp.services.app.financialAssistance',
            function ($state, financialAssistanceService) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.models = [];

                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Create'),
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

                    $state.go('tenant.financialAssistancesNew', query);
                };

                ctrl.edit = function (id) {
                    $state.go('tenant.financialAssistancesEdit', {
                        id: id,
                        referral: ctrl.referralId,
                        person: ctrl.personId
                    });
                };

                // callbacks
                function load() {
                    if (ctrl.personId) {
                        ctrl.loading = true;

                        financialAssistanceService.getFinancialAssistancesByGuid({
                            personId: ctrl.personId
                        }).then(function (result) {
                            ctrl.models = result.data.items;
                            ctrl.loading = false;
                        });
                    } else if (ctrl.referralId) {
                        ctrl.loading = true;

                        financialAssistanceService.getFinancialAssistancesByGuid({
                            referralId: ctrl.referralId
                        }).then(function (result) {
                            ctrl.models = result.data.items;
                            ctrl.loading = false;
                        });
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/financialAssistances/financialassistances-card/financialassistances-card.cshtml'
    });
})(abp);