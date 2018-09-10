(function () {
    appModule.component('socialreportsCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<'
        },
        controllerAs: "vm",
        controller: [
            '$state', 'abp.services.app.socialReport', '$stateParams', 'abp.services.app.person',
            function ($state, socialReportService, $stateParams, personService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.models = [];
                    ctrl.hasAdmittedAdmission = false;

                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.SocialReports.Create')
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        load();
                    }
                };

                ctrl.create = function () {
                    $state.go('tenant.socialReportNew', {
                        personId: $stateParams.id
                    });
                };

                function load() {
                    if (ctrl.personId) {
                        ctrl.loading = true;

                        hasAdmittedAdmission();

                        socialReportService.getSocialReportsByPersonId({
                            id: ctrl.personId
                        }).then(function (result) {
                            ctrl.models = result.data.items;
                            ctrl.loading = false;
                        });
                    }
                }

                function hasAdmittedAdmission() {
                    if (ctrl.personId) {
                        personService.hasAdmittedAdmission(
                            ctrl.personId
                        ).then(function (result) {
                            ctrl.hasAdmittedAdmission = result.data;
                        });
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/socialReports/socialreports-card/socialreports-card.cshtml'
    });
})();