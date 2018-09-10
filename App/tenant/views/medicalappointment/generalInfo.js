(function () {
    appModule.controller('tenant.views.medicalappointment.generalInfo', [
        '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.medicalAppointment', 'abp.services.app.masterLookUp', 'abp.services.app.commonLookup', 'abp.services.app.person',
        function ($scope, $timeout, $filter, $validator, $stateParams, medicalAppointmentService, masterLookup, commonLookupService, personService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.medicalAppointment = {};
            vm.fromToMinMax = {};           

            //close card
            vm.close = function () {
                $scope.vm.init();
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
                $scope.vm.personDisabled = true;
                vm.mode = 'edit';
            };
            //save card
            vm.save = function (medicalAppointment) {
                var data = { "medicalAppointment": medicalAppointment, "scope": vm };
                $scope.$emit('UpdateMedicalAppointment', data);
                
            };
            //init method
            vm.init = function () {                
                $scope.vm.gvm = $scope.gvm;
                $scope.gvm.medicalAppointment = vm.medicalAppointment;
                loadParentProperties();               
            }

            vm.OnChangeAppointmentType = function (selectedAppointmentType) {
                if (selectedAppointmentType.description == 'Specialist Outpatient Clinic') {
                    $scope.vm.isAppointmentTypeSOC = true;
                } else {
                    $scope.vm.isAppointmentTypeSOC = false;
                    $scope.vm.medicalAppointment.specialistOutpatientClinicId = null;                                        
                }
            };

            function loadParentProperties() {
                $scope.$on('vmMedicalAppointment', function (events, data) {
                    vm.medicalAppointment = data;
                });
            }

            //init call
            vm.init();

        }
    ]);
})();