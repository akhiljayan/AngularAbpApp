(function () {
    appModule.controller('tenant.views.medicalappointment.index', [
        '$scope', '$timeout', 'abp.services.app.medicalAppointment', '$location', '$anchorScroll', '$filter',
        function ($scope, $timeout, medicalAppointmentService, $location, $anchorScroll, $filter) {
            
            $anchorScroll.yOffset = 70;
            var vm = this;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.persons = [];
            vm.headingAppend = '- Upcoming'            
            vm.todaysDate = moment().format();


            //Load function
            vm.init = function () {
                vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Delete'),
                };
                
                vm.medicalAppointmentFilterStatus = app.consts.medicalAppointmentStatus.values;
                vm.medicalAppointmentDetailsOpen = false;
            };

            //Scroll to div
            vm.gotoAnchor = function (key) {
                $anchorScroll(key);
            };


            //Search Function
            vm.searchValue = function () {
                //CONTENTS GOES HERE
                switch (vm.selectedFilter) {
                    case app.consts.medicalAppointmentStatus.All:
                        vm.getAll();
                        break;                    
                    case app.consts.medicalAppointmentStatus.PendingConfirmation:
                        getPendingConfirmation();
                        break;
                    case app.consts.medicalAppointmentStatus.Confirmed:
                        getConfirmed();
                        break;
                    case app.consts.medicalAppointmentStatus.Cancelled:
                        getCancelled();
                        break;
                    default:
                        getUpcoming();
                }
            };

            //Create
            vm.create = function () {
                $location.path('/tenant/medicalAppointment/');
            };

            //Get all records
            vm.getAll = function () {
                vm.headingAppend = " - All";
                vm.filter = "";
                getAllRecords();
            };

            vm.showAll = function () {
                vm.selectedFilter.value = "";
                vm.searchValue();
            };

            //Filter function
            vm.medicalAppointmentStatusFilterSelection = function (dataFilter) {
                var appendValue = $filter('enumText')(dataFilter, 'medicalAppointmentStatus');                
                if (!appendValue) {
                    vm.headingAppend = '- Upcoming'
                }
                else {
                    vm.headingAppend = '- ' + appendValue;
                }
                //SERTCH WITH PARAMS
                vm.selectedFilter = dataFilter;
                vm.key = dataFilter.toString();
            };

            //Clear Filter
            vm.clearFilter = function () {
                vm.filter = "";
            };

            //View
            vm.view = function (id) {
                if (vm.permissions.view) {
                    $location.path('/tenant/medicalAppointment/' + id);
                }
            };

            //Page increment function
            vm.incrementPageNumber = function () {
                vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
            };

            vm.init();

            vm.loadResults = function (requestParams) {
                vm.loading = true;
                vm.requestParams = requestParams;
                vm.searchValue();
                vm.gotoAnchor("MedicalAppointmentIndex");
            }

            function getAllRecords() {
                medicalAppointmentService.getAllMedicalAppointment($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                    processResults(result)
                });
            };

            function getUpcoming() {
                medicalAppointmentService.getUpcomingMedicalAppointments($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                    processResults(result)
                });
            };

            function getPendingConfirmation() {
                medicalAppointmentService.getPendingConfirmationMedicalAppointments($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                    processResults(result)
                });
            };

            function getConfirmed() {
                medicalAppointmentService.getConfimedMedicalAppointments($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                    processResults(result)
                });
            };

            function getCancelled() {
                medicalAppointmentService.getCancelledMedicalAppointments($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                    processResults(result)
                });
            };

            function processResults(result) {
                vm.medicalAppointmentList = result.data.items;
                vm.data = result.data;
                vm.loading = false;
            }

            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {

                    });
                }, 0);
            }
        }
    ]);
})();
