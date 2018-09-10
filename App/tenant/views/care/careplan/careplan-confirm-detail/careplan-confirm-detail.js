(function () {
    appModule.component('careplanConfirmDetail', {
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
            '$scope', '$filter', '$stateParams', 'abp.services.app.problemGoal',
            function ($scope, $filter, $stateParams, problemGoalService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.parentCtrl.addForm(ctrl.thisForm);
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.workingModel = ctrl.model;
                        ctrl.parsePriority(ctrl.workingModel);

                        if (ctrl.workingModel.problemId) {
                            var problemId = ctrl.workingModel.problemId;

                            problemGoalService.getProblemGoalForEdit({
                                id: problemId
                            }).then(function (result) {
                                ctrl.goalMaster = result.data.goals
                            });
                        }
                    }
                };

                ctrl.thisForm = { name: 'confirmPage', callback: submitForm };

                function submitForm() {
                    ctrl.form.submitted = true;
                    return ctrl.form.$valid;
                }

                ctrl.getGoalDesc = function (id) {
                    if (ctrl.goalMaster && id != null && id != "") {
                        var goals = ctrl.goalMaster.find(function (x) {
                            return x.id == id;
                        });
                        return goals.description;
                    }
                }

                ctrl.getInterventionDesc = function (item, interventionMaster) {
                    if (interventionMaster && item.interventionId != null && item.interventionId != "") {
                        var intervention = interventionMaster.find(function (x) {
                            return x.id == item.interventionId;
                        });
                        return intervention.description;
                    }
                }

                ctrl.parsePriority = function (model) {
                    if (model) {
                        if (angular.isNumber(model.priority)) {
                            model.priority = $filter('enumText')(model.priority, 'priorityType');
                        }
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/care/careplan/careplan-confirm-detail/careplan-confirm-detail.cshtml'
    });
})();