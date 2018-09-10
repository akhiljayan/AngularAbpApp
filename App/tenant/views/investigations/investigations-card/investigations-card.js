(function () {
    appModule.component('investigationsCard', {
        bindings: {
            mode: '<',
            personId: '<',
            referralId: '<'
        },
        controller: [
            'abp.services.app.investigation', '$state',
            function (investigationService, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.title = abp.localization.localize('Investigations');
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Investigations.Create')
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        changes.personId.currentValue && ctrl.load();
                    } else if (changes.referralId) {
                        changes.referralId.currentValue && ctrl.load();
                    }
                };

                ctrl.load = function () {
                    if (!ctrl.personId && !ctrl.referralId) {
                        return;
                    }

                    ctrl.loading = true;
                    ctrl.key = getFilterKeys();

                    var params = {
                        personId: ctrl.personId ? ctrl.personId : null,
                        referralId: ctrl.referralId ? ctrl.referralId : null
                    };

                    investigationService.getInvestigationsById(
                        $.extend({
                            filter: ctrl.filter,
                        }, params)
                    ).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.create = function () {
                    var query = {};
                    ctrl.personId && (query.person = ctrl.personId);
                    ctrl.referralId && (query.referral = ctrl.referralId);

                    $state.go('tenant.investigationsNew', query);
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                }

                function getFilterKeys() {
                    return ctrl.filter;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/investigations/investigations-card/investigations-card.cshtml'
    });
})();