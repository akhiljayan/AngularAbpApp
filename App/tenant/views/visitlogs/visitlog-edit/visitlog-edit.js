(function () {
    appModule.component('visitlogEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.visitLog', 'abp.services.app.progressNote', '$stateParams', '$state',
            function (visitLogService, progressNoteService, $stateParams, $state) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateVisitLog = function (event) {
                    var data = angular.copy(event.data);
                    _.defaults(data, ctrl.model);

                    visitLogService.updateVisitLog(
                        data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.confirmVisitLog = function (event) {
                    visitLogService.confirmVisitLog({
                        id: event.data
                    }).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.cancelVisitLog = function (event) {
                    visitLogService.cancelVisitLog(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.deleteVisitLog = function (event) {
                    visitLogService.deleteVisitLog(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        if ($stateParams.person) {
                            $state.go('tenant.personDetail', { id: $stateParams.person });
                        } else {
                            $state.go('tenant.visitLogs');
                        }
                    });
                };

                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;
                    visitLogService.getVisitLogForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.person = ctrl.model.person;
                        ctrl.mode = (ctrl.model.isConfirmed || ctrl.model.isCancelled)
                            ? 'readonly'
                            : 'view';
                        ctrl.loading = false;
                    });
                    ctrl.mode = 'view';
                    ctrl.model = {};
                }
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-edit/visitlog-edit.cshtml'
    });
})();