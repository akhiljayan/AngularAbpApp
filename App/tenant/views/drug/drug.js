(function () {
    appModule.controller('tenant.views.drug.index',
        ['$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.genericDrug',
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

                setFlag();
                function setFlag() {
                    vm.activateFilter = false;
                    vm.deactivateFilter = false;
                }


                $scope.saveRow = function (rowEntity) {
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, appService.update(rowEntity));
                };

                vm.gridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useCustomPagination: true,
                    useExternalPagination: true,
                    useExternalSorting: false,
                    enableRowSelection: true,
                    appScopeProvider: vm,
                    rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                    columnDefs: [
                        {
                            name: app.localize('id'),
                            field: 'id',
                            enableHiding: false,
                            visible: false,
                            width: "20%"
                        },
                        {
                            name: app.localize('Name'),
                            field: 'name',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "40%", sort: {
                                direction: uiGridConstants.ASC
                            }
                        },
                        {
                            name: app.localize('CreatedBy'),
                            field: 'createdUserName',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "15%"
                        },
                        {
                            name: app.localize('CreatedOn'),
                            field: 'creationTime',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "15%",
                            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.creationTime | dateTimeFormat}}</div> '
                        },
                        {
                            name: app.localize('ModifiedBy'),
                            field: 'modifiedUserName',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "15%"
                        },
                        {
                            name: app.localize('ModifiedOn'),
                            field: 'lastModificationTime',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            width: "15%",
                            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.lastModificationTime | dateTimeFormat}}</div> '
                        }
                    
                    ],
                    data: vm.data
                };

                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getGenericDrug();
                };

                vm.gridOptions.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        var active = 0;
                        var deactive = 0;
                        var selectedRows = gridApi.selection.getSelectedRows();
                        var log = '';
                        angular.forEach(selectedRows, function (value, key) {
                            active += value.isActive ? 1 : 0;
                            deactive += !value.isActive ? 1 : 0;
                        }, log);

                        vm.activateFilter = false;
                        vm.deactivateFilter = false;

                        if (active > 0)
                            vm.activateFilter = true;

                        if (deactive > 0)
                            vm.deactivateFilter = true;

                    });
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
                                    vm.getGenericDrug();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                    setFlag();
                                });
                            }
                        }
                    );
                };

                vm.rowDblClick = function (row) {
                    vm.edit(row.entity.id);
                };

                vm.create = function () {
                    openCreateOrEditModal($scope.EmptyGuid, 'create');
                };

                vm.edit = function (id, action) {
                    openCreateOrEditModal(id, action);
                };

                var opened = false;
                function openCreateOrEditModal(id, action) {
                    if (opened || !vm.permissions.edit )
                        return;

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/drug/createOrEditGenericDrug.cshtml',
                        controller: 'tenant.views.drug.createOrEditGenericDrug as vm',
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
                        vm.getGenericDrug();
                        opened = false;
                    }, function () {
                        opened = false;
                    });


                }

                vm.getGenericDrug = function () {
                    vm.loading = true;
                    appService.getGenericDrugList(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.totalCount;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Drug.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Drug.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Drug.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Drug.Delete')
                    };
                }

                init();
            }]);
})();