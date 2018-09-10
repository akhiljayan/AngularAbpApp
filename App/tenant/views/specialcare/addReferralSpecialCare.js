(function () {
    appModule.controller('tenant.views.specialcare.addReferralSpecialCare', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'specialcareId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.specialCare', 'abp.services.app.masterLookUp',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, personId, specialcareId, referralId, template, appReferralService, specialCareService, masterLookupService) {
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.specialcareId = specialcareId;
            vm.referralId = referralId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;
            vm.isOthersSelected = false;
            var othersId;

            vm.save = function (specialcare) {
                if (!vm.saving) {
                    vm.saving = true;

                    specialCareService.createReferralSpecialCareList(specialcare).then(function (result) {
                        emitAfterSave();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-SpecialCare');
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.SpecialCare.Edit'),
                };

                vm.disableSave = false;

                masterLookupService.getMasterTypeItems({ type: "Special Care" }).then(function (result) {
                    vm.specialCareItemList = result.data;
                    vm.specialCareItemList.forEach(function (item) {
                        if (item.description.toLowerCase() == "others" || item.description.toLowerCase() == "other") {
                            othersId = item.id;
                        }
                    });
                });

                specialCareService.getReferralSpecialCareList(vm.referralId).then(function (result) {
                    vm.specialCareList = result.data;
                    vm.checkForOthers();
                });
            };

            vm.checkForOthers = function () {
                var existOther = vm.specialCareList.specialCareIdList.indexOf(othersId);
                vm.isOthersSelected = false;
                if (existOther != -1) {
                    vm.isOthersSelected = true;
                }
            }

            init();

            appReferralService.get(referralId).then(function (result) {
                vm.referral = result.data;
                vm.person = vm.referral.person;
            });

        }]);
})();