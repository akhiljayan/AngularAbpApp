(function () {
    appModule.controller('tenant.views.person.tabs.encounterTab', [
        '$scope', '$stateParams', '$location','stateNavigation',
        function ($scope, $stateParams, $location, stateNavigation) {
            var encounterTab = this;
            var parent = $scope.$parent;
            encounterTab.mode = $scope.encounterTab.mode;
            var personTabs = {};
            var hash = $location.hash();

            

            parent.vm.setEncounterNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'VisitLogs', displayName: 'Visit Logs', permission: abp.auth.hasPermission('Pages.Tenant.VisitLogs') },
                    { key: 'Hospitalization', displayName: 'Hospitalization', permission: abp.auth.hasPermission('Pages.Tenant.Hospitalization') },
                    { key: 'MedicalAppointment', displayName: 'Medical Appointment', permission: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment') }                    
                ];
            }
            

            if (hash) {
                var hashs = hash.split('#');
                var hashArray = hashs[0].split('+');
                var tabName = hashArray[0]
                var prefix = "tab_";
                var tab = tabName.replace(prefix, "");
                if (tab == 'Encounter') {
                    parent.vm.setEncounterNavigation();
                }
            }


        }
    ]);
})();