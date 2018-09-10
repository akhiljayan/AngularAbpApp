(function () {
    appModule.component('admissionDischargeView', {
        bindings: {
            mode: '<',
            admission: '=',
            discharge: '=',
            permissions: '<'
        },
        controllerAs: 'vm',
        controller: ['$filter', '$stateParams', 'abp.services.app.admission', 'abp.services.app.commonLookup',
            function ($filter, $stateParams, admissionService, commonLookupService) {
                var ctrl = this;
                ctrl.dischargedDate = "";
                ctrl.deseasedDate = "";

                ctrl.$onInit = function () {
                    loadMasterLookup();
                    if ($stateParams.action == 'admitted') {
                        abp.ui.setBusy();
                        loadEmptyDischargeObject();
                    }
                }


                ctrl.otherDischargeReason = false;
                ctrl.checkForOtherDischargeReason = function (description) {
                    if (description == "Others (specify)") {
                        ctrl.otherDischargeReason = true;
                    } else {
                        ctrl.discharge.dischargeReasonOthers = "";
                        ctrl.otherDischargeReason = false;
                    }
                }

                ctrl.otherDischargeDestination = false;
                ctrl.checkForOtherDischargeDestination = function (description) {
                    if (description == "Others") {
                        ctrl.otherDischargeDestination = true;
                    } else {
                        ctrl.discharge.dischargeDestinationOthers = "";
                        ctrl.otherDischargeDestination = false;
                    }
                }

                ctrl.otherDeceasedReason = false;
                ctrl.checkForOtherDeceasedReason = function (description) {
                    if (description == "COD- Others") {
                        ctrl.otherDeceasedReason = true;
                    } else {
                        ctrl.discharge.deceasedOthers = "";
                        ctrl.otherDeceasedReason = false;
                    }
                }

                ctrl.deseasedSection = false;
                ctrl.checkIfDeath = function (description) {
                    if (description == 'Death') {
                        ctrl.deseasedSection = true;
                        ctrl.discharge.deceasedOn = ctrl.discharge.dischargedOn;
                    } else {
                        unsetDeseased();
                        ctrl.deseasedSection = false;
                    }
                }

                function unsetDeseased() {
                    ctrl.discharge.deceasedOn = '';
                    ctrl.discharge.deceasedReasonId = undefined;
                    ctrl.discharge.deceasedOthers = '';
                    ctrl.discharge.deceasedHospitalId = undefined;
                    ctrl.discharge.deceasedPlaceId = undefined;
                }


                //Get description from master data by Id
                ctrl.getMasterDataDescription = function (Id, masterData) {
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
                    admissionService.getDischarge(app.consts.EmptyGuid).then(function (result) {
                        ctrl.discharge = result.data;
                        ctrl.discharge.staffInChargeId = abp.session.userId;
                        ctrl.discharge.admissionId = ctrl.admission.id;
                        ctrl.discharge.personId = ctrl.admission.personId;
                        ctrl.discharge.dischargedOn = null;
                        abp.ui.clearBusy();
                        window.scrollTo(0, document.body.scrollHeight);
                    }).finally(function () {
                        ctrl.loading = false;
                        abp.ui.clearBusy();
                        window.scrollTo(0, document.body.scrollHeight);
                    });;
                }

                ctrl.dischargedOnChange = function (selectedDate) {
                    if (ctrl.deseasedSection) {
                        ctrl.discharge.deceasedOn = ctrl.discharge.dischargedOn.toISOString();
                    }
                }

                function loadMasterLookup() {
                    commonLookupService.findUsers({ maxResultCount: 100 }).then(function (result) {
                        var options = result.data.items;
                        ctrl.stafIncharge = options.map(function (option) {
                            return {
                                id: parseInt(option.value),
                                description: option.name
                            }
                        });
                    });
                }

            }
        ],
        templateUrl: '~/App/tenant/views/admissions/admission-detail/components/generaldischargeview.cshtml'
    });
})(_);