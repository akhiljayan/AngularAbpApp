(function () {
    appModule.component('visitlogsCard', {
        bindings: {
            mode: '<',
            personId: '<'
        },
        controller: [
            'abp.services.app.visitLog', '$state',
            function (visitLogService, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.title = abp.localization.localize('VisitLogs');
                    ctrl.views = app.consts.visitLogViews.values;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Create')
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        changes.personId.currentValue && ctrl.load();
                    }
                };

                ctrl.changeView = function (view) {
                    ctrl.view = view;
                    ctrl.load();
                };

                ctrl.load = function () {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;

                    visitLogService.getVisitLogsByPersonId(
                        $.extend({
                            filter: ctrl.filter,
                            view: ctrl.view,
                        }, { personId: ctrl.personId })
                    ).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                }
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlogs-card/visitlogs-card.cshtml'
    });
})();