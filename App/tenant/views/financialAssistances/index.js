(function () {
    appModule.controller('tenant.views.financialAssistances.index', [
        '$scope', 'abp.services.app.financialAssistance', 'abp.services.app.financialAssistanceType', '$location', '$anchorScroll', '$state', '$filter',
        function ($scope, financialAssistanceService, financialAssistanceTypeService, $location, $anchorScroll, $state, $filter) {
            var vm = this;
            $anchorScroll.yOffset = 265;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.loading = false;
            vm.detailsOpen = false;
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Edit'),
                confirm: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Confirm'),
                cancel: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances.Cancel')
            };
            vm.selectedSort = app.consts.financialAssistanceSorting.NameAscending;

            vm.create = function () {
                $state.go('tenant.financialAssistancesNew', null);
            };

            vm.viewPerson = function (id) {
                $state.go('tenant.financialAssistancesViewPerson', { id: id });
               // $location.path('/tenant/person/' + id);
            };

            vm.viewFinancialAssistance = function (id) {
                $state.go('tenant.financialAssistancesEdit', {
                    id: id
                });
            };

            vm.clearFilter = function () {
                vm.filter = '';
                vm.load();
            };

            vm.gotoAnchor = function (key) {
                //$location.hash(key);
                $anchorScroll(key);
            };

            vm.getFinancialAssistances = function (requestParams) {
                vm.loading = true;

                // Update key to update paginator
                vm.keys = getFilterKeys();

                financialAssistanceService.getFinancialAssistances(
                    $.extend({
                        filter: vm.filter,
                        sorting: vm.selectedSort,
                        financialAssistanceTypes: vm.selectedFinancialAssistanceType,
                        status: vm.selectedStatus
                    }, requestParams)
                ).then(function (result) {
                    vm.data = result.data;
                    vm.gotoAnchor("financialAssistance");
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.load = function (requestParams) {
                vm.sortingList = app.consts.financialAssistanceSorting.values;
                vm.statusFilter = app.consts.Status.values;

                angular.forEach(vm.statusFilter, function (item, index) {
                    item.name = abp.localization.localize(item.localizedName);
                });

                financialAssistanceTypeService.getFinancialAssistanceTypes({
                }).then(function (result) {
                    vm.financialAssistanceTypeList = result.data.items;
                });

                vm.getFinancialAssistances(requestParams);
            };

            function getFilterKeys() {
                var key = null;

                key += vm.filter;

                if (vm.selectedFinancialAssistanceType) {
                    key += vm.selectedFinancialAssistanceType.join();
                }

                key += vm.selectedStatus;

                key += vm.selectedSort;

                return key;
            }
        }
    ]);
})();