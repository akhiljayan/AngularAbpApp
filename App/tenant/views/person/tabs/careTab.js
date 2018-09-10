(function () {
    appModule.controller('tenant.views.person.tabs.careTab', [
        '$scope', '$stateParams', '$location', 'stateNavigation',
        function ($scope, $stateParams, $location, stateNavigation) {
            var careTab = this;
            var parent = $scope.$parent;
            careTab.mode = $scope.careTab.mode;
            var personTabs = {};
            var hash = $location.hash();

            parent.vm.setCareNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'OwnNotes', displayName: 'Own Notes', permission: true },
                    { key: 'SharedNotes', displayName: 'Shared Notes', permission: true },
                    { key: 'PersonProblems', displayName: 'Problem List / Care Plan', permission: (abp.auth.hasPermission('Pages.Tenant.PersonProblems') || abp.auth.hasPermission('Pages.Tenant.CarePlans')) },
                    { key: 'ProgressNote', displayName: 'Progress Note', permission: abp.auth.hasPermission('Pages.Tenant.ProgressNotes') }
                ];
            }

            if (hash) {
                var hashs = hash.split('#');
                var hashArray = hashs[0].split('+');
                var tabName = hashArray[0]
                var prefix = "tab_";
                var tab = tabName.replace(prefix, "");
                if (tab == 'Care') {
                    parent.vm.setCareNavigation();
                }
            }


            careTab.init = function () {
                parent.vm.setCareNavigation();
            }

            //careTab.init();

        }
    ]);
})();