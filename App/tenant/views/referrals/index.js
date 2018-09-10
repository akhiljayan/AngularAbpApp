(function () {
    appModule.controller('tenant.views.referrals.index', [
        '$state', '$scope', '$timeout', 'abp.services.app.referral', '$location', '$anchorScroll', '$filter',
        function ($state, $scope, $timeout, referralService, $location, $anchorScroll, $filter) {
            //Variables
            var vm = this;
            vm.filter = null;
            vm.persons = [];
            vm.headingAppend = "";
            $anchorScroll.yOffset = 75;
            vm.appPath = abp.appPath;

            //Clear the list filtering
            vm.clearFilter = function () {
                vm.filter = "";
            };

            //Page scrolling to div
            vm.gotoAnchor = function (key) {
                //$location.hash(key);
                //$location.url('#' + key);
                $anchorScroll(key);
            };

            //Redirect to create referral
            vm.create = function () {
                //$location.path('/tenant/referral/');
                $state.go('tenant.referralNew');
            };

            //View existing referral record
            vm.view = function (id) {
                if (vm.permissions.view) {
                    //$location.path('/tenant/referral/' + id);
                    $state.go('tenant.referralEdit', { id: id });
                }
            };

            //Paginator load data
            vm.loadResults = function (requestParams) {
                vm.requestParams = requestParams;
                vm.searchValue();
                vm.gotoAnchor("ReferralIndex");
            }

            vm.filterOptions = {};

            //Call Api to get data
            vm.searchValue = function () {

                referralService.search(
                    $.extend({ filter: vm.filter }, vm.requestParams, vm.filterOptions)
                ).then(function (result) {
                    vm.referralList = result.data.items;
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
                    create: abp.auth.hasPermission('Pages.Tenant.Referral.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Referral.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Referral.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Referral.Delete'),
                };
                vm.referralFilterStatus = app.consts.referralFilterStatus.values;
                vm.referralServiceTypeStatus = app.consts.referralServiceTypeStatus.values;
                vm.referralServiceOpen = false;
                vm.referralServiceTypeStatusFilter(app.consts.referralServiceTypeStatus.Pending);
            };



            //Filter API call for referral status
            vm.referralStatusFilter = function (dataFilter) {
                vm.headingAppend = dataFilter == 0 ? '- Open' : '- Closed';
                vm.filterOptions = {};
                $.extend(vm.filterOptions, { referralStatus: dataFilter });
                vm.key = "referralStatus" + dataFilter;
            }

            //Filter API call for referral service type status
            vm.referralServiceTypeStatusFilter = function (dataFilter) {
                vm.headingAppend = '- ' + $filter('enumText')(dataFilter, 'referralServiceTypeStatus');
                vm.filterOptions = {};
                $.extend(vm.filterOptions, { referralServiceStatus: dataFilter });
                vm.key = "referralServiceStatus" + dataFilter;
            }

            vm.load();

        }
    ]);
})();
