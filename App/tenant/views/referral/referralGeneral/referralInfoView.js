(function () {
    appModule.controller('tenant.views.referral.referralInfoView', [
        '$scope', '$timeout', '$stateParams', 'abp.services.app.masterData', 'abp.services.app.person', 'abp.services.app.referral',
        function ($scope, $timeout, $stateParams, masterData, personService, referralService, event) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};
            vm.referedByOthers = false;
            vm.livingArrangementOthers = false;
            vm.currentLocationOthers = false;
            vm.hospitalDisabled = true;
            vm.hospital = "";

            //close card
            vm.close = function () {
                vm.mode = 'view';
            };
            //edit card
            vm.edit = function (referral) {
                vm.hospital = referral.hospitalId;
                var livingArrangementsText = '';
                var currentLocationText = '';
                var referredByText = '';

                if (typeof referral.livingArragementId != 'undefined' || referral.livingArragementId == null) {
                    livingArrangementsText = $scope.vm.getMasterDataDescription(referral.livingArragementId, $scope.vm.livingArrangementsMaster);
                }
                if (typeof referral.currentLocationId != 'undefined' || referral.currentLocationId == null) {
                    currentLocationText = $scope.vm.getMasterDataDescription(referral.currentLocationId, $scope.vm.currentLocationMaster);
                }
                if (typeof referral.referredById != 'undefined' || referral.referredById == null) {
                    referredByText = $scope.vm.getMasterDataDescription(referral.referredById, $scope.vm.referredByMaster);
                }

                if (referredByText == 'Others') {
                    vm.referedByOthers = true;
                }

                if (livingArrangementsText == 'Others') {
                    vm.currentLocationOthers = true;
                }

                if (currentLocationText == 'Others') {
                    vm.currentLocationOthers = true;
                } else if (currentLocationText == 'Hospital/ Institution') {
                    vm.hospitalDisabled = false;
                }
                vm.mode = 'edit';
                vm.person = _.pick($scope.vm.person, [
                    'highestEducationId', 'lastOccupationId', 'liftLandingId', 'livingArrangementId',
                    'remarks'
                ]);
            };
            //save card
            vm.save = function (referral) {
                if (referral.referredById != null) {
                    masterData.getMasterDataTypeItemById(referral.referredById).then(function (result) {
                        referral.referredBy = result.data;
                        if (referral.person.id == null) {
                            referral.personId = referral.person.id;
                        }
                        $scope.$emit('UpdateReferral', referral);
                    });
                } else {
                    if (referral.person.id == null) {
                        referral.personId = referral.person.id;
                    }
                    $scope.$emit('UpdateReferral', referral);
                }
            };
            //init method
            vm.init = function () {
                $scope.vm.referralInfo = $scope.referralInfo;
                $scope.referralInfo.person = vm.person;
            };
            //prevent default or prevent event
            vm.preventEvent = function (flag, $event) {
                if (flag) {
                    $event.stopPropagation();
                }
            };
            //actions on changing referred by field
            vm.referredByChange = function (text, referral) {
                if (text == 'Others') {
                    vm.referredByOthers = true;
                } else {
                    vm.referredByOthers = false;
                    referral.otherReferred = '';
                }
            };
            //actions on changing living arrangement field
            vm.livingArrangementChange = function (text, referral) {
                if (text == 'Others') {
                    vm.livingArrangementOthers = true;
                } else {
                    referral.otherLivingArrangement = '';
                    vm.livingArrangementOthers = false;
                }
            };
            //actions on changing current location field
            vm.currentLocationChange = function (text, referral, $event) {
                if (text == 'Others') {
                    vm.currentLocationOthers = true;
                    vm.currentLocationNursingHome = false;
                    referral.nursingHomeName = '';
                } else if (text == 'Nursing Home') {
                    referral.otherLocation = '';
                    vm.currentLocationOthers = false;
                    vm.currentLocationNursingHome = true;
                } else {
                    referral.otherLocation = '';
                    referral.nursingHomeName = '';
                    vm.currentLocationOthers = false;
                    vm.currentLocationNursingHome = false;
                }
                if (text == 'Hospital/ Institution') {
                    vm.hospitalDisabled = false;
                } else {
                    vm.hospitalDisabled = true;
                    referral.admissionDate = '';
                    document.getElementById('admissionDate').value = '';
                    referral.dischargedDate = '';
                    document.getElementById('dischargedDate').value = '';
                    referral.ward = '';
                    referral.roomOrBed = '';
                    referral.wardTelephone = '';
                    referral.hospitalId = undefined;
                    vm.hospital = undefined;
                }
            };


            //Brodcast,on and emit functions
            $scope.$on('vmReferral', function (events, data) {
                vm.referral = data;
            });
            $scope.$on('PersonUpdated', function (event, data) {
                if (event.targetScope == $scope) {
                    if (data.success) {
                        vm.close();
                    }
                }
            });
            $scope.$on('ReferralUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });


            //init call
            vm.init();

            //validations
            vm.validationReferalInfoOptions = {
                rules: {
                    "ReferralInfo.ReferralDate": {
                        required: true
                    },
                    "PersonInCharge.EmailAdress": {
                        email: true
                    },
                    "KnownToActionTeam.EmailAddress": {
                        email: true
                    }

                }
            }

  
        }
    ]);
})();