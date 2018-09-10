(function () {
    appModule.controller('tenant.views.irms.referralView', [
        '$scope', '$timeout', '$stateParams', '$location', '$anchorScroll', '$uibModal', 'abp.services.app.iRMSReferral', 'abp.services.app.iRMSReferralConversion',
        function ($scope, $timeout, $stateParams, $location, $anchorScroll, $uibModal, referralService, referralConversionService) {
            var vm = this;
            $anchorScroll.yOffset = 100;

            $scope.referralViewEnabled = true;
            $scope.serviceViewEnabled = false;
            $scope.aicHomeReferralViewEnabled = false;
            $scope.rafViewEnabled = false;
            $scope.socialViewEnabled = false;
            $scope.medicalViewEnabled = false;
            $scope.nursingFunctionalViewEnabled = false;
            $scope.op_pt_st_ViewEnabled = false;
            $scope.dementiaViewEnabled = false;
            $scope.healthViewEnabled = false;
            $scope.homeHelpOthersViewEnabled = false;
            $scope.attachmentViewEnabled = false;

            vm.loading = false;
            vm.referralName = "";
            vm.referralIdentity = "";

            vm.duplicationCheck = "";

            //Navigation to cards
            vm.gotoAnchor = function (key) {
                var offset = 260;
                $location.hash(key);
                $anchorScroll.yOffset = offset;
                $anchorScroll();
            };

            //Load page and data
            vm.load = function () {

                if ($stateParams.id && $stateParams.serviceType) {
                    vm.loading = true;
                    vm.getIRMSReferralByRegNo();
                } else {
                    $location.path('/tenant/irms');
                }
            };

            //Init method
            vm.init = function () {
                vm.permissions = {
                    view: abp.auth.hasPermission('Pages.Tenant.IRMSReferral.View'),
                    convertReferral: abp.auth.hasPermission('Pages.Tenant.IRMSReferral.ConvertReferral')
                };
                vm.load();
            };

            vm.getIRMSReferralByRegNo = function () {
                vm.loading = true;
                referralService.getIRMSReferralByRegNo({
                    referralRegNo: decodeURIComponent($stateParams.id),
                    serviceTypeCode: $stateParams.serviceType
                })
                .then(function (result) {
                    vm.referral = result.data;

                    if (vm.referral.bioDataInfoList.length > 0) {
                        vm.referralName = vm.referral.bioDataInfoList[0].patientName;
                        vm.referralIdentity = vm.referral.bioDataInfoList[0].patientNRIC;
                    }

                    $scope.$broadcast('irmsReferralReadyState', vm.referral);
                })
                .finally(function () {
                    vm.loading = false;
                });
            };

            vm.refreshReferral = function () {
                vm.loading = true;
                referralService.refreshIRMSReferralByRegNo(decodeURIComponent($stateParams.id))
                    .then(function (result) {
                        abp.message.success(app.localize('SuccessfulReferralConversionRefresh'));

                        // Wait for 3 seconds before refreshing the page
                        setTimeout(function () {
                            window.location.reload();
                        }, 3000);

                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.requestReferralReport = function () {

                var reportWindow = window.open();

                referralService.getIRMSReferralReportByRegNo(decodeURIComponent($stateParams.id))
                    .then(function (result) {
                        var url = result.data;
                        reportWindow.location = url;
                        reportWindow.target = '_blank';
                        reportWindow.focus();
                    });
            };

            vm.convertReferral = function () {

                abp.message.confirm("", app.localize('ConversionConfirmation'),
                    function (isConversionConfirmed) {

                        if (isConversionConfirmed) {

                            vm.loading = true;
                            referralConversionService.convertIRMSReferral({
                                referralRegNo: decodeURIComponent($stateParams.id),
                                serviceTypeCode: $stateParams.serviceType
                            }).then(function (result) {

                                var isSuccess = result.data.isSuccess;

                                if (isSuccess) {

                                    abp.message.confirm("", result.data.message,
                                        function (isConfirmed) {

                                            if (isConfirmed) {

                                                $scope.$apply(function () {
                                                    $location.path("/tenant/referral/" + result.data.referralId);
                                                });
                                            }
                                        });

                                } else {
                                    vm.duplicationCheck = result.data.result;
                                    vm.openPersonModal(decodeURIComponent($stateParams.id));
                                }

                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    });
            };

            vm.openPersonModal = function (referralRegNo) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/irms/referral/validation/personCheck.cshtml',
                    controller: 'tenant.views.irms.personCheck as vm',
                    backdrop: 'static',
                    resolve: {
                        referralRegNo: function () {
                            return decodeURIComponent($stateParams.id);
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    if (vm.duplicationCheck.indexOf("familyMember") !== -1) {
                        vm.openFamilyMemberModal(decodeURIComponent($stateParams.id));
                    } else {
                        if (vm.duplicationCheck.indexOf("languageDialect") !== -1) {
                            vm.openLanguageDialectModal(decodeURIComponent($stateParams.id));
                        } else {
                            abp.message.success(app.localize('SuccessfulReferralConversionUpdate'));
                        }
                    }
                });
            };

            vm.openFamilyMemberModal = function (referralRegNo) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/irms/referral/validation/familyMemberCheck.cshtml',
                    controller: 'tenant.views.irms.familyMemberCheck as vm',
                    backdrop: 'static',
                    resolve: {
                        referralRegNo: function () {
                            return decodeURIComponent($stateParams.id);
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    if (vm.duplicationCheck.indexOf("languageDialect") !== -1) {
                        vm.openLanguageDialectModal(decodeURIComponent($stateParams.id));
                    } else {
                        abp.message.success(app.localize('SuccessfulReferralConversionUpdate'));
                    }
                });
            };

            vm.openLanguageDialectModal = function (referralRegNo) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/irms/referral/validation/languageDialectCheck.cshtml',
                    controller: 'tenant.views.irms.languageDialectCheck as vm',
                    backdrop: 'static',
                    resolve: {
                        referralRegNo: function () {
                            return decodeURIComponent($stateParams.id);
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    // Do nothing
                    abp.message.success(app.localize('SuccessfulReferralConversionUpdate'));
                });
            };

            vm.init();

            $scope.$watch('$viewContentLoaded', bindJqueryEvents);

            function bindJqueryEvents() {
                $timeout(function () {}, 0);
            }
        }
    ]);
})();