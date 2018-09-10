(function () {
    appModule.controller('tenant.views.dashboard.workspace.bulletin', [
        '$scope', '$window', '$timeout', 'abp.services.app.bulletin', '$uibModal', 'abp.services.app.commonLookup', 'abp.services.app.masterLookUp',
        function ($scope, $window, $timeout, bulletinService, $uibModal, commonLookupService, masterLookup) {
            var vm = this;

            $scope.options = {
                speed: 500,
                collapsedHeight: 1,
                moreLink: '<a href="#" class="pull-right" ng-click="readMoreBulletin()">...Read message</a>',
                lessLink: '<a href="#" class="pull-right">...Hide message</a>'
            };

            vm.init = function () {
                vm.appPath = abp.appPath;
                vm.bulletinCard = { filterText: "", skipCount: 0, maxResultCount: 3, incrementCount: 3, currentTotal: 3 };
                vm.UnreadBulletinCount = 0;

                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Delete'),
                    pin: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Pin'),
                    unpin: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Unpin')
                };

                var versionIE = app.utils.isBrowserInternetExplorer();

                if (versionIE != false &&
                    versionIE <= 11) {
                    $('input[type="text"]').removeAttr("placeholder");
                }

            };


            vm.getUnReadCount = function () {
                bulletinService.unReadBuletinsCount().then(function (result) {
                    vm.UnreadBulletinCount = result.data;
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getBulletins = function () {
                var prms = {
                    skipCount: 0,
                    maxResultCount: vm.bulletinCard.currentTotal
                };
                bulletinService.getBulletins(prms).then(function (result) {
                    vm.Bulletins = result.data;
                });
            };

            vm.createBulletin = function () {
                openCreateOrEditBulletin($scope.EmptyGuid);
            };

            vm.editBulletin = function (id, action) {
                vm.markAsRead(id);
                openCreateOrEditBulletin(id, action);
            };

            vm.getCategories = function () {
                masterLookup.getMasterTypeItems({
                    type: 'Category'
                }).then(function (result) {
                    vm.Categories = result.data;

                });
            }

            vm.filterByCategory = function (category) {
                var prms = {
                    skipCount: 0,
                    maxResultCount: vm.bulletinCard.currentTotal,
                    categoryId: category.id
                };
                vm.loading = true;
                bulletinService.filterByCategory(prms).then(function (result) {
                    vm.Bulletins = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.refreshGrid = function () {
                var prms = {
                    skipCount: 0,
                    maxResultCount: vm.bulletinCard.currentTotal,
                    filter: vm.bulletinCard.filterText
                };
                vm.loading = true;
                bulletinService.getBulletins(prms).then(function (result) {
                    vm.Bulletins = result.data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.loadMore = function () {
                vm.bulletinCard.skipCount = vm.bulletinCard.skipCount + vm.bulletinCard.maxResultCount;
                vm.bulletinCard.maxResultCount = vm.bulletinCard.maxResultCount + vm.bulletinCard.incrementCount;
                vm.bulletinCard.currentTotal = vm.bulletinCard.maxResultCount + vm.bulletinCard.skipCount;
                var prms = {
                    skipCount: vm.bulletinCard.skipCount,
                    maxResultCount: vm.bulletinCard.maxResultCount,
                    filter: vm.bulletinCard.filterText
                };
                vm.loading = true;
                bulletinService.getBulletins(prms).then(function (result) {
                    for (var index in result.data) {
                        vm.Bulletins.push(result.data[index]);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.pinBulletin = function (bulletinId) {
                bulletinService.pinBulletin(bulletinId).then(function (result) {
                    abp.notify.info(app.localize('PinnedSuccessfully'));
                }).finally(function () {
                    vm.refreshGrid();
                });
            }

            vm.unPinBulletin = function (bulletinId) {
                bulletinService.unPinBulletin(bulletinId).then(function (result) {
                    abp.notify.info(app.localize('UnPinnedSuccessfully'));
                }).finally(function () {
                    vm.refreshGrid();
                });
            }

            vm.markAsRead = function (bulletinId) {
                if (!isBulletinRead(bulletinId)) {
                    bulletinService.markAsRead(bulletinId).then(function (result) {
                        removeNewBadgeAfterRead(bulletinId);
                    }).finally(function () {
                        vm.UnreadBulletinCount = vm.UnreadBulletinCount - 1;
                    });
                }
            }

            vm.deleteBulletin = function (bulletinId) {
                abp.message.confirm(
                    app.localize('DeleteMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bulletinService.deleteBulletin(bulletinId).then(function (result) {
                            }).finally(function () {
                                abp.notify.info(app.localize('BulletinDeletedSuccessfully'));
                                vm.getUnReadCount();
                                vm.getBulletins();
                            });
                        }
                    }
                );

            }

            vm.expandMessageForMob = function (id, $event) {
                var userAgent = $window.navigator.userAgent;
                var isipadOriPhone = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android|IEMobile/i);
                if (isipadOriPhone) {
                    vm.expandbinMessage(id, $event);
                }
            };


            vm.openBulletain = [];
            vm.expandbinMessage = function (id, $event) {
                vm.markAsRead(id);
                var elm = angular.element($event.currentTarget);
                elm.trigger("hover");
                if (vm.openBulletain.indexOf(id) != -1) { //exists
                    var index = vm.openBulletain.indexOf(id);
                    vm.openBulletain.splice(index, 1);
                } else {
                    vm.openBulletain.push(id);
                }
            }


            vm.openBulletain = [];
            vm.expandMessage = function (id, $event) {
                var elm = angular.element($event.currentTarget);
                elm.trigger("hover");
                if (vm.openBulletain.indexOf(id) != -1) { //exists
                    var index = vm.openBulletain.indexOf(id);
                    vm.openBulletain.splice(index, 1);
                } else {
                    vm.openBulletain.push(id);
                }
            }


            function isBulletinRead(bulletinId) {
                var isRead = true;
                for (var index in vm.Bulletins) {
                    var bulletin = vm.Bulletins[index];
                    if (bulletin.id == bulletinId)
                        isRead = bulletin.isRead;
                }
                return isRead;
            }

            function removeNewBadgeAfterRead(bulletinId) {
                for (var index in vm.Bulletins) {
                    var bulletin = vm.Bulletins[index];
                    if (bulletin.id == bulletinId)
                        bulletin.isRead = true;
                }
            }

            function openCreateOrEditBulletin(id, action) {
                var modalInstance = $uibModal.open({
                    //windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                    templateUrl: '~/App/tenant/views/dashboard/WorkSpace/createOrEditBulletin.cshtml',
                    controller: 'tenant.views.dashboard.workspace.createOrEditBulletin as vm',
                    backdrop: 'static',
                    //backdropClass: 'backdropColor-Remove',
                    //windowClass: 'draggableModal',
                    //openedClass: 'dragModal',
                    size: 'lg',
                    resolve: {
                        bulletinId: function () {
                            return id;
                        },
                        action: function () {
                            return action;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getUnReadCount();
                    vm.getBulletins();
                });

            }



            vm.init();
            vm.getCategories();
            vm.getUnReadCount();
            vm.getBulletins();
        }
    ]);
})();