(function () {
    appModule.controller('tenant.views.irms.index', [
        '$scope', '$location', '$uibModal', '$stateParams', 'uiGridConstants', 'abp.services.app.iRMSReferral',
        function ($scope, $location, $uibModal, $stateParams, uiGridConstants, appService) {
            var vm = this;
            vm.loading = false;
            vm.filterText = null;

            vm.clearFilter = function () {
                vm.filterText = null;
                vm.getIRMSReferral();
            };

            //Paginator load data
            vm.loadResults = function (requestParams) {
                vm.requestParams = requestParams;
                vm.getIRMSReferral();
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useCustomPagination: true,
                useExternalPagination: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell text-wrap" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('SubmissionDate'),
                        field: 'submissionDate',
                        enableHiding: false,
                        minWidth: 150,
                        width: '12%',
                        cellTemplate: '<div class="ui-grid-cell-contents text-wrap">{{row.entity.submissionDate | dateFormat}}</div> '
                    },
                    {
                        name: app.localize('ReferralRegNo'),
                        field: 'referralRegNo',
                        enableHiding: false,
                        minWidth: 150,
                        width: '12%',
                    },
                    {
                        name: app.localize('PersonName'),
                        field: 'patientName',
                        enableHiding: false,
                        minWidth: 200,
                        width: '20%',
                        cellTooltip: function (row) {
                            return row.entity.patientName;
                        },
                        cellTemplate: '<div class="ui-grid-cell-contents text-wrap" white-space: normal title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div>'
                    },
                    {
                        name: app.localize('ReferralSource'),
                        field: 'referralSource',
                        enableHiding: false,
                        minWidth: 200,
                        width: '15%',
                        cellTooltip: function (row) {
                            return row.entity.referralSource;
                        },
                        cellTemplate: '<div class="ui-grid-cell-contents text-wrap" white-space: normal title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div>'
                    },
                    {
                        name: app.localize('ServiceType'),
                        field: 'serviceType',
                        enableHiding: false,
                        minWidth: 150,
                        width: '15%',
                        cellTooltip: function (row) {
                            return row.entity.serviceType;
                        },
                        cellTemplate: '<div class="ui-grid-cell-contents text-wrap" white-space: normal title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div>'
                    },
                    {
                        name: app.localize('Outcome'),
                        field: 'outcome',
                        enableHiding: false,
                        minWidth: 200,
                        width: "10%",
                        cellTooltip: function (row) {
                            return row.entity.outcome;
                        },
                        cellTemplate: '<div class="ui-grid-cell-contents text-wrap" white-space: normal title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div>'
                    },
                    {
                        name: app.localize('Options'),
                        enableSorting: false,
                        enableHiding: false,
                        enableColumnMenu: false,
                        minWidth: 200,
                        cellTemplate:
                        '<div class=\"ui-grid-cell-contents text-wrap\">' +
                        '  <a class="referral-view redirect-anchor fontStealGreen" ng-click="grid.appScope.viewIRMSReferral(row.entity.referralRegNo, row.entity.serviceTypeCode)">Go to IRMS Referral Form</button> ' +
                        '</div>'
                    }
                ],
                data: vm.data
            };

            vm.init = function () {
                vm.permissions = {
                    view: abp.auth.hasPermission('Pages.Tenant.IRMSReferral.View'),
                    convertReferral: abp.auth.hasPermission('Pages.Tenant.IRMSReferral.ConvertReferral')
                };
            }

            vm.getIRMSReferral = function () {
                vm.loading = true;
                appService.getIRMSReferral($.extend({ filter: vm.filterText }, vm.requestParams)
                ).then(function (result) {
                    vm.gridOptions.totalItems = result.data.totalCount;
                    vm.gridOptions.data = result.data.items;
                    vm.data = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.viewIRMSReferral = function (referralRegNo, serviceTypeCode) {
                $location.url('/tenant/irms/referral/' + encodeURIComponent(encodeURIComponent(referralRegNo)) + '/' + serviceTypeCode);
            };

            vm.init();
        }]
    );
})();