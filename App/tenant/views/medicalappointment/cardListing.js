(function () {
    appModule.controller('tenant.views.medicalappointment.cardListing', [
        '$scope','$state', '$stateParams', '$filter', '$location', 'abp.services.app.medicalAppointment',
        function ($scope, $state, $stateParams, $filter, $location, medicalAppointmentService) {
            var vm = this;
            vm.appPath = abp.appPath;
            vm.medicalAppointmentList = [];
            vm.selectedFilter = 0;
            vm.headingAppend = '- Upcoming';

            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Delete'),
                };

                vm.medicalAppointmentFilterStatus = app.consts.medicalAppointmentStatus.values;
                vm.medicalAppointmentDetailsOpen = false;
            };
            vm.init();

            vm.load = function (requestParams) {
                vm.loading = true;

                if (vm.selectedFilter == 0) {
                    medicalAppointmentService.getUpcomingMedicalAppointmentForPerson(
                        $.extend({ PersonId: $stateParams.id }, requestParams)
                    ).then(function (result) {

                        //vm.resultCount = result.data.totalCount;
                        vm.medicalAppointmentList = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    medicalAppointmentService.getMedicalAppointmentForPerson(
                        $.extend({ PersonId: $stateParams.id, FilterStatus: vm.selectedFilter }, requestParams)
                    ).then(function (result) {                        
                        vm.medicalAppointmentList = result.data.items;
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }                
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
                vm.key = dataFilter;                

                var requestParams = { skipCount: 0 };
                vm.load(requestParams);             
            };

            vm.addMedicalAppointment = function () {
                if (vm.permissions.create) {
                    $state.go('tenant.medicalAppointmentPersonDetailPersonNew', { personId : $stateParams.id });
                }
            };

            vm.editMedicalAppointment = function (id) {
                if (vm.permissions.edit) {
                    $state.go('tenant.medicalAppointmentPersonDetail', { id: id,  personId: $stateParams.id });
                }
            };

            function incrementPageNumber() {
                vm.pageNumber++;
                requestParams.skipCount = (vm.pageNumber - 1) * vm.pageSize;
            }            
        }
    ]);
})();