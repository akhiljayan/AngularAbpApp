(function () {
    appModule.component('careplanGoalInterventionDetail', {
        require: {
            parentCtrl: '^careplanFormWizard'
        },
        bindings: {
            mode: '<',
            model: '<',
            problemMaster: '<',
            priorityMaster: '<',
            careplanMaster: '<',
            goalMaster: '<',
            interventionMaster: '<',
            careplanItems: '<'
        },
        controllerAs: "vm",
        controller: [
            '$scope', '$filter', '$stateParams', 'abp.services.app.personProblem', 'abp.services.app.goalIntervention', 'abp.services.app.problemGoal',
            function ($scope, $filter, $stateParams, problemListService, goalInterventionService, problemGoalService) {
                var ctrl = this;
                var defaultGoals = {
                    isNew: true,
                    id: null,
                    carePlanGoalInterventions: [],
                    customIntervention: [],
                    customInterventions: []
                };

                ctrl.$onInit = function () {
                    ctrl.parentCtrl.addForm(ctrl.thisForm);
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;

                            if (!ctrl.model.carePlanGoals) {
                                ctrl.model.carePlanGoals = [];
                                ctrl.model.carePlanGoals.push(angular.copy(defaultGoals));
                            }

                        } else if (ctrl.mode == "addGoal") {
                            arrangeDataAddGoal();
                        }
                    }
                };

                ctrl.getSelectedArray = function (model, master) {
                    var selected = [];

                    master.filter(function (obj) {
                        model.filter(function (m) {
                            if (obj.id == m.interventionId) {
                                selected.push(obj);
                            }
                        });
                    });

                    return selected;
                };

                ctrl.thisForm = { name: 'goalsIntervention', callback: submitForm, addGoal: addGoal};

                function submitForm() {
                    ctrl.form.submitted = true;

                    var result = isDuplicateGoal();

                    if (result) {
                        abp.message.error(app.localize('DuplicateCarePlanGoals'));
                        return;
                    }

                    return ctrl.form.$valid;
                }

                /* Return true is have duplication goalId or Custom Goal */
                function isDuplicateGoal() {

                    for (var i = 0; i < ctrl.model.carePlanGoals.length; i++) {
                        for (var j = 0; j < ctrl.model.carePlanGoals.length; j++) {
                            if (i != j) {
                                // If these two duplicated records contain same goalId
                                if ((ctrl.model.carePlanGoals[i].goalId && ctrl.model.carePlanGoals[j].goalId)
                                    && (ctrl.model.carePlanGoals[i].goalId == ctrl.model.carePlanGoals[j].goalId)) {
                                    return true;
                                }
                                // If these two duplicated records contain same custom goal description
                                else if ((!ctrl.model.carePlanGoals[i].goalId && !ctrl.model.carePlanGoals[j].goalId)
                                    && (ctrl.model.carePlanGoals[i].customGoal == ctrl.model.carePlanGoals[j].customGoal)) {
                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                }

                function arrangeData() {
                    if (ctrl.model.goal != null) {
                        var goals = ctrl.goalMaster.find(function (x) {
                            return x.id == ctrl.model.goal;
                        });
                        ctrl.model.goalDesc = goals.description;
                    }
                }

                function addGoal() {
                    ctrl.model.carePlanGoals.push(angular.copy(defaultGoals));
                }

                ctrl.deleteGoal = function (i) {
                    abp.message.confirm(
                        app.localize("DeleteData"),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                $scope.$apply(function () {
                                    ctrl.model.carePlanGoals.splice(i, 1);
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        });
                }

                // TODO: Rename
                ctrl.addCustionIntervention = function (index, customText) {
                    if (customText != null && customText != "") {
                        ctrl.model.carePlanGoals[index].customIntervention = "";
                        //ctrl.model.carePlanGoals[index].interventions.push({
                        //    id: null,
                        //    description: customText
                        //});

                        ctrl.model.carePlanGoals[index].customInterventions.push({
                            interventionId: null,
                            interventionDescription: customText
                        });
                    }
                }

                function arrangeDataAddGoal() {
                 

                    ctrl.workingModel = ctrl.model;
                    ctrl.workingModel.id = ctrl.model.typeId;
                    ctrl.workingModel.personProblemId = ctrl.careplanItems.personProblem.id;
                    ctrl.workingModel.problemId = ctrl.careplanItems.personProblem.problem.id;
                    ctrl.workingModel.problemDescription = ctrl.careplanItems.personProblem.problemDescription;

                    ctrl.workingModel.carePlanGoals = [];
                    var carePlantype = ctrl.careplanItems.carePlans.find(function (x) {
                        return x.id == ctrl.model.typeId;
                    });
                    ctrl.workingModel.priority = carePlantype.priority;
                    ctrl.workingModel.nextReviewDate = carePlantype.nextReviewDate;
                    ctrl.workingModel.careplanTypeId = carePlantype.carePlanType.id;
                    ctrl.workingModel.tags = [];

                    // Assign
                    var tags = carePlantype.tags;
                    for (tag in tags) {
                        ctrl.workingModel.tags.push(tags[tag].name);
                    }

                    // Load goal Master
                    problemGoalService.getProblemGoalForEdit({
                        id: ctrl.workingModel.problemId
                    }).then(function (result) {
                        ctrl.goalMaster = result.data.goals;
                    });


                    for (i = 0; i < carePlantype.carePlanGoals.length; i++) {
                        var goal = {};
                        goal.id = carePlantype.carePlanGoals[i].id;
                        goal.goalId = carePlantype.carePlanGoals[i].goal.id;
                        goal.carePlanGoalInterventions = [];

                        var interventions = carePlantype.carePlanGoals[i].carePlanGoalInterventions;

                        for (j = 0; j < interventions.length; j++) {
                            goal.carePlanGoalInterventions.push({
                                id: interventions[j].id,
                                interventionId: interventions[j].intervention.id,
                                interventionDescription: interventions[j].intervention.description
                            });
                        }

                        goal.customInterventions = [];
                        goal.isNew = false;
                        ctrl.workingModel.carePlanGoals.push(goal);

                        loadGoalInterventionMaster(
                            goal.goalId,i
                        ).then(function (result) {      
                            var ii = i;
                            $scope.$apply(function () {
                                ctrl.workingModel.carePlanGoals[result.index].interventionMaster = result.data;

                                ctrl.workingModel.carePlanGoals[result.index].tempcarePlanGoalInterventions =
                                    ctrl.getSelectedArray(ctrl.workingModel.carePlanGoals[result.index].carePlanGoalInterventions,
                                    ctrl.workingModel.carePlanGoals[result.index].interventionMaster)
                            });
                        });
                    }
                }

                function loadGoalInterventionMaster(goalId,index) {
                    var promise = new Promise(function (resolve, reject) {
                        goalInterventionService.getGoalInterventionForEdit({
                            id: goalId
                        }).then(function (result) {
                            var interventionMaster = {};
                            interventionMaster.data = result.data.interventions;
                            interventionMaster.index = index;
                            resolve(interventionMaster);
                        });
                    });

                    return promise;
                }

                ctrl.goalOnChange = function (id, index) {
                    ctrl.workingModel.carePlanGoals[index].goalId = id;
                    goalInterventionService.getGoalInterventionForEdit({
                        id: id
                    }).then(function (result) {
                        ctrl.workingModel.carePlanGoals[index].interventionMaster = result.data.interventions;
                    });
                }

                ctrl.removeCustomIntervention = function (index, GoalIndex) {
                    var currentCustomInterventions = ctrl.workingModel.carePlanGoals[GoalIndex].customInterventions;
                    currentCustomInterventions.splice(index, 1);
                }

                ctrl.interventionOnChange = function (goalIndex, selectedIntervention) {
                    ctrl.workingModel.carePlanGoals[goalIndex].carePlanGoalInterventions = [];
                    for (var i = 0; i < selectedIntervention.length; i++) {
                        var item = {};
                        item.interventionId = selectedIntervention[i].id;
                        item.interventionDescription = selectedIntervention[i].description;
                        ctrl.workingModel.carePlanGoals[goalIndex].carePlanGoalInterventions.push(item);
                    }

                }
            }
        ],
        templateUrl: '~/App/tenant/views/care/careplan/careplan-goal-intervention-detail/careplan-goal-intervention-detail.cshtml'
    });
})();