(function () {
    appModule.controller('tenant.views.irms.medicalView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.medicalReportList = {};
            vm.secondaryDiagnosisList = [];
            vm.otherSecondaryDiagnosisList = [];
            vm.infectiousDiseaseList = [];
            vm.otherInfectiousDiseaseList = [];
            vm.precautionRequiredList = {};
            vm.procedureDescriptionList = {};
            vm.drugAllergyList = [];
            vm.currentMedicationList = [];
            vm.alertList = [];
            vm.mrForCHService = {};
            vm.mrForHospiceService = {};

            parent.vm.setMedicalNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'PrimaryDiagnosis', displayName: app.localize('PrimaryDiagnosis'), permission: true },
                    { key: 'SecondaryDiagnosis', displayName: app.localize('SecondaryDiagnosis'), permission: true },
                    { key: 'OtherSecondaryDiagnosis', displayName: app.localize('OtherSecondaryDiagnosis'), permission: true },
                    { key: 'Disease', displayName: app.localize('Disease'), permission: true },
                    { key: 'PrecautionRequired', displayName: app.localize('PrecautionRequired'), permission: true },
                    { key: 'MedicalReportForCommunityHospitalService', displayName: app.localize('MedicalReportForCommunityHospitalService'), permission: true },
                    { key: 'MedicalReportForHospiceService', displayName: app.localize('MedicalReportForHospiceService'), permission: true },
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.medicalReportList &&
                    vm.referral.medicalReportList.length > 0) {
                    vm.medicalReportList = vm.referral.medicalReportList[0];
                }

                vm.secondaryDiagnosisList = vm.referral.secondaryDiagnosisList;
                vm.otherSecondaryDiagnosisList = vm.referral.otherSecondaryDiagnosisList;
                vm.infectiousDiseaseList = vm.referral.infectiousDiseaseList;
                vm.otherInfectiousDiseaseList = vm.referral.otherInfectiousDiseaseList;

                if (vm.referral.precautionRequiredList &&
                    vm.referral.precautionRequiredList.length > 0) {
                    vm.precautionRequiredList = vm.referral.precautionRequiredList[0];
                }

                if (vm.referral.procedureDescriptionList &&
                    vm.referral.procedureDescriptionList.length > 0) {
                    vm.procedureDescriptionList = vm.referral.procedureDescriptionList[0];
                }

                vm.drugAllergyList = vm.referral.drugAllergyList;
                vm.currentMedicationList = vm.referral.currentMedicationList;
                vm.alertList = vm.referral.alertList;

                if (vm.referral.mrForCHService &&
                    vm.referral.mrForCHService.length > 0) {
                    vm.mrForCHService = vm.referral.mrForCHService[0];
                }

                if (vm.referral.mrForHospiceService &&
                    vm.referral.mrForHospiceService.length > 0) {
                    vm.mrForHospiceService = vm.referral.mrForHospiceService[0];
                }

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setMedicalNavigation();
            };

            vm.init();
        }
    ]);
})();