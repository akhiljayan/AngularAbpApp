(function () {
    appModule.controller('tenant.views.memberships.index', [
        '$state', '$scope', '$timeout', 'abp.services.app.membership', '$location', '$anchorScroll', '$filter',
        function ($state, $scope, $timeout, membershipService, $location, $anchorScroll, $filter) {
            //Variables
            var vm = this;
            vm.filter = null;
            vm.persons = [];
            vm.membershipOpen = false;
            vm.headingAppend = "";
            $anchorScroll.yOffset = 75;
            vm.appPath = abp.appPath;

            //Clear the list filtering
            vm.clearFilter = function () {                
                vm.filter = "";
            };

            //Page scrolling to div
            vm.gotoAnchor = function (key) {
                $anchorScroll(key);
            };

            //Redirect to create Membership
            vm.create = function () {
                //debugger;
                vm.mode = 'new';
                vm.IsNewMember = 'true';
                if (vm.permissions.create) {
                    $state.go('tenant.membershipsNew');
                }
            };

            //View existing Membership record
            vm.view = function (membershipId) {
                //debugger;
                vm.mode = 'view';
                vm.IsNewMember = 'false';

                if (vm.permissions.view) {
                    $state.go('tenant.membershipsEdit', { membershipId: membershipId });
                }
            };

            //Paginator load data
            vm.loadResults = function (requestParams) {                
                vm.requestParams = requestParams;
                vm.searchValue();
                vm.gotoAnchor("MembershipIndex");
            }

            vm.filterOptions = {};

            //Call Api to get data
            vm.searchValue = function () {
                //debugger;
                membershipService.search(
                    $.extend({ filter: vm.filter }, vm.requestParams, vm.filterOptions)
                ).then(function (result) {
                    vm.membershipList = result.data.items;
                    
                    vm.data = result.data;
                    vm.loading = false;
                });
            }

            //Reset paginator params and get all
            vm.getAll = function () {
                vm.headingAppend = "";
                vm.filter = "";
                vm.key = "getAll";
                vm.filterOptions = {};
            };

            //Page init function
            vm.load = function () {
                vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Memberships.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Memberships.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Memberships.View'),
                };
                vm.membershipOpen = false;
                // get list of Application Status
                vm.applicationFilterStatus = app.consts.applicationFilterStatus.values;
                // default Application Status as pending on load
                vm.applicationStatusFilter(app.consts.applicationFilterStatus.Pending);
                // get list of Membership Status
                vm.membershipFilterStatus = app.consts.membershipFilterStatus.values;
            };
            
            //Filter API call and heading for Application status
            vm.applicationStatusFilter = function (dataFilter) {               
                var appendValue = $filter('enumText')(dataFilter, 'applicationFilterStatus');                

                vm.headingAppend = '- ' + appendValue;
                vm.filterOptions = {};
               
                $.extend(vm.filterOptions, { applicationStatus: dataFilter });
                vm.key = "applicationStatus" + dataFilter;
            }

            //Filter API call and heading for Membership Status
            vm.membershipStatusFilter = function (dataFilter) {             
               var appendValue = $filter('enumText')(dataFilter, 'membershipFilterStatus');
                vm.headingAppend = '- ' + appendValue;
                vm.filterOptions = {};
               
                $.extend(vm.filterOptions, { membershipStatus: dataFilter });
                vm.key = "membershipStatus" + dataFilter;
            }
            vm.load();
        }
    ]);
})();
