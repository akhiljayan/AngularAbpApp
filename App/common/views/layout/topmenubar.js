(function () {
    appModule.controller('common.views.layout.topmenubar', [
        '$scope', '$state',
        function ($scope, $state) {
            var vm = this;
            vm.menuItems = [];
            vm.searchfilter = '';
            vm.maxlist = false;
            vm.seplist = false;

            vm.maxCount = 10;

            vm.maxHeading = '';
            vm.sepHeading = '';
            vm.maxListItems = [];
            vm.seplistItems = [];

            vm.menu = abp.nav.menus.MainMenu;
            var level1 = vm.menu.items;
            for (var i = 0; i < level1.length; i++) {
                var level2 = level1[i].items;
                if (level2.length > 0) {
                    for (var j = 0; j < level2.length; j++) {
                        var level3 = level2[j].items;
                        if (level3.length > 0) {
                            for (var k = 0; k < level3.length; k++) {
                                if (level3[k].isVisible) {
                                    vm.menuItems.push(level3[k]);
                                }
                            }
                        } else {
                            if (level2[j].isVisible) {
                                vm.menuItems.push(level2[j]);
                            }
                        }
                    }
                }
            }

            vm.onSelect = function ($item, $model, $label) {
                $state.go($item.url);
            };

            //Clear the list filtering
            vm.clearFilter = function () {
                vm.searchfilter = "";
            };

            vm.showMaxList = function (items, displayName) {
                vm.maxHeading = displayName;
                vm.maxListItems = items;
                vm.maxlist = true;
            }

            vm.showSeperateList = function (items, displayName) {
                setSepListVals(items);
                vm.sepHeading = displayName;
                vm.seplistItems = items;
                vm.seplist = true;
            };

            function setSepListVals(items) {
                var colCount = vm.maxCount;
                var chunks = 6;
                var arr = items;
                vm.columns = items.map(function (e, i) {
                    return i % colCount === 0 ? arr.slice(i, i + colCount) : null;
                }).filter(function (e) { return e; });
                vm.columnSubitems = vm.columns.map(function (e, i) {
                    return i % chunks === 0 ? vm.columns.slice(i, i + chunks) : null;
                }).filter(function (e) { return e; });
            };

            vm.hideMaxList = function () {
                vm.maxlist = false;
            };

            vm.hideSepList = function () {
                vm.seplist = false;
            };

            vm.unsetMaxSepList = function () {
                vm.maxlist = false;
                vm.seplist = false;
            }



            $scope.$on('$includeContentLoaded', function () {
                setTimeout(function () {
                    //Layout.initSidebar($state); // init sidebar
                    $(window).trigger('resize');
                }, 0);
            });
        }
    ]);
})();