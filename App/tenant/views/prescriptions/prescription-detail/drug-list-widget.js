(function () {
    appModule.component("drugListWidget", {
        bindings: {
            model: '<',
            index: '<',
            step: '<',
            showDetails: '=',
            onDeleteDrug: "&",
            unitOfMeasurementMaster: '<',
            currentAction:'<'
        },
        controller: [
            function () {
                var ctrl = this;

                ctrl.$onInit = function () {
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.displayDose(ctrl.model.doseInteger, ctrl.model.doseFractional, ctrl.model.doseUomId);
                    }
                };

                ctrl.deleteDrug = function ($event) {
                    ctrl.onDeleteDrug({
                        event: {
                            index: ctrl.index
                        }
                    });
                };

                ctrl.isNumber = function (number) {
                    return angular.isNumber(number) && !isNaN(number);
                };

                ctrl.displayDose = function (doseInt, doseFrac, doseUomId) {
                    var dose;
                    if (doseFrac) {
                        dose = parseInt(doseInt) + "." + doseFrac + ctrl.getUomName(doseUomId);
                    } else {
                        dose = parseInt(doseInt) + "" + ctrl.getUomName(doseUomId);
                    }
                    ctrl.model.dose = dose;
                };

                ctrl.getUomName = function (uomId) {

                    if (uomId) {
                        var uom = ctrl.unitOfMeasurementMaster.find(function (x) {
                            return x.id == uomId;
                        });

                        return uom.description;
                    }
                };
            }
        ],
        templateUrl: "~/App/tenant/views/prescriptions/prescription-detail/drug-list-widget.cshtml"
    });
})();