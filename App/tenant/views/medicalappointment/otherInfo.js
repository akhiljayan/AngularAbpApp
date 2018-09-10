(function () {
    appModule.controller('tenant.views.medicalappointment.otherInfo', [
        '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.medicalAppointment',
        function ($scope, $timeout, $filter, $validator, $stateParams, medicalAppointmentService) {
            
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.medicalAppointment = {};
            vm.appointmentStatusList = app.consts.medicalAppointmentStatusType.values;
            vm.followUpList = app.consts.medicalAppointmentFollowUpType.values;
                        
            //close card
            vm.close = function () {
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
                vm.mode = 'edit';
            };
            //save card
            vm.save = function (medicalAppointment) {                
                var data = { "medicalAppointment": medicalAppointment, "scope": vm };
                $scope.$emit('UpdateMedicalAppointment', data);
                
            };
            //init method
            vm.init = function () {
                $scope.vm.ovm = $scope.ovm;
                $scope.ovm.medicalAppointment = vm.medicalAppointment;                
                loadParentProperties();
            }              

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