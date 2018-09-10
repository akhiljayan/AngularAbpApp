(function () {
    appModule.component('admissionNew', {
        controller: [
            '$rootScope', '$state', '$filter', '$stateParams', 'abp.services.app.admission', 'abp.services.app.referral',
            function ($rootScope, $state, $filter, $stateParams, admissionService, referralService) {
                var ctrl = this;
                ctrl.$onInit = function () {
                    ctrl.admission = {};
                    ctrl.discharge = {};
                    ctrl.referralServiceType = {};
                    ctrl.referralServiceTypeId = $stateParams.id;
                    ctrl.dischargeFlag = false;
                    ctrl.defaults();
                };

                ctrl.defaults = function () {
                    abp.ui.setBusy();
                    referralService.getReferralServiceType(ctrl.referralServiceTypeId).then(function (result) {
                        ctrl.referralServiceType = result.data;
                        ctrl.person = ctrl.referralServiceType.referral.person.fullName;
                        ctrl.dischargeFlag = false;
                        ctrl.validateDateValue(result.data.referralStatusLogs);
                        admissionService.getAdmissionModel({
                            tenantId: abp.session.tenantId,
                            referralServiceTypeId: ctrl.referralServiceTypeId
                        }).then(function (result) {
                            ctrl.admission = result.data;
                            ctrl.admission.admittedOn = null;
                            ctrl.admission.lengthOfStay = 0;
                        }).finally(function () {
                            abp.ui.clearBusy();
                        });
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

                ctrl.createAdmission = function (event) {
                    abp.ui.setBusy();
                    referralService.updateReferralServiceType(ctrl.referralServiceType).then(function (result) {
                        admissionService.create(
                            event.admission
                        ).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));                            
                            //$state.go('tenant.admissionEdit', { id: result.data.id, action: 'admitted', close:'person' });
                            $state.go('tenant.personDetail', { id: result.data.personId, action: 'admitted', close: 'person' });
                            event.success && event.success();
                        }).finally(function () {
                            abp.ui.clearBusy();
                        });
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/admissions/admission-new/admission-new.cshtml'
    });
})();