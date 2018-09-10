(function () {
    appModule.controller('tenant.views.referral.referralRequiredFieldsForAdmit', [
        '$scope', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'referralValidationObj', 'abp.services.app.referral', 'abp.services.app.serviceType',
        function ($scope, $timeout, $uibModal, $uibModalInstance, masterLookup, referralValidationObj, appReferralService, serviceType) {
            var vm = this;
            vm.saving = false;
            vm.referral = referralValidationObj;
            vm.referedByOthers = false;
            vm.referredByDesc = '';
            vm.requiredFields = [];

            angular.forEach(referralValidationObj, function (value, key) {
                if (value == null) {
                    vm.requiredFields.push(key);
                }
            });


            if (vm.referral.dateOfBirth && vm.referral.genderId && vm.referral.nationalityId && vm.referral.raceId && vm.referral.religionId) {
                vm.biodata = false;
            } else {
                vm.biodata = true;
            }

            if (vm.referral.postalCode && vm.referral.highestEducationId && vm.referral.lastOccupationId && (vm.referral.homePhone || vm.referral.mobilePhone)) {
                vm.contact = false;
            } else {
                vm.contact = true;
            }


            if (vm.referral.referredById) {
                vm.referralInfoHead = false;
            } else {
                vm.referralInfoHead = true;
            }

            if (vm.referral.referredById) {
                if (vm.referral.referralServiceType.referral.referredBy.description == 'AIC' && vm.requiredFields.indexOf('aicReferralServiceType') != '-1') {
                    if (vm.referral.aicReferralServiceType != null && vm.referral.aicAssignmentDate != null) {
                        vm.referralSTHead = false;
                    } else {
                        vm.referralSTHead = true;
                    }
                } else {
                    if (vm.referral.referringInstitutionId) {
                        vm.referralSTHead = false;
                    } else {
                        vm.referralSTHead = true;
                    }
                }
            } else {
                if (vm.referral.referringInstitutionId) {
                    vm.referralSTHead = false;
                } else {
                    vm.referralSTHead = true;
                }
            }



            vm.save = function () {
                vm.saving = true;
                appReferralService.saveRequiredReferralFieldsForAdmission(vm.referral).then(function (result) {
                    if (result.data) {
                        abp.notify.info(app.localize('Saved Successfully.. Redirecting to Admission Form'));
                        $scope.$emit('UpdateReferralStatus', vm.referral.referralServiceType.referral.id);
                        $uibModalInstance.close();
                        vm.saving = false;
                        //swal("Validated all fields.. Admission form will be shown (Under construction)");
                        var action = 'create';
                        //$state.go('tenant.admissionDetailNew', { action: 'create', referralId: referralServieType.referralId, id: referralServieType.id });
                        var path = '#!/tenant/admission/new/' + action + '/' + vm.referral.referralServiceType.referral.id + '/' + vm.referral.referralServiceType.id;
                        window.location.assign(path);
                    } else {
                        abp.notify.error("Some error occured while saving...");
                    }
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.referredByChange = function (text, referral) {
                vm.referredByDesc = text;
                if (text == 'Others') {
                    vm.referredByOthers = true;
                } else {
                    vm.referredByOthers = false;
                    referral.otherReferred = '';
                }
            };


            function init() {

                serviceType.getActiveServiceTypes().then(function (result) {
                    vm.serviceTypes = result.data;
                    vm.ServiceTypeMasterLookUp = result.data;
                });
                vm.disableSave = false;
            }

            init();


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

            //watch onload jquery
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            //binding jquery functions
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                        var requiredHtml = '<span class="businessRequired"> * </span>';
                        var required = $(".attach-lable-required").find("label").append(requiredHtml);
                    });
                }, 0);
            }

        }
    ]);
})();