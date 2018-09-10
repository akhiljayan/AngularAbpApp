(function () {
    appModule.component("drugEntryWidget", {
        bindings: {
            mode: '=',
            model: '<',
            onAddDrug: '&',
            onUpdateDrug: '&',
            onClearForm: '<',
            unitOfMeasurementMaster: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$filter', 'abp.services.app.drug', 'abp.services.app.drugFrequency', 'abp.services.app.drugRoute', 'abp.services.app.drugSource',
            function ($scope, $filter, drugService, drugFrequencyService, drugRouteService, drugSourceService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.isCollaped = true;
                    // Drugs Master
                    drugService.getDrugs({}
                    ).then(function (result) {
                        ctrl.drugs = result.data.items;
                    });

                    // Drug Frequency Master
                    drugFrequencyService.getDrugFrequencies({}
                    ).then(function (result) {
                        ctrl.drugFrequencyMaster = result.data.items;
                    });

                    // Drug Route Master
                    drugRouteService.getDrugRoutes({}
                    ).then(function (result) {
                        ctrl.drugRouteMaster = result.data.items;
                    });

                    // Drug Source Master
                    drugSourceService.getDrugSources({}
                    ).then(function (result) {
                        ctrl.drugSourceMaster = result.data.items;
                    });

                    ctrl.workingModel = {};
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model || changes.mode) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                            ctrl.oldValue = angular.copy(ctrl.model);
                        } else if (ctrl.mode == 'edit') {
                            ctrl.workingModel = angular.copy(ctrl.model);
                            ctrl.oldValue = angular.copy(ctrl.model);

                            if (ctrl.workingModel) {
                                if (angular.isNumber(ctrl.workingModel.type)) {
                                    ctrl.workingModel.type = $filter('enumText')(ctrl.workingModel.type, 'prescriptionType');
                                }
                                ctrl.loadDrugDetails(ctrl.workingModel.drugStrength)
                            }
                        }
                    }

                    if (changes.onClearForm && typeof (changes.onClearForm.currentValue) == 'boolean') {
                        ctrl.clearEntryFrom();
                    }
                };

                ctrl.saveOrUpdate = function (status, $event) {
                    var dose;
                    if (ctrl.workingModel.doseFractional) {
                        dose = parseInt(ctrl.workingModel.doseInteger) + "." + ctrl.workingModel.doseFractional + ctrl.getUomName(ctrl.workingModel.doseUomId);
                    } else {
                        dose = parseInt(ctrl.workingModel.doseInteger) + "" + ctrl.getUomName(ctrl.workingModel.doseUomId);
                    }
                    ctrl.workingModel.doseInteger = parseInt(ctrl.workingModel.doseInteger);
                    ctrl.workingModel.dose = dose;

                    if (ctrl.workingModel.quantityInteger) {
                        ctrl.workingModel.quantityInteger = parseInt(ctrl.workingModel.quantityInteger);
                    }
                    ctrl.form.submitted = true;

                    if (ctrl.form.$valid == true) {
                        if (status == "save") {
                            ctrl.add($event);
                        } else {
                            ctrl.update($event);
                        }
                    }
                };

                ctrl.add = function ($event) {
                    ctrl.onAddDrug({
                        event: {
                            data: ctrl.workingModel,
                            oldValue: ctrl.oldValue,
                            success: ctrl.clearEntryFrom,
                            failure: ctrl.popOutPrescriptionDuplicateErrorMessage
                        }
                    });

                    event.preventDefault();
                };

                ctrl.update = function ($event) {
                    ctrl.onUpdateDrug({
                        event: {
                            data: ctrl.workingModel,
                            oldValue: ctrl.oldValue,
                            success: ctrl.clearEntryFrom,
                            failure: ctrl.popOutPrescriptionDuplicateErrorMessage
                        }
                    });

                    event.preventDefault();
                };

                ctrl.clearEntryFrom = function () {
                    // Clear form with no data and inline error message
                    //debugger;
                    $scope.$broadcast('show-errors-remove');
                    ctrl.form.submitted = false;
                    ctrl.workingModel = {};
                    ctrl.mode = "new";
                    ctrl.form.$setPristine();
                    ctrl.form.$setUntouched();

                };

                ctrl.popOutPrescriptionDuplicateErrorMessage = function () {
                    abp.message.error(app.localize('PrescriptionDuplicateInList'));
                };

                ctrl.loadDrugDetails = function (drugStrength) {
                    var drugId;
                    var drug = {};

                    if (ctrl.drugs) {
                        for (var i = 0; i < ctrl.drugs.length; i++) {
                            if (ctrl.drugs[i].description == drugStrength) {
                                drugId = ctrl.drugs[i].id;
                                drug = ctrl.drugs[i];
                                break;
                            }
                        }
                    }

                    ctrl.workingModel.drugId = drugId;
                    ctrl.workingModel.drug = drug;

                    // Initialise text in Drug Category and Drug Type
                    if (ctrl.workingModel.drug) {
                        ctrl.workingModel.drug.drugTypeDescription = $filter('enumText')(ctrl.workingModel.drug.drugType, 'drugType');
                        ctrl.workingModel.drug.drugCategoryDescription = $filter('enumText')(ctrl.workingModel.drug.drugCategory, 'drugCategory');
                    }
                };

                ctrl.loadDrugFrequencyDetail = function (drugFrequencyId) {
                    var drugFrequency = {};

                    for (var i = 0; i < ctrl.drugFrequencyMaster.length; i++) {
                        if (ctrl.drugFrequencyMaster[i].id == drugFrequencyId) {
                            drugFrequency = ctrl.drugFrequencyMaster[i];
                            break;
                        }
                    }

                    ctrl.workingModel.drugFrequency = drugFrequency;
                };

                ctrl.loadDrugRouteDetail = function (drugRouteId) {
                    var drugRoute = {};

                    for (var i = 0; i < ctrl.drugRouteMaster.length; i++) {
                        if (ctrl.drugRouteMaster[i].id == drugRouteId) {
                            drugRoute = ctrl.drugRouteMaster[i];
                            break;
                        }
                    }

                    ctrl.workingModel.drugRoute = drugRoute;
                };

                ctrl.loadDrugBasedOnSource = function (drugSourceId) {
                    if (!drugSourceId) {
                        return;
                    }

                    // Retrieve Description for Drug Source (Display)
                    var drugSource = ctrl.drugSourceMaster.find(function (x) {
                        return x.id == drugSourceId;
                    });
                    ctrl.workingModel.drugSource = drugSource;

                    drugService.getDrugsByDrugSource({
                        drugSourceId: drugSourceId
                    }).then(function (result) {
                        ctrl.drugs = result.data.items;
                    });
                };

                ctrl.NumberOnly = function (evt) {
                    var theEvent = evt || window.event;
                    var key = theEvent.keyCode || theEvent.which;
                    key = String.fromCharCode(key);
                    var regex = /[0-9]/;
                    if (!regex.test(key)) {
                        theEvent.returnValue = false;
                        if (theEvent.preventDefault) theEvent.preventDefault();
                    }
                }

                ctrl.doseValidator = function (integer, fractional) {
                    integer = parseInt(integer) || 0;
                    fractional = parseInt(fractional) || 0;

                    var combineNumber = integer + fractional;

                    if (integer == 0 && fractional == 0) {
                        return 'Dose is required';
                    } else if (integer == 0 && fractional != 0) {
                        if (combineNumber <= 0) {
                            return 'Dose is required';
                        } else {
                            ctrl.workingModel.doseInteger = 0;
                        }
                    } else if (integer != 0 && fractional != 0) {
                        if (combineNumber <= 0) {
                            return 'Dose is required';
                        }
                    }
                    return true;
                };

                ctrl.getUomName = function (uomId) {
                    if (uomId) {
                        var uom = ctrl.unitOfMeasurementMaster.find(function (x) {
                            return x.id == uomId;
                        });
                        return uom.description;
                    }
                }

                ctrl.quantityTextChanged = function () {
                    var integer = ctrl.workingModel.quantityInteger;
                    var fractional = ctrl.workingModel.quantityFractional;

                    if (ctrl.workingModel.quantityInteger) {
                        ctrl.workingModel.quantityInteger = parseInt(ctrl.workingModel.quantityInteger);
                    }

                    if (ctrl.workingModel.quantityFractional) {
                        integer = parseInt(integer) || 0;
                        fractional = parseInt(fractional) || 0;
                        var combineNumber = integer + fractional;
                        if (integer == 0 && fractional != 0) {
                            ctrl.workingModel.quantityInteger = 0;
                        }
                    }

                };
            }
        ],
        templateUrl: "~/App/tenant/views/prescriptions/prescription-detail/drug-entry-widget.cshtml"
    });
})();