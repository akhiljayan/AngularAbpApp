(function () {
    appModule.controller('tenant.views.hospitalization.index', [
        '$scope', '$timeout', 'abp.services.app.hospitalization', '$location', '$anchorScroll', '$filter', '$state',
    function ($scope, $timeout, hospitalizationService, $location, $anchorScroll, $filter,$state) {
        $anchorScroll.yOffset = 70;
        var vm = this;
        vm.appPath = abp.appPath;
        vm.filter = null;
        vm.persons = [];
        vm.headingAppend = '- All'
        vm.selectedFilter = 0;
        vm.todaysDate = moment().format();
       

        //Load function
        vm.init = function () {
            
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Hospitalization.View'),
                delete: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Delete'),
            };          
            //vm.getAll();
            vm.hospitalizationFilterStatus = app.consts.hospitalizationStatus.values;
            vm.hospitalisationDetailsOpen = false;
        };

        //Scroll to div
        vm.gotoAnchor = function (key) {
            //$location.hash(key);
            $anchorScroll(key);
        };


        //Search Function
        vm.searchValue = function () {
            vm.loading = true;
            //CONTENTS GOES HERE
            switch (vm.selectedFilter) {
                //case app.consts.hospitalizationStatus.Hospitalized:
                //    getHospitalized();
                //    break;
                case app.consts.hospitalizationStatus.Discharged:
                    getDischarged();
                    break;
                case app.consts.hospitalizationStatus.Deceased:
                    getDeceased();
                    break;
                case app.consts.hospitalizationStatus.ToBeConfirmed:
                    getUnconfirmed();
                    break;
                case app.consts.hospitalizationStatus.Confirmed:
                    getConfirmed();
                    break;
                case app.consts.hospitalizationStatus.Cancelled:
                    getCancelled();
                    break;
                default:
                    getHospitalized();
            }

        };

        //Create
        //vm.create = function () {
        //    $location.path('/tenant/hospitalization/');
        //};

        vm.create = function () {
            $state.go('tenant.hospitalizationNew');
        };

        //Get all records
        vm.getAll = function () {
            vm.headingAppend = "";
            vm.filter = "";
            getAllRecords();
        };

        vm.showAll = function () {
            vm.selectedFilter.value = "";
            vm.searchValue();
        };

        //Filter function
        vm.hospitalizationStatusFilterSelection = function (dataFilter) {
            var appendValue = $filter('enumText')(dataFilter, 'hospitalizationStatus');
            if (!appendValue) {
                vm.headingAppend = '- All'
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
                $location.path('/tenant/hospitalization/' + id);
            }
        };

        //Page increment function
        vm.incrementPageNumber = function () {
            vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
        };

        vm.init();

        vm.loadResults = function (requestParams) {
            vm.requestParams = requestParams;
            vm.searchValue();
            vm.gotoAnchor("HospitalizationIndex");
        }

        function getAllRecords() {
            hospitalizationService.getAll($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function getHospitalized() {
            hospitalizationService.getAllHospitalization($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function getDischarged() {
            hospitalizationService.getDischargedHospitalizations($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function getDeceased() {
            hospitalizationService.getDeceasedHospitalizations($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function getUnconfirmed() {
            hospitalizationService.getTobeConfimedHospitalizations($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function getConfirmed() {
            hospitalizationService.getConfimedHospitalizations($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function getCancelled() {

            hospitalizationService.getCancelledHospitalizations($.extend({ filter: vm.filter }, vm.requestParams)).then(function (result) {
                processResults(result)
            });
        };

        function processResults(result) {
            vm.hospitalzationList = result.data.items;
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
