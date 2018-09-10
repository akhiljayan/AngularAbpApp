(function () {
    appModule.controller('tenant.views.auditlog.detail', [
        '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'auditLog', 'abp.services.app.customAuditLog',
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, uiGridConstants, auditLog, auditLogService) {
            var vm = this;

            vm.auditLog = auditLog;
            vm.auditId = auditLog.id;

            var stateNameRaw = camelCaseToWords(auditLog.stateName).trim();
            vm.stateName = stateNameRaw.replace("Entity ", "");
            vm.title = camelCaseToWords(auditLog.entityTypeName) + " - " + vm.stateName;

            vm.pageSize = app.consts.grid.defaultPageSize;
            vm.currentPage = 1;

            vm.requestParams = {
                skipCount: 0,
                maxResultCount: vm.pageSize,
                sorting: null
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.init = function () {
                vm.permissions = {
                    view: abp.auth.hasPermission('Pages.Tenant.AuditLog.View')
                };

                if (auditLog.state == app.consts.auditLogEntityStates.EntityModified) {
                    vm.editedState = true;
                    vm.gridOptions = $.extend(vm.gridGeneralOptions, vm.editingStateOptions);

                } else {
                    vm.editedState = false;
                    vm.gridOptions = $.extend(vm.gridGeneralOptions, vm.otherStateOptions);
                }

                vm.getAuditLogDetail();
            };

            vm.getAuditLogDetail = function () {
                vm.loading = true;
                auditLogService.getAuditEntryDetails($.extend({ auditEntryID: vm.auditId }, vm.requestParams)).then(function (result) {
                    vm.gridOptions.data = result.data.items;
                    vm.gridOptions.totalItems = result.data.totalCount;
                    vm.totalItems = result.data.totalCount;
                    vm.setTitle();
                    vm.loading = false;
                });
            };

            vm.pageChanged = function () {
                vm.requestParams.maxResultCount = vm.pageSize;
                vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
                vm.getAuditLogDetail();
            };

            function camelCaseToWords(str) {
                if (str != undefined) {
                    return $.splitCamelCase(str);
                } else {
                    return '';
                }
            };

            vm.setTitle = function () {
                vm.title = camelCaseToWords(auditLog.entityTypeName) + " - " + vm.stateName;

                if (vm.gridOptions.data.length > 0) {

                    var recordName = vm.gridOptions.data.find(function (element) {
                        return element.propertyName == "Name";
                    });

                    if (recordName != undefined) {
                        vm.detail = recordName.newValue;
                    }
                }
            };

            vm.gridGeneralOptions = {
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                },

                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSize: app.consts.grid.defaultPageSize,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                useExternalPagination: false,
                useExternalSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                appScopeProvider: vm,
                rowTemplate: '<div ng-dblclick="grid.appScope.rowDblClick(row)" style="cursor:pointer" '
                + 'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" '
                + 'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                enablePaginationControls: false,
            };

            vm.editingStateOptions = {
                columnDefs: [
                        {
                            name: 'Field Name',
                            headerCellTemplate: '<div class="header-padding">Field Name</div>',
                            field: 'propertyName',
                            cellTemplate: '<div class="ui-grid-cell-contents text-wrap">{{row.entity.propertyName}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "30%",
                            enableSorting: false,
                        },
                        {
                            name: 'Old Value',
                            headerCellTemplate: '<div class="header-padding">Old Value</div>',
                            field: 'oldValue',
                            cellTemplate: '<div class="ui-grid-cell-contents text-wrap">' +
                                '<span style="word-wrap: normal" ng-if="row.entity.oldValue">{{row.entity.oldValue}}</span>' +
                                '<span ng-if="!row.entity.oldValue"><i></i></span>' +
                                '</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "35%",
                            enableSorting: false,
                        },
                        {
                            name: 'New Value',
                            headerCellTemplate: '<div class="header-padding">New Value</div>',
                            field: 'newValue',
                            cellTemplate: '<div class="ui-grid-cell-contents text-wrap">' +
                                '<span style="word-wrap: normal" ng-if="row.entity.newValue">{{row.entity.newValue}}</span>' +
                                '<span ng-if="!row.entity.newValue"><i></i></span>' +
                                '</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "35%",
                            enableSorting: false,
                        },

                ],
                data: [],
            };

            vm.otherStateOptions = {
                columnDefs: [
                        {
                            name: 'Field Name',
                            headerCellTemplate: '<div class="header-padding">Field Name</div>',
                            field: 'propertyName',
                            cellTemplate: '<div class="ui-grid-cell-contents text-wrap">{{row.entity.propertyName}}</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "50%",
                            enableSorting: false,
                        },
                        {
                            name: 'Value',
                            headerCellTemplate: '<div class="header-padding">Value</div>',
                            field: 'newValue',
                            cellTemplate: '<div class="ui-grid-cell-contents text-wrap">' +
                                '<span style="word-wrap: normal" ng-if="row.entity.newValue">{{row.entity.newValue}}</span>' +
                                '<span ng-if="!row.entity.newValue"><i></i></span>' +
                                '</div>',
                            enableHiding: false,
                            enableColumnMenu: false,
                            width: "50%",
                            enableSorting: false,
                        },
                ],
                data: [],
            };

            vm.init();
        }
    ]);
})();