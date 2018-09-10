(function () {
    appModule.controller('tenant.views.visitServices.index', [
        '$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.visitService',
        function ($scope, $uibModal, $stateParams, uiGridConstants, visitServiceService) {
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
                vm.getVisitServices();
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
                        name: app.localize('ServiceType'),
                        field: 'serviceType.description',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: app.localize('VisitServiceCategory'),
                        field: 'visitServiceCategory.description',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: app.localize('VisitServiceCode'),
                        field: 'code',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%",
                        sort: {
                            direction: uiGridConstants.ASC
                        }
                    },
                    {
                        name: app.localize('VisitServiceDescription'),
                        field: 'description',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "30%"
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
                vm.getVisitServices();
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

            vm.activateSelectedVisitService = function () {
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

                            visitServiceService.activateSelectedVisitService(
                                datalist
                            ).then(function () {
                                vm.getVisitServices();
                                abp.notify.success(app.localize('SuccessfullyActivated'));

                                disabledActivateDeactivateBtn();

                                // Clear Top Left 'Select All CheckBox'
                                $scope.gridApi.selection.clearSelectedRows();
                            });
                        }
                    }
                );
            };

            vm.deactivateSelectedVisitService = function () {
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

                            visitServiceService.deactivateSelectedVisitService(
                                datalist
                            ).then(function () {
                                vm.getVisitServices();
                                abp.notify.success(app.localize('SuccessfullyDeactivated'));

                                disabledActivateDeactivateBtn();

                                // Clear Top Left 'Select All CheckBox'
                                $scope.gridApi.selection.clearSelectedRows();
                            });
                        }
                    }
                );
            };

            vm.deleteSelectedVisitService = function () {
                if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                    abp.message.info(app.localize('PromptSelectRecord'));
                    return;
                }

                abp.message.confirm(
                    app.localize('DeleteData'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var deletelist = $scope.gridApi.selection.getSelectedRows();

                            visitServiceService.deleteSelectedVisitService(
                                deletelist
                            ).then(function () {
                                vm.getVisitServices();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));

                                disabledActivateDeactivateBtn();
                            });
                        }
                    }
                );
            };

            vm.createVisitService = function () {
                openCreateOrEditModal(null);
            };

            vm.rowDblClick = function (row) {
                vm.editVisitService(row.entity.id);
            };

            vm.editVisitService = function (id) {
                openCreateOrEditModal(id);
            };

            function openCreateOrEditModal(id, action) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/visitServices/createOrEditVisitService.cshtml',
                    controller: 'tenant.views.visitServices.createOrEditVisitService as vm',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getVisitServices();
                });
            }

            vm.getVisitServices = function () {
                vm.loading = true;

                visitServiceService.getAllVisitServices(
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
                    create: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    edit: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    delete: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    activate: abp.auth.hasPermission('Pages.Tenant.VisitLogs'),
                    deactivate: abp.auth.hasPermission('Pages.Tenant.VisitLogs')
                };
            }

            init();
        }
    ]);
})();