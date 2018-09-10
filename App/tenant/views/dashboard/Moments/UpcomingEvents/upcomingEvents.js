(function () {
    appModule.component('upcomingEvents', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', '$state', 'abp.services.app.centre',
            function (membershipBookingService, $state, centre) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.key = "";
                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {};
                    ctrl.pageSize = 30;

                    centre.getAllCentresLookUpInUserOU().then(function (result) {
                        ctrl.centrelist = result.data;
                    });
                };

                ctrl.load = function () {
                    membershipBookingService.getAllUpcomingEvents($.extend({ filter: ctrl.filter }, ctrl.requestParams)).then(function (result) {
                        ctrl.events = result.data.items;
                        ctrl.data = result.data;
                    });
                };


                ctrl.loadResults = function (requestParams) {
                    ctrl.requestParams = requestParams;
                    ctrl.load();
                }

                ctrl.viewEvent = function (eventId) {
                    $state.go('tenant.editCentreEvent', { id: eventId })
                };

                //Page increment function
                ctrl.incrementPageNumber = function () {
                    ctrl.requestParams.skipCount = (ctrl.currentPage - 1) * ctrl.pageSize;
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = "";
                    ctrl.loadResults();
                }
            }
        ],
        templateUrl: '~/App/tenant/views/dashboard/Moments/UpcomingEvents/upcomingEvents.cshtml'
    });
})();