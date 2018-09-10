(function () {
    appModule.controller('tenant.views.dashboard.medicalAppoinment', [
        '$scope', '$state', '$timeout', 'abp.services.app.medicalAppointment', '$location', '$anchorScroll', '$filter',
        function ($scope, $state, $timeout, medicalAppointmentService, $location, $anchorScroll, $filter) {
            var vm = this;
            vm.filter = null;
            vm.appPath = abp.appPath;
            
            vm.headingAppend = 'Upcoming';
            vm.totalDataCount = 0;
            vm.pageSizes = [5, 10, 20, 50, 100];
            vm.pageSize = 5;
            vm.requestParams = { maxResultCount: vm.pageSize, skipCount: 0 };
            vm.currentPage = 1;
            vm.recordFrom = 0;
            vm.recordTo = 0;



            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Delete'),
                };
                vm.medicalAppointmentFilterStatus = app.consts.medicalAppointmentStatus.values;
                vm.medicalAppointmentDetailsOpen = false;
                vm.loadData();
            };

            vm.loadData = function () {
                vm.loading = true;
                getUpcomingForCareBoard();                
            };
            
            vm.view = function (id) {
                if (vm.permissions.view) {
                    $state.go('tenant.medicalAppointmentDetail', { id: id , close:"Careboard"})
                }
            };


            vm.pageChanged = function () {
                vm.requestParams.maxResultCount = vm.pageSize;
                vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
                vm.loadData();
            };

            vm.reset = function () {
                vm.currentPage = 1;
                vm.pageChanged();
            };

            vm.clearFilter = function () {
                vm.filter = "";
                vm.init();
            };

            vm.changeFromToCount = function () {
                vm.recordFrom = Math.min(vm.totalDataCount, (vm.currentPage - 1) * vm.pageSize + 1);
                vm.recordTo = Math.min(vm.totalDataCount, vm.currentPage * vm.pageSize);
            };
            

            function getUpcomingForCareBoard() {
                medicalAppointmentService.getUpcomingMedicalAppointmentsForCareBoard($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                    processResults(result)
                });
            };
            
            function processResults(result) {
                vm.totalDataCount = result.data.totalCount;
                vm.medicalAppointmentList = result.data.items;
                vm.data = result.data;
                vm.changeFromToCount();
                vm.loading = false;
            };

            vm.init();

        }
    ]);
})();