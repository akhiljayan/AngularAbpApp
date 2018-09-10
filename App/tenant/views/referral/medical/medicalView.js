(function () {
    appModule.controller('tenant.views.referral.medicalView', [
        '$scope', '$stateParams',
        function ($scope, $stateParams) {
            var medical = this;
            var parent = $scope.$parent;
            medical.mode = $scope.medical.mode;

            parent.vm.setMedicalNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'FunctionalStatus', displayName: 'Functional Status' },
                    { key: 'RAF', displayName: 'RAF' },
                    { key: 'Allergies', displayName: 'Allergies' },
                    { key: 'Diagnosis', displayName: 'Diagnosis' },
                    { key: 'medicalhistories', displayName: 'Medical History' },
                    { key: 'medicationhistories', displayName: 'Medication History' },
                    { key: 'specialcares', displayName: 'Special Care' },
                    { key: 'medicalalerts', displayName: 'Medical Alerts' },
                    { key: 'Investigations', displayName: 'Investigations' }
                ];
            }
            
        }
    ]);
})();