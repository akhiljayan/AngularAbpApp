(function () {
    appModule.component("careAction", {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.personProblem', 'abp.services.app.carePlan', 'abp.services.app.user', '$filter',
            function (personProblemService, carePlanService, userService, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.saving = false;
                    ctrl.personProblemStatusUpdateApis = [
                        'openPersonProblem',
                        'suspendPersonProblem',
                        'resolvePersonProblem',
                        'closePersonProblem'
                    ];
                    ctrl.typeLabel = {
                        'Problem List': app.localize('Problem'),
                        'CarePlan': app.localize('CarePlanType'),
                        'Goal': app.localize('Goal'),
                        'Intervention': app.localize('Intervention')
                    };
                    ctrl.peopleMaster = [];

                    userService.getUsers({
                    }).then(function (result) {
                        var peopleList = result.data.items;

                        angular.forEach(peopleList, function (value, key) {
                            var people = {
                                "id": value.id,
                                "description": value.name
                            };

                            ctrl.peopleMaster.push(people);
                        });
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        ctrl.workingModel = {};
                        ctrl.workingModel.status = ctrl.resolve.status;
                        ctrl.workingModel.id = ctrl.resolve.id;
                        ctrl.workingModel.actionDate = abp.clock.today();
                        ctrl.workingModel.actionByUserId = abp.session.userId;
                        ctrl.submittedFrom = ctrl.resolve.submittedFrom;
                        ctrl.type = ctrl.resolve.type;
                        ctrl.typeDescription = null;
                        // Used for display Care Plan Goal/Intervention Description
                        ctrl.carePlanId = ctrl.resolve.careplanId;

                        if (ctrl.type == "Problem List") {
                            personProblemService.getPersonProblemForEdit({
                                id: ctrl.workingModel.id
                            }).then(function (result) {
                                ctrl.workingModel.typeDescription = result.data.problem.description;
                            });
                        } else if (ctrl.type == "CarePlan") {
                            carePlanService.getCarePlanForEdit({
                                id: ctrl.workingModel.id
                            }).then(function (result) {
                                var careplan = result.data;
                                ctrl.workingModel.typeDescription = careplan.carePlanType.description;
                            });
                        } else if (ctrl.type == "Goal") {
                            carePlanService.getCarePlanForEdit({
                                id: ctrl.carePlanId
                            }).then(function (result) {
                                var goals = result.data.goals;
                                var goal = goals.find(function (x) {
                                    return x.id == ctrl.workingModel.id;
                                });

                                ctrl.workingModel.typeDescription = goal.goal.description;
                            });
                        } else if (ctrl.type == "Intervention") {
                            carePlanService.getCarePlanForEdit({
                                id: ctrl.carePlanId
                            }).then(function (result) {
                                var goals = result.data.goals;
                                // Retrieve intervention descriptions from goals
                                for (var i = 0; i < goals.length; i++) {
                                    var intervention = goals[i].carePlanGoalInterventions.find(function (y) {
                                        return y.id == ctrl.workingModel.id;
                                    });

                                    if (intervention) {
                                        ctrl.workingModel.typeDescription = intervention.intervention.description;
                                        break;
                                    }
                                }
                            });
                        }
                    }
                };

                ctrl.save = function () {
                    ctrl.saving = true;

                    if (ctrl.type == 'Problem List') {
                        var input = {
                            id: ctrl.resolve.id,
                            remarks: ctrl.workingModel.remarks,
                            actionDate: ctrl.workingModel.actionDate,
                            source: ctrl.type, 
                            submittedFrom: ctrl.submittedFrom
                        };

                        if (ctrl.resolve.status >= 0 && ctrl.resolve.status <= 3) {
                            var api = ctrl.personProblemStatusUpdateApis[ctrl.resolve.status];

                            personProblemService[api](
                                input
                            ).then(function () {
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.saving = false;
                            });
                        }
                    } else {
                        var input = {
                            id: ctrl.workingModel.id,
                            remarks: ctrl.workingModel.remarks,
                            actionDate: ctrl.workingModel.actionDate,
                            source: ctrl.type
                        };

                        if (ctrl.resolve.status == 0) {
                            carePlanService.openCarePlan(
                                input
                            ).then(function () {
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.saving = false;
                            });
                        } else if (ctrl.resolve.status == 1) {
                            carePlanService.suspendCarePlan(
                                input
                            ).then(function () {
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.saving = false;
                            });
                        } else if (ctrl.resolve.status == 2) {
                            carePlanService.resolveCarePlan(
                                input
                            ).then(function () {
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.saving = false;
                            });
                        } else {
                            carePlanService.closeCarePlan(
                                input
                            ).then(function () {
                                ctrl.modalInstance.close(input);
                                
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
        templateUrl: '~/App/tenant/views/care/action/care-action.cshtml'
    });
})();