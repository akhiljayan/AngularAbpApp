(function () {
    appModule.controller('tenant.views.vitalSign.index', [
        '$scope', '$state', '$location', '$timeout', '$state', '$anchorScroll', '$filter', '$uibModal', 'uiGridConstants', 'abp.services.app.vitalSign',
    function ($scope, $state, $location, $timeout, $state, $anchorScroll, $filter, $uibModal, uiGridConstants, vitalSignService) {
        $anchorScroll.yOffset = 70;
        var vm = this;
        vm.appPath = abp.appPath;
        vm.filter = null;
        vm.vitalsigns = [];
        vm.todaysDate = moment().format();
        vm.headingAppend = "";


        //Load function
        vm.init = function () {
            vm.loading = true;
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.VitalSign.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.VitalSign.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.VitalSign.View'),
                delete: abp.auth.hasPermission('Pages.Tenant.VitalSign.Delete'),
            };
            vm.vitalSignnDetailsOpen = false;
            //vm.getVitalSigns();
        };

        //Search Function
        //vm.searchValue = function () {
        //    vm.vitalSignList = [];
        //    vm.data = [];
        //    vm.loading = false;
        //    vm.key = "";
        //};

        //Create
        vm.create = function () {
            //$state.go('tenant.admissionDetail', { action: action, referralId: data.referralId, id: data.id });
            if (vm.permissions.create) {
                openCreateOrEditVitalSignModal("create", $scope.EmptyGuid, $scope.EmptyGuid);
                //openCreateOrEditVitalSignModal("create", app.consts.EmptyGuid, app.consts.EmptyGuid);
            }
        };

        //View
        vm.view = function (id) {
            if (vm.permissions.create) {
                openCreateOrEditVitalSignModal("edit", id);
            }
        };

        vm.init();

        vm.gotoAnchor = function (key) {
            $location.hash(key);
            $anchorScroll();
        };
        var range = abp.setting.values;
        vm.tempRange = range['App.VitalSign.TemperatureRange'].split(",");
        vm.pulseRange = range['App.VitalSign.PulseRateRange'].split(",");
        vm.respRange = range['App.VitalSign.RespiratoryRateRange'].split(",");
        vm.spo2Range = range['App.VitalSign.SpO2PercentageRange'].split(",");
        vm.bgFastingRange = range['App.VitalSign.FastingRange'].split(",");

        vm.bpDiastolicLying = range['App.VitalSign.BloodPressureLyingDiastolicRange'].split(",");
        vm.bpSystolicLying = range['App.VitalSign.BloodPressureLyingSystolicRange'].split(",");


        vm.bpDiastolicSitting = range['App.VitalSign.BloodPressureSittingDiastolicRange'].split(",");
        vm.bpSystolicSitting = range['App.VitalSign.BloodPressureSittingSystolicRange'].split(",");


        vm.bpDiastolicStanding = range['App.VitalSign.BloodPressureStandingDiastolicRange'].split(",");
        vm.bpSystolicStanding = range['App.VitalSign.BloodPressureStandingSystolicRange'].split(",");
       



        //Grid Options
        vm.gridOptions = {
            onRegisterApi: function (gridApi) {
                //set gridApi on scope
                $scope.gridApi = gridApi;
            },
            enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            paginationPageSizes: app.consts.grid.defaultPageSizes,
            //paginationPageSize: app.consts.grid.defaultPageSize,
            useExternalPagination: false,
            useExternalSorting: false,
            enableRowSelection: true,
            appScopeProvider: vm,
            rowTemplate: '<div ng-dblclick="grid.appScope.rowDblClick(row)" ios-dblclick="grid.appScope.rowDblClick(row)"  style="cursor:pointer" '
                + 'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" '
                + 'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
            columnDefs: [
                {
                    name: 'Person',
                    headerCellTemplate: '<div class="hedder-padding" ios-dblclick="grid.appScope.rowDblClick(row)">Person <br><small>&nbsp;</small></div>',
                    field: 'person',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.person.fullName}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "15%",
                    pinnedLeft: true,
                    enableSorting: false,
                },
                {
                    name: 'TakenOn',
                    headerCellTemplate: '<div class="hedder-padding" ios-dblclick="grid.appScope.rowDblClick(row)">Taken On <br><small>&nbsp;</small></div>',
                    field: 'takenOn',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.takenOn | dateTimeFormat}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "20%",
                    enableSorting: false,
                    pinnedLeft: true
                },
                {
                    name: 'Temperature',
                    headerCellTemplate: '<div class="hedder-padding">Temperature <br><small>(&#8451;)</small></div>',
                    field: 'temperature',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.tempRange,row.entity.temperature) }">{{row.entity.temperature ? row.entity.temperature :"-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "17%",
                    enableSorting: false
                },
                {
                    name: 'PulseRate',
                    headerCellTemplate: '<div class="hedder-padding">Pulse Rate <br><small>(/min)</small></div>',
                    field: 'pulseRate',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.pulseRange,row.entity.pulseRate) }">{{row.entity.pulseRate ? row.entity.pulseRate :"-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "15%",
                    enableSorting: false
                },
                {
                    name: 'RespiratoryRate',
                    headerCellTemplate: '<div class="hedder-padding">Respiratory Rate <br><small>(/min)</small></div>',
                    field: 'respiratoryRate',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.respRange,row.entity.respiratoryRate) }">{{row.entity.respiratoryRate ? row.entity.respiratoryRate :"-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "21%",
                    enableSorting: false
                },
                {
                    name: 'SpO2',
                    headerCellTemplate: '<div class="hedder-padding">SpO<sub>2</sub> <br><small>(%)</small></div>',
                    field: 'spO2Percentage',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.spo2Range,row.entity.spO2Percentage) }">{{row.entity.spO2Percentage ? row.entity.spO2Percentage :"-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
                //{
                //    name: 'SpO2 (Oxygen Supplement)',
                //    headerCellTemplate: '<div class="hedder-padding">SpO<sub>2</sub>(Oxygen Supplement)</div>',
                //    field: 'spO2OxygenSupplement',
                //    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.spO2OxygenSupplement ? row.entity.spO2OxygenSupplement :"-"}}</div>',
                //    enableHiding: false,
                //    enableColumnMenu: false,
                //    width: "10%",
                //    enableSorting: false
                //},
                {
                    name: 'Lying (Systolic/Distolic)',
                    headerCellTemplate: '<div class="hedder-padding">Lying (Systolic/Distolic) <br><small>(mmHg)</small></div>',
                    field: 'bloodPressure',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<span ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bpSystolicLying,row.entity.bloodPressure.lyingSystolic) }">{{row.entity.bloodPressure.lyingSystolic ? row.entity.bloodPressure.lyingSystolic : "-"}}</span> '
                    + '<span ng-if="row.entity.bloodPressure.lyingSystolic">/</span> '
                    + '<span ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bpDiastolicLying,row.entity.bloodPressure.lyingDiastolic) }">{{row.entity.bloodPressure.lyingDiastolic}}</span></div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "27%",
                    enableSorting: false
                },
                {
                    name: 'Sitting (Systolic/Distolic)',
                    headerCellTemplate: '<div class="hedder-padding">Sitting (Systolic/Distolic) <br><small>(mmHg)</small></div>',
                    field: 'bloodPressure',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<span ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bpSystolicSitting,row.entity.bloodPressure.sittingSystolic) }">{{row.entity.bloodPressure.sittingSystolic ? row.entity.bloodPressure.sittingSystolic : "-"}}</span> '
                        + '<span ng-if="row.entity.bloodPressure.sittingSystolic">/</span> '
                        + '<span ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bpDiastolicSitting,row.entity.bloodPressure.sittingDiastolic) }">{{row.entity.bloodPressure.sittingDiastolic}}</span></div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "30%",
                    enableSorting: false
                },
                {
                    name: 'Standing (Systolic/Distolic)',
                    headerCellTemplate: '<div class="hedder-padding">Standing (Systolic/Distolic) <br><small>(mmHg)</small></div>',
                    field: 'bloodPressure',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<span ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bpSystolicStanding,row.entity.bloodPressure.standingSystolic) }">{{row.entity.bloodPressure.standingSystolic ? row.entity.bloodPressure.standingSystolic : "-"}}</span> '
                        + '<span ng-if="row.entity.bloodPressure.standingSystolic">/</span> '
                        + '<span ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bpDiastolicStanding,row.entity.bloodPressure.standingDiastolic) }">{{row.entity.bloodPressure.standingDiastolic}}</span></div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "32%",
                    enableSorting: false
                },                
                {
                    name: 'Blood Glucose 2HPP',
                    headerCellTemplate: '<div class="hedder-padding">2HPP <br><small>(mmol/L)</small></div>',
                    field: 'bloodGlucose',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bgFastingRange,row.entity.bloodGlucose.twoHPP) }">{{row.entity.bloodGlucose.twoHPP ? row.entity.bloodGlucose.twoHPP :"-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
                {
                    name: 'Blood Glucose Fasting',
                    headerCellTemplate: '<div class="hedder-padding">Fasting <br><small>(mmol/L)</small></div>',
                    field: 'bloodGlucose',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bgFastingRange,row.entity.bloodGlucose.fasting) }">{{row.entity.bloodGlucose.fasting ? row.entity.bloodGlucose.fasting : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "11%",
                    enableSorting: false
                },
                {
                    name: 'Blood Glucose Random',
                    headerCellTemplate: '<div class="hedder-padding">Random <br><small>(mmol/L)</small></div>',
                    field: 'bloodGlucose',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'abnormal\': grid.appScope.checkForAbnormal(grid.appScope.bgFastingRange,row.entity.bloodGlucose.random) }">{{row.entity.bloodGlucose.random ? row.entity.bloodGlucose.random : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "11%",
                    enableSorting: false
                },
                {
                    name: 'Urine Blood',
                    headerCellTemplate: '<div class="hedder-padding">Urine Blood <br></div>',
                    field: 'urine',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.urine.blood ? row.entity.urine.blood : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "15%",
                    enableSorting: false
                },
                {
                    name: 'Urine P.H',
                    headerCellTemplate: '<div class="hedder-padding">Urine PH <br></div>',
                    field: 'urine',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.urine.ph ? row.entity.urine.ph : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
                {
                    name: 'Urine Ketone',
                    headerCellTemplate: '<div class="hedder-padding">Urine Ketone<br></div>',
                    field: 'urine',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.urine.ketone ? row.entity.urine.ketone : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "15%",
                    enableSorting: false
                },
                {
                    name: 'Urine Glucose',
                    headerCellTemplate: '<div class="hedder-padding">Urine Glucose<br></div>',
                    field: 'urine',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.urine.glucose ? row.entity.urine.glucose : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "15%",
                    enableSorting: false
                },
                {
                    name: 'Urine Leukocytes',
                    headerCellTemplate: '<div class="hedder-padding">Urine Leukocytes<br></div>',
                    field: 'urine',
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="switch">'
                        + '<div ng-if="row.entity.urine.luekocytes == 1">Positive</div>'
                        + '<div ng-if="row.entity.urine.luekocytes == 2">Negative</div>'
                        + '<div ng-if="!row.entity.urine.luekocytes">-</div></div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "15%",
                    enableSorting: false
                },
                {
                    name: app.localize('Urine Nitrite'),
                    headerCellTemplate: '<div class="hedder-padding">Urine Nitrite<br></div>',
                    field: 'urine',
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="switch">'
                        + '<div ng-if="row.entity.urine.nitrite == 1">Positive</div>'
                        + '<div ng-if="row.entity.urine.nitrite == 2">Absent/Negative</div>'
                        + '<div ng-if="!row.entity.urine.nitrite">-</div></div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
                {
                    name: app.localize('Height'),
                    headerCellTemplate: '<div class="hedder-padding">Height <br><small>(cm)</small></div>',
                    field: 'bmi',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bmi.height ? row.entity.bmi.height : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
                {
                    name: app.localize('Weight'),
                    headerCellTemplate: '<div class="hedder-padding">Weight <br><small>(kg)</small></div>',
                    field: 'bmi',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bmi.weight ? row.entity.bmi.weight : "-"}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
                {
                    name: app.localize('BMI'),
                    headerCellTemplate: '<div class="hedder-padding">BMI <br><small>(kg/m<sup>2</sup>)</small></div>',
                    field: 'bmi',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bmi.weight / ((row.entity.bmi.height * row.entity.bmi.height) / 10000) | number : 2}}</div>',
                    enableHiding: false,
                    enableColumnMenu: false,
                    width: "10%",
                    enableSorting: false
                },
            ],
            data: [],
            enablePaginationControls: false,
        };



        vm.checkForAbnormal = function (range, val) {
            var min = Number(range[0]);
            var max = Number(range[1]);
            if (val) {
                return (val < min || val > max);
            }
        };


        $scope.$on('Created-new-vitalsign', function () {
            vm.loadResults(vm.requestParams);
        });

        vm.delete = function () {
            if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                abp.message.info(app.localize('PromptSelectRecord'));
                return;
            }
            abp.message.confirm(
                app.localize('DeleteData'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        var deletelist = [];
                        var deletelistObjects = $scope.gridApi.selection.getSelectedRows();
                        for (var i = 0; i < deletelistObjects.length; i++) {
                            deletelist.push(deletelistObjects[i].id);
                        }
                        var deletelistLength = $scope.gridApi.selection.getSelectedRows().length;
                        if (deletelistLength > 1) {
                            vitalSignService.deleteAll(deletelist).then(function (response) {
                                vm.loadResults(vm.requestParams);
                            });
                        }
                        else {
                            vitalSignService.delete(deletelist[0]).then(function (response) {
                                vm.loadResults(vm.requestParams);
                            });
                        }
                    }
                }
            );
        };

        vm.rowDblClick = function (row) {
            openVitalSignView(row.entity.id);
        };

        function openCreateOrEditVitalSignModal(action, id, pid) {
            createResolve = {
                action: function () { return action; },
                vitalSignId: function () { return id; },
                template: function () { return 'person'; },
                templateId: function () { return ''; },
                templateDateIn: function () { return ''; },
                templateDateOut: function () { return ''; },
                personId: function () { return pid; },
            };

            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/vitalSigns/createOrEditVitalSigns.cshtml',
                controller: 'tenant.views.vitalSigns.createOrEditVitalSigns as vm',
                backdrop: 'static',
                //windowClass: 'larger-modal',
                size: 'lg',
                scope: $scope,
                resolve: createResolve
            });
            modalInstance.result.then(function () {
                load();
            });
        };

        vm.getVitalSigns = function () {
            vitalSignService.getAll($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                vm.data = result.data;
                vm.gridOptions.data = result.data.items;
                vm.loading = false;
            });
        };

        vm.loadResults = function (requestParams) {
            vm.gridOptions.data = [];
            $scope.gridApi.core.refresh();
            vm.gridOptions.totalItems = requestParams.maxResultCount;
            vm.gridOptions.paginationPageSize = requestParams.maxResultCount;
            vm.requestParams = requestParams;
            vm.getVitalSigns();
        }
        vm.search = function () {
            vm.loadResults(vm.requestParams);
        }

        function openVitalSignView(vid) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/vitalSigns/vitalSignView.cshtml',
                controller: 'tenant.views.vitalSigns.vitalSignView as vm',
                backdrop: 'static',
                scope: $scope,
                resolve: {
                    vitalSignId: function () {
                        return vid;
                    },
                }
            });
            modalInstance.result.then(function () {
                load();
            });
        }

    }
    ]);
})();
