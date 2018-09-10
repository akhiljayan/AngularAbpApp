(function () {
    appModule.controller('tenant.views.centreServiceType.centreService',
        ['$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.centreServices',
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
                    rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                    columnDefs: [
                       
                        {
                            name: app.localize('CentreName'),
                            field: 'centreName',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "25%"
                        },
                        {
                            name: app.localize('ServiceType'),
                            field: 'serviceName',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "50%"
                        },
                        {
                            name: app.localize('Status'),
                            field: 'status',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.isActive | statusFilter}}</div> ',
                            width: "15%"
                        },
                        {
                            name: app.localize('InstituitionCode'),
                            field: 'institutionCode',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "20%"
                        },
                        {
                            name: 'HCICode',
                            displayName: app.localize('HCICode'),
                            
                            field: 'hciCode',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "20%"
                        },
                        {
                            name: app.localize('Url'),
                            field: 'url',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "35%",
                            
                        },
                      
                    ],
                    data: vm.data
                    
                };


                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getCentreService();
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

                        if (active > 0 && deactive == 0) {
                            vm.activateFilter = false;
                            vm.deactivateFilter = true;
                        } else if (active == 0 && deactive > 0) {
                            vm.activateFilter = true;
                            vm.deactivateFilter = false;
                        } else {
                            vm.activateFilter = false;
                            vm.deactivateFilter = false;
                        }

                    });
                };

                vm.exportToExcel = function () {

                    appService.getMasterDataToExcel({ type: vm.masterData.select.type }).then(function (result) {
                        app.downloadTempFile(result.data);
                    });
                }

                vm.rowDblClick = function (row) {
                    vm.edit(row.entity.id);
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
                                    vm.getCentreService();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                    setFlag();
                                });
                            }
                        }
                    );
                };

                vm.activate = function () {
                    if (!vm.activateFilter) { return }
                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('ActionOnSelectedRecord', app.localize('Active')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var datalist = $scope.gridApi.selection.getSelectedRows();
                                appService.activateAll(datalist).then(function () {
                                    vm.getCentreService();
                                    setFlag();
                                    abp.notify.success(app.localize('SuccessfullyActivated'));
                                });
                            }
                        }
                    );
                };

                vm.deactivate = function () {
                    if (!vm.deactivateFilter) { return }
                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('ActionOnSelectedRecord', app.localize('Inactive')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var datalist = $scope.gridApi.selection.getSelectedRows();
                                appService.deActivateAll(datalist).then(function () {
                                    vm.getCentreService();
                                    setFlag();
                                    abp.notify.success(app.localize('SuccessfullyDeactivated'));
                                });
                            }
                        }
                    );
                };


                vm.create = function () {
                    openCreateOrEditCentre($scope.EmptyGuid,'create');
                };

                vm.edit = function (id, action) {
                    openCreateOrEditCentre(id, action);
                };


                function openCreateOrEditCentre(id, action) {
                   
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/centreServiceType/createOrEditCentreServiceType.cshtml',
                        controller: 'tenant.views.centreServiceType.createOrEditCentreServiceType as vm',
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

                    modalInstance.result.then(function () {
                        vm.getCentreService();
                    });
                }

                vm.getCentreService = function () {
                    vm.loading = true;
                    appService.getAllCentreServices(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.totalCount;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Delete'),
                        activate: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.Activate'),
                        deactivate: abp.auth.hasPermission('Pages.Tenant.CentreServiceType.DeActivate')
                    };
                    console.log('vm.data');
                    console.log(vm.data);
                }

                init();
            }]);
})();