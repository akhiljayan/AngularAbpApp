(function () {
    appModule.controller('common.views.teams.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.team', 'teamId', 'uiGridConstants', 'abp.services.app.commonLookup', 'lookupModal', '$q',
        function ($scope, $uibModalInstance, teamService, teamId, uiGridConstants, commonLookup, lookupModal, $q) {
            var vm = this;
            vm.saving = false;
            vm.team = null;

            vm.permissions = {
                manageMembers: abp.auth.hasPermission('Pages.Administration.Teams.ManageMembers')
            };

            vm.membersGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: 'Actions',
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                        '<div class=\"ui-grid-cell-contents\">' +
                        '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                        '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                        '    <ul uib-dropdown-menu>' +
                        '      <li><a ng-if="grid.appScope.permissions.manageMembers" ng-click="grid.appScope.removeUserFromTeam(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },
                    {
                        name: 'Name',
                        field: 'userName'
                    },
                    {
                        name: 'Addition Time',
                        field: 'additionTime',
                        cellFilter: 'momentFormat: \'L\''
                    }
                ],
                data: []
            };

            vm.save = function () {
                vm.saving = true;
                teamService.createOrUpdateTeam({
                    team: vm.team
                }).then(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.addMember = function () {
                vm.openAddModal();
            };

            vm.openAddModal = function () {
                if (!vm.team.id) {
                    return;
                }

                lookupModal.open({
                    title: app.localize('SelectAUser'),
                    serviceMethod: commonLookup.findUsers,
                    canSelect: function (item) {
                        return $q(function (resolve, reject) {
                            teamService.isInTeam({
                                userId: item.value,
                                teamId: vm.team.id
                            }).then(function (result) {
                                if (result.data) {
                                    abp.message.warn(app.localize('UserIsAlreadyInTheTeam'));
                                }

                                resolve(!result.data);
                            }).catch(function () {
                                reject();
                            });
                        });
                    },
                    callback: function (selectedItem) {
                        teamService.addUserToTeam({
                            userId: selectedItem.value,
                            teamId: vm.team.id
                        }).then(function () {
                            abp.notify.success(app.localize('SuccessfullyAdded'));
                            vm.getMembers();
                        });
                    }
                });
            };
            
            vm.getMembers = function () {
                if (teamId != null) {
                    teamService.getTeamMembers({
                        id: teamId
                    }).then(function (result) {
                        vm.membersGridOptions.data = result.data.items;
                    });
                }
            };

            vm.removeUserFromTeam = function (member) {
                teamService.removeUserFromTeam({
                    teamId: vm.team.id,
                    userId: member.userId
                }).then(function () {
                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                    vm.getMembers();
                });
            };

            function init() {
                teamService.getTeamForEdit({
                    id: teamId
                }).then(function (result) {
                    vm.team = result.data;
                    vm.getMembers();
                });
            }

            init();
        }
    ]);
})();
