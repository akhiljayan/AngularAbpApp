(function () {
    appModule.controller('tenant.views.centreServiceType.centre',
        ['$scope', '$timeout', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.centre', '$filter',
            function ($scope, $timeout, $uibModal, $stateParams, uiGridConstants, appService, $filter) {
                var vm = this;
                vm.loading = false;
                vm.isCreateMode = !$stateParams.id;
                vm.isReadOnlyMode = false;
                vm.headingAppend = "";
                vm.requestParams = {
                    permission: '',
                    role: '',
                    skipCount: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,
                    sorting: null
                };

                vm.filterActive = true;

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
                    //rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-style="{\'border-bottom\':\'1px solid #cccccc\',\'border-right\':\'1px solid #cccccc\'}" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                    rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div> ',
                    columnDefs: [
                        {
                            name: app.localize('OrganizationUnit'),
                            field: 'organizationUnitName',
                            enableColumnMenu: false,
                            width: "15%",
                            enableHiding: false
                        },
                        {
                            name: app.localize('Name'),
                            field: 'name',
                            enableColumnMenu: false,
                            width: "15%",
                            enableHiding: false,
                            sort: {
                                direction: uiGridConstants.ASC
                            }
                        },
                        {
                            name: app.localize('Code'),
                            field: 'code',
                            enableColumnMenu: false,
                            width: "15%",
                            enableHiding: false
                        },
                        {
                            name: app.localize('Address'),
                            field: 'address',
                            enableColumnMenu: false,
                            editableCellTemplate:
                                '<textarea class="animate msd-elastic" style="width:100%" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></textarea>',
                            width: "27.5%",
                            enableHiding: false
                        },
                        {
                            name: app.localize('Remarks'),
                            field: 'remarks',
                            enableColumnMenu: false,
                            editableCellTemplate:
                                '<textarea class="animate msd-elastic" style="width:100%" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></textarea>',
                            width: "27.5%",
                            enableHiding: false
                        },
                        {
                            name: app.localize('Status'),
                            field: 'isActive',
                            enableColumnMenu: false,
                            width: "13%",
                            enableHiding: false,
                            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.isActive | statusFilter}}</div> '
                        }
                    ],
                    data: vm.data
                };

                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getActiveCentre();
                };

                $scope.saveRow = function (rowEntity) {
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, appService.update(rowEntity));
                };


                vm.exportToExcel = function () {
                    appService.getMasterDataToExcel().then(function (result) {
                        app.downloadTempFile(result.data);
                    });
                }

  
                vm.gridOptions.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
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
                                var centrelistLength = $scope.gridApi.selection.getSelectedRows().length;
                                if (centrelistLength > 1) {
                                    appService.deleteAll(deletelist).then(function (response) {
                                        abp.message.info(response.data.message);
                                        vm.getActiveCentre();
                                    });
                                }
                                else {
                                    appService.delete(deletelist[0]).then(function (response) {
                                        abp.message.info(response.data.message);
                                        vm.getActiveCentre();
                                    });
                                }
                            }
                        }
                    );
                };

                vm.activate = function () {
                    if (vm.filterActive) { return }

                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('ActionOnSelectedRecord', app.localize('Active')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var centrelist = $scope.gridApi.selection.getSelectedRows();
                                appService.activateAll(centrelist).then(function () {
                                    vm.getActiveCentre();
                                    abp.notify.success(app.localize('SuccessfullyActivated'));
                                });
                            }
                        }
                    );
                };

                vm.deactivate = function () {
                    if (!vm.filterActive) { return }

                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectRecord'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('ActionOnSelectedRecord', app.localize('Inactive')),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var centrelist = $scope.gridApi.selection.getSelectedRows();
                                appService.deActivateAll(centrelist).then(function () {
                                    vm.getActiveCentre();
                                    abp.notify.success(app.localize('SuccessfullyDeactivated'));
                                });
                            }
                        }
                    );
                };


                vm.create = function () {
                    openCreateOrEditCentre($scope.EmptyGuid);
                };

                vm.edit = function (id, action) {
                    openCreateOrEditCentre(id, action);
                };

                vm.rowDblClick = function (row) {
                    vm.edit(row.entity.id);
                };

                function openCreateOrEditCentre(id, action) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/centreServiceType/createOrEditCentre.cshtml',
                        controller: 'tenant.views.centre.createOrEditCentre as vm',
                        backdrop: 'static',
                        resolve: {
                            centreId: function () {
                                return id;
                            },
                            action: function () {
                                return action;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        vm.getActiveCentre();
                    });

                }

                vm.getActiveCentre = function () {
                    vm.loading = true;
                    vm.filterActive = true;
                    vm.headingAppend = " - Active";

                    appService.getActiveCentre(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.totalCount;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                vm.getInactiveCentre = function () {
                    vm.loading = true;
                    vm.filterActive = false;
                    vm.headingAppend = " - Inactive";

                    appService.getInactiveCentre(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.totalCount;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                vm.setActiveDataInGrid = function () {
                    vm.getActiveCentre();
                };

                vm.setDeActiveDataInGrid = function () {
                    vm.getInactiveCentre();
                };

                function init() {
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Centre.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Centre.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Centre.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Centre.Delete'),
                        activate: abp.auth.hasPermission('Pages.Tenant.Centre.Activate'),
                        deactivate: abp.auth.hasPermission('Pages.Tenant.Centre.DeActivate')
                    };
                }

                init();
            }
        ]);
})();