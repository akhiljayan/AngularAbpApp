(function () {
    appModule.controller('tenant.views.settings.slider.userFavouriteMenu',
        ['$scope', '$rootScope', '$stateParams', '$location', '$timeout', '$filter', 'abp.services.app.userFavourite',
            function ($scope, $rootScope, $stateParams, $location, $timeout, $filter, userFavouriteService) {
                var vm = this;
                vm.isSavingDisabled = false;

                vm.entityMenuList = [];
                vm.userFavouriteMenuList = [];
                vm.internalUserFavouriteMenuList = [];

                vm.validate = function () {

                    if (vm.userFavouriteMenuList.length > 10) {
                        abp.message.error(app.localize('UserFavouriteMenuLimitSelection'));
                        return false;
                    }

                    return true;
                };

                vm.save = function () {

                    if (vm.isSavingDisabled == false) {
                        vm.isSavingDisabled = true;

                        if (vm.validate() == false) {
                            vm.isSavingDisabled = false;
                        } else {

                            userFavouriteService.addMenuToUserFavourites(vm.userFavouriteMenuList).then(function (result) {
                                abp.message.success(app.localize('ConfigurationSavedSuccessfully'));
                            }).finally(function () {
                                vm.isSavingDisabled = false;
                                $rootScope.$broadcast('refreshFavouriteList');
                            });
                        }
                    }

                };

                vm.cancel = function () {
                    $location.path('/');
                };

                vm.loadEntityMenuList = function () {

                    userFavouriteService.getEntityMenuList()
                        .then(function (result) {
                            vm.entityMenuList = result.data;
                        }).finally(function () {
                            vm.loadUserSetting();
                        });
                };

                vm.loadUserSetting = function () {

                    userFavouriteService.getUserFavouriteMenus()
                        .then(function (result) {
                            vm.internalUserFavouriteMenuList = result.data;
                        }).finally(function () {
                            vm.filterEntityMenuList();
                        });
                };

                vm.filterEntityMenuList = function () {
                    
                    var userFavouriteMenuList = vm.internalUserFavouriteMenuList;
                    if (userFavouriteMenuList.length > 0) {

                        $scope.$$postDigest(function () {
                            for (var i = 0; i < userFavouriteMenuList.length; i++) {
                                angular.element("#favouriteMenuList").multiSelect('select', userFavouriteMenuList[i]);
                            }
                        });
                    }
                };

                vm.init = function () {
                    vm.loadEntityMenuList();
                };

                vm.init();
            }]);
})();