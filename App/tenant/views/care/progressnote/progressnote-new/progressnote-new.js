(function () {
    appModule.component('progressnoteNew', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: [
            'abp.services.app.progressNote', 'abp.services.app.personProblem', 'abp.services.app.progressNoteType',
            function (progressNoteService, personProblemService, progressNoteTypeService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'new';
                    ctrl.model = {
                        progressNoteDateTime: ctrl.resolve.visitDateTimeIn || abp.clock.now(),
                        personProblemId: ctrl.selectedPersonProblems
                    };
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        var resolve = ctrl.resolve;

                        if (resolve.personId) {
                            ctrl.personId = resolve.personId;
                        }
                    }

                    if (resolve.selectedPersonProblems) {
                        ctrl.selectedPersonProblems = angular.copy(resolve.selectedPersonProblems);
                    }

                    if (resolve.visitLogId) {
                        ctrl.visitLogId = resolve.visitLogId;
                    }
                };

                ctrl.createProgressNote = function (event) {
                    ctrl.saving = true;
                    var model = event.model;
                    model.personId = ctrl.personId;
                    model.progressNoteSaveMode = event.saveMode;

                    if (ctrl.visitLogId) {
                        model.visitLogId = ctrl.visitLogId;
                    }

                    progressNoteService.createProgressNote(
                        model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        ctrl.modalInstance.close();
                    }).finally(function () {
                        ctrl.saving = false;
                    });
                };

                ctrl.cancel = function () {
                    ctrl.modalInstance.dismiss();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/care/progressnote/progressnote-new/progressnote-new.cshtml'
    });
})();