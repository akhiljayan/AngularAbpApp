(function () {
    appModule.controller('host.views.masterdata.index',
        ['$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.masterData',
            function ($scope, $uibModal, $stateParams, uiGridConstants, masterData) {
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

                $scope.saveRow = function (rowEntity) {
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, masterData.update(rowEntity));
                };
                $scope.datalength = 0;
                vm.masterDataGridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useExternalSorting: false,
                    appScopeProvider: vm,
                    rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
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
                            enableCellEdit: true
                        }
                      
                    ],
                    onRegisterApi : function (gridApi) {
                        //set gridApi on scope
                        $scope.gridApi = gridApi;
                        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
                    },
                    data: [],
                    enablePaginationControls: false,
                    maxsize:5
                };

                vm.onchange = function() {

                    if (vm.masterData.select == null) {
                        vm.masterDataGridOptions.data = [];
                        return;
                    }

                    vm.loading = true;
                    masterData.getMasterDataTypeItems({ type: vm.masterData.select.type }).then(function (result) {
                        $scope.datalength = result.data.length;
                        vm.masterDataGridOptions.data= result.data;
                        vm.loading = false;
                    });
                    
                }

                vm.createMasterDataItem = function () {
                    openCreateOrEditMasterDataItem($scope.EmptyGuid);
                };

                vm.editMasterDataItem = function (id, action) {
                    openCreateOrEditMasterDataItem(id, action);
                };


                function openCreateOrEditMasterDataItem(id, action) {
                   
                    if (!vm.masterData.select.type) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/masterdata/createOrEditMasterDataItem.cshtml',
                        controller: 'host.views.masterdata.createOrEditMasterDataItem as vm',
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
                        vm.loading = true;
                        masterData.getMasterDataTypeList({ type: vm.masterData.select.type }).then(function (result) {
                            $scope.datalength= result.data.length;
                            vm.masterDataGridOptions.data = result.data;
                            vm.loading = false;
                        });
                    });

                }


                function init() {
                    
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Administration.Host.MasterData.Create'),
                        edit: abp.auth.hasPermission('Pages.Administration.Host.MasterData.Edit'),
                        view: abp.auth.hasPermission('Pages.Administration.Host.MasterData.View'),
                        delete: abp.auth.hasPermission('Pages.Administration.Host.MasterData.Delete')
                    };

                    masterData.getMasterDataTypeList().then(function (result) {
                        vm.masterDataList = result.data;
                    });
                 
                }

                init();
            }]);
})();