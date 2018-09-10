(function () {
    appModule.component('personEdit', {
        controller: [
            '$state', '$stateParams', 'abp.services.app.person',
            function ($state, $stateParams, personService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.model = {
                        id: $stateParams.id
                    };

                    ctrl.load($stateParams.id);
                };

                ctrl.load = function (id) {
                    if (!id) {
                        return;
                    }

                    abp.ui.setBusy();

                    personService.getPersonForEdit({
                        id: id
                    }).then(function (result) {
                        ctrl.model = result.data;
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.updatePerson = function (event) {
                    abp.ui.setBusy();

                    personService.updatePerson(
                        event.model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();

                        ctrl.load(ctrl.model.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.deletePerson = function (event) {
                    abp.ui.setBusy();

                    personService.deletePerson(
                        event.id
                    ).then(function () {
                        abp.notify.info('Deleted');

                        $state.go('tenant.dashboard.careboard');
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/persons/person-edit/person-edit.cshtml'
    });
})();