(function () {
    appModule.component('mohMasterCodeMappingsDetail', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: "vm",
        controller: [
            '$state', '$rootScope', '$location', 'abp.services.app.mOHMasterCodeMapping',
            function ($state, $rootScope, $location, mohMasterCodeMappingsService) {
                var ctrl = this
                ctrl.editMode = false;

                ctrl.cancel = function () {
                    ctrl.modalInstance.dismiss();
                };

                ctrl.$onInit = function () {

                    /* Binding parameter from parent component. */
                    ctrl.disableSave = false;
                    ctrl.mohMasterCodeMappingsId = ctrl.resolve.id;

                    if (ctrl.mohMasterCodeMappingsId != null)
                        ctrl.editMode = true;

                    mohMasterCodeMappingsService.getMOHMasterCodeMappingForEdit({ id: ctrl.mohMasterCodeMappingsId }).then(function (result) {
                        ctrl.mohMasterCodeMapping = result.data;
                    });
                }

                ctrl.save = function (mohMasterCodeMapping) {
                    ctrl.disableSave = true;

                    if (ctrl.editMode && ctrl.mohMasterCodeMappingsId != app.consts.EmptyGuid) {
                        mohMasterCodeMappingsService.updateMOHMasterCodeMapping(mohMasterCodeMapping).then(function (result) {
                            ctrl.modalInstance.close();
                        });
                    } else {
                        mohMasterCodeMappingsService.createMOHMasterCodeMapping(mohMasterCodeMapping).then(function (result) {
                            ctrl.modalInstance.close();
                        }).finally(function () {
                            ctrl.disableSave = false;
                        });
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/mohMasterCodeMappings/moh-master-code-mappings-detail.cshtml'
    });
})();