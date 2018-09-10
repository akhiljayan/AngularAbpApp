(function () {
    appModule.component('centreUiSelect', {
        bindings: {
            centreId: '=',
            uiselectDisabled: '<',
            required: '<',
            repeat: '<',
            onSelect: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', 'abp.services.app.centre',
            function ($scope, centre) {
                var ctrl = this;
                ctrl.centreId = null;
                ctrl.centres = [];
                ctrl.$onInit = function () {
                    getAllAllowedCentresAndSet();
                };

                ctrl.$onChanges = function (changes) {
                    getAllAllowedCentresAndSet();
                    if (changes.uiselectDisabled && changes.uiselectDisabled.currentValue) {
                        ctrl.disabled = changes.uiselectDisabled.currentValue;
                    }
                };

                ctrl.$doCheck = function () {
                    if (typeof ctrl.centreId == 'undefined' && ctrl.centres.length == 1) {
                        ctrl.centreId = ctrl.centres[0].id;
                    }
                };

                function getAllAllowedCentresAndSet() {

                    centre.getAllCentresLookUpInUserOU().then(function (result) {
                        if (ctrl.repeat) {
                            ctrl.centres = ctrl.repeat;
                        } else {
                            ctrl.centres = result.data;
                            if (ctrl.centres.length == 1) {
                                ctrl.centreId = ctrl.centres[0].id;
                            }
                        }

                    });
                };


                ctrl.select = function (item) {
                    if (item != null) {
                        callback(item.id);
                    }
                };

                function callback(centreId) {
                    ctrl.onSelect({ centreId: centreId });
                }
            },
        ],
        templateUrl: '~/App/common/directives/centreUiSelect.cshtml'
    });
})();