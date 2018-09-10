(function () {
    appModule.controller('tenant.views.lifeEvents.significantLifeEventView', [
        '$scope', '$stateParams', '$uibModal', 'abp.services.app.lifeEvent',
        function ($scope, $stateParams, $uibModal, lifeEventService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.lifeEvents = [];
            vm.resultCount = 0;
            vm.pageNumber = 1;
            vm.pageSize = 5;
            vm.requestParams = {  };

            //vm.loadMore = function () {
            //    incrementPageNumber();
            //    vm.load();
            //};

            //function incrementPageNumber() {
            //    vm.pageNumber++;
            //    requestParams.skipCount = (vm.pageNumber - 1) * vm.pageSize;
            //}

            vm.load = function (requestParams) {
                
                vm.requestParams = requestParams;
                vm.loadData = true;
                if ($stateParams.id) {
                    lifeEventService.getSignificantLifeEvents(
                        $.extend({ personId: $stateParams.id }, vm.requestParams)
                    ).then(function (result) {
                        
                        vm.resultCount = result.data.totalCount;
                        vm.lifeEvents = result.data.items;
                        vm.data = result.data;                        
                        
                        }).finally(function () {
                            vm.loadData = false;
                        });
                }
            };

            vm.createLifeEvent = function () {
                vm.mode = "edit";
                openCreateOrEditLifeEventModal(null);
            };

            vm.editLifeEvent = function (lifeEventId) {
                openCreateOrEditLifeEventModal(lifeEventId);
            };

            vm.deleteLifeEvent = function (lifeEventId) {
                abp.message.confirm(
                    app.localize('RecordDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            lifeEventService.deleteLifeEvent(
                                { id: lifeEventId }
                            ).then(function () {
                                abp.notify.info(app.localize('SuccessfullyDeleted'));
                                getLifeEventItems();
                            });
                        }
                    }
                );
            };

            function getLifeEventItems() {
                //resetPaging();                

                lifeEventService.getSignificantLifeEvents(
                    $.extend({ personId: $stateParams.id }, vm.requestParams)
                ).then(function (result) {
                    vm.resultCount = result.data.totalCount;
                    vm.lifeEvents = result.data.items;
                    vm.data = result.data;
                    
                });
            }

            //function resetPaging() {
            //    vm.pageNumber = 1;
            //    requestParams.skipCount = 0;
            //}

            function openCreateOrEditLifeEventModal(lifeEventId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/lifeEvents/createOrEditLifeEvent.cshtml',
                    controller: 'tenant.views.lifeEvents.createOrEditLifeEvent as vmx',
                    backdrop: 'static',
                    resolve: {
                        lifeEventId: function () {
                            return lifeEventId;
                        },
                        personId: function () {
                            return $stateParams.id;
                        },
                        permissions: function () {
                            return vm.permissions;
                        },
                        significantLifeEventFlag: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    getLifeEventItems();
                });
            }

            vm.close = function () {
                vm.mode = 'view';
            };

            var requestParams = {
                skipCount: 0,
                maxResultCount: vm.pageSize
            };

            vm.init = function () {
                vm.permissions = {
                    createLifeEvent: abp.auth.hasPermission('Pages.Tenant.LifeEvents.Create'),
                    editLifeEvent: abp.auth.hasPermission('Pages.Tenant.LifeEvents.Edit'),
                    deleteLifeEvent: abp.auth.hasPermission('Pages.Tenant.LifeEvents.Delete')
                };
                //vm.pageNumber = 1;
                //vm.load();
            };
            vm.init();
        }
    ]);
})();