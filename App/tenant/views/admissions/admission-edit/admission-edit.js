(function () {
    appModule.component('admissionEdit', {
        controller: [
            '$state', '$filter', '$stateParams', 'abp.services.app.admission', 'abp.services.app.referral',
            function ($state, $filter, $stateParams, admissionService, referralService) {
                var ctrl = this;
                ctrl.disableActions = true;
                ctrl.$onInit = function () {
                    ctrl.referralServiceType = {};
                    ctrl.person = {};
                    ctrl.admission = {
                        id: $stateParams.id
                    };
                    if ($stateParams.action == 'discharged') {
                        ctrl.dischargeFlag = true;
                    } else {
                        ctrl.dischargeFlag = false;
                    }
                    ctrl.load($stateParams.id);
                };

                ctrl.load = function (admissionid) {
                    if (!admissionid) {
                        return;
                    }
                    ctrl.disableActions = true;
                    abp.ui.setBusy();
                    if ($stateParams.action == 'discharged' || ctrl.dischargeFlag) {
                        getDischargedObj(admissionid);
                    }
                    //else {
                    //    getEmptyDischargedObj(admissionid);
                    //}
                    admissionService.get(admissionid).then(function (result) {
                        ctrl.admission = result.data;
                        loadRegerralServiceType(admissionid);
                    }).finally(function () {
                        abp.ui.clearBusy();
                        ctrl.disableActions = false;
                    });
                };

                function loadRegerralServiceType(admissionid) {
                    referralService.getReferralServiceType(ctrl.admission.referralServiceTypeId).then(function (result) {
                        ctrl.referralServiceType = result.data;
                        ctrl.person = ctrl.referralServiceType.referral.person.fullName;
                        ctrl.validateDateValue(result.data.referralStatusLogs);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };


                function getDischargedObj(admissionid) {
                    admissionService.getDischargeByAdmission(admissionid).then(function (result) {
                        ctrl.discharge = result.data;
                    });
                };

                //function getEmptyDischargedObj(admissionid) {
                //    admissionService.getDischarge(app.consts.EmptyGuid).then(function (result) {
                //        ctrl.discharge = result.data;
                //        ctrl.discharge.staffInChargeId = abp.session.userId;
                //        ctrl.discharge.admissionId = ctrl.admission.id;
                //        ctrl.discharge.personId = ctrl.admission.personId;
                //        ctrl.discharge.dischargedOn = null;
                //        abp.ui.clearBusy();
                //        window.scrollTo(0, document.body.scrollHeight);
                //    }).finally(function () {
                //        ctrl.loading = false;
                //        abp.ui.clearBusy();
                //        window.scrollTo(0, document.body.scrollHeight);
                //    });
                //};


                ctrl.updateAdmission = function (event) {
                    abp.ui.setBusy();
                    ctrl.dischargeFlag = event.dischargeFlag;
                    referralService.updateReferralServiceType(ctrl.referralServiceType).then(function (result) {
                        if (event.dischargeFlag) {
                            ctrl.updateForDischarge(event);
                        } else {
                            ctrl.admissionUpdate(event);
                        }
                    });
                };


                ctrl.updateForDischarge = function (event) {
                    var admissionDischargeDto = {
                        admissionDto: event.admission,
                        dischargeDto: event.discharge
                    };
                    admissionService.updateAdmissionCreateOrUpdateDischarge(
                        admissionDischargeDto
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();
                        ctrl.load(ctrl.admission.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.admissionUpdate = function (event) {
                    admissionService.update(
                        event.admission
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();
                        ctrl.load(ctrl.admission.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.validateDateValue = function (logs) {
                    var log = $filter('filter')(logs, function (m) { return m.status === 1; })[0];
                    if (!log) {
                        ctrl.minAdmitedOnDate = ctrl.referralServiceType.referral.referralDate;
                    } else {
                        ctrl.minAdmitedOnDate = log.statusDate;
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/admissions/admission-edit/admission-edit.cshtml'
    });
})();