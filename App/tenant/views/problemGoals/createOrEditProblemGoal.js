(function () {
    appModule.controller('tenant.views.problemGoals.createOrEditProblemGoal', [
        '$scope', '$filter', '$timeout', '$uibModalInstance', 'id', 'abp.services.app.problemGoal', 'abp.services.app.problem', 'abp.services.app.goal',
        function ($scope, $filter, $timeout, $uibModalInstance, problemId, problemGoalService, problemService, goalService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !problemId;

            vm.problemGoal = {};
            vm.goalList = [];
            vm.selectedGoalList = [];

            vm.save = function () {
                vm.saving = true;

                if (!vm.validate()) {
                    vm.saving = false;
                } else {
                    problemGoalService.createProblemGoal(
                        vm.problemGoal
                    ).then(function (result) {
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.validate = function () {
                // Need to use the below code to explicitly clear the highlight selection state
                angular.element("#goalList").val('selectedOptions', []);
                angular.element("#selectedGoalList").val('selectedOptions', []);

                var selectedGoalList = angular.element("#selectedGoalList option");

                if (selectedGoalList.length === 0) {
                    abp.message.error(app.localize('GoalZeroSelection'));
                    return false;
                }

                vm.problemGoal.problemId = vm.problemGoal.id;
                vm.problemGoal.goals = [];

                for (var i = 0; i < selectedGoalList.length; i++) {
                    vm.problemGoal.goals.push(selectedGoalList[i].value);
                }

                return true;
            };

            vm.cancelProblemGoals = function () {
                $uibModalInstance.dismiss();
            };

            vm.loadMaster = function () {
                if (vm.isCreateMode) {
                    problemService.getProblemsWithoutGoal({
                    }).then(function (result) {
                        vm.problemMaster = result.data.items;
                    });
                } else {
                    problemService.getProblems({
                    }).then(function (result) {
                        vm.problemMaster = result.data.items;
                    });
                }
            };

            vm.loadGoalList = function () {
                goalService.getAllGoals({
                }).then(function (result) {
                    vm.goalList = result.data.items;
                }).finally(function () {
                    vm.loadSelectedGoalList();
                });
            };

            vm.loadSelectedGoalList = function () {
                if (!vm.isCreateMode) {
                    problemGoalService.getProblemGoalForEdit({
                        id: problemId
                    }).then(function (result) {
                        vm.problemGoal = result.data;
                    }).finally(function () {
                        vm.filterGoalList();
                    });
                }
            };

            vm.filterGoalList = function () {
                var goalList = angular.element("#goalList option");

                $timeout(function () {
                    var temporaryElement = angular.element("<select id='temporaryList'></select>");

                    for (var i = 0; i < goalList.length; i++) {
                        var isExists = vm.problemGoal.goals.filter(function (obj) {
                            return obj.id === vm.goalList[i].id;
                        });

                        if (isExists.length > 0) {
                            var index = vm.goalList.indexOf(vm.goalList[i]);

                            if (index > -1) {
                                angular.element("#goalList option[value='" + goalList[i].value + "']").remove().appendTo(temporaryElement);
                            }
                        }
                    }

                    var selectedGoalList = angular.element("#selectedGoalList option");
                    var temporaryList = temporaryElement.find("option");

                    for (var j = 0; j < vm.problemGoal.goals.length; j++) {
                        var temporaryItem = $filter('filter')(temporaryList, { value: vm.problemGoal.goals[j].id });

                        if (temporaryItem.length > 0) {
                            temporaryElement.find("option[value='" + vm.problemGoal.goals[j].id + "']").appendTo('#selectedGoalList');
                        }
                    }

                    // Need to use the below code to explicitly clear the highlight selection state
                    angular.element("#selectedGoalList").val('selectedOptions', []);
                }, 0);
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    edit: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    delete: abp.auth.hasPermission('Pages.Tenant.CarePlans')
                };

                vm.loadMaster();
                vm.loadGoalList();
            }

            init();
        }
    ]);
})();