(function () {
    appModule.controller('tenant.views.assessment.settings.index',
        ['$scope', '$timeout', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.assessment', '$filter',
            function ($scope, $timeout, $uibModal, $stateParams, uiGridConstants, appService, $filter) {
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
                            name: 'Assesment',
                            field: 'description',
                            enableColumnMenu: false,
                            width: "35%",
                            enableHiding: false
                        },
                        {
                            name: 'Code',
                            field: 'name',
                            enableColumnMenu: false,
                            width: "32%",
                            enableHiding: false,
                        },
                        {
                            name: 'Next Review Month',
                            field: 'nextReviewMonth',
                            enableColumnMenu: false,
                            width: "32%",
                            enableHiding: false
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                    },
                    data: vm.data
                };


                vm.loadData = function (requestParams) {
                    vm.requestParams = requestParams;
                    vm.getAssesments();
                };

                vm.edit = function (id, action) {
                    openCreateOrEditCentre(id, action);
                };

                vm.rowDblClick = function (row) {
                    vm.edit(row.entity.id);
                };

                function openCreateOrEditCentre(id, action) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/assessment/settings/assesmentConfig.cshtml',
                        controller: 'tenant.views.assesment.settings.assesmentConfig as vm',
                        backdrop: 'static',
                        resolve: {
                            assesmentId: function () {
                                return id;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        vm.getAssesments();
                    });

                }

                vm.getAssesments = function () {
                    vm.loading = true;
                    appService.getAll(vm.requestParams).then(function (result) {
                        vm.gridOptions.totalItems = result.data.length;
                        vm.gridOptions.data = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {

                }

                init();
            }
        ]);
})();