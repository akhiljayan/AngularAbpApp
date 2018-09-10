(function () {
    appModule.component('transportrequisitions', {
        controller: [
            'abp.services.app.transportRequisition', '$state', '$anchorScroll', '$filter',
            function (transportRequisitionService, $state, $anchorScroll, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    $anchorScroll.yOffset = 265;
                    ctrl.views = app.consts.transportRequisitionViews.values;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.TransportRequisitions.Create')
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

                    transportRequisitionService.getTransportRequisitions(
                        $.extend({
                            filter: ctrl.filter,
                            view: ctrl.view,
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                        ctrl.gotoAnchor("TransportRequisitions");
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                };

                ctrl.gotoAnchor = function (key) {
                    $anchorScroll(key);
                };

                function getFilterKeys() {
                    var key = "";

                    key = key.concat(ctrl.filter, $filter("enumText")(ctrl.view, 'transportRequisitionViews'));

                    return key;
                }
            }
        ],
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisitions/transportrequisitions.cshtml"
    });
})();