(function () {
    /* This is a generic modal that can be used to select an entity.
     * It can work with a remote service method that gets
     * PagedAndFilteredInputDto as input and returns PagedResultDto<NameValueDto> as output.
     * Example: CommonLookupAppService.FindUsers
     */
    appModule.controller('common.views.common.multiSelectLookupModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'lookupOptions',
        function ($scope, $uibModalInstance, uiGridConstants, lookupOptions) {
            var vm = this;

            vm.loading = false;

            //Options
            vm.options = angular.extend({
                serviceMethod: null, //Required
                title: app.localize('SelectAnItem'),
                loadOnStartup: true,
                showFilter: true,
                filterText: '',
                skipCount: 0,
                pageSize: app.consts.grid.defaultPageSize,
                callback: function (selectedItem) {
                    //This method is used to get selected item
                },
                canSelect: function (item) {
                    /* This method can return boolean or a promise which returns boolean.
                     * A false value is used to prevent selection.
                     */
                    return true;
                },
                selectedLookUps : []
            }, lookupOptions);

            //Check required parameters
            if (!vm.options.serviceMethod) {
                $uibModalInstance.dismiss();
                return;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.intializeCheckBox = function (entity) {
                var check = false;
                $.each(vm.options.selectedLookUps, function (index, item) {
                    if (item.Id == entity.value) {
                        check = true;
                    }
                });

                return check;
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: vm.options.pageSize,
                useExternalPagination: true,
                enableSorting: false,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Select'),
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <input type="checkbox" ng-init="vm.isChecked=grid.appScope.intializeCheckBox(row.entity)" ng-model="vm.isChecked" ng-click="grid.appScope.selectItem(row.entity, vm.isChecked)"/>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.options.skipCount = (pageNumber - 1) * pageSize;
                        vm.options.pageSize = pageSize;

                        vm.refreshGrid();
                    });
                },
                data: []
            };

            vm.selectItem = function (item, isChecked) {
                var boolOrPromise = vm.options.canSelect(item, isChecked);
                if (!boolOrPromise) {
                    return;
                }

                if (boolOrPromise === true) {
                    vm.options.callback(item, isChecked);
                    //$uibModalInstance.close(item);
                    return;
                }

                //assume as promise
                boolOrPromise.then(function (result) {
                    alert('2');
                    if (result) {
                        vm.options.callback(item);
                        //$uibModalInstance.close(item);
                    }
                });
            };

            vm.refreshGrid = function () {
                var prms = angular.extend({
                    skipCount: vm.options.skipCount,
                    maxResultCount: vm.options.pageSize,
                    filter: vm.options.filterText
                }, lookupOptions.extraFilters);

                vm.loading = true;
                vm.options.serviceMethod(prms).then(function (result) {
                    vm.gridOptions.totalItems = result.data.totalCount;
                    vm.gridOptions.data = result.data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            if (vm.options.loadOnStartup) {
                vm.refreshGrid();
            }
        }
    ]);

    //lookupModal service
    appModule.factory('multiSelectLookupModal', [
        '$uibModal',
        function ($uibModal) {
            function open(lookupOptions) {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/multiSelectLookupModal.cshtml',
                    controller: 'common.views.common.multiSelectLookupModal as vm',
                    backdrop: 'static',
                    resolve: {
                        lookupOptions: function () {
                            return lookupOptions;
                        }
                    }
                });
            }

            return {
                open: open
            };
        }
    ]);
})();