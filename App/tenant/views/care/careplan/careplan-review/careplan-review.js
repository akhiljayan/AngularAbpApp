(function () {
    appModule.component('careplanReview', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: "vm",

        controller: [
            'abp.services.app.problem', '$filter', 'abp.services.app.personProblem', 'abp.services.app.user', 'abp.services.app.carePlan', '$state', '$stateParams',
            function (problemService, $filter, personProblemService, userService, carePlanService, $state, $stateParams) {
                var ctrl = this

                ctrl.cancel = function () {
                    ctrl.modalInstance.close();
                };

                ctrl.$onInit = function () {
                    ctrl.problemMaster = [];
                    ctrl.personProblems = [];

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

                    userService.getUsers({
                    }).then(function (result) {
                        var peopleList = result.data.items;
                        ctrl.peopleMaster = [];

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
                        ctrl.action = ctrl.resolve.action;
                        ctrl.model = {
                            personId: ctrl.resolve.personId,
                            typeId: ctrl.resolve.typeId,
                        };
                        ctrl.workingModel = ctrl.model;
                        ctrl.careplanItems = ctrl.resolve.careplanItems;
                        ctrl.workingModel.personProblemId = ctrl.careplanItems.personProblemId;
                        ctrl.workingModel.problemId = ctrl.careplanItems.personProblem.problemId;
                        ctrl.workingModel.progressNoteDateTime = new Date();
                        ctrl.workingModel.reviewedByUserId = abp.session.userId;
                        ctrl.workingModel.sourceId = ctrl.model.typeId;
                    }
                }

                ctrl.onSave = function () {
                    var isValid = validation();
     
                    if (isValid) {
                        carePlanService.reviewCarePlan(
                            ctrl.model
                        ).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            ctrl.modalInstance.close();
                        });
                    }
                }

                function validation() {
                    ctrl.form.submitted = true;
                    return ctrl.form.$valid;
                }
            }
        ],

        templateUrl: '~/App/tenant/views/care/careplan/careplan-review/careplan-review.cshtml'
    });
})();