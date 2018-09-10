(function (_, app) {
    appModule.component('meanstestDetailMeanstestCard', {
        require: {
            parentCtrl: '^meanstestDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.subsidyRate', 'abp.services.app.person', 'abp.services.app.referral', 'abp.services.app.masterLookUp', '$scope', '$filter', 'abp.services.app.masterLookUp',
            function (subsidyRateService, personService, referralService, masterLookUp, $scope, $filter, masterLookup) {
                var ctrl = this;
                ctrl.validateSubsidy = true;
                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.parentCtrl.addForm(submitForm);
                    subsidyRateService.getSubsidyRateItems()
                        .then(function (result) {
                            ctrl.subsidyRateMaster = result.data.items;
                        });

                    masterLookup.getMasterTypeItems({
                        type: 'Deviation Reason'
                    }).then(function (result) {
                        ctrl.deviationReasonMaster = result.data;
                    });

                    masterLookup.getMasterTypeItems({
                        type: 'Means Testing - Deviation Approval'
                    }).then(function (result) {
                        ctrl.deviatedSubsidyApprovedByMaster = result.data;
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model /*&& changes.model.isFirstChange()*/) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                        } else {
                            ctrl.workingModel = _.pick(ctrl.model, [
                                'meansTestType', 'othersMeansTestType', 'meansTestDate', 'effectiveDate', 'expiryDate', 'subsidyRateId',
                                'hasFinancialAssistance', 'financialAssistanceEffectiveDate', 'financialAssistanceExpiryDate', 'isDeviated',
                                'finalSubsidyRateId', 'deviationReasonId', 'othersDeviationReason', 'deviationApprovalDate', 'deviatedSubsidyApprovedById'
                            ]);

                            //For get Means Test Type string
                            if (ctrl.workingModel.meansTestType || ctrl.workingModel.meansTestType == 0) {
                                if (ctrl.workingModel.meansTestType == 0)
                                    ctrl.workingModel.meansTestType = 'MeansTest';
                                else
                                    ctrl.workingModel.meansTestType = $filter('enumText')(ctrl.workingModel.meansTestType, 'meansTestType');
                            }

                            ctrl.workingModel.deviationReasonDescription = "";
                        }
                    }
                };

                // event handlers
                ctrl.save = function (event) {
                    $scope.$broadcast('check-select-ui-required');
                    var isValid = submitForm();

                    if (isValid) {
                        ctrl.onUpdate({
                            event: {
                                data: ctrl.workingModel,
                                success: closeEditMode
                            }
                        });

                        event.preventDefault();
                    }
                };

                ctrl.cancel = function () {
                    closeEditMode();
                };

                ctrl.generateFinalSubsidyRate = function (subsidyRate) {
                    ctrl.workingModel.finalSubsidyRateId = subsidyRate;
                    ctrl.validateFinalSubsidyRate();
                };

                function getPatientBandGuid(description) {
                    masterLookUp.getMasterTypeItems({
                        type: 'Patient Band'
                    }).then(function (result) {
                        ctrl.patientBandMaster = result.data;

                        angular.forEach(ctrl.patientBandMaster, function (value, key) {
                            if (value.description == description) {
                                ctrl.workingModel.patientBandId = value.id;
                            }
                        });
                    });
                }

                function assignPatientBand(nationality, subsidyRate) {
                    var subsidyRateCode = "";
                    var patientBand = "";

                    subsidyRateService.getSubsidyRateItem(subsidyRate)
                        .then(function (result) {
                            subsidyRate = result.data;
                            subsidyRateCode = subsidyRate.code;

                            if (nationality == "SINGAPORE CITIZEN") {
                                if (subsidyRateCode >= 60)
                                    patientBand = "Band 1";
                                else if (subsidyRateCode >= 40 && subsidyRateCode <= 50)
                                    patientBand = "Band 2";
                                else if (subsidyRateCode >= 10 && subsidyRateCode <= 30)
                                    patientBand = "Band 3";
                                else if (subsidyRateCode == 0)
                                    patientBand = "";
                            }
                            else if (nationality == "PR")
                                patientBand = "PR";
                            else
                                patientBand = "";

                            getPatientBandGuid(patientBand);
                        });
                }

                ctrl.generatePatientBand = function (subsidyRate) {
                    var nationality = "";
                    var person = null;
                    var referral = null;
                    var registrationDocumentType = "";

                    if (!(ctrl.model.referralId || ctrl.model.personId) || !subsidyRate) {
                        /* Prevent auto populate patient band if both (either referralId
                            or personId) or subsidyRate is not filled
                        */
                        return;
                    }

                    if (ctrl.model.personId) {
                        personService.getPerson(ctrl.model.personId)
                            .then(function (result) {
                                person = result.data;
                                nationality = returnNationality(person.registrationDocumentType.description);
                                assignPatientBand(nationality, subsidyRate);
                            });
                    }
                    else {
                        referralService.get(ctrl.model.referralId)
                            .then(function (result) {
                                referral = result.data;
                                nationality = returnNationality(referral.person.registrationDocumentType.description);
                                assignPatientBand(nationality, subsidyRate);
                            });
                    }

                };

                function returnNationality(registrationDocumentType) {
                    if (registrationDocumentType == "NRIC Pink")
                        return "SINGAPORE CITIZEN";
                    else if (registrationDocumentType == "NRIC Blue")
                        return "PR";
                    else
                        return "";
                }

                ctrl.generateExpiryDate = function () {
                    var configuredDateValidation = abp.setting.get('App.MeansTest.ConfiguredDateValidation');
                    var date = null;

                    if (configuredDateValidation == 'Effective Date') {
                        date = ctrl.workingModel.effectiveDate;
                    } else if (configuredDateValidation == 'Means Test Date') {
                        date = ctrl.workingModel.meansTestDate;
                    }

                    if (!!date) {
                        var validityInMonth = abp.setting.getInt('App.MeansTest.MeansTestLengthOfValidity');
                        ctrl.configuredDate = new Date(date);
                        expiryDate = new Date(date);
                        expiryDate.setMonth(expiryDate.getMonth() + validityInMonth);
                        // Minus 1 day as exclude last day
                        expiryDate.setDate(expiryDate.getDate() - 1);
                        ctrl.workingModel.expiryDate = expiryDate;
                        //ctrl.configuredExpiryDate = ctrl.workingModel.expiryDate;
                        ctrl.configuredDateValidation = configuredDateValidation;
                    }
                };

                ctrl.generateFinancialAssistanceExpiryDate = function (financialAssistanceEffectiveDate) {
                    if (!!financialAssistanceEffectiveDate) {
                        var validityInMonth = abp.setting.getInt('App.MeansTest.FinancialAssistanceLengthOfValidity');
                        financialAssistanceExpiryDate = new Date(financialAssistanceEffectiveDate);
                        financialAssistanceExpiryDate.setMonth(financialAssistanceExpiryDate.getMonth() + validityInMonth);
                        // Minus 1 day as exclude last day
                        financialAssistanceExpiryDate.setDate(financialAssistanceExpiryDate.getDate() - 1);
                        ctrl.workingModel.financialAssistanceExpiryDate = new Date(financialAssistanceExpiryDate);
                    }
                };

                ctrl.validateMeansTestDate = function (meansTestDate, effectiveDate) {
                    if (!meansTestDate || !effectiveDate) {
                        return true;
                    }

                    meansTestDate = new Date(meansTestDate);
                    effectiveDate = new Date(effectiveDate);

                    if (meansTestDate > effectiveDate) {
                        return "Means Test Date must be on or earlier than Effective Date.";
                    }

                    return true;
                };

                ctrl.validateValidExpiryDate = function (expiryDate) {
                    if (!expiryDate || !ctrl.configuredDate) {
                        return true;
                    }

                    expiryDate = new Date(expiryDate);
                    configuredExpiryDate = new Date(ctrl.configuredDate);

                    if (expiryDate < ctrl.configuredDate) {
                        return "Expiry Date must be on or after " + ctrl.configuredDateValidation + ".";
                    }

                    return true;
                }

                ctrl.getDeviationReason = function (deviationReasonId) {
                    ctrl.workingModel.deviationReasonDescription = "";

                    if (deviationReasonId == null) {
                        return;
                    }

                    masterLookUp.getMasterTypeItems({
                        type: 'Deviation Reason'
                    }).then(function (result) {
                        ctrl.deviationReasonMaster = result.data;

                        angular.forEach(ctrl.deviationReasonMaster, function (value, key) {
                            if (value.id == deviationReasonId) {
                                ctrl.workingModel.deviationReasonDescription = value.description;
                            }
                        });
                    });
                };

                ctrl.initialiseDeviationFields = function (isDeviated) {
                    if (!isDeviated) {
                        ctrl.workingModel.finalSubsidyRateId = ctrl.workingModel.subsidyRateId;
                        ctrl.workingModel.deviationApprovalDate = null;
                        ctrl.workingModel.deviationReasonId = null;
                        ctrl.workingModel.othersDeviationReason = null;
                        ctrl.workingModel.deviationReasonDescription = null;
                        ctrl.workingModel.deviatedSubsidyApprovedById = null;
                        ctrl.form.OthersDeviationReason.$dirty = false;
                    }
                    else {
                        var defaultDeviatedSubsidyApprovedBy = "MOH/AIC";
                        masterLookUp.getMasterTypeItems({
                            type: 'Means Testing - Deviation Approval'
                        }).then(function (result) {
                            ctrl.deviationApprovalMaster = result.data;

                            angular.forEach(ctrl.deviationApprovalMaster, function (value, key) {
                                if (value.description == defaultDeviatedSubsidyApprovedBy) {
                                    ctrl.workingModel.deviatedSubsidyApprovedById = value.id;
                                }
                            });
                        });
                    }
                };

                ctrl.initialiseOtherMeansTestType = function (meansTestType) {
                    if (meansTestType != 'Others') {
                        ctrl.workingModel.othersMeansTestType = null;
                        ctrl.form.OthersMeansTestType.$dirty = false;
                    }
                };

                ctrl.initialiseFinancialAssistanceFields = function (hasFinancialAssistance) {
                    if (!hasFinancialAssistance) {
                        ctrl.workingModel.financialAssistanceEffectiveDate = null;
                        ctrl.workingModel.financialAssistanceExpiryDate = null;
                    }
                };

                ctrl.validateFinalSubsidyRate = function () {
                    ctrl.validateSubsidy = checkDeviated();
                };

                function checkDeviated() {
                    if (!ctrl.workingModel.isDeviated) {
                        return true;
                    }

                    var finalSubsidyRate = 0;
                    var subsidyRate = 0;
                    for (var i = 0; i < ctrl.subsidyRateMaster.length; i++) {
                        if (ctrl.subsidyRateMaster[i].id == ctrl.workingModel.finalSubsidyRateId) {
                            finalSubsidyRate = parseInt(ctrl.subsidyRateMaster[i].code);
                        }

                        if (ctrl.subsidyRateMaster[i].id == ctrl.workingModel.subsidyRateId) {
                            subsidyRate = parseInt(ctrl.subsidyRateMaster[i].code);
                        }
                    }

                    if (finalSubsidyRate <= subsidyRate) {
                        return false;
                    }

                };


                // callbacks
                function closeEditMode() {
                    ctrl.mode = 'view';
                }

                function submitForm() {
                    ctrl.form.submitted = true;

                    /*
                        Add this statement to not show popout dialog
                        Your changes have not been saved. Leave anyway?
                        when click Save with all mandatory fields are filled
                    */
                    if (ctrl.form.$valid) {
                        ctrl.form.$setPristine();
                    }

                    return ctrl.form.$valid;
                }

                //ctrl.validateExpiryDate = function () {
                //    if (ctrl.workingModel.financialAssistanceEffectiveDate) {
                //        var effectiveDate = ctrl.workingModel.financialAssistanceEffectiveDate;
                //        effectiveDate = new Date(effectiveDate).setHours(0, 0, 0, 0);

                //        var expiryDate = new Date(ctrl.workingModel.financialAssistanceExpiryDate).setHours(0, 0, 0, 0);

                //        console.log(expiryDate);
                //        var isValid = expiryDate >= effectiveDate;

                //        if (!isValid) {
                //            return "Financial Assistance Expiry Date must be on or after Financial Assistance Effective Date.";
                //        } else {
                //            return isValid;
                //        }
                //    } else {
                //        return true;
                //    }
                //}
            },
        ],
        templateUrl: '~/App/tenant/views/meanstests/meanstest-detail/meanstest-detail-meanstest-card.cshtml'
    });
})(_, app);