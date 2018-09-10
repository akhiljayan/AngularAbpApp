(function () {
    appModule.component('progressnoteEdit', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: [
            'abp.services.app.progressNote',
            function (progressNoteService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = 'edit';
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        var resolve = ctrl.resolve;

                        if (resolve.personId) {
                            ctrl.personId = resolve.personId;
                        }

                        if (resolve.progressNoteId) {
                            ctrl.progressNoteId = resolve.progressNoteId;
                            ctrl.loadProgressNote();
                        }
                    }

                    if (resolve.selectedPersonProblems) {
                        ctrl.selectedPersonProblems = angular.copy(resolve.selectedPersonProblems);
                    }
                };

                ctrl.loadProgressNote = function () {
                    ctrl.saving = true;

                    progressNoteService.getProgressNoteForEdit({
                        id: ctrl.progressNoteId
                    }).then(function (result) {
                        ctrl.model = result.data;

                        ctrl.model.personProblemId = result.data.personProblems.map(function (personProblem) {
                            return personProblem.id;
                        });
                    }).finally(function () {
                        ctrl.saving = false;
                    });
                };

                ctrl.updateProgressNote = function (event) {
                    ctrl.saving = true;

                    var model = event.model;
                    model.progressNoteSaveMode = event.saveMode;

                    progressNoteService.updateProgressNote(
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
        templateUrl: '~/App/tenant/views/care/progressnote/progressnote-edit/progressnote-edit.cshtml'
    });
})();