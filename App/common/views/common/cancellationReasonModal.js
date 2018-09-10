(function () {
    appModule.component('cancellationReasonModal', {
        bindings: {
            modalInstance: '<',
            resolve: '<'
        },
        controllerAs: 'vm',
        controller: function (commonFormFunction) {
            var ctrl = this;

            ctrl.$onChanges = function (changes) {
                if (changes.resolve) {
                    ctrl.titleName = ctrl.resolve.titleName;
                    ctrl.moduleName = ctrl.resolve.moduleName;
                }
            };

            ctrl.save = function () {
                ctrl.modalInstance.close(ctrl.cancellationReason);
            };

            ctrl.cancel = function () {
                ctrl.modalInstance.close();
            };
        },
        templateUrl: '~/App/common/views/common/cancellationReasonModal.cshtml'
    })
})();