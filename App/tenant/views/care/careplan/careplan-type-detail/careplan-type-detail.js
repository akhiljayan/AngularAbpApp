(function () {
    appModule.component('careplanTypeDetail', {
        require: {
            parentCtrl: '^careplanFormWizard'
        },
        bindings: {
            mode: '<',
            model: '<',
            personProblems: '<',
            problemMaster: '<',
            priorityMaster: '<',
            careplanMaster: '<',
            goalMaster: '<',
            interventionMaster: '<',
            careplanItems: '<',
            onProblemSelected: '&'
        },
        controllerAs: "vm",
        controller: [
            '$scope', '$filter', '$stateParams', 'abp.services.app.personProblem', 'abp.services.app.carePlan',
            function ($scope, $filter, $stateParams, problemListService, carePlanService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.parentCtrl.addForm(ctrl.thisForm);
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.workingModel = ctrl.model;

                        if (ctrl.mode == "edit") {
                            ctrl.workingModel.id = ctrl.model.typeId;
                            ctrl.workingModel.personProblemId = ctrl.careplanItems.personProblemId;
                            ctrl.workingModel.problemId = ctrl.careplanItems.personProblem.problemId;
                            ctrl.workingModel.problemDescription = ctrl.careplanItems.personProblem.problemDescription;

                            var carePlantype = ctrl.careplanItems.carePlans.find(function (x) {
                                return x.id == ctrl.model.typeId;
                            });
                            ctrl.workingModel.carePlanTypeId = carePlantype.carePlanTypeId;
                            ctrl.workingModel.nextReviewDate = carePlantype.nextReviewDate;
                            ctrl.workingModel.tags = carePlantype.tags;
                        }
                    }
                };

                ctrl.thisForm = { name: 'careplanType', callback: submitForm };

                function submitForm() {
                    var input = angular.copy(ctrl.workingModel);


                    var promise = new Promise(function (resolve, reject) {
                        ctrl.form.submitted = true;

                        if (!ctrl.workingModel.problemId && !ctrl.workingModel.problemCustom) {
                            resolve(false);
                            // TODO: Replace the message
                            abp.message.error('Please select a problem.');

                            return;
                        }

                        // Duplication check for Care Plan Type
                        if (ctrl.form.$valid) {
                            carePlanService.isExistedCarePlan(
                                input       // ctrl.workingModel
                            ).then(function (result) {
                                ctrl.workingModel.isDuplicateCarePlanType = result.data;
                                resolve(ctrl.form.$valid && !ctrl.workingModel.isDuplicateCarePlanType);

                                // TODO: Do we still need isDuplicateCarePlanType flag?
                                if (ctrl.workingModel.isDuplicateCarePlanType) {
                                    abp.message.error(app.localize('DuplicateCarePlanType'));
                                }
                            });
                        }
                    });

                    return promise;
                }

                ctrl.problemOnChange = function () {
                    // Senario
                    // Select problem, go to next step, select goal and intervention, go to previous step
                    // Enter custom problem, go to next step again, goalId and intervention not clear
                    ctrl.workingModel.carePlanGoals.forEach(function (element) {
                        if (!!element.goalId) {
                            element.goalId = null;
                            element.interventionMaster = null;
                            element.carePlanGoalInterventions = null;
                        }
                    });

                    var personProblem = ctrl.personProblems.find(function (x) {
                        return x.problem.id == ctrl.workingModel.problemId;
                    });

                    if (personProblem) {
                        ctrl.workingModel.problemDescription = personProblem.problemDescription;
                        ctrl.workingModel.priority = personProblem.priority;
                        ctrl.workingModel.personProblemId = personProblem.id;
                        ctrl.workingModel.onsetDate = personProblem.onsetDate;
                    } else {
                        ctrl.workingModel.problemDescription = null;
                        ctrl.workingModel.priority = null;
                        ctrl.workingModel.personProblemId = null;
                        ctrl.workingModel.onsetDate = abp.clock.today();
                    }

                    ctrl.onProblemSelected({
                        event: {
                            problemId: ctrl.workingModel.problemId
                        }
                    })
                };
            }
        ],
        templateUrl: '~/App/tenant/views/care/careplan/careplan-type-detail/careplan-type-detail.cshtml'
    });
})();