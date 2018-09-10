(function () {
    appModule.controller('tenant.views.holiday',
        ['$scope', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.holiday', '$filter',
            function ($scope, $uibModal, $stateParams, uiGridConstants, appService, $filter) {
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

                //setFlag();
                //function setFlag() {
                //    vm.activateFilter = false;
                //    vm.deactivateFilter = false;
                //}

                $scope.saveRow = function (rowEntity) {
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, appService.update(rowEntity));
                };

                vm.rowDblClick = function (row) {
                    vm.edit(row.entity.id);
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
                        ' <div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div> ',
                    columnDefs: [
                        {
                            name: app.localize('id'),
                            field: 'id',
                            enableHiding: false,
                            visible: false,
                            width: "20%"
                        },
                        {
                            name: app.localize('date'),
                            field: 'date',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.date | dateFormat}}</div>',
                            enableColumnMenu: false,
                            width: "50%",
                            enableHiding: false,
                            sort: {
                                direction: uiGridConstants.DESC
                            }
                        },
                        {
                            name: app.localize('holidayDescription'),
                            field: 'holidayDescription',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.holidayDescription.description}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "50%"
                        }
                    ],
                    data: vm.data
                };

                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getHolidays();
                };

                vm.gridOptions.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    //gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    //    var active = 0;
                    //    var deactive = 0;
                    //    var selectedRows = gridApi.selection.getSelectedRows();
                    //    var log = '';
                    //    angular.forEach(selectedRows, function (value, key) {
                    //        active += value.isActive ? 1 : 0;
                    //        deactive += !value.isActive ? 1 : 0;
                    //    }, log);

                    //    if (active > 0 && deactive == 0) {
                    //        vm.activateFilter = false;
                    //        vm.deactivateFilter = true;
                    //    } else if (active == 0 && deactive > 0) {
                    //        vm.activateFilter = true;
                    //        vm.deactivateFilter = false;
                    //    } else {
                    //        vm.activateFilter = false;
                    //        vm.deactivateFilter = false;
                    //    }

                    //});
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
                                var deletelistLength = $scope.gridApi.selection.getSelectedRows().length;
                                if (deletelistLength > 1) {
                                    appService.deleteAll(deletelist).then(function (response) {
                                        abp.message.info(response.data.message);
                                        vm.getHolidays();
                                        //setFlag();
                                    });
                                }
                                else {
                                    appService.delete(deletelist[0]).then(function (response) {
                                        abp.message.info(response.data.message);
                                        vm.getHolidays();
                                    });
                                }
                            }
                        }
                    );
                };

                //vm.activate = function () {
                //    if (!vm.activateFilter) { return }
                //    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                //        abp.message.info(app.localize('PromptSelectRecord'));
                //        return;
                //    }
                //    abp.message.confirm(
                //        app.localize('ActionOnSelectedRecord', app.localize('Active')),
                //        function (isConfirmed) {
                //            if (isConfirmed) {
                //                var datalist = $scope.gridApi.selection.getSelectedRows();
                //                appService.activateAll(datalist).then(function () {
                //                    vm.getServiceTypes();
                //                    setFlag();
                //                    abp.notify.success(app.localize('SuccessfullyActivated'));
                //                });
                //            }
                //        }
                //    );
                //};

                //vm.deactivate = function () {
                //    if (!vm.deactivateFilter) { return }
                //    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                //        abp.message.info(app.localize('PromptSelectRecord'));
                //        return;
                //    }

                //    abp.message.confirm(
                //        app.localize('ActionOnSelectedRecord', app.localize('Inactive')),
                //        function (isConfirmed) {
                //            if (isConfirmed) {
                //                var datalist = $scope.gridApi.selection.getSelectedRows();
                //                appService.deActivateAll(datalist).then(function () {
                //                    vm.getServiceTypes();
                //                    setFlag();
                //                    abp.notify.success(app.localize('SuccessfullyDeactivated'));
                //                });
                //            }
                //        }
                //    );
                //};

                vm.create = function () {
                    openCreateOrEditHoliday($scope.EmptyGuid);
                };

                vm.edit = function (id, action) {
                    openCreateOrEditHoliday(id, action);
                };


                function openCreateOrEditHoliday(id, action) {
         
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/holidays/holiday-new/holiday-new.cshtml',
                        controller: 'tenant.views.holidays.holidayNew as vm',
                        backdrop: 'static',
                        resolve: {
                            holidayId: function () {
                                return id;
                            },
                            action: function () {
                                return action;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        vm.getHolidays();
                    });

                }

                vm.getHolidays = function () {
                    vm.loading = true;
                    appService.getHolidays(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.totalCount;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Holiday.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Holiday.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Holiday.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Holiday.Delete'),
                    };

                    //appService.getHolidays().then(function (result) {
                    //    vm.gridOptions.serviceTypeCategories = result.data;
                    //});
                }

                //$scope.isActiveFilter = [{ id: true, label: "Yes" }, { id: false, label: "No" }];

                init();

            }])
        //.filter('mapActive', function () {
        //        return function (input, scope) {
        //            return input + ' <strong>' + scope.isActiveFilter + '</strong>';
        //        };
        //    });
})();