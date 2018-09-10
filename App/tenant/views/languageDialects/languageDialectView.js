(function (abp) {
    appModule.component('languageDialects', {
        bindings: {
            maintitle: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<',
            lockCard: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$stateParams', '$uibModal', 'abp.services.app.languageDialect',
            function ($scope, $stateParams, $uibModal, languageDialectService) {
                var vm = this;
                vm.filter = "active";
                // lifecycle hooks
                vm.$onInit = function () {
                    vm.languageDialects = [];
                    vm.mode = $scope.vm.mode;
                    vm.languageDialects = [];
                    vm.resultCount = 0;
                    vm.pageNumber = 1;
                    vm.pageSize = 5;
                    vm.permissions = {
                        createLanguageDialect: abp.auth.hasPermission('Pages.Tenant.LanguageDialects.Create'),
                        editLanguageDialect: abp.auth.hasPermission('Pages.Tenant.LanguageDialects.Edit'),
                        deleteLanguageDialect: abp.auth.hasPermission('Pages.Tenant.LanguageDialects.Delete')
                    };

                    vm.pageNumber = 1;
                    vm.load();
                };


                vm.$onChanges = function (changes) {
                    if (changes.personId) {
                        vm.pageNumber = 1;
                        vm.load();
                    }
                };

                // event handlers
                vm.loadMore = function () {
                    incrementPageNumber();
                    vm.load();
                };

                function incrementPageNumber() {
                    vm.pageNumber++;
                    requestParams.skipCount = (vm.pageNumber - 1) * vm.pageSize;
                }

                vm.load = function () {
                    if (vm.personId) {
                        vm.loading = true;
                        languageDialectService.getLanguageDialects(
                            $.extend({ personId: vm.personId }, requestParams)
                        ).then(function (result) {
                            vm.resultCount = result.data.totalCount;
                            vm.languageDialects = result.data.items;
                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                };

                vm.createLanguageDialect = function () {
                    vm.mode = "edit";
                    openCreateOrEditLanguageDialectModal(null);
                };

                vm.editLanguageDialect = function (languageDialectId) {
                    if (!vm.lockCard) {
                        openCreateOrEditLanguageDialectModal(languageDialectId);
                    }
                };

                vm.deleteLanguageDialect = function (languageDialectId) {
                    abp.message.confirm(
                        app.localize('LanguageDialectDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                languageDialectService.deleteLanguageDialect(languageDialectId).then(function () {
                                    abp.notify.info(app.localize('SuccessfullyDeleted'));
                                    getLanguageDialectItems();
                                });
                            }
                        }
                    );
                };

                function getLanguageDialectItems() {
                    resetPaging();

                    languageDialectService.getLanguageDialects(
                        $.extend({ personId: vm.personId }, requestParams)
                    ).then(function (result) {
                        vm.resultCount = result.data.totalCount;
                        vm.languageDialects = result.data.items;
                    });
                }

                function resetPaging() {
                    vm.pageNumber = 1;
                    requestParams.skipCount = 0;
                }

                function openCreateOrEditLanguageDialectModal(languageDialectId) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/languageDialects/createOrEditLanguageDialect.cshtml',
                        controller: 'tenant.views.languageDialects.createOrEditLanguageDialect as vmx',
                        backdrop: 'static',
                        resolve: {
                            languageDialectId: function () {
                                return languageDialectId;
                            },
                            personId: function () {
                                return vm.personId;
                            },
                            permissions: function () {
                                return vm.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        getLanguageDialectItems();
                    });
                }

                vm.close = function () {
                    vm.mode = 'view';
                };

                var requestParams = {
                    skipCount: 0,
                    maxResultCount: vm.pageSize
                };


                vm.load();

            }
        ],

        templateUrl: '~/App/tenant/views/languageDialects/languageDialectView.cshtml'
    });
})(abp);