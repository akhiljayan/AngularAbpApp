(function () {
    appModule.component('centrePersonGroups', {
        controller: [
            'abp.services.app.membershipBooking',
            function (membershipBookingService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups.Edit'),
                        delete: abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups.Delete')
                    };

                    ctrl.load();
                };
                
                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                    ctrl.load();
                };

                ctrl.load = function (requestParams) {
                    ctrl.loading = true;

                    membershipBookingService.getAllCentrePersonGroups(
                        $.extend({
                            filter: ctrl.filter
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrePersonGroups/centrePersonGroups.cshtml'
    });
})();
