(function () {
    appModule.controller('tenant.views.hospitalization.cardListing', [
        '$scope', '$stateParams', '$filter', '$location', 'abp.services.app.hospitalization',
        function ($scope, $stateParams, $filter, $location, hospitalizationService) {
            var vm = this;
            vm.appPath = abp.appPath;
            vm.todaysDate = moment().format();

            vm.load = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Hospitalization.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Hospitalization.Delete'),
                };

            }

            vm.addHospitalization = function () {
                if (vm.permissions.create) {
                    var path = "/tenant/hospitalization//" + ($scope.vm.person.id);
                    $location.path(path);
                }
            };

            vm.editHospitalization = function (id) {
                if (vm.permissions.edit) {
                    var path = "/tenant/hospitalization/" + id + "/" + ($scope.vm.person.id);
                    $location.path(path);
                }
            };

            vm.incrementPageNumber = function () {
                vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
            };


            vm.loadResults = function (requestParams) {
                vm.requestParams = requestParams;
                vm.searchValue();
            }

            vm.searchValue = function () {
                vm.loadinghos = true;
                hospitalizationService.getHospitalizationForPerson(
                    $.extend({ personId: $stateParams.id }, vm.requestParams)
                ).then(function (result) {
                    vm.hospitalizationList = result.data.items;
                    vm.data = result.data;
                    
                }).finally(function () {
                    vm.loadinghos = false; 
                });
            };


            function init() {
                vm.load();
            }

            init();
        }
    ]);
})();