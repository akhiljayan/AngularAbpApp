(function () {
    appModule.component('investigationEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.investigation', '$stateParams', '$state', '$rootScope',
            function (investigationService, $stateParams, $state, $rootScope) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateInvestigation = function (event) {
                    var data = angular.copy(event.data);
                    _.defaults(data, ctrl.model);

                    investigationService.updateInvestigation(
                        data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.confirmInvestigation = function (event) {
                    investigationService.confirmInvestigation({
                        id: event.data
                    }).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.cancelInvestigation = function (event) {
                    investigationService.cancelInvestigation(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                    });
                };

                ctrl.deleteInvestigation = function (event) {
                    investigationService.deleteInvestigation(
                        event.data
                    ).then(function (result) {
                        if ($stateParams.person) {
                            $rootScope.profileViewEnabled = true;
                            $rootScope.entityName = 'Investigations';

                            $state.go('tenant.personDetail', { id: $stateParams.person });
                        } else if ($stateParams.referral) {
                            $rootScope.medicalViewEnabled = true;
                            $rootScope.entityName = 'Investigations';

                            $state.go('tenant.referralDetail', { id: $stateParams.referral });
                        }
                    });
                };

                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;
                    investigationService.getInvestigationForEdit({
                        id: $stateParams.id
                    }).then(function (result) {
                        ctrl.model = result.data;
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
        templateUrl: '~/App/tenant/views/investigations/investigation-edit/investigation-edit.cshtml'
    });
})();