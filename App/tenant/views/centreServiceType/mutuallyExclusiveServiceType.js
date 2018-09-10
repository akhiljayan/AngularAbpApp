(function () {
    appModule.controller('tenant.views.centreServiceType.mutuallyExclusiveServceType',
        ['$rootScope','$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.mutuallyExclusiveServiceType',
            function ($rootScope,$scope, $uibModal, $stateParams, uiGridConstants, appService) {
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
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, appService.update(rowEntity));
                };

                vm.rowDblClick = function (row) {
                    if (vm.permissions.edit) {
                        vm.edit(row.entity.id, 'edit');
                    }
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
                    rowTemplate:
                        '<div ng-click="grid.appScope.rowDblClick(row)"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div></div>',
                    columnDefs: [
                        {
                            name: app.localize('id'),
                            field: 'id',
                            enableHiding: false,
                            visible: false,
                            width: "20%",
                            sort: {
                                direction: uiGridConstants.ASC
                            }
                        },
                        {
                            name: app.localize('ServiceType'),
                            field: 'displayServiceType()',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "35%"
                        },
                        {
                            name: app.localize('MutuallyExclusiveServceType'),
                            field: 'displayMutuallyExclusiveServiceType()',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "35%"
                        },
                        {
                            name: app.localize('Remarks'),
                            field: 'remarks',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "27%"
                        }
                    ],
                    data: vm.data
                };
                vm.gridOptions.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                }

                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getMutuallyExclusiveServiceTypes();
                };

                vm.exportToExcel = function () {

                    appService.getMasterDataToExcel().then(function (result) {
                        app.downloadTempFile(result.data);
                    });
                }

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
                                    vm.getMutuallyExclusiveServiceTypes();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };



                vm.create = function () {
                    openCreateOrEditCentre($rootScope.EmptyGuid, 'create');
                };

                vm.edit = function (id, action) {
                    openCreateOrEditCentre(id, action);
                };


                function openCreateOrEditCentre(id, action) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/centreServiceType/createOrEditMutuallyExclusiveServiceType.cshtml',
                        controller: 'tenant.views.centreServiceType.createOrEditMutuallyExclusiveServiceType as vm',
                        backdrop: 'static',
                        resolve: {
                            meServiceTypeId: function () {
                                return id;
                            },
                            action: function () {
                                return action;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        vm.getMutuallyExclusiveServiceTypes();
                    });

                }

                vm.getMutuallyExclusiveServiceTypes = function () {
                    vm.loading = true;

                    appService.getMutuallyExclusiveServiceTypes(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.totalCount;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;

                        angular.forEach(vm.gridOptions.data, function (row) {
                            row.displayServiceType = function () {
                                return this.serviceTypeDescription + ' [' + this.serviceTypeCode +']';
                            }

                            row.displayMutuallyExclusiveServiceType = function () {
                                return this.anotherServiceTypeDescription + ' [' + this.anotherServiceTypeCode + ']';
                            }
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {

                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType.Delete')
                    };
                    vm.disableSave = false;
                }

                init();
                
            }]).filter('mapActive', function () {
                return function (input, scope) {
                    return input + ' <strong>' + scope.isActiveFilter + '</strong>';
                };
            });
})();