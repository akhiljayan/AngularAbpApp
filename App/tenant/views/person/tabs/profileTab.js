(function () {
    appModule.controller('tenant.views.person.tabs.profileTab', [
        '$scope', '$stateParams', '$location','stateNavigation',
        function ($scope, $stateParams, $location, stateNavigation) {
            var profileTab = this;
            var parent = $scope.$parent;
            profileTab.mode = $scope.profileTab.mode;
            var personTabs = {};
            var hash = $location.hash();

            parent.vm.setProfileNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Allergies', displayName: 'Allergies', permission: abp.auth.hasPermission('Pages.Tenant.Allergies') },
                    { key: 'medicalhistory', displayName: 'Medical History', permission: abp.auth.hasPermission('Pages.Tenant.MedicalHistory') },
                    { key: 'medicationhistory', displayName: 'Medication History', permission: abp.auth.hasPermission('Pages.Tenant.MedicationHistory') }
                ];
            }

            if (hash) {
                var hashs = hash.split('#');
                var hashArray = hashs[0].split('+');
                var tabName = hashArray[0]
                var prefix = "tab_";
                var tab = tabName.replace(prefix, "");
                if (tab == 'Profile') {
                    parent.vm.setProfileNavigation();
                }
            }

            
        }
    ]);
})();