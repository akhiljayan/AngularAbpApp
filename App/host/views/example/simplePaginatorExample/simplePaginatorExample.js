(function () {
    appModule.component('simplePaginatorExample', {
        controller: [
            'sampleDataService',
            function (sampleDataService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.views = app.consts.personViews.values;
                };

                ctrl.changeView = function (view) {
                    ctrl.view = view;
                    ctrl.load();
                };

                ctrl.load = function (requestParams) {
                    sampleDataService.getPersons(
                        $.extend({
                            filter: ctrl.filter,
                            view: ctrl.view
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                    });
                };
            }
        ],
        templateUrl: '~/App/host/views/example/simplePaginatorExample/simplePaginatorExample.cshtml'
    });
})();