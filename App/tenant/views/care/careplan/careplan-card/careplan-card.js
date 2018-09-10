(function () {
    appModule.component('careplanCard', {
        require: {
            parentCtrl: '^careTabContent'
        },
        bindings: {
            personId: '<',
            filter: '<',
            showDetails: '=',
            selectViews: '<',
            selectViewChange: '<',
            loadProgressNote: '=',
            loading: '=',
            onSelectPersonProblem: '&'
        },
        controller: [
            'abp.services.app.carePlan', '$timeout', '$scope', '$uibModal', '$sce', '$filter', 'abp.services.app.personProblem',
            function (carePlanService, $timeout, $scope, $uibModal, $sce, $filter, personProblemService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.permissions = ctrl.parentCtrl.permissions;

                    ctrl.load();

                    // Add Load / Create function to parentCtrl if permission granted
                    if (ctrl.permissions.createCarePlan) {
                        ctrl.parentCtrl.addCreateFunction(ctrl.create, 'CarePlan');
                    }
                    if (ctrl.permissions.viewCarePlan) {
                        ctrl.parentCtrl.addLoadFunction(ctrl.load, 'CarePlan');
                    }
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.selectViewChange) {
                        ctrl.load();
                    }

                    if (changes.personId) {
                        changes.personId.currentValue && ctrl.load();
                    }
                };

                ctrl.load = function (requestParams) {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;
                    ctrl.key = getFilterKeys();

                    carePlanService.getCarePlansByPersonId(
                        $.extend({
                            view: ctrl.selectViews,
                            filter: ctrl.filter,
                        }, { personId: ctrl.personId }, requestParams)
                    ).then(function (result) {
                        ctrl.result = result;

                        for (var i = 0; i < ctrl.result.data.items.length; i++) {
                            preparePersonProblemPopoverContent(ctrl.result.data.items[i]);
                        }
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.setActionButtonRule = function (status) {
                    // Open
                    if (status == 0) {
                        ctrl.statusOptions = { 'Open': false, 'Suspended': true, 'Closed': true, 'Resolved': true };
                    }
                    // Suspended
                    else if (status == 1) {
                        ctrl.statusOptions = { 'Open': true, 'Suspended': false, 'Closed': true, 'Resolved': true };
                    }
                    // Resolved
                    else if (status == 2) {
                        ctrl.statusOptions = { 'Open': true, 'Suspended': false, 'Closed': true, 'Resolved': false };
                    }
                    // Closed
                    else if (status == 3) {
                        ctrl.statusOptions = { 'Open': true, 'Suspended': false, 'Closed': false, 'Resolved': false };
                    }
                    else {
                        ctrl.statusOptions = { 'Open': false, 'Suspended': false, 'Closed': false, 'Resolved': false };
                    }

                    return ctrl.statusOptions;
                };

                ctrl.create = function () {
                    openCarePlanFormWizardModal("new", $scope.EmptyGuid, ctrl.personId, null);
                };

                ctrl.addCarePlanGoal = function (typesid, careplan) {
                    openCarePlanFormWizardModal("addGoal", typesid, ctrl.personId, careplan);
                };

                ctrl.edit = function (typesid, careplan) {
                    openCarePlanFormWizardModal("edit", typesid, ctrl.personId, careplan);
                };

                ctrl.change = function (enable, type, id, state, careplanId) {
                    var canProceed = false;

                    if (!enable) {
                        return;
                    }

                    if ((state == 3 || state == 2) && type == 'Problem List') {
                        personProblemService.canClosePersonProblem({
                            id: id,
                            maxOpenCount: 1
                        }).then(function (result) {
                            var canClose = result.data;

                            if (!canClose) {
                                if (state == 3) {
                                    abp.message.error(app.localize('ProblemCannotClosed'));
                                } else if (state == 2) {
                                    abp.message.error(app.localize('ProblemCannotResolved'));
                                }

                                return;
                            }

                            openModalPopup(type, id, state, careplanId);
                        });
                    } else {
                        openModalPopup(type, id, state, careplanId);
                    }
                };

                function openModalPopup(type, id, state, careplanId) {
                    var careplanId = careplanId || null;

                    var modalInstance = $uibModal.open({
                        component: 'careAction',
                        backdrop: 'static',
                        resolve: {
                            id: function () {
                                return id;
                            },
                            status: function () {
                                return state;
                            },
                            type: function () {
                                return type;
                            },
                            careplanId: function () {
                                return careplanId;
                            },
                            submittedFrom: function () {
                                return 1;
                            }
                        }
                    });

                    modalInstance.result.then(function (input) {
                        // State = 3 (Closed)
                        if (type == 'CarePlan' && state == 3) {
                            carePlanService.getSuspendCloseCarePlan(
                                input
                            ).then(function (result) {
                                var isExists = result.data;

                                if (!isExists) {
                                    abp.message.confirm(
                                        app.localize('ConfirmCloseProblem'),
                                        function (isConfirmed) {
                                            if (isConfirmed) {
                                                carePlanService.closePersonProblem(
                                                    input
                                                ).finally(function () {
                                                    ctrl.load();
                                                });
                                            }
                                            else {
                                                ctrl.load();
                                            }
                                        }
                                    );
                                }
                                else {
                                    ctrl.load();
                                }
                            });
                        }
                        else {
                            ctrl.load();
                        }
                    });
                };

                function preparePersonProblemPopoverContent(problem) {
                    var html = '<ul>';

                    if (problem.personProblem.problemDescription) {
                        html += '<p>' + problem.personProblem.problemDescription + '</p><hr/>';
                    }

                    for (var j = 0; j < problem.logs.length; j++) {
                        var log = problem.logs[j];
                        html += '<li>' + createStatusHtml(log.actionDate, log.actionByUser.fullName, log.previousStatus, log.currentStatus, log.remarks) + '</li>';
                    }

                    html += '<ul>';

                    problem.personProblem.popoverContent = $sce.trustAsHtml(html);

                    var types = [];

                    for (var i = 0; i < problem.carePlans.length; i++) {
                        prepareCarePlanPopoverContent(problem.carePlans[i]);
                        types.push(problem.carePlans[i].carePlanType.description);
                    }

                    problem.summary = types.join(', ');
                }

                function prepareCarePlanPopoverContent(carePlan) {
                    carePlan.summary = carePlan.carePlanGoals.length + ' Goal(s): ' + computeStatusSummary(carePlan.carePlanGoals);

                    var html = '<ul>';

                    for (var j = 0; j < carePlan.logs.length; j++) {
                        var log = carePlan.logs[j];
                        html += '<li>' + createStatusHtml(log.actionDate, log.actionByUser.fullName, log.previousStatus, log.currentStatus, log.remarks) + '</li>';
                    }

                    html += '</ul>';

                    carePlan.log = $sce.trustAsHtml(html);

                    if (carePlan.reviews.length > 0) {
                        var lastReview = carePlan.reviews[carePlan.reviews.length - 1];
                        carePlan.popoverContent = $sce.trustAsHtml(createLastReviewHtml(lastReview.progressNoteDateTime, lastReview.creatorUser.fullName, lastReview.subject));

                        // Review history
                        var reviews = '<ul style="list-style-type: none;">';
                        for (var i = 0; i < carePlan.reviews.length; i++) {
                            var review = carePlan.reviews[i];
                            reviews += '<li>' + createReviewHistoryHtml(review.progressNoteDateTime, review.creatorUser.fullName, review.subject) + '</li>';
                        }

                        reviews += '</ul>';

                        carePlan.reviewHistoryPopoverContent = $sce.trustAsHtml(reviews);
                    } else {
                        carePlan.popoverContent = $sce.trustAsHtml('N/A');
                    }

                    for (var i = 0; i < carePlan.carePlanGoals.length; i++) {
                        prepareCarePlanGoalPopoverContent(carePlan.carePlanGoals[i]);
                    }
                }

                function prepareCarePlanGoalPopoverContent(goal) {
                    var html = '<ul>';

                    for (var j = 0; j < goal.logs.length; j++) {
                        var log = goal.logs[j];
                        html += '<li>' + createStatusHtml(log.actionDate, log.actionByUser.fullName, log.previousStatus, log.currentStatus, log.remarks) + '</li>';
                    }

                    html += '</ul>';

                    goal.popoverContent = $sce.trustAsHtml(html);
                    goal.summary = goal.carePlanGoalInterventions.length + ' Intervention(s): ' + computeStatusSummary(goal.carePlanGoalInterventions);

                    for (var i = 0; i < goal.carePlanGoalInterventions.length; i++) {
                        prepareCarePlanGoalInterventionPopoverContent(goal.carePlanGoalInterventions[i]);
                    }
                }

                function prepareCarePlanGoalInterventionPopoverContent(intervention) {
                    var html = '<ul>';
                    for (var j = 0; j < intervention.logs.length; j++) {
                        var log = intervention.logs[j];
                        html += '<li>' + createStatusHtml(log.actionDate, log.actionByUser.fullName, log.previousStatus, log.currentStatus, log.remarks) + '</li>';
                    }
                    html += '</ul>';

                    intervention.popoverContent = $sce.trustAsHtml(html);
                }

                function createStatusHtml(date, name, previousStatus, currentStatus, remarks) {
                    formattedDate = $filter('dateFormat')(date);
                    currentStatus = $filter('enumText')(currentStatus, 'careStatusType');

                    if (previousStatus >= 0) {
                        previousStatus = $filter('enumText')(previousStatus, 'careStatusType');
                    }

                    if (previousStatus == null) {
                        return 'Status \'<strong>' + currentStatus + '</strong>\' on <strong>' + formattedDate + '</strong> by <strong>' + name + '</strong>.';
                    }

                    return 'Status changed from \'<strong>' + previousStatus + '</strong>\' to \'<strong>' + currentStatus + '</strong>\' on <strong>' + formattedDate + '</strong> by <strong>' + name + '</strong>.<br/><strong>' + remarks + '</strong>';
                }

                function createLastReviewHtml(date, name, remarks) {
                    formattedDate = $filter('dateFormat')(date);

                    return 'Last reviewed on <strong>' + formattedDate + '</strong> by <strong>' + name + '</strong>.<br/>' + remarks;
                }

                function createReviewHistoryHtml(date, name, remarks) {
                    formattedDate = $filter('dateFormat')(date);

                    return 'Reviewed on <strong>' + formattedDate + '</strong> by <strong>' + name + '</strong>.<br/><strong>' + remarks + '</strong>';
                }

                function computeStatusSummary(items) {
                    var statusCount = [0, 0, 0, 0];
                    var text = [];

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        statusCount[item.status]++;
                    }

                    if (statusCount[0]) {
                        text.push(statusCount[0] + ' Open');
                    }

                    if (statusCount[3]) {
                        text.push(statusCount[3] + ' Closed');
                    }

                    if (statusCount[1]) {
                        text.push(statusCount[1] + ' Suspended');
                    }

                    if (statusCount[2]) {
                        text.push(statusCount[2] + ' Resolved');
                    }

                    return text.join(', ');
                }

                function openCarePlanFormWizardModal(mode, id, pid, items) {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'careplanFormWizard',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return pid;
                            },
                            typeId: function () {
                                return id;
                            },
                            action: function () {
                                if (mode == "new") {
                                    return "Create Care Plan";
                                } else if (mode == "edit") {
                                    return "Edit Care Plan";
                                } else {
                                    return "Add Goal/Intervention";
                                }
                            },
                            mode: function () {
                                return mode;
                            },
                            items: function () {
                                return items;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.load();
                    });
                };

                ctrl.reviewCareplan = function (typesid, careplan) {
                    ctrl.loadProgressNote = false;

                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'careplanReview',
                        backdrop: 'static',
                        //windowClass: 'larger-modal',
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return ctrl.personId;
                            },
                            typeId: function () {
                                return typesid;
                            },
                            action: function () {
                                return "Review Care Plan";
                            },
                            careplanItems: function () {
                                return careplan;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.load();
                        ctrl.loadProgressNote = true;
                    });
                }

                function getFilterKeys() {
                    var key = "";

                    key += ctrl.filter;

                    for (var i = 0; i < ctrl.selectViews.length; i++) {
                        key += ctrl.selectViews[i];
                    }

                    return key;
                }

                ctrl.select = function (personProblem) {
                    $timeout(function () {
                        personProblem.isSelected = !personProblem.isSelected;

                        ctrl.onSelectPersonProblem({
                            event: {
                                id: personProblem.id,
                                isSelected: personProblem.isSelected
                            }
                        });
                    });

                    event.preventDefault();
                    event.stopPropagation();
                };

                ctrl.isOverdue = function (inputDate) {
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);

                    return new Date(inputDate) < today;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/care/careplan/careplan-card/careplan-card.cshtml'
    });
})();
