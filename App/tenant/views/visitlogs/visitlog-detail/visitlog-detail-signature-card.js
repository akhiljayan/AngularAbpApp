(function (_) {
    appModule.component('visitlogDetailSignatureCard', {
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: function () {
            var EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjgAAADcCAQAAADXNhPAAAACIklEQVR42u3UIQEAAAzDsM+/6UsYG0okFDQHMBIJAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHADDAQwHMBwAwwEMB8BwAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEwHMBwAMMBMBzAcAAMBzAcwHAADAcwHADDAQwHMBwAwwEMB8BwAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcCQADAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHMBwAAwHMBwAwwEMBzAcAMMBDAfAcADDAQwHwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHMBwAAwHMBwAwwEMB8BwAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDkQAwHMBwAAwHMBwAwwEMBzAcAMMBDAfAcADDAQwHwHAAwwEwHMBwAMMBMBzAcAAMBzAcwHAADAcwHADDAQwHMBwAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHMBwAAwHMBwAwwEMBzAcAMMBDAegeayZAN3dLgwnAAAAAElFTkSuQmCC';
            var ctrl = this;
            
            ctrl.$onInit = function () {
                ctrl.emptyImage = EMPTY_IMAGE;
            };

            ctrl.$onChanges = function (changes) {
                if (changes.model) {
                    ctrl.workingModel = _.pick(ctrl.model, [
                        'signatureBody', 'categories', 'nameOfPerson'
                    ]);

                    ctrl.dataurl = ctrl.workingModel.signatureBody;
                }
            };

            ctrl.save = function (event) {
                ctrl.workingModel.renderedServices = [];

                for (var i = 0; i < ctrl.workingModel.categories.length; i++) {
                    var category = ctrl.workingModel.categories[i];

                    for (var x = 0; x < category.visitServices.length; x++) {
                        if (category.visitServices[x].isChecked) {
                            ctrl.workingModel.renderedServices.push(category.visitServices[x]);
                        }
                    }
                }

                if (ctrl.signature.isEmpty) {
                    ctrl.workingModel.signatureBody = null;
                } else {
                    ctrl.workingModel.signatureBody = ctrl.signature.dataUrl;
                }

                ctrl.onUpdate({
                    event: {
                        data: ctrl.workingModel,
                        success: closeEditMode
                    }
                });

                event.preventDefault();
            };

            ctrl.cancel = function () {
                closeEditMode();
            };

            function closeEditMode() {
                ctrl.mode = 'view';
            }
        },
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-detail/visitlog-detail-signature-card.cshtml'
    });
})(_);