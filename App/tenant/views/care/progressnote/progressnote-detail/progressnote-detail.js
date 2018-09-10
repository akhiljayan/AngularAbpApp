(function () {
    appModule.component('progressnoteDetail', {
        bindings: {
            mode: '<',
            model: '<',
            resolve: '<',
            saving: '<',
            onSave: '&',
            onCancel: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', 'abp.services.app.progressNote', 'abp.services.app.personProblem', 'abp.services.app.progressNoteType',
            function ($scope, progressNoteService, personProblemService, progressNoteTypeService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        createAndConfirmProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.CreateAndConfirm'),
                        createDraftProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.CreateAsDraft'),
                        createConfidentialProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.CreateAsConfidential')
                    };

                    loadProgressNoteTypes();
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        var resolve = changes.resolve.currentValue;

                        if (resolve.personId) {
                            ctrl.personId = resolve.personId;
                            ctrl.model = ctrl.model || {};
                            ctrl.model.personId = resolve.personId;

                            loadPersonProblems(resolve.personId);
                        }

                        if (resolve.visitLogId) {
                            ctrl.visitLogId = resolve.visitLogId;
                            ctrl.minProgressNoteDateTime = resolve.visitDateTimeIn;
                            ctrl.maxProgressNoteDateTime = resolve.visitDateTimeOut;
                        } else {
                            ctrl.minProgressNoteDateTime = null;
                            ctrl.maxProgressNoteDateTime = null;
                        }
                    }

                    if (changes.model) {
                        if (ctrl.model.personProblemId && ctrl.model.personProblemId.length > 0) {
                            loadPersonProblems(ctrl.personId);
                        }
                    }
                };

                ctrl.save = function (saveMode) {
                    $scope.$broadcast('check-select-ui-required');
                    ctrl.form.submitted = true;

                    if (ctrl.form.$valid) {
                        if (saveMode == 0 && ctrl.mode == 'new') {
                            abp.message.confirm(
                                app.localize('CommitProgressNoteMessage'),
                                function (isConfirmed) {
                                    if (!isConfirmed) {
                                        return;
                                    } else {
                                        ctrl.onSave({
                                            event: {
                                                model: ctrl.model,
                                                saveMode: saveMode
                                            }
                                        });
                                    }
                                }
                            );
                        } else {
                            ctrl.onSave({
                                event: {
                                    model: ctrl.model,
                                    saveMode: saveMode
                                }
                            });
                        }
                    }
                };

                ctrl.cancel = function () {
                    ctrl.onCancel();
                };

                function loadProgressNoteTypes() {
                    progressNoteTypeService.getAllProgressNoteTypes({
                    }).then(function (result) {
                        ctrl.progressNoteTypes = result.data.items;
                    })
                };

                function loadPersonProblems(personId) {
                    personProblemService.getPersonProblemsByPersonId({
                        personId: personId,
                        StatusView: [0] // 0: All Status
                    }).then(function (result) {
                        var personProblems = result.data.items;

                        ctrl.personProblems = personProblems.map(function (personProblem) {
                            return {
                                id: personProblem.id,
                                description: personProblem.problem.description
                            };
                        });
                    })
                };
            }
        ],
        templateUrl: '~/App/tenant/views/care/progressnote/progressnote-detail/progressnote-detail.cshtml'
    });
})();