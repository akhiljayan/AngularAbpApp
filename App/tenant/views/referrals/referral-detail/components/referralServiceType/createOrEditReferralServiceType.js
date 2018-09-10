(function () {
    appModule.controller('tenant.views.referrals.createOrEditReferralServiceType', [
        '$rootScope', '$scope', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'referralServiceTypeId', 'action', 'referral', 'status', 'abp.services.app.referral', 'abp.services.app.serviceType',
        function ($rootScope, $scope, $timeout, $uibModal, $uibModalInstance, masterLookup, referralServiceTypeId, action, referral, status, appReferralService, serviceType) {
            var vm = this;
            vm.stStatus = app.consts.referralServiceTypeStatus;
            vm.saving = false;
            vm.serviceTypes = [];
            vm.referralServiceType = [];
            vm.action = action;
            vm.person = referral.person;
            vm.referral = referral;
            vm.status = status;


            if (status != vm.stStatus.Admitted && status != vm.stStatus.Rejected && status != vm.stStatus.Withdrawn && status != vm.stStatus.Discharged) {
                vm.dissableEdit = false;
            } else {
                vm.dissableEdit = false;
            }

            vm.save = function () {
                vm.saving = true;
                if ($rootScope.isEmptyGuid(referralServiceTypeId)) {
                    appReferralService.addReferralServiceType(vm.referralServiceType).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                        $scope.$parent.updateReferralStatus(referral.id);
                    });
                }
                else {
                    appReferralService.updateReferralServiceType(vm.referralServiceType).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                        $scope.$parent.updateReferralStatus(referral.id);
                    });
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Referral.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Referral.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Referral.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Referral.Delete'),
                };

                appReferralService.getReferralServiceType(referralServiceTypeId).then(function (result) {
                    vm.referralServiceType = result.data;
                    vm.referralServiceType.referralId = referral.id;
                    vm.referralServiceType.referralCode = referral.referralCode;
                  
                    if ($rootScope.isEmptyGuid(referralServiceTypeId)) {
                        vm.referralServiceType.serviceTypeId = '';
                    }
                });

                serviceType.getActiveServiceTypes().then(function (result) {
                    vm.ServiceTypeMasterLookUp = result.data;
                });

                serviceType.getServiceTypesInUserOU().then(function (result) {
                    vm.serviceTypes = result.data;
                });

                vm.disableSave = false;

                if (action == 'View' || (action == 'Edit' && !vm.permissions.edit) || (action == 'create' && !vm.permissions.create))
                    vm.disableSave = true;
            }

            vm.checkIfDisabled = function (flag, event) {
                if (flag == true) {
                    alert("check");
                    event.stopPropagation();
                }
            };

            //lookups
            vm.institutions = [];
            vm.iltcEpisodeServiceType = [];
            masterLookup.getMasterTypeItems({
                type: 'Referral Source Institution'
            }).then(function (result) {
                vm.institutions = result.data;
            });

            masterLookup.getMasterTypeItems({
                type: 'ILTC Episode Service Type'
            }).then(function (result) {
                vm.iltcEpisodeServiceType = result.data;
            });

            vm.init();
        }
    ]);
})();