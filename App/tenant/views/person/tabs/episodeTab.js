(function () {
    appModule.controller('tenant.views.person.tabs.episodeTab', [
        '$scope', '$stateParams', '$location', 'stateNavigation',
        function ($scope, $stateParams, $location, stateNavigation) {
            var episodeTab = this;
            var parent = $scope.$parent;
            episodeTab.mode = $scope.episodeTab.mode;
            var personTabs = {};
            var hash = $location.hash();

            parent.vm.setEpisodeNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Episode', displayName: 'Episode', permission: true },
                ];
            }

            if (hash) {
                var hashs = hash.split('#');
                var hashArray = hashs[0].split('+');
                var tabName = hashArray[0]
                var prefix = "tab_";
                var tab = tabName.replace(prefix, "");
                if (tab == 'Episode') {
                    parent.vm.setEpisodeNavigation();
                }
            }


        }
    ]);
})();