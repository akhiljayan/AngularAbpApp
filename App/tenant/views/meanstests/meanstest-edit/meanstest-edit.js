(function () {
    appModule.component('meanstestEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.meansTest', '$stateParams',
            function (meansTestService, $stateParams) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateMeansTest = function (event) {
                    var data = angular.copy(event.data);
                    _.defaults(data, ctrl.model);

                    meansTestService.updateMeansTest(
                        data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.confirmMeansTest = function (event) {
                    meansTestService.confirmMeansTest({
                        id: event.data
                    }).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.cancelMeansTest = function (event) {
                    meansTestService.cancelMeansTest(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                function load() {
                    ctrl.loading = true;
                    meansTestService.getMeansTestForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.person = ctrl.model.person;
                        ctrl.mode = (ctrl.model.isConfirmed || ctrl.model.isCancelled)
                            ? 'readonly'
                            : 'view';
                        ctrl.loading = false;
                    });
                }
            }
        ],
        templateUrl: '~/App/tenant/views/meanstests/meanstest-edit/meanstest-edit.cshtml'
    });
})();