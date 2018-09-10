(function () {
    appModule.controller('tenant.views.hospitalization.otherInfo', [
        '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.hospitalization', 'abp.services.app.centreServices', 'abp.services.app.masterLookUp',
        function ($scope, $timeout, $filter, $validator, $stateParams, hospitalizationService, centreServices, masterLookup) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.referralServiceType = {};
            vm.hospitalization = {};
            vm.eventType = [];

            //close card
            vm.close = function () {
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
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
                $scope.vm.ovm = $scope.ovm;
                $scope.ovm.hospitalization = vm.hospitalization;
                masterLookup.getMasterTypeItems({
                    type: 'Event Type'
                }).then(function (result) {
                    vm.eventType = result.data;
                });
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
                    //vm.hospitalization.isPlanned = null;
                    //loadMasterLookup(vm.hospitalization.person.id);
                });
            }


            //init call
            vm.init();
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            vm.validationOptions = {
                messages: {
                }
            };

            vm.centreLookup = [];
            function loadMasterLookup(personId) {

            };

            function getDateValueForBrowsers(dateString) {
                var arr = dateString.split(" ");
                var date = arr[0].split("-");
                var timeString = arr[1] + ' ' + arr[2].toLowerCase();
                var time = moment(timeString, ["h:mm A"]).format("HH:mm");
                var month = new Date(Date.parse(date[1] + " 1, 2012")).getMonth() + 1
                var selectedDateString = date[2] + '-' + month + '-' + date[0] + ' ' + time + ':00';
                var selectedDate = new Date(selectedDateString);
                return selectedDate;
            }

            //Jquery functions
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                    });
                }, 0);
            }
        }
    ]);
})();