(function () {
    appModule.controller('tenant.views.familymember.index', [
        '$scope', 'abp.services.app.person', 'abp.services.app.familyMember', '$location', '$anchorScroll', '$state',
        function ($scope, personService, familyMemberService, $location, $anchorScroll, $state) {
            var vm = this;
            $anchorScroll.yOffset = 265;
            vm.appPath = abp.appPath;
            vm.filter = null;
            vm.loading = false;
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.View'),
                delete: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Delete'),
                //activate: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Activate'),
                //deactivate: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Deactivate')
            };

            vm.create = function () {
                $state.go('tenant.familyMemberNew');
            };

            vm.view = function (id) {
                $state.go('tenant.familyMemberPersonDetail', { id: id });
            };

            vm.viewFamilyMember = function (familyId, personId) {
                $state.go('tenant.familyMember', { familyId: familyId });
            };

            vm.clearFilter = function () {
                vm.filter = null;
                vm.load();
            };

            vm.changeView = function (view) {
                vm.view = view;
                vm.load();
            };

            vm.gotoAnchor = function (key) {
                //$location.hash(key);
                //$location.url('#' + key);
                $anchorScroll(key);
            };

            vm.load = function (requestParams) {
                vm.loading = true;

                if (vm.view == app.consts.personViews.All) {
                    vm.filterStatus = 'all';
                    vm.filterStatusTitle = abp.localization.localize('All');
                } else if (vm.view == app.consts.personViews.Inactive) {
                    vm.filterStatus = 'inactive';
                    vm.filterStatusTitle = abp.localization.localize('Inactive');
                } else if (vm.view == app.consts.personViews.Active) {
                    vm.filterStatus = 'active';
                    vm.filterStatusTitle = abp.localization.localize('Active');
                }

                vm.key = getFilterKeys();

                familyMemberService.getPersonFamilyMemberList(
                    $.extend({
                        filter: vm.filter,
                        view: vm.filterStatus
                    }, requestParams)
                ).then(function (result) {
                    vm.data = result.data;
                    vm.gotoAnchor("familyMemberIndex");
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getFilterKeys() {
                var key = "";

                key = key.concat(vm.filterStatus, vm.filter);

                return key;
            }
        }
    ]);
})();