(function () {
    appModule.component('cancelInvestigation', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: 'vm',
        controller: function () {
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.saving = false;
            };

            ctrl.$onChanges = function (changes) {
                if (changes.resolve) {
                    ctrl.workingModel = {
                        id: ctrl.resolve.investigationId
                    };

                    ctrl.permissions = ctrl.resolve.permissions;
                }
            };

            ctrl.cancel = function () {
                ctrl.modalInstance.dismiss();
            };

            ctrl.save = function () {
                if (!ctrl.saving) {
                    ctrl.saving = true;

                    //Cancel Investigation record
                    ctrl.modalInstance.close(ctrl.workingModel);

                    ctrl.saving = false;
                }
            };
        },
        templateUrl: '~/App/tenant/views/investigations/investigation-detail/investigation-detail-cancellation.cshtml'
    });
})();
