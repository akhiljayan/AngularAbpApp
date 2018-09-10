(function () {
    appModule.controller('tenant.views.hospitalization.hospitalizationInfo', [
        '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.hospitalization', 'abp.services.app.centreServices', 'abp.services.app.masterLookUp',
        function ($scope, $timeout, $filter, $validator, $stateParams, hospitalizationService, centreServices, masterLookup) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.referralServiceType = {};
            vm.hospitalization = {};
            vm.otherHospitalizationReason = false;
            vm.fromdatemin = "";
            vm.isDeceased = false;
            //close card
            vm.close = function () {
                $scope.$parent.vm.load();
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
                vm.mode = 'edit';
            };
            //save card
            vm.save = function (hospitalization) {
                vm.hospitalization.deceasedDate = null;
                if (vm.isDeceased) {
                    vm.hospitalization.deceasedDate = vm.hospitalization.to;
                }
                vm.currentHospitalization = hospitalization;
                var data = { "hospitalization": hospitalization, "scope": vm };
                $scope.$emit('UpdateHospitalization', data);
                //vm.mode = 'view';
            };
            //init method
            vm.init = function () {
                $scope.vm.hvm = $scope.hvm;
                $scope.hvm.hospitalization = vm.hospitalization;
                loadParentProperties();
            }

            vm.checkForOtherHospitalizedReason = function (desc) {
                if (typeof desc == "undefined") {
                    vm.otherHospitalizationReason = false;
                    $scope.vm.hospitalization.otherReasonForHospitalization = '';
                } else {
                    if (desc.trim() === "Others") {
                        vm.otherHospitalizationReason = true;
                    } else {
                        vm.otherHospitalizationReason = false;
                        $scope.vm.hospitalization.otherReasonForHospitalization = '';
                    }
                }
            }
 

     
            //Get description from master data by Id
            vm.getMasterDataDescription = function (Id, masterData) {
                var data = $filter('filter')(masterData, function (m) { return m.id === Id; });
                if (typeof data != 'undefined' && data != null) {
                    var dataDescription = data[0];
                } else {
                    var dataDescription = null;
                }
                if (typeof dataDescription != 'undefined' && dataDescription != null) {
                    return dataDescription.description;
                } else {
                    return "";
                }
            };

            function loadParentProperties() {
                $scope.$on('vmHospitalization', function (events, data) {
                    vm.hospitalization = data;
                    $scope.$broadcast('$mapDatetimeToFormat');
                });
            }

            vm.validateFromToDate = function () {
                var fromDate = vm.hospitalization.from;
                var toDate = vm.hospitalization.to;

                if (!fromDate || !toDate) {
                    return true;
                }

                if (fromDate > toDate) {
                    return false;
                }
                return true;
            };


            vm.validationOptions = {
                rules: {
                    "hospitalizationTo": {
                        daterange: []
                    }
                },
            };

            $validator.addMethod('daterange', function (value, element, options) {
                
                return value < vm.hospitalization.from;
            }, 'Date cannot be a before from date.');


            //init call
            vm.init();
 

            vm.centreLookup = [];
         

         
        }
    ]);
})();