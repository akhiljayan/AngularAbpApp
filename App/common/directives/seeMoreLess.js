(function () {
    appModule.component('seeMoreSeeLess', {
        bindings: {
            model: '=',
            pageSize: '<',
            mode: '<',
            onCancel: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$anchorScroll', '$location', '$state', '$stateParams', '$rootScope',
            function ($scope, $anchorScroll, $location, $state, $stateParams, $rootScope) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    
                };

                ctrl.$onChanges = function () {
                    if (changes.model) {

                    }
                };

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

            }
        ],
        templateUrl: '~/App/common/directives/seeMoreLess.cshtml'
    });
})();