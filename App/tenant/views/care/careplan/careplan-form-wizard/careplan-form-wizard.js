(function () {
    appModule.component('careplanFormWizard', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: "vm",
        controller: [
            '$scope', '$state', '$stateParams', '$filter', 'abp.services.app.personProblem', 'abp.services.app.carePlan', 'abp.services.app.carePlanType', 'abp.services.app.problem', 'abp.services.app.goal', 'abp.services.app.intervention', 'abp.services.app.problemGoal',
            function ($scope, $state, $stateParams, $filter, personProblemService, carePlanService, carePlanTypeService, problemService, goalService, interventionService, problemGoalService) {
                var ctrl = this

                ctrl.cancel = function () {
                    ctrl.modalInstance.close();
                };

                ctrl.$onInit = function () {
                    ctrl.defaultTab = 1;
                    ctrl.currentPage = 1;
                    ctrl.forms = [];
                    ctrl.problemMaster = [];
                    ctrl.personProblems = [];
                    ctrl.isSavingDisabled = false;

                    if (ctrl.permissions.viewPersonProblem) {
                        personProblemService.getPersonProblemsByPersonId({
                            personId: ctrl.model.personId
                        }).then(function (result) {
                            var personProblemList = result.data.items;

                            ctrl.personProblems = personProblemList.map(function (item) {
                                ctrl.problemMaster.push({
                                    "id": item.problem.id,
                                    "type": 'Existing Problem',
                                    "description": item.problem.description
                                });

                                return {
                                    id: item.id,
                                    problem: item.problem,
                                    priority: $filter('enumText')(item.priority, 'priorityType'),
                                    problemDescription: item.problemDescription,
                                    onsetDate: item.onsetDate
                                };
                            });

                            problemService.getProblems({
                            }).then(function (result) {
                                var problemList = result.data.items;

                                angular.forEach(problemList, function (value, key) {
                                    var existingProblems = personProblemList.filter(function (item) {
                                        return value.id == item.problem.id
                                    });

                                    if (!existingProblems || existingProblems.length <= 0) {
                                        ctrl.problemMaster.push({
                                            "id": value.id,
                                            "type": 'Problem',
                                            "description": value.description
                                        });
                                    }
                                });
                            });
                        });
                    } else {
                        problemService.getProblems({
                        }).then(function (result) {
                            var problemList = result.data.items;

                            angular.forEach(problemList, function (value, key) {
                                ctrl.problemMaster.push({
                                    "id": value.id,
                                    "type": 'Problem',
                                    "description": value.description
                                });
                            });
                        });
                    }

                    carePlanTypeService.getCarePlanTypes({
                    }).then(function (result) {
                        ctrl.careplanMaster = result.data.items
                    });

                    goalService.getAllGoals({
                    }).then(function (result) {
                        ctrl.goalMaster = result.data.items;
                    });

                    interventionService.getAllInterventions({
                    }).then(function (result) {
                        ctrl.interventionMaster = result.data.items;
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        ctrl.action = ctrl.resolve.action;
                        ctrl.mode = ctrl.resolve.mode;
                        ctrl.model = {
                            personId: ctrl.resolve.personId,
                            typeId: ctrl.resolve.typeId
                        };
                        ctrl.careplanItems = ctrl.resolve.items;
                        ctrl.permissions = ctrl.resolve.permissions;

                        if (ctrl.mode == "new") {
                            setCarePlanNew();
                        } else if (ctrl.mode == "addGoal") {
                            setCarePlanAddGoal();
                        }
                    }
                }

                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };

                ctrl.goNext = function () {
                    validation(
                    ).then(function (isValid) {
                        if (isValid) {
                            $scope.$apply(function () {
                                if (ctrl.currentPage >= 1 && ctrl.currentPage <= ctrl.maxpage) {
                                    $('[href="#step' + (1 + ctrl.currentPage) + '"]').tab('show');
                                    if (ctrl.currentPage < ctrl.maxpage) {
                                        ctrl.currentPage = ctrl.currentPage + 1;
                                    } else {
                                    }
                                    var step = ctrl.currentPage;
                                    var percent = (parseInt(step) / ctrl.maxpage) * 100;
                                    ctrl.percent = percent + '%';
                                }
                            });
                        }
                    });
                }

                ctrl.goBack = function () {
                    if (ctrl.currentPage <= ctrl.maxpage && ctrl.currentPage > 1) {
                        $('[href="#step' + (ctrl.currentPage - 1) + '"]').tab('show');
                        if (ctrl.currentPage > 1) {
                            ctrl.currentPage = ctrl.currentPage - 1;
                        }
                        var step = ctrl.currentPage;
                        var percent = (parseInt(step) / ctrl.maxpage) * 100;
                        ctrl.percent = percent + '%';

                        return false;
                    }
                }

                ctrl.addGoalBtn = function () {
                    var checkform = ctrl.forms.find(function (x) {
                        return x.name === 'goalsIntervention';
                    });
                    checkform.addGoal();
                }

                ctrl.onSave = function () {
                    if (!ctrl.isSavingDisabled) {
                        ctrl.isSavingDisabled = true;
                        var input = ctrl.model;

                        if (ctrl.mode == "new") {
                            input.carePlanGoals.map(function (obj) {
                                obj.carePlanGoalInterventions = obj.carePlanGoalInterventions.concat(obj.customInterventions);
                            });

                            carePlanService.createCarePlan(
                                input
                            ).then(function () {
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.isSavingDisabled = false;
                            });
                        } else if (ctrl.mode == "edit") {
                            validation(
                            ).then(function (isValid) {
                                if (isValid) {
                                    carePlanService.updateCarePlan(
                                        input
                                    ).then(function () {
                                        abp.notify.info(app.localize('SavedSuccessfully'));
                                        ctrl.modalInstance.close();
                                    }).finally(function () {
                                        ctrl.isSavingDisabled = false;
                                    });
                                }
                            });
                        } else if (ctrl.mode == "addGoal") {
                            input.carePlanGoals.map(function (obj) {
                                obj.carePlanGoalInterventions = obj.carePlanGoalInterventions.concat(obj.customInterventions);
                            });

                            validation(
                            ).then(function (isValid) {
                                if (isValid) {
                                    carePlanService.updateCarePlanGoals(
                                        input
                                    ).then(function () {
                                        abp.notify.info(app.localize('SavedSuccessfully'));
                                        ctrl.modalInstance.close();
                                    }).finally(function () {
                                        ctrl.isSavingDisabled = false;
                                    });
                                }
                            });
                        }
                    }
                }

                function validation() {
                    var promise = new Promise(function (resolve, reject) {
                        if (ctrl.mode == "new") {
                            if (ctrl.currentPage == 1) {
                                var checkform = ctrl.forms.find(function (x) {
                                    return x.name === 'careplanType';
                                });

                                checkform.callback(
                                ).then(function (isValid) {
                                    resolve(isValid)
                                })
                            }

                            if (ctrl.currentPage == 2) {
                                var checkform = ctrl.forms.find(function (x) {
                                    return x.name === 'goalsIntervention';
                                });
                                resolve(checkform.callback());
                            }
                        } else if (ctrl.mode == "addGoal") {
                            if (ctrl.currentPage == 1) {
                                var checkform = ctrl.forms.find(function (x) {
                                    return x.name === 'goalsIntervention';
                                });
                                resolve(checkform.callback());
                            } else {
                                // can add validation next time
                                resolve(true);
                            }

                        } else if (ctrl.mode == "edit") {
                            if (ctrl.currentPage == 1) {
                                var checkform = ctrl.forms.find(function (x) {
                                    return x.name === 'careplanType';
                                });
                                resolve(checkform.callback());
                            }
                        }
                    });

                    return promise;
                }

                function setCarePlanNew() {
                    var createForm = [{
                        number: 1,
                        title: 'Care Plan Type',
                        target: '#step1',
                    }, {
                        number: 2,
                        title: 'Goals & Intervention',
                        target: '#step2',
                    }, {
                        number: 3,
                        title: 'Confirm',
                        target: '#step3',
                    }];

                    ctrl.tabs = createForm;
                    ctrl.percent = '33%';
                    ctrl.maxpage = 3;
                }

                function setCarePlanAddGoal() {
                    var createForm = [{
                        number: 1,
                        title: 'Goals & Intervention',
                        target: '#step1',
                    }, {
                        number: 2,
                        title: 'Confirm',
                        target: '#step2',
                    }];

                    ctrl.tabs = createForm;
                    ctrl.percent = '50%';
                    ctrl.maxpage = 2;
                }

                ctrl.onProblemSelected = function (event) {
                    var problemId = event.problemId

                    problemGoalService.getProblemGoalForEdit({
                        id: problemId
                    }).then(function (result) {
                        ctrl.goalMaster = result.data.goals
                    });
                }
            }
        ],
        templateUrl: '~/App/tenant/views/care/careplan/careplan-form-wizard/careplan-form-wizard.cshtml'
    });
})();