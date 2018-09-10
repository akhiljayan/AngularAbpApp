(function () {
    appModule.component('problemlistDetail', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: "vm",
        controller: [
            '$filter', 'abp.services.app.personProblem', 'abp.services.app.problem',
            function ($filter, personProblemService, problemService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.saving = false;
                    ctrl.permissions = {};

                    problemService.getProblems({
                    }).then(function (result) {
                        ctrl.problemMaster = result.data.items;
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        var problemListId = ctrl.resolve.problemListId;
                        ctrl.mode = !problemListId ? 'new' : 'edit';

                        if (ctrl.mode == "new") {
                            ctrl.workingModel = {
                                onsetDate: abp.clock.today(),
                                personId: ctrl.resolve.personId,
                                tags: []
                            };
                        } else if (ctrl.mode == "edit") {
                            personProblemService.getPersonProblemForEdit({
                                id: problemListId
                            }).then(function (result) {
                                ctrl.workingModel = angular.copy(result.data);

                                if (ctrl.workingModel.problem) {
                                    ctrl.workingModel.problemCustom = ctrl.workingModel.problem.description;
                                }

                                ctrl.parsePriority(ctrl.workingModel);
                            });
                        }
                    }
                };

                ctrl.parsePriority = function (model) {
                    if (model) {
                        if (angular.isNumber(model.priority)) {
                            model.priority = $filter('enumText')(model.priority, 'priorityType');
                        }
                    }
                };

                ctrl.loadProblemDetails = function (problem) {
                    if (problem) {
                        ctrl.workingModel.problemId = problem.id;
                        ctrl.workingModel.problemCustom = problem.description;
                    }
                };

                ctrl.save = function () {
                    if (!ctrl.saving) {
                        ctrl.saving = true;

                        if (ctrl.mode == "new") {
                            // Create Problem List record
                            personProblemService.createPersonProblem(
                                ctrl.workingModel
                            ).then(function () {
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.saving = false;
                            });
                        } else {
                            // Update Problem List record
                            personProblemService.updatePersonProblem(
                                ctrl.workingModel
                            ).then(function () {
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.saving = false;
                            });
                        }
                    }
                };

                ctrl.cancel = function () {
                    ctrl.modalInstance.close();
                };
            }
        ],
        templateUrl: "~/App/tenant/views/care/problemlist/problemlist-detail/problemlist-detail.cshtml"
    });
})();