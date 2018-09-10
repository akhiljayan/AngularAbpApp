(function () {
    appModule.component("prescriptionDetail", {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.prescription', '$filter', 'abp.services.app.unitOfMeasurement',
            function (prescriptionService, $filter, unitOfMeasurementService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.mode = "new";
                    ctrl.model = {};
                    ctrl.model.prescriptionList = [];
                    ctrl.model.prescriptionItem = {};
                    ctrl.existedPrescription = 0;
                    ctrl.checking = false;

                    // ctrl.isDeleted = false;
                    // To prevent simultaneous saving of records which would result in duplicated records
                    ctrl.isSavingDisabled = false;

                    // Unit Of Measurement Master
                    unitOfMeasurementService.getUnitOfMeasurements({}
                    ).then(function (result) {
                        ctrl.unitOfMeasurementMaster = result.data.items;
                    });

                    if (!!ctrl.data) {
                        ctrl.model.prescriptionList = angular.copy(ctrl.data);
                    }
                };

                ctrl.$onChanges = function (changes) {
                    /* Dictionary with action as "key" and inner dictionary orderStatus as "key" and its value; 
                        and action as "key" and function to be called as "value"
                    */
                    ctrl.actionsListAndOrderStatus = {
                        "Add/Copy": { 'orderStatus': 1, 'action': ctrl.addPrescription },
                        "Void": { 'orderStatus': 2, 'action': ctrl.voidPrescription },
                        "Complete": { 'orderStatus': 4, 'action': ctrl.completePrescription },
                        "Stop": { 'orderStatus': 3, 'action': ctrl.stopPrescription },
                        "Counter-Check": { 'orderStatus': 0, 'action': ctrl.counterCheckPrescription },
                        "Confirm": { 'orderStatus': 1, 'action': ctrl.confirmPrescription }
                    };

                    if (changes.resolve) {
                        ctrl.workingModel = {};
                        ctrl.workingModel.orderBy = "";
                        ctrl.workingModel.designation = "";
                        ctrl.workingModel.medicalProfession = "";
                        ctrl.action = ctrl.resolve.action;
                        ctrl.data = ctrl.resolve.data;
                        ctrl.currentStep = 'next';
                        ctrl.inactiveReason = "";
                        ctrl.inactiveDate = "";

                        if (ctrl.action == 'Add/Copy') {
                            ctrl.currentStep = 'first';
                        }

                        prescriptionService.getCurrentUserMedicalProfile(
                        ).then(function (result) {
                            var user = result.data;
                            ctrl.workingModel.orderBy = user.fullName;
                            ctrl.workingModel.designation = user.designation;

                            if (user.medicalProfession != null) {
                                ctrl.workingModel.medicalProfession = $filter('enumText')(user.medicalProfession, 'medicalProfession');
                            }

                            if (ctrl.workingModel.medicalProfession.indexOf("Nurse") != -1 && ((ctrl.action == "Add/Copy") || (ctrl.action == "Counter-Check"))) {
                                if (ctrl.action == "Add/Copy") {
                                    ctrl.workingModel.orderStatus = 6;      // Unchecked
                                } else if (ctrl.action == "Counter-Check") {
                                    ctrl.workingModel.orderStatus = 0;      // Provisional
                                }
                            } else {
                                ctrl.workingModel.orderStatus = ctrl.actionsListAndOrderStatus[ctrl.action]['orderStatus'];
                            }
                        });
                    }
                };

                ctrl.proceed = function () {
                    ctrl.existedPrescription = 0;
                    ctrl.checking = true;
                    // Check each drug item is existed or not in the database for create Prescription
                    prescriptionService.checkIsExistedPrescriptions(
                        ctrl.model.prescriptionList
                    ).then(function (result) {
                        var data = result.data;

                        for (var i = 0; i < ctrl.model.prescriptionList.length; i++) {
                            ctrl.model.prescriptionList[i].isExistedPrescription = data[i];

                            // Calculate number of existed Presription item in database
                            if (data[i]) {
                                ctrl.existedPrescription++;
                            }
                        }

                        if (ctrl.existedPrescription == 0) {
                            ctrl.setStep('next');
                        } else {
                            abp.message.error(app.localize('PrescriptionDuplicateWithExistPrescription'))
                        }
                    }).finally(function () {
                        ctrl.checking = false;
                    });
                };

                ctrl.confirm = function () {
                    ctrl.actionsListAndOrderStatus[ctrl.action]['action']();
                };

                ctrl.isDuplicateOrder = function (oldValue, item) {
                    var duplication = false;
                    var index = -1;

                    for (var j = 0; j < ctrl.model.prescriptionList.length; j++) {
                        /*
                            Copy out prescription and remove 'isExistedPrescription' key
                            as this key is not required to included in checking
                        */
                        var prescription = angular.copy(ctrl.model.prescriptionList[j]);
                        if ('isExistedPrescription' in prescription) {
                            delete prescription['isExistedPrescription'];
                        }

                        if ('isExistedPrescription' in oldValue) {
                            delete oldValue['isExistedPrescription'];
                        }

                        if (!angular.equals(prescription, oldValue)) {
                            // If these two duplicated records contain same Drug Strength, Dose and Drug Frequency
                            if (prescription.drugStrength == item.drugStrength &&
                                prescription.dose == item.dose &&
                                prescription.drugFrequencyId == item.drugFrequencyId) {
                                duplication = true;
                            }
                        } else {
                            index = j;
                        }
                    }

                    return { 'duplication': duplication, 'index': index };
                }

                ctrl.cancel = function () {
                    ctrl.modalInstance.close();
                };

                ctrl.setStep = function (status) {
                    ctrl.currentStep = status;

                    // Clear selected prescription item and load drug details solution
                    ctrl.mode = 'new';
                    ctrl.model.prescriptionItem = null;
                    ctrl.model.prescriptionItemSelectedIndex = null;
                };

                ctrl.addDrug = function (event) {
                    event.data.personId = ctrl.resolve.personId;
                    // Check drug item to be added is existed in the list
                    var result = ctrl.isDuplicateOrder(event.oldValue, event.data);
                    if (result['duplication']) {
                        event.failure && event.failure();
                    } else {
                        event.success && event.success();
                        ctrl.model.prescriptionList.push(event.data);
                    }
                };

                ctrl.updateDrug = function (event) {
                    event.data.personId = ctrl.resolve.personId;

                    // Check drug item to be updated is existed in the list
                    var result = ctrl.isDuplicateOrder(event.oldValue, event.data);

                    if (result['duplication']) {
                        event.failure && event.failure();
                    } else if (result['index'] == -1) {
                        ctrl.addDrug(event);
                    } else {
                        event.success && event.success();
                        event.data.isExistedPrescription = false;
                        ctrl.model.prescriptionList[result['index']] = event.data;
                    }
                };

                ctrl.deleteDrug = function (event) {
                    ctrl.model.prescriptionList.splice(event.index, 1);
                    // Clear entry form
                    ctrl.isDeleted = !ctrl.isDeleted;
                };

                ctrl.showDrug = function (event) {
                    ctrl.model.prescriptionItem = event.data;
                    ctrl.model.prescriptionItemSelectedIndex = event.index;
                };

                ctrl.addPrescription = function () {
                    if (!ctrl.isSavingDisabled) {
                        ctrl.isSavingDisabled = true;

                        prescriptionService.createPrescription(
                            ctrl.model.prescriptionList
                        ).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            ctrl.modalInstance.close();
                        }).finally(function () {
                            ctrl.isSavingDisabled = false;
                        });
                    }
                };

                ctrl.voidPrescription = function () {
                    ctrl.form.submitted = true;
                    if (ctrl.form.$valid == true) {
                        if (!ctrl.isSavingDisabled) {
                            ctrl.isSavingDisabled = true;

                            prescriptionService.voidPrescription(
                                ctrl.model.prescriptionList, ctrl.inactiveReason
                                //, ctrl.inactiveDate
                            ).then(function (result) {
                                abp.notify.info(app.localize('UpdatedSuccessfully', angular.lowercase(app.localize("Voided"))));
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.isSavingDisabled = false;
                            });
                        }
                    }
                };

                ctrl.completePrescription = function () {
                    if (!ctrl.isSavingDisabled) {
                        ctrl.isSavingDisabled = true;

                        prescriptionService.completePrescription(
                            ctrl.model.prescriptionList
                        ).then(function (result) {
                            abp.notify.info(app.localize('UpdatedSuccessfully', angular.lowercase(app.localize("Completed"))));
                            ctrl.modalInstance.close();
                        }).finally(function () {
                            ctrl.isSavingDisabled = false;
                        });
                    }
                };

                ctrl.stopPrescription = function () {
                    ctrl.form.submitted = true;
                    if (ctrl.form.$valid == true) {
                        if (!ctrl.isSavingDisabled) {
                            ctrl.isSavingDisabled = true;

                            prescriptionService.stopPrescription(
                                ctrl.model.prescriptionList, ctrl.inactiveReason
                                //, ctrl.inactiveDate
                            ).then(function (result) {
                                abp.notify.info(app.localize('UpdatedSuccessfully', angular.lowercase(app.localize("Stopped"))));
                                ctrl.modalInstance.close();
                            }).finally(function () {
                                ctrl.isSavingDisabled = false;
                            });
                        }
                    }
                };

                ctrl.counterCheckPrescription = function () {
                    if (!ctrl.isSavingDisabled) {
                        ctrl.isSavingDisabled = true;

                        prescriptionService.counterCheckPrescription(
                            ctrl.model.prescriptionList
                        ).then(function (result) {
                            abp.notify.info(app.localize('UpdatedSuccessfully', angular.lowercase(app.localize("CounterChecked"))));
                            ctrl.modalInstance.close();
                        }).finally(function () {
                            ctrl.isSavingDisabled = false;
                        });
                    }
                };

                ctrl.confirmPrescription = function () {
                    if (!ctrl.isSavingDisabled) {
                        ctrl.isSavingDisabled = true;

                        prescriptionService.confirmPrescription(
                            ctrl.model.prescriptionList
                        ).then(function (result) {
                            abp.notify.info(app.localize('UpdatedSuccessfully', angular.lowercase(app.localize("Confirmed"))));
                            ctrl.modalInstance.close();
                        }).finally(function () {
                            ctrl.isSavingDisabled = false;
                        });
                    }
                };

                ctrl.showDetailsInForm = function (prescriptionItem, index) {
                    // Solution for swapping Prescription Item to be displayed in entry form
                    ctrl.model.prescriptionItem = prescriptionItem;
                    ctrl.model = angular.copy(ctrl.model); // temp workaround to trigger onchanges
                    ctrl.mode = "edit";
                };

                //ctrl.inactiveDateValidator = function (inputDate) {
                   
                //    if (inputDate) {
                //        if (!isValidDate(inputDate)) {
                //            return "invalid date format";
                //        }

                //        var selectedList = ctrl.model.prescriptionList;

                //        for (var i = 0; i < selectedList.length; i++) {
                //            var confirmedDateTime = new Date(selectedList[i].confirmedDateTime);
                //            var counterCheckedDate = new Date(selectedList[i].counterCheckedDate);
                //            var orderedDate = new Date(selectedList[i].orderedDate);
                //            orderedDate.setHours(0, 0, 0, 0);
                //            orderedDate.getTime();
                //            confirmedDateTime.setHours(0, 0, 0, 0);
                //            confirmedDateTime.getTime();
                //            counterCheckedDate.setHours(0, 0, 0, 0);
                //            counterCheckedDate.getTime();
                           
                //            var inactivate = new Date(inputDate);
                //            inactivate.setHours(0, 0, 0, 0);
                //            inactivate.getTime();

                //            if (inactivate < orderedDate) {
                //                return "Date can't earlier than Order Start Date";
                //            }

                //            if (inactivate < confirmedDateTime) {
                //                return "Date can't earlier than Confirmed date";
                //            }

                //            if (inactivate < counterCheckedDate) {
                //                return "Date can't earlier than Counter Checked Date";
                //            }
                //        }
                //    }
                    
                    
                //    return true;
                //};


                //function isValidDate(str) {
                //    var reg = /^\d+$/;
                //    var result = str.match(reg);

                //    if (!result) {
                //        var d = moment(str, 'D/MMM/YYYY');
                //        if (d == null || !d.isValid()) {
                //            return false;
                //        } else {
                //            return true;
                //        }
                //    } else {
                //        return false;
                //    }
                   
                //}
            }
        ],
        templateUrl: "~/App/tenant/views/prescriptions/prescription-detail/prescription-detail.cshtml"
    });
})();