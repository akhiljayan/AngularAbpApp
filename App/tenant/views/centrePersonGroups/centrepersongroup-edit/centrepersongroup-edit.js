(function () {
    appModule.component('centrePersonGroupsEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membershipBooking', '$stateParams', '$state',
            function (membershipBookingService, $stateParams, $state) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateCentrePersonGroup = function () {
                    membershipBookingService.updateCentrePersonGroup(
                        ctrl.model
                    ).then(function (result) {
                        $state.go('tenant.centrePersonGroups');
                    });
                };

                ctrl.deleteCentrePersonGroup = function () {
                    membershipBookingService.deleteCentrePersonGroup(
                        ctrl.model.id
                    ).then(function (result) {
                        $state.go('tenant.centrePersonGroups');
                    });
                };

                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;

                    membershipBookingService.getCentrePersonGroupForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.mode = 'view';
                        ctrl.loading = false;
                    });

                    ctrl.mode = 'view';
                    ctrl.model = {};
                }
            }
        ],
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrepersongroup-edit/centrepersongroup-edit.cshtml'
    });
})();