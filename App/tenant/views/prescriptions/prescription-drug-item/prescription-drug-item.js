(function () {
    appModule.component('prescriptionDrugItem', {
        bindings: {
            model: '<',
            showDetails: '=',
            onSelect: '&',
            unitOfMeasurementMaster:'<'
        },
        controller: [
            '$timeout', '$filter',
            function ($timeout, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.displayDose(ctrl.model.doseInteger, ctrl.model.doseFractional, ctrl.model.doseUomId);
                    }
                };

                ctrl.backgroundColor = function (item) {
                    var colorClass;

                    if (item != null) {
                        item = $filter('enumText')(item, 'prescriptionOrderStatus');
                    }

                    if (item == 'Unchecked') {
                        colorClass = 'order-status-color-orange';
                    } else if (item == 'Provisional') {
                        colorClass = 'order-status-color-pink';
                    } else if (item == 'Referral') {
                        colorClass = 'order-status-color-blue';
                    } else if (item == 'Confirmed') {
                        colorClass = '';
                    } else {
                        colorClass = 'order-status-color-grey';
                    }

                    return colorClass;
                };

                ctrl.cbxChecked = function (event) {
                    event.preventDefault();

                    $timeout(function () {
                        ctrl.model.isChecked = !ctrl.model.isChecked;

                        ctrl.onSelect({
                            event: {
                                data: ctrl.model
                            }
                        });
                    });
                }

                ctrl.isNumber = function (number) {
                    return angular.isNumber(number) && !isNaN(number);
                }

                ctrl.displayDose = function (doseInt, doseFrac, doseUomId) {
                    var dose;
                    if (doseFrac) {
                        dose = parseInt(doseInt) + "." + doseFrac + ctrl.getUomName(doseUomId);
                    } else {
                        dose = parseInt(doseInt) + "" + ctrl.getUomName(doseUomId);
                    }
                    ctrl.model.dose = dose;
                }

                ctrl.getUomName = function (uomId) {
                    if (uomId) {
                        var uom = ctrl.unitOfMeasurementMaster.find(function (x) {
                            return x.id == uomId;
                        });

                        return uom.description;
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/prescriptions/prescription-drug-item/prescription-drug-item.cshtml'
    });
})();
