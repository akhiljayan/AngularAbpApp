(function () {
    appModule.controller('tenant.views.irms.aicHomeReferralView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.aicHomeReferralList = {
                "isHeartFailure": "-",
                "isHeartFailureNYHA": "-",
                "isHeartFailureOthers": "-",
                "isRespiratory": "-",
                "isRespiratoryDyspnoea": "-",
                "isRespiratoryRepeated": "-",
                "isRespiratoryHypoxaemia": "-",
                "isRespiratoryCOPD": "-",
                "isRenalFailure": "-",
                "isRenalGFR": "-",
                "isRenalDialysisReason": "-",
                "isLiverFailure": "-",
                "isLiverINR": "-",
                "isLiverSerum": "-",
                "isLiverOthers": "-",
                "diagnosis": "-",
                "presentCondition": "-",
                "isAwareDiagnosis": "-",
                "isFamilyAwareDiagnosis": "-",
                "isAwarePrognosis": "-",
                "isFamilyAwarePrognosis": "-",
                "addendumRemarks": "-",
            };

            vm.heartFailureReasonList = {
                "heartFailureReason": "-",
            };

            vm.liverFailureReasonList = {
                "liverFailureReason": "-",
            };

            parent.vm.setHomeReferralNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'HeartFailureCondition', displayName: app.localize('HeartFailureCondition'), permission: true },
                    { key: 'RespiratoryFailureCondition', displayName: app.localize('RespiratoryFailureCondition'), permission: true },
                    { key: 'RenalFailureCondition', displayName: app.localize('RenalFailureCondition'), permission: true },
                    { key: 'LiverFailureCondition', displayName: app.localize('LiverFailureCondition'), permission: true },
                    { key: 'DiagnosisPrognosis', displayName: app.localize('DiagnosisPrognosis'), permission: true },
                    { key: 'Remarks', displayName: app.localize('Remarks'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.aicHomeReferralList &&
                    vm.referral.aicHomeReferralList.length > 0) {
                    vm.aicHomeReferralList = vm.referral.aicHomeReferralList[0];
                }

                if (vm.referral.heartFailureReasonList &&
                    vm.referral.heartFailureReasonList.length > 0) {
                    vm.heartFailureReasonList = vm.referral.heartFailureReasonList[0];
                }

                if (vm.referral.liverFailureReasonList &&
                    vm.referral.liverFailureReasonList.length > 0) {
                    vm.liverFailureReasonList = vm.referral.liverFailureReasonList[0];
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setHomeReferralNavigation();
            };

            vm.init();
        }
    ]);
})();