(function () {
    appModule.controller('tenant.views.mohMasterCodeMappings.index', [
        '$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.mOHMasterCodeMapping',
        function ($scope, $uibModal, $stateParams, uiGridConstants, mohMasterCodeMappingsService) {
            var vm = this;
            vm.loading = false;
            vm.isCreateMode = !$stateParams.id;
            vm.isReadOnlyMode = false;
            vm.activateFilter = false;
            vm.deactivateFilter = false;
            vm.requestParams = {
                permission: '',
                role: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            function disabledActivateDeactivateBtn() {
                vm.activateFilter = false;
                vm.deactivateFilter = false;
            }

            vm.clearFilter = function () {
                vm.filterText = null;
                vm.getMOHMasterCodeMappings();
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
                        name: app.localize('MasterCodeType'),
                        field: 'masterCodeType',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: "ILTCCode",
                        displayName: app.localize("ILTCCode"),
                        field: 'iltcCode',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "12.5%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: "ILTCDescription",
                        displayName: app.localize("ILTCDescription"),
                        field: 'iltcDescription',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: "PSDescription",
                        displayName: app.localize("PSDescription"),
                        field: 'psDescription',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: app.localize('Type'),
                        field: 'type',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%"
                    },
                    {
                        name: app.localize('Remarks'),
                        field: 'remarks',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "20%"
                    },
                    {
                        name: app.localize('Status'),
                        field: 'isActive',
                        enableHiding: false,
                        width: "12%",
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.isActive | statusFilter}}</div> '
                    },
                    {
                        name: app.localize('CreatedBy'),
                        field: 'creatorUser.fullName',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "12.5%"
                    },
                    {
                        name: app.localize('CreatedOn'),
                        field: 'creationTime',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "18%",
                        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.creationTime | dateTimeFormat}}</div> '
                    },
                    {
                        name: app.localize('ModifiedBy'),
                        field: 'lastModifierUser.fullName',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "12.5%"
                    },
                    {
                        name: app.localize('ModifiedOn'),
                        field: 'lastModificationTime',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "18%",
                        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.lastModificationTime | dateTimeFormat}}</div> '
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                },
                data: vm.data
            };

            vm.loadData = function (requestParams) {
                vm.requestParams = requestParams;
                vm.getMOHMasterCodeMappings();
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
                        vm.deactivateFilter = true;

                    if (deactive > 0)
                        vm.activateFilter = true;

                    if (active > 0 && deactive > 0)
                        disabledActivateDeactivateBtn();
                });

                gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {
                    var active = 0;
                    var deactive = 0;
                    var selectedRows = gridApi.selection.getSelectedRows();

                    if (selectedRows.length > 0) {
                        for (var i = 0; i < selectedRows.length; i++) {
                            active += selectedRows[i].isActive ? 1 : 0;
                            deactive += !selectedRows[i].isActive ? 1 : 0;

                            if (active > 0 && deactive > 0) {
                                break;
                            }
                        }
                    }
                    else {
                        disabledActivateDeactivateBtn();
                    }

                    if (active > 0)
                        vm.deactivateFilter = true;

                    if (deactive > 0)
                        vm.activateFilter = true;

                    if (active > 0 && deactive > 0)
                        disabledActivateDeactivateBtn();
                });
            };

            vm.activateSelectedMOHMasterCodeMapping = function () {
                if (!vm.activateFilter) {
                    return;
                }

                if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                    abp.message.info(app.localize('PromptSelectRecord'));
                    return;
                }

                abp.message.confirm(
                    app.localize('ActionOnSelectedRecord', app.localize('Active')),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var datalist = $scope.gridApi.selection.getSelectedRows();

                            mohMasterCodeMappingsService.activateSelectedMOHMasterCodeMapping(
                                datalist
                            ).then(function () {
                                vm.getMOHMasterCodeMappings();
                                abp.notify.success(app.localize('SuccessfullyActivated'));

                                disabledActivateDeactivateBtn();

                                // Clear Top Left 'Select All CheckBox'
                                $scope.gridApi.selection.clearSelectedRows();
                            });
                        }
                    }
                );
            };

            vm.deactivateSelectedMOHMasterCodeMapping = function () {
                if (!vm.deactivateFilter) {
                    return;
                }

                if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                    abp.message.info(app.localize('PromptSelectRecord'));
                    return;
                }

                abp.message.confirm(
                    app.localize('ActionOnSelectedRecord', app.localize('Inactive')),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var datalist = $scope.gridApi.selection.getSelectedRows();

                            mohMasterCodeMappingsService.deactivateSelectedMOHMasterCodeMapping(
                                datalist
                            ).then(function () {
                                vm.getMOHMasterCodeMappings();
                                abp.notify.success(app.localize('SuccessfullyDeactivated'));

                                disabledActivateDeactivateBtn();

                                // Clear Top Left 'Select All CheckBox'
                                $scope.gridApi.selection.clearSelectedRows();
                            });
                        }
                    }
                );
            };

            vm.deleteSelectedMOHMasterCodeMapping = function () {
                if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                    abp.message.info(app.localize('PromptSelectRecord'));
                    return;
                }

                abp.message.confirm(
                    app.localize('DeleteData'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var deletelist = $scope.gridApi.selection.getSelectedRows();

                            mohMasterCodeMappingsService.deleteSelectedMOHMasterCodeMapping(
                                deletelist
                            ).then(function () {
                                vm.getMOHMasterCodeMappings();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));

                                disabledActivateDeactivateBtn();
                            });
                        }
                    }
                );
            };

            vm.createMOHMasterCodeMapping = function () {
                openCreateOrEditModal(null);
            };

            vm.rowDblClick = function (row) {
                vm.editMOHMasterCodeMapping(row.entity.id);
            };

            vm.editMOHMasterCodeMapping = function (id) {
                openCreateOrEditModal(id);
            };

            function openCreateOrEditModal(id) {
                var modalInstance = $uibModal.open({
                    component: 'mohMasterCodeMappingsDetail',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getMOHMasterCodeMappings();
                });
            }

            vm.getMOHMasterCodeMappings = function () {
                vm.loading = true;

                mohMasterCodeMappingsService.getAllMOHMasterCodeMappings(
                    $.extend({ filter: vm.filterText }, vm.requestParams)
                ).then(function (result) {
                    vm.gridOptions.totalItems = result.data.totalCount;
                    vm.gridOptions.data = result.data.items;
                    vm.data = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.ILTC.MOHMasterCodeMapping.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.ILTC.MOHMasterCodeMapping.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.ILTC.MOHMasterCodeMapping.Delete'),
                    activate: abp.auth.hasPermission('Pages.Tenant.ILTC.MOHMasterCodeMapping.Activate'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.ILTC.MOHMasterCodeMapping.Deactivate')
                };
            }

            init();
        }
    ]);
})();