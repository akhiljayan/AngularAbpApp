(function (_) {
    appModule.component('centrePersonGroupDetailGeneralCard', {
        require: {
            parentCtrl: '^centrePersonGroupDetail'
        },
        bindings: {
            mode: '<',
            model: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.centre',
            function (centre) {
                var ctrl = this;
            }
        ],
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrepersongroup-detail/centrepersongroup-detail-general-card.cshtml'
    });
})(_);