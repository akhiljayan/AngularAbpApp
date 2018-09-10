(function () {
    appModule.component('progressnoteEditTag', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: [
            'abp.services.app.progressNote',
            function (progressNoteService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.saving = false;
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        ctrl.saving = true;

                        progressNoteService.getTagsForEdit({
                            id: ctrl.resolve.progressNoteId
                        }).then(function (result) {
                            ctrl.tags = result.data;
                        }).finally(function () {
                            ctrl.saving = false;
                        });
                    }
                };

                ctrl.save = function () {
                    ctrl.saving = true;

                    progressNoteService.updateTags({
                        id: ctrl.resolve.progressNoteId,
                        tags: ctrl.tags
                    }).then(function (result) {
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
        templateUrl: '~/App/tenant/views/care/progressnote/progressnote-edit-tag/progressnote-edit-tag.cshtml'
    });
})();