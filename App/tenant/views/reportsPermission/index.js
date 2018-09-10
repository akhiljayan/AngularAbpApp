(function () {
    appModule.controller('tenant.views.reportsPermission.index', [
        '$scope', '$state', '$timeout', 'abp.services.app.role', '$location', '$filter', 'abp.services.app.dynamicPermission',
        function ($scope, $state, $timeout, roleService, $location, $filter, dynamicPermissionService) {
            
            var vm = this;     
            
            vm.loading = false;
            vm.saving = false;

            vm.reportList = [];
            vm.roleList = [];
            vm.selectedRoleId = null;
            vm.checkAll = false;

            vm.requestParams = {
                permission: ''
            };
            
            //Load function
            vm.init = function () {
                vm.loading = true;
                vm.permissions = {
                    configuration: abp.auth.hasPermission('Pages.Tenant.ReportsPermission.Configuration'),
                };

                vm.getRoles();                
            };
            
            vm.getRoles = function () {
                if (vm.permissions.configuration) {
                    vm.loading = true;
                    roleService.getRoles(vm.requestParams).then(function (result) {                       
                        vm.roles = result.data.items;
                        angular.forEach(vm.roles, function (role) {
                            if (role.name != 'Admin') {
                                vm.roleList.push(role);
                            }
                        });                        
                        vm.selectedRoleId = vm.roleList[0].id;
                        vm.selectedRoleName = vm.roleList[0].displayName;

                        getPermission(vm.selectedRoleId);

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                
            };

            vm.selectRole = function (role) {
                vm.selectedRoleId = role.id;
                vm.selectedRoleName = role.displayName;
                vm.checkAll = false;
                getPermission(role.id);
            }

            function getPermission(roleId) {
                if (vm.permissions.configuration) {
                    vm.loading = true;
                    dynamicPermissionService.getGrantedReportPermissionByRole({ RoleId: roleId }).then(function (result) {
                        vm.reportList = result.data;
                        vm.loading = false;
                    });
                }                           
            };            


            vm.toogleAll = function () {
                if (vm.checkAll) {
                    vm.checkAll = true;
                } else {
                    vm.checkAll = false;
                }
                angular.forEach(vm.reportList, function (item) {
                    item.isGranted = vm.checkAll;
                });
            };

            vm.updatePermissionCheck = function ($index) {                
                var count = 0;
                angular.forEach(vm.reportList, function (item) {
                    if (item.isActive) {
                        count++;
                    }
                });

                if (vm.reportList.length == count) {
                    vm.checkAll = true;
                } else {
                    vm.checkAll = false;
                }
            }

            vm.save = function () {
                
                if (!vm.saving) {
                    vm.saving = true;
                    dynamicPermissionService.assignPermissionToReport(vm.reportList, vm.selectedRoleId).then(function (result) {                        
                        abp.message.info(result.data.message);
                    }).finally(function () {
                        vm.saving = false;                        
                    });
                }                
            };

            vm.close = function () {
                $state.go('tenant.dashboard.careboard');
            };

            vm.init();

            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {

                    });
                }, 0);
            }
        }
    ]);
})();
