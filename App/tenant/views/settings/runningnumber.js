(function () {
    appModule.controller('tenant.views.runningnumber.index',
        ['$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.runningNumber',
            function ($scope, $uibModal, $stateParams, uiGridConstants, appService) {
                var vm = this;
                vm.loading = false;
                vm.isCreateMode = !$stateParams.id;
                vm.isReadOnlyMode = false;
                vm.requestParams = {
                    permission: '',
                    role: '',
                    skipCount: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,
                    sorting: null
                };

                vm.gridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useCustomPagination: true,
                    useExternalPagination: true,
                    useExternalSorting: false,
                    appScopeProvider: vm,
                    rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                    columnDefs: [
                        {
                            name: app.localize('Reference'),
                            field: 'reference',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "9%"
                        },
                        {
                            name: app.localize('Prefix'),
                            field: 'prefix',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "9%"
                        },
                        {
                            name: app.localize('CurrentRunning'),
                            field: 'currentRunning',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "11%"
                        },
                        {
                            name: app.localize('ResetNumber'),
                            field: 'resetNumber',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "10%"
                        },
                        {
                            name: app.localize('ResetNumberIfValueGreaterThan'),
                            field: 'resetNumberIfValueGreaterThan',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "22%"
                        },
                        {
                            name: app.localize('Suffix'),
                            field: 'suffix',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "7%",
                        },
                        {
                            name: app.localize('Padding'),
                            field: 'padding',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.padding | enumText: "runningNumberPadding" }}</div> ',
                            width: "8%"
                        },
                        {
                            name: app.localize('PaddingCharacter'),
                            field: 'paddingCharacter',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "12%"
                        },
                        {
                            name: app.localize('ResetEveryYear'),
                            field: 'resetEveryYear',
                            enableColumnMenu: false,
                            width: "12%",
                            enableHiding: false,
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.resetEveryYear | yesnoFilter}}</div> '
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                    },
                    data: vm.data
                };

                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getRunningNumber();
                };

                vm.delete = function () {
                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('DeleteData'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var deletelist = $scope.gridApi.selection.getSelectedRows();
                                appService.deleteAll(deletelist).then(function () {
                                    vm.getRunningNumber();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };

                vm.rowDblClick = function (row) {
                    vm.edit(row.entity.id);
                };

                vm.create = function () {
                    openCreateOrEditRunningNumber($scope.EmptyGuid, 'create');
                };

                vm.edit = function (id, action) {
                    openCreateOrEditRunningNumber(id, action);
                };

                var opened = false;
                function openCreateOrEditRunningNumber(id, action) {
                    if (opened)
                        return;


                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/settings/createOrEditRunningNumber.cshtml',
                        controller: 'tenant.views.runningnumber.createOrEditRunningNumber as vm',
                        backdrop: 'static',
                        resolve: {
                            id: function () {
                                return id;
                            },
                            action: function () {
                                return action;
                            }
                        }
                    });
                    opened = true;

                    modalInstance.result.then(function () {
                        vm.getRunningNumber();
                        opened = false;
                    }, function () {
                        opened = false;
                    });
                }

                vm.getRunningNumber = function () {
                    vm.loading = true;
                    appService.getRunningNumberList(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.length;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.RunningNumber.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.RunningNumber.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.RunningNumber.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.RunningNumber.Delete')
                    };
                }

                init();
            }]);
})();