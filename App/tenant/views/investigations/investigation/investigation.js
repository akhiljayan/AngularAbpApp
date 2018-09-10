(function () {
    appModule.component('investigation', {
        bindings: {
            model: '<',
            showDetails: '<',
        },
        controller: [
            '$state',
            function ($state) {
                var ctrl = this;

                ctrl.edit = function (investigation) {
                    var query = {
                        id: investigation.id,
                        person: (investigation.personId ? investigation.personId : null),
                        referral: (investigation.referralId ? investigation.referralId : null)
                    };

                    $state.go('tenant.investigationsEdit', query);
                };
            }],
        templateUrl: "~/App/tenant/views/investigations/investigation/investigation.cshtml"
    });
})();