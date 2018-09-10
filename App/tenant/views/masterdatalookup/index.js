(function () {
    appModule.controller('tenant.views.masterdatalookup.index',
        ['$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.masterLookUp',
            function ($scope, $uibModal, $stateParams, uiGridConstants, masterLookup) {
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
                vm.masterData = [];

                $scope.saveRow = function (rowEntity) {
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, masterLookup.update(rowEntity));
                };

                vm.masterDataGridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useCustomPagination: true,
                    useExternalPagination: true,
                    useExternalSorting: false,
                    editableOnFocus: true,
                    appScopeProvider: vm,
                    rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-style="{\'border-bottom\':\'1px solid #cccccc\',\'border-right\':\'1px solid #cccccc\'}" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                    columnDefs: [
                        {
                            name: app.localize('Code'),
                            field: 'code',
                            enableHiding: false,
                            width: "25%",
                            enableColumnMenu: false,
                            enableCellEdit: true
                        },
                        {
                            name: app.localize('Description'),
                            field: 'description',
                            enableHiding: false,
                            width: "50%",
                            enableColumnMenu: false,
                            enableCellEdit: true

                        },
                        {
                            name: app.localize('displayOrder'),
                            field: 'displayOrder',
                            enableHiding: false,
                            width: "25%",
                            enableColumnMenu: false,
                            enableCellEdit: true,
                            sort: {
                                direction: uiGridConstants.ASC
                            }
                        }

                    ],
                    onRegisterApi: function (gridApi) {
                        //set gridApi on scope
                        $scope.gridApi = gridApi;
                        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);

                        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {

                            if (!sortColumns.length || !sortColumns[0].field) {
                                vm.requestParams.sorting = null;
                            } else {
                                vm.requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            }

                            vm.getMasterLookupTypeItems();
                        });
                    },
                    data: vm.data
                };

                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getMasterLookupTypeItems();
                };

                vm.exportToExcel = function () {
                    masterLookup.getMasterDataToExcel({ type: vm.masterData.select.type }).then(function (result) {
                        app.downloadTempFile(result.data);
                    });
                }

                vm.onchange = function () {
                    vm.filter = '';

                    if (vm.masterData.select == null) {
                        vm.masterDataGridOptions.data = [];
                        vm.data = [];
                    } else {
                        vm.getMasterLookupTypeItems();
                    }
                }

                vm.deleteMasterLookupList = function () {
                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('UserDeleteWarningMessage', "Selected record(s)"),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var deleteMasterdatalist = $scope.gridApi.selection.getSelectedRows();
                                var deleteMasterdatalistLength = $scope.gridApi.selection.getSelectedRows().length;
                                if (deleteMasterdatalistLength > 1) {
                                    masterLookup.deleteList(deleteMasterdatalist).then(function (response) {
                                        abp.message.info(response.data.message);
                                        vm.getMasterLookupTypeItems();
                                    });
                                }
                                else {
                                    masterLookup.delete(deleteMasterdatalist[0]).then(function (response) {
                                        abp.message.info(response.data.message);
                                        vm.getMasterLookupTypeItems();
                                    });
                                }
                            }
                        }
                    );
                };


                vm.createMasterDataItem = function () {
                    openCreateOrEditMasterDataItem($scope.EmptyGuid);
                };

                vm.editMasterDataItem = function (id, action) {
                    openCreateOrEditMasterDataItem(id, action);
                };


                function openCreateOrEditMasterDataItem(id, action) {
                    if (!vm.masterData.select) {
                        abp.message.info(app.localize('SelectMasterLookupCategory'));
                        return;
                    }
                        

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/masterdatalookup/createOrEditMasterDataItem.cshtml',
                        controller: 'tenant.views.masterdatalookup.createOrEditMasterDataItem as vm',
                        backdrop: 'static',
                        resolve: {
                            masterType: function () {
                                return vm.masterData.select;
                            },
                            masterTypeItemId: function () {
                                return id;
                            },
                            action: function () {
                                return action;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        vm.getMasterLookupTypeItems();
                    });

                }

                vm.getMasterLookupTypeItems =  function() {
                    if (vm.masterData.select == null) {
                        vm.masterDataGridOptions.data = [];
                        vm.data = [];
                        return;
                    }

                    vm.loading = true;
                    masterLookup.getMasterTypeItemsWithPagination($.extend({ type: vm.masterData.select.type, filter: vm.filter }, vm.requestParams)).then(function (result) {
                        vm.masterDataGridOptions.totalItems = result.data.totalCount;
                        vm.masterDataGridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {

                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.Create'),
                        edit: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.Edit'),
                        view: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.View'),
                        delete: abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup.Delete')
                    };

                    masterLookup.getMasterTypeList().then(function (result) {
                        vm.masterDataList = result.data;
                    });
                }

                init();
            }]);
})();