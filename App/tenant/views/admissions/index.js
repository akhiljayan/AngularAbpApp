(function () {
    appModule.controller('tenant.views.admissions.index', [
        '$scope', '$state', '$timeout', '$location', 'abp.services.app.centre', 'abp.services.app.serviceType', 'abp.services.app.admission', '$anchorScroll', '$filter',
        function ($scope, $state, $timeout, $location, centerAppService, serviceTypeAppService, admissionAppService, $anchorScroll, $filter) {

            var vm = this;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.persons = [];
            $anchorScroll.yOffset = 75;

            vm.headingAppend = "";
            vm.selectedCentre = "";

            vm.clearFilter = function () {
                vm.filter = "";
            };

            vm.gotoAnchor = function (key) {
                //$location.hash(key);
                //$location.url('#' + key);
                $anchorScroll(key);
            };

            vm.view = function (data) {
                var id = data.id;
                if (vm.permissions.view) {
                    if (data.listingFor == 'Admission') {
                        $state.go('tenant.admissionEdit', { action: 'admitted', id: data.id, close: "main" });
                    } else {
                        $state.go('tenant.dischargeEdit', { action: 'discharged', id: data.id, close: "main" });
                    }
                    
                }
            };

            vm.loadResults = function (requestParams) {
                vm.requestParams = requestParams;
                vm.searchValue();
                vm.gotoAnchor("AdmissionIndex");
            }

            vm.changeFilterOptions = function () {
                if (vm.selectedStatus == app.consts.admissionFilterStatus.Admitted || typeof vm.selectedStatus == 'undefined' || vm.selectedStatus == null || vm.selectedStatus == '') {
                    vm.key = "getAdmissions";
                } else if (vm.selectedStatus == app.consts.admissionFilterStatus.Discharged) {
                    vm.key = "getDischargedAdmissions";
                } else if (vm.selectedStatus == app.consts.admissionFilterStatus.Deceased) {
                    vm.key = "getDeceasedAdmissions";
                }
                vm.searchValue();
            }

            vm.searchValue = function () {
                vm.loading = true;
                loadHeaderAndSortLabels();
                var requestObject = $.extend({ filter: vm.filter, centres: vm.selectedCentre, serviceTypes: vm.selectedServiceTypes, status: vm.selectedStatus, sorting: vm.selectedSort }, vm.requestParams);
                if (vm.selectedStatus == app.consts.admissionFilterStatus.Admitted || typeof vm.selectedStatus == 'undefined' || vm.selectedStatus == null || vm.selectedStatus == '') {
                    admissionAppService.getAdmissions(requestObject).then(function (result) {
                        processResults(result)
                    });
                } else if (vm.selectedStatus == app.consts.admissionFilterStatus.Discharged) {
                    admissionAppService.getDischargedAdmissions(requestObject).then(function (result) {
                        processResults(result)
                    });
                } else if (vm.selectedStatus == app.consts.admissionFilterStatus.Deceased) {
                    requestObject = $.extend(requestObject, { status: app.consts.admissionFilterStatus.Discharged, deceased: true });
                    admissionAppService.getDischargedAdmissions(requestObject).then(function (result) {
                        processResults(result)
                    });
                }

            }

            function processResults(result) {
                vm.dataList = result.data.items;
                vm.data = result.data;
                vm.loading = false;
            }

            vm.init = function () {
                //vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Admission.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Admission.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Admission.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Admission.Delete'),
                    discharge: abp.auth.hasPermission('Pages.Tenant.Admission.Discharge')
                };

                vm.admissionFilterStatus = app.consts.admissionFilterStatus.values;
                vm.selectedStatus = app.consts.admissionFilterStatus.Admitted;
                loadHeaderAndSortLabels();
                vm.previousStatus = vm.selectedStatus;

                centerAppService.getAllCentresInUserOU().then(function (result) {
                    vm.centreList = result.data;
                });

                serviceTypeAppService.getServiceTypesInUserOU().then(function (result) {
                    vm.serviceTypeList = result.data;
                });
            };

            function loadHeaderAndSortLabels() {
                if (vm.previousStatus != vm.selectedStatus) {
                    if (vm.selectedStatus == app.consts.admissionFilterStatus.Admitted) {
                        vm.sortingList = app.consts.admissionSorting.values;
                        vm.selectedSort = app.consts.admissionSorting.AdmittedRecent;
                        vm.heading = "Admitted";
                    } else if (vm.selectedStatus == app.consts.admissionFilterStatus.Discharged) {
                        vm.sortingList = app.consts.dischargedSorting.values;
                        vm.selectedSort = app.consts.dischargedSorting.DischargedRecent;
                        vm.heading = "Discharged";
                    } else if (vm.selectedStatus == app.consts.admissionFilterStatus.Deceased) {
                        vm.sortingList = app.consts.deceasedSorting.values;
                        vm.selectedSort = app.consts.deceasedSorting.DeceasedRecent;
                        vm.heading = "Deceased";
                    }
                    vm.previousStatus = vm.selectedStatus;
                }
            }

            vm.init();

        }
    ]);
})();
