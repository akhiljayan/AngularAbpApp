(function () {
    appModule.component('problemlistCareplanCard', {
        bindings: {
            personId: '<'
        },
        controller: [
            'mockProblemListDataService', 'mockCarePlanDataService', '$uibModal',
            function (problemListService, carePlanService, $uibModal) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.personproblems = [{ name: 'Problem 1' }, { name: 'Problem 2' }];
                    ctrl.careplans = [{ name: 'Plan 1' }, { name: 'Plan 2' }];
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId.currentValue) {
                       
                    }
                };

                ctrl.create = function () {
                    ctrl.mode = "new";
                    ctrl.model = {
                        priorityType: 1,
                        onsetDate: abp.clock.now()
                    };
                    ctrl.popOutProblemListModal(null);
                };

                ctrl.edit = function (problemListId) {
                    ctrl.mode = "edit";
                    ctrl.model = {
                        priorityType: 2,
                        problemName: "Problem 6",
                        problemDescription: "This is Prob. 6",
                        onsetDate: abp.clock.now(),
                        reviewDate: abp.clock.now().setMonth(abp.clock.now().getMonth() + 6),
                        tags: ["aa", "bb", "cc"]
                    };
                    ctrl.popOutProblemListModal(problemListId);
                };

                ctrl.popOutProblemListModal = function (problemListId) {
                    var modalInstance = $uibModal.open({
                        component: 'problemlistDetail',
                        backdrop: 'static',
                        resolve: {
                            problemListId: function () {
                                return problemListId;
                            },
                            mode: function () {
                                return ctrl.mode;
                            },
                            model: function () {
                                return ctrl.model;
                            },
                            personId: function () {
                                return ctrl.personId;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        //ctrl.load();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/person/care/problemlist-careplan-card/problemlist-careplan-card.cshtml'
    });
})();
