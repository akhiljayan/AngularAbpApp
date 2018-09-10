(function () {
    appModule.component('visitlogs', {
        controller: [
            'abp.services.app.visitLog', '$state', '$location', '$anchorScroll', '$filter',
            function (visitLogService, $state, $location, $anchorScroll, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.views = app.consts.visitLogViews.values;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.VisitLogs.Create')
                    };

                    ctrl.load();
                };

                ctrl.changeView = function (view) {
                    ctrl.view = view;
                    ctrl.load();
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                    ctrl.load();
                };

                ctrl.load = function (requestParams) {
                    ctrl.loading = true;
                    ctrl.key = getFilterKeys();

                    visitLogService.getVisitLogs(
                        $.extend({
                            filter: ctrl.filter,
                            view: ctrl.view,
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                        ctrl.gotoAnchor("VisitLogs");
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                };

                ctrl.gotoAnchor = function (key) {
                    //$location.hash(key);
                    $anchorScroll(key);
                };

                function getFilterKeys() {
                    var key = "";

                    key = key.concat(ctrl.filter, $filter("enumText")(ctrl.view, 'visitLogViews'));

                    return key;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlogs/visitlogs.cshtml'
    });
})();
