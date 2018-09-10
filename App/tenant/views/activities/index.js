(function () {
    appModule.controller('tenant.views.activities.index', [
        '$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.membershipBooking',
        function ($scope, $uibModal, $stateParams, uiGridConstants, membershipBookingService) {
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
            
            vm.clearFilter = function () {
                vm.filterText = null;
                vm.getAllActivities();
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
                    //{
                    //    name: app.localize('StartDateTime'),
                    //    field: 'startDateTime',
                    //    enableHiding: false,
                    //    enableCellEdit: false,
                    //    enableColumnMenu: false,
                    //    width: "16%",
                    //    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.startDateTime | dateTimeFormat}}</div> ',
                    //    sort: {
                    //        direction: uiGridConstants.DESC,
                    //        priority: 1
                    //    }
                    //},
                    //{
                    //    name: app.localize('EndDateTime'),
                    //    field: 'endDateTime',
                    //    enableHiding: false,
                    //    enableCellEdit: false,
                    //    enableColumnMenu: false,
                    //    width: "16%",
                    //    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.endDateTime | dateTimeFormat}}</div> '
                    //},
                    {
                        name: app.localize('Centre'),
                        field: 'centre.name',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%"
                    },
                    {
                        name: app.localize('ActivityCategory'),
                        field: 'activityEvent.description',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%"
                    },
                    {
                        name: app.localize('ActivityMaster'),
                        field: 'activityMaster',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%"
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%"
                    },
                    {
                        name: app.localize('LocationInMandarin'),
                        field: 'locationInMandarin',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "10%"
                    },
                    {
                        name: app.localize('Remarks'),
                        field: 'remarks',
                        enableHiding: false,
                        enableCellEdit: false,
                        enableColumnMenu: false,
                        width: "15%"
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
                        width: "16%",
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
                        width: "16%",
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
                vm.getAllActivities();
            };

            vm.deleteSelectedActivity = function () {
                if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                    abp.message.info(app.localize('PromptSelectRecord'));
                    return;
                }

                abp.message.confirm(
                    app.localize('DeleteData'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var deletelist = $scope.gridApi.selection.getSelectedRows();

                            membershipBookingService.deleteSelectedActivity(
                                deletelist
                            ).then(function () {
                                vm.getAllActivities();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.createActivity = function () {
                openCreateOrEditModal(null);
            };

            vm.rowDblClick = function (row) {
                vm.editActivity(row.entity.id);
            };

            vm.editActivity = function (id) {
                openCreateOrEditModal(id);
            };

            function openCreateOrEditModal(id, action) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/activities/createOrEditActivity.cshtml',
                    controller: 'tenant.views.activities.createOrEditActivity as vm',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getAllActivities();
                });
            };

            vm.getAllActivities = function () {
                vm.loading = true;

                membershipBookingService.getAllActivities(
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
                    create: abp.auth.hasPermission('Pages.Tenant.Activities.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Activities.Edit'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Activities.Delete')
                };
            }

            init();
        }
    ]);
})();