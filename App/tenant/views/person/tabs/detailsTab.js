(function () {
    appModule.controller('tenant.views.person.tabs.detailsTab', [
        '$scope', '$stateParams', '$location', 'stateNavigation',
        function ($scope, $stateParams, $location, stateNavigation) {
            var detailsTab = this;
            var parent = $scope.$parent;
            detailsTab.mode = $scope.detailsTab.mode;
            var personTabs = {};
            var hash = $location.hash();

            parent.vm.setPersonDetailsNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'BioData', displayName: 'Bio Data', permission: true },
                    { key: 'ContactInformation', displayName: 'Contact Information', permission: true },
                    { key: 'OtherInformation', displayName: 'Other Information', permission: true },
                    { key: 'LanguageDialect', displayName: 'Language Dialect', permission: abp.auth.hasPermission('Pages.Tenant.LanguageDialects') },
                    { key: 'MeansTesting', displayName: 'Means Testing', permission: abp.auth.hasPermission('Pages.Tenant.MeansTests') },
                    { key: 'FinancialAssistance', displayName: 'Financial Assistance', permission: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances') },
                    { key: 'FamilyMembersCaregiver', displayName: 'Family Members Caregiver', permission: true },
                    { key: 'Social', displayName: 'Social', permission: true },
                    { key: 'Genogram', displayName: 'Genogram', permission: (abp.auth.hasPermission('Pages.Tenant.Genogram')) },
                    { key: 'SocialReports', displayName: 'Social Reports', permission: abp.auth.hasPermission('Pages.Tenant.SocialReports') },
                    { key: 'LifeEvent', displayName: 'Life Event', permission: true },
                    { key: 'HashSymbolTags', displayName: '# Tags', permission: true },
                    { key: 'Membership', displayName: 'Membership', permission: true },
                ];
            }

            if (hash) {
                var hashs = hash.split('#');
                var hashArray = hashs[0].split('+');
                var tabName = hashArray[0]
                var prefix = "tab_";
                var tab = tabName.replace(prefix, "");
                if (tab == 'PersonDetails') {
                    parent.vm.setPersonDetailsNavigation();
                }
            }

        }
    ]);
})();