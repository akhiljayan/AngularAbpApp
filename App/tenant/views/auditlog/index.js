(function () {
    appModule.controller('tenant.views.auditlog.index', [
        '$scope', '$state', '$location', '$timeout', '$state', '$anchorScroll', '$filter', '$uibModal', 'uiGridConstants', 'abp.services.app.customAuditLog',
        function ($scope, $state, $location, $timeout, $state, $anchorScroll, $filter, $uibModal, uiGridConstants, auditLogService) {
            var vm = this;
            vm.filter = null;
            vm.auditLog = [];
            vm.modules = [];
            vm.events = [];
            $anchorScroll.yOffset = 75;
            vm.loadData = false;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeModel = {
                startDate: null,
                endDate: null
            };

            vm.gotoAnchor = function (key) {
                $location.hash(key);
                $anchorScroll();
            };

            vm.view = function (id) {
                if (vm.permissions.view) {
                    openEntityAuditLog(id);
                }
            };

            vm.init = function () {
                vm.permissions = {
                    view: abp.auth.hasPermission('Pages.Tenant.AuditLog.View')
                };

                auditLogService.getAuditEntryEntityTypes().then(function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        var obj = { name: vm.camelCaseToWords(result.data[i]), value: result.data[i] }
                        vm.modules.push(obj);
                    }
                });

                auditLogService.getAuditStateList().then(function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        var obj = { name: result.data[i].description.replace('Entity',''), value: result.data[i].id }
                        vm.events.push(obj);
                    }
                });
            };

            vm.gridOptions = {
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                },
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                useExternalPagination: false,
                useExternalSorting: false,
                enableRowSelection: false,
                enableRowHeaderSelection: false,
                appScopeProvider: vm,
                rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" style="cursor:pointer" '
                + 'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" '
                + 'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                        {
                            name: app.localize('DateAndTime'),
                            field: 'createdDate',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.createdDate | dateTimeFormat}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "20%",
                        },
                        {
                            name: app.localize('Module'),
                            field: 'entityTypeName',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.camelCaseToWords(row.entity.entityTypeName)}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "20%",
                        },
                        {
                            name: app.localize('Record'),
                            field: 'recordName',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.recordName}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "30%",
                        },
                        {
                            name: app.localize('Action'),
                            field: 'customStateName',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.camelCaseToWords(row.entity.customStateName)}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "10%",
                        },
                        {
                            name: app.localize('ActionBy'),
                            field: 'createdBy',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.createdBy}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "20%",
                        },
                ],
                data: [],
                enablePaginationControls: false,
            };

            vm.getAuditLogs = function () {
                vm.loading = true;
                auditLogService.getAuditEntries($.extend(vm.filter, vm.requestParams, vm.dateRangeModel)).then(function (result) {
                    vm.data = result.data;
                    vm.gridOptions.data = result.data.items;
                    vm.loading = false;
                });
            };

            vm.camelCaseToWords = function (str) {
                if (str != undefined) {
                    var eventName = $.splitCamelCase(str);
                    return eventName.replace("Entity", "");
                } else {
                    return '';
                }
            };

            //EntityTypeName
            vm.loadResults = function (requestParams) {
                vm.gridOptions.data = [];
                $scope.gridApi.core.refresh();
                vm.gridOptions.totalItems = requestParams.maxResultCount;
                vm.gridOptions.paginationPageSize = requestParams.maxResultCount;
                vm.requestParams = requestParams;
                if (vm.loadData) {
                    vm.getAuditLogs();
                }
            }

            vm.search = function () {
                vm.loadData = true;
                vm.loadResults(vm.requestParams);
            }

            vm.rowDblClick = function (row) {

                if (row.entity.isFileAuditing == true) {
                    openFileAuditingDetail(row.entity);
                } else {
                    openAuditLogDetail(row.entity);
                }
            };

            function openAuditLogDetail(entity) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/auditlog/detail.cshtml',
                    controller: 'tenant.views.auditlog.detail as vm',
                    backdrop: 'static',
                    size: 'xlg',
                    scope: $scope,
                    resolve: {
                        auditLog: function () {
                            return entity;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    load();
                });
            }

            function openFileAuditingDetail(entity) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/auditlog/file-detail.cshtml',
                    controller: 'tenant.views.auditlog.fileDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    scope: $scope,
                    resolve: {
                        auditLog: function () {
                            return entity;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    load();
                });
            }


            vm.init();
        }
    ]);
})();
