(function () {
    appModule.component('centreEventList', {
        bindings: {
            model: '<',
            showDetails: '='
        },
        controller: function ($filter) {
            var ctrl = this;
        },
        templateUrl: '~/App/tenant/views/event/event-list/event-list.cshtml'
    });
})();
