(function () {
    appModule.component('centrePersonGroupDetail', {
        bindings: {
            mode: '<',
            model: '<',
            loading: '<',
            onSave: '&',
            onDelete: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$state', 'commonFormFunction',
            function ($state, commonFormFunction) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups.Edit'),
                        delete: abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups.Delete')
                    };
                };

                ctrl.saveCentrePersonGroup = function (closeAfterSave) {
                    commonFormFunction.setFormSubmitted(ctrl.form);

                    if (!ctrl.form.$valid) {
                        return;
                    }

                    commonFormFunction.setPristine();
                    ctrl.onSave();
                };

                ctrl.deleteCentrePersonGroup = function () {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onDelete();
                            }
                        }
                    );
                };

                ctrl.cancel = function () {
                    $state.go('tenant.centrePersonGroups');
                };
            }
        ],
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrepersongroup-detail/centrepersongroup-detail.cshtml'
    });
})();