(function () {
    appModule.component('psCkeditor', {
        bindings: {
            model: '=',
            maxCharCount:'<',
            ngDisabled: '<'
        },
        controllerAs: 'vm',
        controller: [
            function() {
                var ctrl = this;
                ctrl.ckEditorName = "ckedit";

                ctrl.$onDestroy = function() {
                    CKEDITOR.instances[ctrl.ckEditorName].destroy();
                };
                CKEDITOR.config.baseFloatZIndex = 102000;
                CKEDITOR.on("instanceReady",
                    function(event) {
                        ctrl.ckEditorName = event.editor.name;
                });

            },
        ],
        templateUrl: '~/App/common/directives/psCkeditor.cshtml'
    });
})();