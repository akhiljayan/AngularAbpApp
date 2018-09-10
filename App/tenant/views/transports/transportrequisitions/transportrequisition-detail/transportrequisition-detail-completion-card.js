(function () {
    appModule.component('transportrequisitionDetailCompletionCard', {
        require: {
            parentCtrl: '^transportrequisitionDetail'
        },
        bindings: {
            model: '<',
        },
        controllerAs: 'vm',
        controller: function () {
            var ctrl = this;

            ctrl.isNumber = function (text) {
                return angular.isNumber(text);
            };
        },
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail-completion-card.cshtml"
    });
})();