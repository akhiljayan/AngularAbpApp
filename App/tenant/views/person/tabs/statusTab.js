(function () {
    appModule.controller('tenant.views.person.tabs.statusTab', [
        '$scope', '$stateParams', '$location',
        function ($scope, $stateParams, $location) {
            var statusTab = this;
            var parent = $scope.$parent;
            statusTab.mode = $scope.statusTab.mode;
            var hash = $location.hash();


            parent.vm.setStatusNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Allergies', displayName: 'Allergies', permission: abp.auth.hasPermission('Pages.Tenant.Allergies') },
                    { key: 'Prescription', displayName: 'Prescription', permission: abp.auth.hasPermission('Pages.Tenant.Prescriptions') },
                    { key: 'immunization', displayName: 'Immunization', permission: abp.auth.hasPermission('Pages.Tenant.Immunization.View') },
                    { key: 'Investigations', displayName: 'Investigations', permission: abp.auth.hasPermission('Pages.Tenant.Investigations') },
                    { key: 'Diagnosis', displayName: 'Diagnosis', permission: abp.auth.hasPermission('Pages.Tenant.Diagnosis') },
                    { key: 'Raisoft', displayName: 'Assessment - interRAI', permission: abp.auth.hasPermission('Pages.Tenant.Raisoft') },
                    { key: 'Assessment', displayName: 'Assessment', permission: abp.auth.hasPermission('Pages.Tenant.Assessment') },
                    { key: 'medicalhistories', displayName: 'Medical History', permission: abp.auth.hasPermission('Pages.Tenant.MedicalHistory') },
                    { key: 'specialcares', displayName: 'Special Cares', permission: abp.auth.hasPermission('Pages.Tenant.SpecialCare') },
                    { key: 'VitalSign', displayName: 'Vital Sign', permission: abp.auth.hasPermission('Pages.Tenant.VitalSign') },
                    { key: 'MedicalAlert', displayName: 'Medical Alert', permission: abp.auth.hasPermission('Pages.Tenant.MedicalAlert') },
                    { key: 'timeline', displayName: 'Timeline', permission: true }
                ];
            }

            if (hash) {
                var hashs = hash.split('#');
                var hashArray = hashs[0].split('+');
                var tabName = hashArray[0]
                var prefix = "tab_";
                var tab = tabName.replace(prefix, "");
                if (tab == 'Status') {
                    parent.vm.setStatusNavigation();
                }
            }

        }
    ]);
})();