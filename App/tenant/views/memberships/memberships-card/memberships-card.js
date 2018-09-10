(function (abp) {
    appModule.component('membershipCard', {
        bindings: {
            personId: '<',
        },
        controller: [
            '$scope', '$filter', '$state', '$stateParams', '$uibModal', 'abp.services.app.membership',
            function ($scope, $filter, $state, $stateParams, $uibModal, membershipService) {
                var ctrl = this;
                ctrl.membershipApplications = {};
                ctrl.status = app.consts.membershipStatus;
                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.vitalsign = "";
                    ctrl.permissions = {
                        view: abp.auth.hasPermission('Pages.Tenant.Memberships'),
                        create: abp.auth.hasPermission('Pages.Tenant.Memberships.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Memberships.Edit'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.Memberships.Terminate'),
                    };
                    if (ctrl.personId) {
                        load();
                    }
                };


                ctrl.$onChanges = function (changes) {
                    if (changes.personId && ctrl.personId) {
                        load();
                    }
                };

                ctrl.viewMembershipApplication = function (id) {
                    $state.go('tenant.membershipsEdit', { membershipId: id });
                };


                // callbacks
                function load() {
                    ctrl.loading = true;
                    membershipService.getPersonMembershipApplications(ctrl.personId).then(function (result) {
                        var appResult = result.data;
                        var pendingApplications = appResult.pendingApplications;
                        var completedApplications = appResult.completedApplications;
                        ctrl.membershipApplications.firstCompletedApplication = appResult.firstCompletedApplication;
                        ctrl.membershipApplications.pendingApplications = pendingApplications;
                        ctrl.membershipApplications.completedApplications = completedApplications;
                        ctrl.loading = false;
                    });
                }; 



                function groupApplicationByApplicationNumber(applications) {
                    var groups = applications.reduce(function (obj, item) {
                        obj[item.membershipApplicationNo] = obj[item.membershipApplicationNo] || [];
                        obj[item.membershipApplicationNo].push(item);
                        return obj;
                    }, {});
                    var result = Object.keys(groups).map(function (key) {
                        return { applicationNumber: key, application: groups[key] };
                    });

                    return result;
                };

            }
        ],

        templateUrl: '~/App/tenant/views/memberships/memberships-card/memberships-card.cshtml'
    });
})(abp);