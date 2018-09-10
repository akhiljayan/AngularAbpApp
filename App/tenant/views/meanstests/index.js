(function () {
    appModule.controller('tenant.views.meanstests.index', [
        '$scope', '$state', 'abp.services.app.meansTest', '$stateParams', '$location', '$anchorScroll',
        function ($scope, $state, meansTestService, $stateParams, $location, $anchorScroll) {
            var vm = this;
            vm.isDetailView = false;
            vm.selectedSort = app.consts.meansTestSorting.NameAscending;

            vm.new = function () {
                $state.go('tenant.meansTestsNew');
            };

            vm.edit = function (id) {
                $state.go('tenant.meansTestsEdit', { id: id });
            };

            vm.viewPerson = function (id) {
                $state.go('tenant.personDetail', { id: id });
            };

            vm.clearFilter = function () {
                vm.filter = '';
                vm.load();
            };

            vm.searchValue = function () {
                vm.loading = true;
                vm.key = getFilterKeys();

                meansTestService.getMeansTests({
                    filter: vm.filter,
                    sorting: vm.selectedSort
                }).then(function (result) {
                    vm.data = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.load = function (requestParams) {
                vm.loading = true;
                vm.key = getFilterKeys();

                meansTestService.getMeansTests(
                    $.extend({
                        filter: vm.filter,
                        sorting: vm.selectedSort
                    }, requestParams)
                ).then(function (result) {
                    vm.data = result.data;
                }).finally(function () {
                    vm.loading = false;
                });

                vm.sortingList = app.consts.meansTestSorting.values;
            };

            vm.gotoAnchor = function (key) {
                //$location.hash(key);
                $anchorScroll(key);
            };

            function getFilterKeys() {
                var key = "";

                key = key.concat(vm.filter, vm.selectedSort);

                return key;
            }
        }
    ]);
})();