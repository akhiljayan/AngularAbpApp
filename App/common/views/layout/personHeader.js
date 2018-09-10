(function () {
    appModule.controller('common.views.layout.personHeader', [
        '$scope', '$state',
        function ($scope, $state) {
            $scope.appPath = abp.appPath;
            $scope.age = 0;
            $scope.mode = '';
            $scope.personHeader = {}
        }
    ]);
})();