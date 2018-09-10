(function () {
    appModule.controller('tenant.views.hospitalization.generalInfo', [
        '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.hospitalization', 'abp.services.app.centreServices', 'abp.services.app.commonLookup',
        function ($scope, $timeout, $filter, $validator, $stateParams, hospitalizationService, centreServices, commonLookupService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.referralServiceType = {};
            vm.hospitalization = {};
            vm.fromToMinMax = {};

            //close card
            vm.close = function () {
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
                $scope.vm.personDisabled = true;
                vm.mode = 'edit';
            };
            //save card
            vm.save = function (hospitalization) {
                var data = { "hospitalization": hospitalization, "scope": vm };
                $scope.$emit('UpdateHospitalization', data);
                //vm.mode = 'view';
            };
            //init method
            vm.init = function () {
                $scope.vm.gvm = $scope.gvm;
                $scope.gvm.hospitalization = vm.hospitalization;
                loadParentProperties();
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
                });
            }

            //init call
            vm.init();
          
        }
    ]);
})();