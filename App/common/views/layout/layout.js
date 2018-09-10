(function () {
    appModule.controller('common.views.layout', [
        '$scope',
        function ($scope) {

            $scope.hasSliderAccess = (abp.session.tenantId ? true : false);

            $scope.$on('$viewContentLoaded', function () {
                App.initComponents(); // init core components
            });
        }
    ]);
})();