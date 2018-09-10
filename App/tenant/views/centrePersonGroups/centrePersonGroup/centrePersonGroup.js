(function () {
    appModule.component('centrePersonGroup', {
        bindings: {
            model: '<',
            showDetails: '='
        },
        controller: function ($filter) {
            var ctrl = this;
        },
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrePersonGroup/centrePersonGroup.cshtml'
    });
})();
