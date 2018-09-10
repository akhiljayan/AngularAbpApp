(function () {
    appModule.controller('tenant.views.dashboard.index', [
        '$state', '$scope', '$location',
        function ($state, $scope, $location) {
            var vm = this;
            vm.workspace = true;

            vm.workspaceLink = function () {
                $state.go('tenant.dashboard.home');
                vm.workspace = true;
                vm.careboard = false;
                vm.moments = false;
            }

            vm.careboardLink = function () {
                $state.go('tenant.dashboard.careboard');
                vm.workspace = false;
                vm.careboard = true;
                vm.moments = false;
            }

            vm.momentsLink = function () {
                $state.go('tenant.dashboard.moments');
                vm.workspace = false;
                vm.careboard = false;
                vm.moments = true;
            }
        }
    ]);
})();