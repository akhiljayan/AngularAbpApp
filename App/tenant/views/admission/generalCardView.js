(function () {
    appModule.controller('tenant.views.admission.generalCardView', [
        '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.referral', 'abp.services.app.centreServices', 'abp.services.app.masterLookUp', 'abp.services.app.centre', 'abp.services.app.report',
        function ($scope, $timeout, $filter, $validator, $stateParams, referralService, centreServices, masterLookup, centre, reportService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.referralServiceType = {};
            vm.admission = {};
            vm.referralServiceType.referral = {};
            vm.referralservicetype = $scope.vm.referralServiceType;
            vm.statusimageencoded = app.consts.image64.admissionDischargeStstus;
  


            //close card
            vm.close = function () {
                $scope.$parent.vm.init();
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function () {
                vm.mode = 'edit';
            };
            //save card
            vm.save = function (admission) {
                $scope.$emit('UpdateAdmission', admission);
                vm.mode = 'view';
            };
            //init method
            vm.init = function () {
                $scope.vm.general = $scope.general;
                $scope.general.referralServiceType = vm.referralServiceType;
                $scope.general.admission = vm.admission;
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
                $scope.$on('vmScopeProperties', function (events, data) {
                    vm.admission = data.vmAdmission;
                    vm.referralServiceType = data.vmReferralServiveType;
                    loadMasterLookup(vm.referralServiceType.serviceTypeId);
                });
            }

            vm.validateDischargeDate = function () {
                var admissionDate = vm.admission.admittedOn;
                var dischargeDate = vm.admission.plannedDischargeDate;

                if (!admissionDate || !dischargeDate) {
                    return true;
                }

                if (admissionDate > dischargeDate) {
                    return false;
                }

                return true;
            };



            vm.validateAdmissionDate = function () {

                var approvalDate = $scope.vm.minAdmitedOnDate;
                var admissionDate = vm.admission.admittedOn;

                if (!admissionDate || !approvalDate) {
                    return true;
                }

                if (approvalDate > admissionDate) {
                    return false;
                }

                return true;
            };

            //init call
            vm.init();

            //Print
            vm.print = function () {
                var reportWindow = window.open();

                reportService.printAdmissionReport(vm.admission.id).then(function (result) {
                    vm.url = result.data;

                    var location = window.location.origin + abp.appPath + vm.url;
                    reportWindow.location = location;
                    reportWindow.target = '_blank';
                    reportWindow.locationbar.visible = false;
                    reportWindow.focus();
                });
            };
       
            vm.centreLookup = [];
            vm.iltcEpisodeServiceType = [];
            function loadMasterLookup(referralServiceTypeId) {
                centre.getAllCentresLookUpInUserOU().then(function (result) {
                    vm.centreLookup = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'ILTC Episode Service Type'
                }).then(function (result) {
                    vm.iltcEpisodeServiceType = result.data;
                });
            }

       
        }
    ]);
})();