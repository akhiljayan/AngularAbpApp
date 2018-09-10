(function () {
    appModule.component('problemlistCard', {
        require: {
            parentCtrl: '^careTabContent'
        },
        bindings: {
            personId: '<',
            filter: '<',
            showDetails: '=',
            selectViews: '<',
            selectViewChange: '<',
            selectedPersonProblems: '=',
            loading: '=',
            onSelectPersonProblem: '&'
        },
        controller: [
            'abp.services.app.personProblem', '$uibModal',
            function (personProblemService, $uibModal) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        createPersonProblem: abp.auth.hasPermission('Pages.Tenant.PersonProblems.Create'),
                        editPersonProblem: abp.auth.hasPermission('Pages.Tenant.PersonProblems.Edit'),
                        viewPersonProblem: abp.auth.hasPermission('Pages.Tenant.PersonProblems')
                    };

                    // Add Load / Create function to parentCtrl if permission granted
                    if (ctrl.permissions.createPersonProblem) {
                        ctrl.parentCtrl.addCreateFunction(ctrl.create, 'PersonProblem');
                    }
                    if (ctrl.permissions.viewPersonProblem) {
                        ctrl.parentCtrl.addLoadFunction(ctrl.load, 'PersonProblem');
                    }
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.selectViewChange) {
                        ctrl.load();
                    }

                    if (changes.personId) {
                        changes.personId.currentValue && ctrl.load();
                    }
                };

                ctrl.load = function (requestParams) {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;
                    ctrl.key = getFilterKeys();

                    personProblemService.getPersonProblemsByPersonId(
                        $.extend({
                            personId: ctrl.personId,
                            statusView: ctrl.selectViews,
                            filter: ctrl.filter,
                        }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.changeView = function (view) {
                    ctrl.view = view;
                    ctrl.load();
                };

                ctrl.create = function () {
                    ctrl.popOutProblemListModal(null);
                };

                ctrl.edit = function (event) {
                    if (event.id) {
                        ctrl.popOutProblemListModal(event.id);
                    }
                };

                ctrl.popOutProblemListModal = function (problemListId) {
                    var modalInstance = $uibModal.open({
                        component: 'problemlistDetail',
                        backdrop: 'static',
                        resolve: {
                            problemListId: function () {
                                return problemListId;
                            },
                            personId: function () {
                                return ctrl.personId;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        ctrl.load();
                    });
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                };

                ctrl.selectForProgressNote = function (event) {
                    if (event) {
                        ctrl.onSelectPersonProblem({
                            event: {
                                id: event.id,
                                isSelected: event.isSelected
                            }
                        });
                    }
                };

                ctrl.changeStatus = function (event) {
                    if (event.status == 3 || event.status == 2) {
                        personProblemService.canClosePersonProblem({
                            id: event.problemListId
                        }).then(function (result) {
                            var canClose = result.data;

                            if (!canClose) {
                                if (event.status == 3) {
                                    abp.message.error(app.localize('ProblemCannotClosed'));
                                } else if (event.status == 2) {
                                    abp.message.error(app.localize('ProblemCannotResolved'));
                                }

                                return;
                            }

                            openModalPopup(event);
                        });
                    } else {
                        openModalPopup(event);
                    }
                };

                function openModalPopup(event) {
                    var type = 'Problem List';
                    var modalInstance = $uibModal.open({
                        component: 'careAction',
                        backdrop: 'static',
                        resolve: {
                            id: function () {
                                return event.problemListId;
                            },
                            status: function () {
                                return event.status;
                            },
                            type: function () {
                                return type;
                            },
                            submittedFrom: function () {
                                return 0;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        ctrl.load();
                    });
                }

                function getFilterKeys() {
                    var key = "";

                    key += ctrl.filter;

                    for (var i = 0; i < ctrl.selectViews.length; i++) {
                        key += ctrl.selectViews[i];
                    }

                    return key;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/care/problemlist/problemlist-card/problemlist-card.cshtml'
    });
})();
