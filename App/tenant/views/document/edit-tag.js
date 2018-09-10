(function () {
    appModule.component('documentEditTag', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: [
            'abp.services.app.document',
            function (documentService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.saving = false;
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        ctrl.saving = true;

                        documentService.getTagsForDocumentFile(ctrl.resolve.id).then(function (result) {
                            ctrl.tags = result.data;
                        }).finally(function () {
                            ctrl.saving = false;
                        });
                    }
                };

                ctrl.save = function () {
                    ctrl.saving = true;

                    documentService.createUpdateTagForDocumentFile({
                        id: ctrl.resolve.id,
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
        templateUrl: '~/App/tenant/views/document/edit-tag.cshtml'
    });
})();