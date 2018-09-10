(function () {
    appModule.controller('tenent.views.slider.index', [
        '$scope', '$rootScope', '$state', '$location', 'sliderState', 'abp.services.app.userFavourite',
        function ($scope, $rootScope, $state, $location, sliderState, userFavouriteService) {
            var vm = this;

            vm.checked = false;
            vm.selectedMenu = '';
            vm.userPersonCareList = [];
            vm.userFavouriteList = [];
            vm.watchedPersonList = [];

            vm.getUserPersonCareList = function () {
                userFavouriteService.getAllUserPersonCareList().then(function (result) {
                    vm.userPersonCareList = result.data;
                    $rootScope.userPersonCareList = result.data;
                });
            }

            vm.getUserFavouriteList = function () {

                userFavouriteService.getUserFavouriteList()
                    .then(function (result) {
                        vm.userFavouriteList = result.data;
                        $rootScope.userFavouriteList = result.data;
                    }).finally(function () {

                    });
            };

            vm.getUserWatchedPersonList = function () {
                userFavouriteService.getUserPersonWatchList()
                    .then(function (result) {
                        vm.watchedPersonList = result.data;
                        $rootScope.watchedPersonList = result.data;
                    }).finally(function () {});
            };

            vm.toggleSlider = function () {
                vm.checked = !vm.checked;
                //if (vm.checked) {
                //    var width = $(document).width();
                //    var final = width - 300;
                //    $("#main-content").css('width', final +'px').css('float', 'right');
                //} else {
                //    $("#main-content").css('width', '100%').css('float', 'right');
                //}
            };

            vm.goToFavouriteSetting = function () {
                vm.toggleSlider();
                $location.url('/tenant/settings/userFavouriteMenu');
            };

            vm.toggleFavouriteList = function () {

                var iconElement = angular.element('#favourite-list-icon');

                if (angular.element('#favourite-list').is(':visible') == true) {
                    iconElement.removeClass('fa fa-angle-up');
                    iconElement.addClass('fa fa-angle-down');
                    angular.element('#favourite-list').hide();
                } else {
                    iconElement.removeClass('fa fa-angle-down');
                    iconElement.addClass('fa fa-angle-up');
                    angular.element('#favourite-list').show();
                }
            };

            vm.toggleWatchList = function () {

                var iconElement = angular.element('#watch-list-icon');

                if (angular.element('#watch-list').is(':visible') == true) {
                    iconElement.removeClass('fa fa-angle-up');
                    iconElement.addClass('fa fa-angle-down');
                    angular.element('#watch-list').hide();
                } else {
                    iconElement.removeClass('fa fa-angle-down');
                    iconElement.addClass('fa fa-angle-up');
                    angular.element('#watch-list').show();
                }
            };

            vm.goTo = function (stateName) {
                vm.selectedMenu = stateName;
                sliderState.setStickyMenu(stateName);
                var params = sliderState.getParams(stateName);
                sliderState.isCurrentStateChangeIsFromSlider = true;
                $state.go(stateName);
            };

            vm.navigateToPerson = function (personId) {
                sliderState.isCurrentStateChangeIsFromSlider = true;
                $state.go("tenant.personDetail", { id: personId });
            }


            vm.refreshWatchList = function () {
                vm.watchedPersonList = [];
                $rootScope.watchedPersonList = [];
                vm.getUserWatchedPersonList();
            };

            vm.refreshFavoriteList = function () {
                vm.selectedMenu = null;
                sliderState.setStickyMenu(vm.selectedMenu);
                vm.userFavouriteList = [];
                $rootScope.watchedPersonList = [];
                vm.getUserFavouriteList();
            };

            $rootScope.$on('refreshPersonCareList', function (events) {
                vm.userPersonCareList = [];
                $rootScope.userPersonCareList = [];
                vm.getUserPersonCareList();
            });

            $rootScope.$on('refreshFavouriteList', function (events) {
                vm.refreshFavoriteList();
            });

            $rootScope.$on('refreshPersonWatchList', function (events) {
                vm.refreshWatchList();
            });

            vm.getUserFavouriteList();
            vm.getUserWatchedPersonList();
            vm.getUserPersonCareList()
        }
    ]);
})();