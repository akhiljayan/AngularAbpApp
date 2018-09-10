(function () {
    appModule.component('referralInfoView', {
        bindings: {
            mode: '<',
            referral: '=',
            isNew: '<',
        },
        controllerAs: 'vm',
        controller: ['$scope', 
            function ($scope) {
                var ctrl = this;
                ctrl.referedByOthers = false;
                ctrl.livingArrangementOthers = false;
                ctrl.currentLocationOthers = false;
                ctrl.hospitalDisabled = true;
                ctrl.hospital = "";


                ctrl.$onInit = function () {
                    if (ctrl.mode == 'edit' && !ctrl.isNew) {
                        ctrl.setFieldsForEdit();
                    }
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.mode) {
                        if (ctrl.mode == 'edit' && !ctrl.isNew) {
                            ctrl.setFieldsForEdit();
                        }
                    }
                };


                ctrl.setFieldsForEdit = function () {
                    debugger;
                    //ctrl.hospital = ctrl.referral.hospitalId;
                    var livingArrangementsText = '';
                    var currentLocationText = '';
                    var referredByText = '';
                    if (ctrl.referral.referredBy && ctrl.referral.referredBy.description == 'Others') {
                        ctrl.referedByOthers = true;
                    }
                    if (ctrl.referral.livingArragement && ctrl.referral.livingArragement.description == 'Others') {
                        ctrl.currentLocationOthers = true;
                    }
                    if (ctrl.referral.currentLocation && ctrl.referral.currentLocation.description == 'Others') {
                        ctrl.currentLocationOthers = true;
                    } else if (ctrl.referral.currentLocation && ctrl.referral.currentLocation.description == 'Hospital/ Institution') {
                        ctrl.hospitalDisabled = false;
                    }
                };

                //prevent default or prevent event
                ctrl.preventEvent = function (flag, $event) {
                    if (flag) {
                        $event.stopPropagation();
                    }
                };
                //actions on changing referred by field
                ctrl.referredByChange = function (text, referral) {
                    if (text == 'Others') {
                        ctrl.referredByOthers = true;
                    } else {
                        ctrl.referredByOthers = false;
                        referral.otherReferred = '';
                    }
                };
                //actions on changing living arrangement field
                ctrl.livingArrangementChange = function (text, referral) {
                    if (text == 'Others') {
                        ctrl.livingArrangementOthers = true;
                    } else {
                        referral.otherLivingArrangement = '';
                        ctrl.livingArrangementOthers = false;
                    }
                };
                //actions on changing current location field
                ctrl.currentLocationChange = function (text, referral, $event) {
                    if (text == 'Others') {
                        ctrl.currentLocationOthers = true;
                        ctrl.currentLocationNursingHome = false;
                        referral.nursingHomeName = '';
                    } else if (text == 'Nursing Home') {
                        referral.otherLocation = '';
                        ctrl.currentLocationOthers = false;
                        ctrl.currentLocationNursingHome = true;
                    } else {
                        referral.otherLocation = '';
                        referral.nursingHomeName = '';
                        ctrl.currentLocationOthers = false;
                        ctrl.currentLocationNursingHome = false;
                    }
                    if (text == 'Hospital/ Institution') {
                        ctrl.hospitalDisabled = false;
                    } else {
                        ctrl.hospitalDisabled = true;
                        referral.admissionDate = '';
                        document.getElementById('admissionDate').value = '';
                        referral.dischargedDate = '';
                        document.getElementById('dischargedDate').value = '';
                        referral.ward = '';
                        referral.roomOrBed = '';
                        referral.wardTelephone = '';
                        referral.hospitalId = undefined;
                        ctrl.hospital = undefined;
                    }
                };



            }
        ],
        templateUrl: '~/App/tenant/views/referrals/referral-detail/components/referralInfoView.cshtml'
    });
})(_);