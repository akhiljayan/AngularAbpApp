(function () {
    appModule.controller('tenant.views.admission.discharge.generalDischargeView', [
        '$scope','$state', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.referral', 'abp.services.app.centreServices', 'abp.services.app.masterLookUp', 'abp.services.app.admission', 'abp.services.app.commonLookup',
        function ($scope, $state, $timeout, $filter, $validator, $stateParams, referralService, centreServices, masterLookup, admissionService, commonLookupService) {
            var vm = this;
            if ($stateParams.action == 'admitted') {
                vm.mode = 'edit';
                vm.isNew = true;
            } else {
                vm.mode = 'view';
                vm.isNew = false;
            }
            vm.pageInput = { maxResultCount: 100, skipCount: 0 };
            vm.dischargedDate = "";
            vm.deseasedDate = "";
            vm.referralServiceType = {};
            vm.admission = $scope.vm.admission;
            vm.referralServiceType.referral = {};
            vm.referralservicetype = $scope.vm.referralServiceType;
            vm.statusimageencoded = app.consts.image64.admissionDischargeStstus;
            vm.discharge = {};
            vm.userid = abp.session.userId;


            //close card
            vm.close = function () {
                $scope.$parent.vm.init();
                vm.mode = 'view';
            };

            vm.closeDischarge = function () {
                vm.mode = 'view';
                vm.discharge = {};
                $scope.vm.dischargeFlag = false;
            }


            //edit card
            vm.edit = function () {
                vm.dischargedDate = vm.discharge.dischargedOn;
                vm.mode = 'edit';
            };
            //save card
            vm.save = function (discharge, isNew) {
                vm.isSaving = true;
                if (isNew) {
                    admissionService.discharge(discharge).then(function (result) {
                        var action = 'discharged';
                        $state.go('tenant.admissionDetail', { action: action, referralId: $stateParams.referralId, id: result.data.admissionId });
                    }).finally(function () {
                        vm.isSaving = false;
                    });
                } else {
                    admissionService.updateDischarge(discharge).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        loadDischargeAfterEdit(result.data.id);
                    }).finally(function () {
                        vm.isSaving = false;
                    });
                }
            };

            //init method
            vm.init = function () {
                vm.loading = true;
                $scope.vm.dis = $scope.dis;
                $scope.dis.referralServiceType = vm.referralServiceType;
                $scope.dis.admission = vm.admission;
                loadMasterLookup();
                if ($stateParams.action == 'admitted') {
                    loadEmptyDischargeObject();
                } else {
                    loadDischargeObject();
                }

            }

            vm.otherDischargeReason = false;
            vm.checkForOtherDischargeReason = function (description) {
                if (description == "Others (specify)") {
                    vm.otherDischargeReason = true;
                } else {
                    vm.discharge.dischargeReasonOthers = "";
                    vm.otherDischargeReason = false;
                }
            }

            vm.otherDischargeDestination = false;
            vm.checkForOtherDischargeDestination = function (description) {
                if (description == "Others") {
                    vm.otherDischargeDestination = true;
                } else {
                    vm.discharge.dischargeDestinationOthers = "";
                    vm.otherDischargeDestination = false;
                }
            }

            vm.otherDeceasedReason = false;
            vm.checkForOtherDeceasedReason = function (description) {
                if (description == "COD- Others") {
                    vm.otherDeceasedReason = true;
                } else {
                    vm.discharge.deceasedOthers = "";
                    vm.otherDeceasedReason = false;
                }
            }

            vm.deseasedSection = false;
            vm.checkIfDeath = function (description) {
                if (description == 'Death') {
                    vm.deseasedSection = true;
                    vm.discharge.deceasedOn = vm.discharge.dischargedOn;
                } else {
                    unsetDeseased();
                    vm.deseasedSection = false;
                }
            }

            function unsetDeseased() {
                vm.discharge.deceasedOn = '';
                vm.discharge.deceasedReasonId = undefined;
                vm.discharge.deceasedOthers = '';
                vm.discharge.deceasedHospitalId = undefined;
                vm.discharge.deceasedPlaceId = undefined;
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

            function loadEmptyDischargeObject() {
                admissionService.getDischarge($scope.EmptyGuid).then(function (result) {
                    vm.discharge = result.data;
                    vm.discharge.staffInChargeId = abp.session.userId;
                    vm.discharge.admissionId = $scope.vm.admission.id;
                    vm.discharge.personId = $scope.vm.admission.personId;
                    $scope.$broadcast('$mapDatetimeToFormat');
                    vm.loading = false;
                });
            }

            function loadDischargeObject() {
                $scope.$on('vmScopeDischarge', function (events, data) {
                    vm.discharge = data;
                    $scope.$broadcast('$mapDatetimeToFormat');
                    if (vm.discharge.dischargeType.name == 'Death') {
                        vm.deseasedSection = true;
                    }
                    vm.loading = false;
                });
            }

            function loadDischargeAfterEdit(dichargeId) {
                admissionService.getDischarge(dichargeId).then(function (result) {
                    vm.discharge = result.data;
                    if (vm.discharge.dischargeType.name == 'Death') {
                        vm.deseasedSection = true;
                    }
                    vm.close();
                    vm.loading = false;
                });
            }

            vm.dischargedOnChange = function (selectedDate) {
                if (vm.deseasedSection) {
                    vm.discharge.deceasedOn = vm.discharge.dischargedOn.toISOString();
                }
            }


            

            //init call
            vm.init();


            vm.validationOptions = {
                rules: {
                    //"DeceasedOn": {
                    //    daterange: []
                    //},
                },
                messages: {
                    "DischargeReasonOthers": {
                        required: "You must provide a value for Other Discharge reason"
                    },
                    "DischargeDestinationOthers": {
                        required: "You must provide a value for Other Discharge Destination"
                    },
                    "DeceasedReasonOthers": {
                        required: "You must provide a value for Other Deseased reason"
                    }
                }
            };

            vm.stafIncharge = [];
            vm.deceasedReasons = [];
            vm.deceasedPlace = [];
            function loadMasterLookup() {
                commonLookupService.findUsers({ maxResultCount: 100 }).then(function (result) {
                    var options = result.data.items;
                    vm.stafIncharge = options.map(function (option) {
                        return {
                            id: parseInt(option.value),
                            description: option.name
                        }
                    });
                });
            }


       
 
        }
    ]);
})();