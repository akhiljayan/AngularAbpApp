(function () {
    appModule.controller('common.views.teams.index', [
        '$scope', "$uibModal", 'uiGridConstants', 'abp.services.app.team',
        function ($scope, $uibModal, uiGridConstants, teamService) {
            var vm = this;

            vm.permissions = {
                manageTeams: abp.auth.hasPermission('Pages.Administration.Teams.ManageTeams'),
                manageMembers: abp.auth.hasPermission('Pages.Administration.Teams.ManageMembers')
            };

            vm.teamsGridOptions = {
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
                        '      <li><a ng-if="grid.appScope.permissions.manageTeams" ng-click="grid.appScope.editTeam(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.manageTeams" ng-click="grid.appScope.deleteTeam(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },
                    {
                        name: 'Name',
                        field: 'name'
                    },
                    {
                        name: 'Description',
                        field: 'description',
                        minWidth: 200
                    },
                    {
                        name: 'Creation Time',
                        field: 'creationTime',
                        cellFilter: 'momentFormat: \'L\''
                    }
                ],
                data: []
            };

            vm.getTeams = function () {
                var loading = true;
                teamService.getTeams(
                ).then(function (result) {
                    vm.teamsGridOptions.data = result.data.items;
                }).finally(function () {
                    loading = false;
                });
            };

            vm.createTeam = function () {
                openCreateOrEditTeamModel(null);
            };

            vm.editTeam = function (team) {
                openCreateOrEditTeamModel(team.id);
            };

            vm.deleteTeam = function (team) {
                abp.message.confirm(
                    app.localize('TeamDeleteWarningMessage', team.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            teamService.deleteTeam({
                                id: team.id
                            }).then(function () {
                                vm.getTeams();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function openCreateOrEditTeamModel(teamId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/teams/createOrEditModal.cshtml',
                    controller: 'common.views.teams.createOrEditModal as vm',
                    windowClass: 'teammodel',
                    backdrop: 'static',
                    resolve: {
                        teamId: function () {
                            return teamId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTeams();
                });
            }

            vm.getTeams();
        }
    ]);
})();
