(function () {
    appModule.controller('tenant.views.referral.createReferralStatusLog', [
        '$scope', '$timeout', '$filter', '$uibModal', '$uibModalInstance', '$validator', 'abp.services.app.masterLookUp', 'referralServiceType', 'action', 'referral', 'abp.services.app.referral', 'abp.services.app.user','abp.services.app.commonLookup',
        function ($scope, $timeout, $filter, $uibModal, $uibModalInstance, $validator, masterLookup, referralServiceType, action, referral, appReferralService, userService, commonLookupService) {
            var vm = this;
            vm.saving = false;
            vm.referral = referral;
            vm.action = action;
            vm.actionLabel = (action == 'Withdraw' ? 'Withdrawal' : vm.action);
            vm.attr = '';
            vm.referralST = referralServiceType;
            vm.users = [];

            var dte = new Date(referralServiceType.referral.referralDate);
            dte.setHours(0, 0, 0, 0);
            var referralDate = $filter("dateTimeFormat")(dte);

            var logs = referralServiceType.referralStatusLogs;
            var log = $filter('filter')(logs, function (m) { return m.status === 1; })[0];
            if (typeof log != 'undefined') {
                if (log.statusDate == null || log.statusDate == '' || typeof log.statusDate == 'undefined') {
                    vm.mindate = referralDate;
                } else {
                    vm.mindate = log.statusDate;
                }
            } else {
                vm.mindate = referralDate;
                //referralServiceType.referral.referralDate;
            }

            
           

            if (vm.referral.isReferredByAIC) {
                vm.serviceTypeString = '[' + referralServiceType.serviceType.description + '] ' + '[' + referralServiceType.aicReferralServiceType + '] ' +
                    '[' + moment(referralServiceType.aicAssignmentDate).format($scope.DefaultDateFormat) + ']';
            } else {
                vm.serviceTypeString = referralServiceType.serviceType.description;
            }

            if (vm.action != "Approve") {
                vm.attr = 'ui-select-required something';
            } else {
                vm.attr = '';
            }

            vm.reasonChange = function (reason) {
                if (reason == 'Others') {
                    vm.otherReason = true;
                } else {
                    vm.otherReason = false;
                    vm.statusLog.otherReasonText = '';
                }
            }


            vm.save = function () {
                vm.statusLogForm.validate();
                if (vm.statusLogForm.validate()) {
                    vm.saving = true;
                    if (action == 'Approve') {
                        vm.statusLog.status = app.consts.referralServiceTypeStatus.Approved;
                        ApproveServiceType(vm.statusLog);
                    } else if (action == 'Reject') {
                        vm.statusLog.status = app.consts.referralServiceTypeStatus.Rejected;
                        RejectServiceType(vm.statusLog);
                    } else if (action == 'Withdraw') {
                        vm.statusLog.status = app.consts.referralServiceTypeStatus.Withdrawn;
                        WithdrawServiceType(vm.statusLog);
                    }
                }
            };

            function ApproveServiceType(statusLog) {
                appReferralService.approve(statusLog).then(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                    $scope.$parent.updateReferralStatus(referral.id);
                });
            }

            function RejectServiceType(statusLog) {
                appReferralService.reject(statusLog).then(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                    $scope.$parent.updateReferralStatus(referral.id);
                });
            }

            function WithdrawServiceType(statusLog) {
                appReferralService.withdraw(statusLog).then(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                    $scope.$parent.updateReferralStatus(referral.id);
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.init = function() {
                vm.loading = true;
                appReferralService.getReferralStatusLogObj().then(function (result) {
                    vm.statusLog = result.data;
                    vm.statusLog.referralServiceTypeId = referralServiceType.id;
                    if (!vm.statusLog.status)
                        vm.statusLog.statusDate = null;
                });
                getSTCreatedUser();
                vm.disableSave = false;
                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create)) {
                    vm.disableSave = true;
                }
            }

            $uibModalInstance.rendered.then(function () {
            });

            function getSTCreatedUser() {
                userService.getUsersNameById(referralServiceType.creatorUserId).then(function (result) {
                    vm.creatoruser = result.data;
                });
            }

            //watch onload jquery
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            //binding jquery functions
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                        var reasonLabel = $filter('enumText')(vm.action, 'referralServiceTypeLabel') + " " + abp.localization.localize("Reason");
                        var label = $(".reason-tab").find("label").html(reasonLabel);
                        var requiredHtml = '<span class="businessRequired"> * </span>';
                        var required = $(".attach-lable-required").find("label").append(requiredHtml);
                    });
                }, 0);
            }


            vm.validationOptions = {
                rules: {
                },
            };


            getMasterLookupReasons(action);
       
            vm.init();

            //lookups
            function getMasterLookupReasons(act) {
                var typeName = '';
                if (act == 'Approve') {
                    typeName = 'Approved Reason';
                } else if (act == 'Reject') {
                    typeName = 'Rejected Reason';
                } else if (act == 'Withdraw') {
                    typeName = 'Withdrawn Reason';
                }

                masterLookup.getMasterTypeItems({
                    type: typeName
                }).then(function (result) {
                    vm.reasons = result.data;
                });

            }

        }
    ]);
})();