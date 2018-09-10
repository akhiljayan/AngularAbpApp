(function () {
    appModule.component('centrePersonGroupsNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', '$state',
            function (membershipBookingService, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {};
                    ctrl.model.persons = [];
                };

                ctrl.createCentrePersonGroup = function () {
                    membershipBookingService.createCentrePersonGroup(
                        ctrl.model
                    ).then(function (result) {
                        $state.go('tenant.centrePersonGroupsEdit', {
                            id: result.data
                        });
                    }).finally(function (result) {

                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrepersongroup-new/centrepersongroup-new.cshtml'
    });
})();