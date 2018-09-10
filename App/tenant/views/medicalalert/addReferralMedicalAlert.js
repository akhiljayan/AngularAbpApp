(function () {
    appModule.controller('tenant.views.medicalalert.addReferralMedicalAlert', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'medicalalertId', 'referralId', 'template', 'abp.services.app.referral', 'abp.services.app.medicalAlert', 'abp.services.app.masterLookUp',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, personId, medicalalertId, referralId, template, appReferralService, medicalAlertService, masterLookupService) {
            var vm = this;
            vm.saving = false;
            vm.personId = personId;
            vm.medicalalertId = medicalalertId;
            vm.referralId = referralId;
            vm.editMode = false;
            vm.statusList = app.consts.generalStatus.values;
            vm.isInfectiousDiseaseSelected = false;
            vm.isOthersSelected = false;
            var othersId, infectiousdiseaseId;
            vm.save = function (medicalalert) {
                if (!vm.saving) {
                    vm.saving = true;

                    medicalAlertService.createReferralMedicalAlertList(medicalalert).then(function (result) {
                        emitAfterSave();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.checkOthersAndInfectiousDisease = function () {
                var existOther = vm.medicalalertList.medicalAlertIdList.indexOf(othersId);
                var existInfectiousDisease = vm.medicalalertList.medicalAlertIdList.indexOf(infectiousdiseaseId);
                vm.isInfectiousDiseaseSelected = false;
                vm.isOthersSelected = false;
                if (existOther != -1)
                    vm.isOthersSelected = true;

                if (existInfectiousDisease != -1)
                    vm.isInfectiousDiseaseSelected = true;
            }

            function emitAfterSave() {
                $scope.$emit('Created-Updated-MedicalAlert');
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalAlert.Edit'),
                };

                vm.disableSave = false;

                masterLookupService.getMasterTypeItems({ type: "Medical Alert" }).then(function (result) {
                    vm.medicalAlertItemList = result.data;
                    vm.medicalAlertItemList.forEach(function (item) {
                        if (item.description == "Others") {
                            othersId = item.id;
                        }
                        if (item.description == "Infectious Disease") {
                            infectiousdiseaseId = item.id;
                        }
                       
                    });
                });

                medicalAlertService.getReferralMedicalAlertList(vm.referralId).then(function (result) {
                    vm.medicalalertList = result.data;
                    vm.checkOthersAndInfectiousDisease();
                });

            };

            init();



            appReferralService.get(referralId).then(function (result) {
                vm.referral = result.data;
                vm.person = vm.referral.person;
            });

        }]);
})();