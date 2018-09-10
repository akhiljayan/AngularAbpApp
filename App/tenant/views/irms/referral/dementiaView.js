(function () {
    appModule.controller('tenant.views.irms.dementiaView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.dementiaList = {
                "diagnoseDoctorName": "-",
                "diagnoseDoctorDesignation": "-",
                "diagnoseDoctorSpecilization": "-",
                "dementiaFollowUp": "-",
                "drName": "-",
                "drDesignation": "-",
                "drInstitution": "-",
                "hospital": "-",
                "tcuDate": "-",
                "additionalRemarks": "-"
            };

            vm.dementiaTypeList = [];
            vm.dementiaCognitiveBehaviourList = [];
            vm.dementiaActivityDisturbanceList = [];
            vm.dementiaAggressivenessList = [];
            vm.dementiaAffectiveDisturbanceList = [];

            parent.vm.setDementiaNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Dementia', displayName: app.localize('Dementia'), permission: true },
                    { key: 'DementiaType', displayName: app.localize('DementiaType'), permission: true },
                    { key: 'CognitiveBehaviour', displayName: app.localize('CognitiveBehaviour'), permission: true },
                    { key: 'ActivityDisturbance', displayName: app.localize('ActivityDisturbance'), permission: true },
                    { key: 'Aggressiveness', displayName: app.localize('Aggressiveness'), permission: true },
                    { key: 'AffectiveDisturbance', displayName: app.localize('AffectiveDisturbance'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.dementiaList &&
                    vm.referral.dementiaList.length > 0) {
                    vm.dementiaList = vm.referral.dementiaList[0];
                }
                
                vm.dementiaTypeList = vm.referral.dementiaTypeList;
                vm.dementiaCognitiveBehaviourList = vm.referral.dementiaCognitiveBehaviourList;
                vm.dementiaActivityDisturbanceList = vm.referral.dementiaActivityDisturbanceList;
                vm.dementiaAggressivenessList = vm.referral.dementiaAggressivenessList;
                vm.dementiaAffectiveDisturbanceList = vm.referral.dementiaAffectiveDisturbanceList;

                vm.loading = false;
            });

            vm.init = function () {
                parent.vm.setDementiaNavigation();
            };

            vm.init();
        }
    ]);
})();