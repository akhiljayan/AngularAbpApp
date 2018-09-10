(function () {
    appModule.component('personNew', {
        controller: [
            '$state', 'abp.services.app.person',
            function ($state, personService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.model = {};

                    ctrl.defaults();
                };

                ctrl.defaults = function () {
                    abp.ui.setBusy();

                    personService.getPersonForEdit({
                        id: null
                    }).then(function (result) {
                        ctrl.model = result.data;
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.createPerson = function (event) {
                    abp.ui.setBusy();

                    personService.createPerson(
                        event.model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();

                        $state.go('tenant.personEdit', { id: result.data });
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/persons/person-new/person-new.cshtml'
    });
})();