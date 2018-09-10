(function () {
    appModule.controller('tenant.views.goalInterventions.createOrEditGoalIntervention', [
        '$scope', '$filter', '$timeout', '$uibModalInstance', 'id', 'abp.services.app.goalIntervention', 'abp.services.app.goal', 'abp.services.app.intervention',
        function ($scope, $filter, $timeout, $uibModalInstance, goalId, goalInterventionService, goalService, interventionService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = !goalId;

            vm.goalIntervention = {};
            vm.interventionList = [];
            vm.selectedInterventionList = [];

            vm.save = function () {
                vm.saving = true;

                if (!vm.validate()) {
                    vm.saving = false;
                } else {
                    goalInterventionService.createGoalIntervention(
                        vm.goalIntervention
                    ).then(function (result) {
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.validate = function () {
                // Need to use the below code to explicitly clear the highlight selection state
                angular.element("#interventionList").val('selectedOptions', []);
                angular.element("#selectedInterventionList").val('selectedOptions', []);

                var selectedInterventionList = angular.element("#selectedInterventionList option");

                if (selectedInterventionList.length === 0) {
                    abp.message.error(app.localize('InterventionZeroSelection'));
                    return false;
                }

                vm.goalIntervention.goalId = vm.goalIntervention.id;
                vm.goalIntervention.interventions = [];

                for (var i = 0; i < selectedInterventionList.length; i++) {
                    vm.goalIntervention.interventions.push(selectedInterventionList[i].value);
                }

                return true;
            };

            vm.cancelGoalInterventions = function () {
                $uibModalInstance.dismiss();
            };

            vm.loadMaster = function () {
                if (vm.isCreateMode) {
                    goalService.getGoalsWithoutIntervention({
                    }).then(function (result) {
                        vm.goalMaster = result.data.items;
                    });
                } else {
                    goalService.getAllGoals({
                    }).then(function (result) {
                        vm.goalMaster = result.data.items;
                    });
                }
            };

            vm.loadInterventionList = function () {
                interventionService.getAllInterventions({
                }).then(function (result) {
                    vm.interventionList = result.data.items;
                }).finally(function () {
                    vm.loadSelectedInterventionList();
                });
            };

            vm.loadSelectedInterventionList = function () {
                if (!vm.isCreateMode) {
                    goalInterventionService.getGoalInterventionForEdit({
                        id: goalId
                    }).then(function (result) {
                        vm.goalIntervention = result.data;
                    }).finally(function () {
                        vm.filterInterventionList();
                    });
                }
            };

            vm.filterInterventionList = function () {
                var interventionList = angular.element("#interventionList option");

                $timeout(function () {
                    var temporaryElement = angular.element("<select id='temporaryList'></select>");

                    for (var i = 0; i < interventionList.length; i++) {
                        var isExists = vm.goalIntervention.interventions.filter(function (obj) {
                            return obj.id === vm.interventionList[i].id;
                        });

                        if (isExists.length > 0) {
                            var index = vm.interventionList.indexOf(vm.interventionList[i]);

                            if (index > -1) {
                                angular.element("#interventionList option[value='" + interventionList[i].value + "']").remove().appendTo(temporaryElement);
                            }
                        }
                    }

                    var selectedInterventionList = angular.element("#selectedInterventionList option");
                    var temporaryList = temporaryElement.find("option");

                    for (var j = 0; j < vm.goalIntervention.interventions.length; j++) {
                        var temporaryItem = $filter('filter')(temporaryList, { value: vm.goalIntervention.interventions[j].id });

                        if (temporaryItem.length > 0) {
                            temporaryElement.find("option[value='" + vm.goalIntervention.interventions[j].id + "']").appendTo('#selectedInterventionList');
                        }
                    }

                    // Need to use the below code to explicitly clear the highlight selection state
                    angular.element("#selectedInterventionList").val('selectedOptions', []);
                }, 0);
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    edit: abp.auth.hasPermission('Pages.Tenant.CarePlans'),
                    delete: abp.auth.hasPermission('Pages.Tenant.CarePlans')
                };

                vm.loadMaster();
                vm.loadInterventionList();
            }

            init();
        }
    ]);
})();