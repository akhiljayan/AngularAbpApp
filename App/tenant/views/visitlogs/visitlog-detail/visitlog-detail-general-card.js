(function (_) {
    appModule.component('visitlogDetailGeneralCard', {
        require: {
            parentCtrl: '^visitlogDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&',
            onReload: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.serviceType', 'abp.services.app.visitType', 'abp.services.app.admission', 'abp.services.app.referral', 'abp.services.app.visitLog', '$filter',
            function ($stateParams, commonLookupService, userService, serviceTypeService, visitTypeService, admissionService, referralService, visitLogService, $filter) {
                var ctrl = this;
                var initialContactType = null;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.$stateParams = $stateParams;

                    ctrl.parentCtrl.addForm(submitForm);


                    userService.getUsers({
                    }).then(function (result) {
                        var options = result.data.items;
                        ctrl.users = options.map(function (option) {
                            return {
                                id: option.id,
                                description: option.name
                            }
                        });
                    });

                    serviceTypeService.getActiveServiceTypes().then(function (result) {
                        ctrl.serviceTypeMaster = result.data;
                    });
                };



                ctrl.$onChanges = function (changes) {
                    if (changes.model /*&& changes.model.isFirstChange()*/) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                            ctrl.workingModel.personId && ctrl.loadAdmissions(ctrl.workingModel.personId);

                        } else {
                            //ctrl.workingModel = _.pick(ctrl.model, [
                            //    'visitLogId', 'personId', 'admissionId', 'serviceTypeId', 'visitDateTimeIn',
                            //    'visitDateTimeOut', 'nextVisitDate', 'contactType', 'othersContactType', 'visitTypeId',
                            //    'attendedByUserId', 'accompanyStaffUserId', 'isFutile', 'futileReason', 'remarks'
                            //]);
                            ctrl.workingModel = ctrl.model;
                            if (ctrl.workingModel.personId && ctrl.workingModel.contactType != 2) {
                                ctrl.loadAdmissions(ctrl.workingModel.personId);
                                ctrl.populateAdmissionDate(ctrl.workingModel.admissionId);
                            }
                            ctrl.workingModel.contactTypeId = angular.copy(ctrl.workingModel.contactType);

                            if (angular.isNumber(ctrl.workingModel.contactType)) {
                                //ctrl.workingModel.contactType = $filter('enumText')(ctrl.workingModel.contactType, 'contactType');
                                if (ctrl.workingModel.contactType == 0) {
                                    ctrl.workingModel.contactType = 'HomeVisit';
                                } else if (ctrl.workingModel.contactType == 1) {
                                    ctrl.workingModel.contactType = "Telecommunication";
                                } else if (ctrl.workingModel.contactType == 2) {
                                    ctrl.workingModel.contactType = "SpecialVisit";
                                    initialContactType = ctrl.workingModel.contactType;
                                } else {
                                    ctrl.workingModel.contactType = "Others";
                                }
                            }
                        };
                    }
                };

                ctrl.loadAdmissions = function (id) {
                    if (ctrl.workingModel.contactType != "SpecialVisit") {
                        commonLookupService.findAdmissions({
                            personId: id
                        }).then(function (result) {
                            var options = result.data.items;

                            ctrl.admissions = options.map(function (option) {
                                return {
                                    id: option.value,
                                    description: option.name
                                }
                            });

                            if (ctrl.admissions.length == 1) {
                                ctrl.workingModel.admissionId = ctrl.admissions[0].id;
                                ctrl.populateAdmissionDate(ctrl.workingModel.admissionId);
                                ctrl.populateServiceType(ctrl.workingModel.admissionId);
                            } else if (!!ctrl.workingModel.serviceTypeId) {
                                visitTypeService.getVisitTypes({
                                    ServiceTypeId: ctrl.workingModel.serviceTypeId
                                }).then(function (result) {
                                    ctrl.visitTypeMaster = result.data.items;
                                });
                            }
                        });
                    }
                };

                //Populate Admission Date based on Admission Selected
                ctrl.populateAdmissionDate = function (admissionId) {
                    if (!admissionId) {
                        ctrl.workingModel.admittedOn = null;
                        ctrl.workingModel.dischargedOn = null;
                        return;
                    }

                    admissionService.get(
                        admissionId
                    ).then(function (result) {
                        var admission = result.data;
                        ctrl.workingModel.admittedOn = admission.admittedOn;
                        ctrl.workingModel.dischargedOn = admission.dischargedOn;

                        // Set AdmittedOn and DischargedOn seconds and milliseconds to 0
                        if (ctrl.workingModel.admittedOn) {
                            var admittedOn = new Date(ctrl.workingModel.admittedOn);
                            admittedOn.setSeconds(0, 0);
                            ctrl.workingModel.admittedOn = admittedOn.toISOString();
                        }

                        if (ctrl.workingModel.dischargedOn) {
                            var dischargedOn = new Date(ctrl.workingModel.dischargedOn);
                            dischargedOn.setSeconds(0, 0);
                            ctrl.workingModel.dischargedOn = dischargedOn.toISOString();
                        }
                    });
                };


                // Populate Service Type : Admission --> ReferralServiceType
                ctrl.populateServiceType = function (admissionId) {
                    if (!admissionId) {
                        ctrl.workingModel.serviceTypeId = null;
                        ctrl.visitTypeMaster = null;
                        ctrl.workingModel.categories = null;
                        return;
                    }

                    admissionService.get(
                        admissionId
                    ).then(function (result) {
                        var admission = result.data;
                        referralService.getReferralServiceType(
                            admission.referralServiceTypeId
                        ).then(function (result) {
                            ctrl.workingModel.serviceTypeId = result.data.serviceTypeId;
                            //load Rendered Service category 
                            if (ctrl.workingModel.id == null || (ctrl.workingModel.mode != "new" && initialContactType == "SpecialVisit")) {
                                visitLogService.getRenderServiceByServiceTypeId({
                                    visitLogId: ctrl.workingModel.id,
                                    serviceTypeId: ctrl.workingModel.serviceTypeId
                                }).then(function (result) {
                                    ctrl.workingModel.categories = result.data;
                                });
                            }
                            visitTypeService.getVisitTypes({
                                ServiceTypeId: ctrl.workingModel.serviceTypeId
                            }).then(function (result) {
                                ctrl.visitTypeMaster = result.data.items;
                            });
                        });
                    });
                };

                ctrl.visitDateTimeInChanged = function (value) {
                    ctrl.workingModel.visitDateTimeOut = value;
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

                ctrl.visitDateTimeInValidator = function (visitDateTimeIn, admittedOn, dischargedOn) {
                    if (!visitDateTimeIn) { return true; }

                    visitDateTimeIn = Date.parse(visitDateTimeIn);

                    if (admittedOn) {
                        admittedOn = Date.parse(admittedOn);

                        if (admittedOn > visitDateTimeIn) {
                            return "Visit Date & Time In must be on or after Admitted On.";
                        }
                    }

                    if (dischargedOn) {
                        dischargedOn = Date.parse(dischargedOn);

                        if (visitDateTimeIn > dischargedOn) {
                            return "Visit Date & Time In must be on or earlier than Discharged On.";
                        }
                    }

                    return true;
                };

                ctrl.visitDateTimeOutValidator = function (visitDateTimeIn, visitDateTimeOut, admittedOn, dischargedOn) {
                    if (!visitDateTimeOut) { return true; }

                    visitDateTimeOut = Date.parse(visitDateTimeOut);

                    if (admittedOn) {
                        admittedOn = Date.parse(admittedOn);

                        if (admittedOn > visitDateTimeOut) {
                            return "Visit Date & Time Out must be on or after Admitted On.";
                        }
                    }

                    if (dischargedOn) {
                        dischargedOn = Date.parse(dischargedOn);

                        if (visitDateTimeOut > dischargedOn) {
                            return "Visit Date & Time Out must be on or earlier than Discharged On.";
                        }
                    }

                    if (visitDateTimeIn) {
                        visitDateTimeIn = Date.parse(visitDateTimeIn);

                        if (visitDateTimeIn > visitDateTimeOut) {
                            return "Visit Date & Time Out must be on or after Visit Date & Time In.";
                        }
                    }

                    return true;
                };

                ctrl.nextVisitDateValidator = function (visitDateTimeIn, visitDateTimeOut, nextVisitDate) {
                    if (!nextVisitDate) {
                        return true;
                    }

                    nextVisitDate = new Date(nextVisitDate);

                    if (visitDateTimeIn) {
                        visitDateTimeIn = new Date(visitDateTimeIn);

                        if (visitDateTimeIn > nextVisitDate) {
                            return "Next Visit Date must be on or after Visit Date & Time In.";
                        }
                    }

                    if (visitDateTimeOut) {
                        visitDateTimeOut = Date.parse(visitDateTimeOut);

                        if (visitDateTimeOut > nextVisitDate) {
                            return "Next Visit Date must be on or after Visit Date & Time Out.";
                        }
                    }

                    return true;
                };

                ctrl.initialiseFutileField = function (isFutile) {
                    if (!isFutile) {
                        ctrl.workingModel.futileReason = null;
                        ctrl.form.FutileReason.$dirty = false;
                    }
                };

                ctrl.contactTypeChanged = function () {
                    ctrl.workingModel.contactType != 'Others' && (ctrl.workingModel.othersContactType = null);

                    if (ctrl.workingModel.contactType == "SpecialVisit") {
                        ctrl.workingModel.admissionId = null;
                        ctrl.workingModel.serviceTypeId = null;
                        ctrl.workingModel.visitTypeId = null;
                        ctrl.workingModel.categories = [];
                    } else {
                        ctrl.workingModel.personId && ctrl.loadAdmissions(ctrl.workingModel.personId)
                    }
                };

                ctrl.validateAccompanyStaff = function () {
                    if (!(ctrl.workingModel.accompanyStaffUserId && ctrl.workingModel.attendedByUserId)) {
                        return true;
                    }

                    if (ctrl.workingModel.accompanyStaffUserId == ctrl.workingModel.attendedByUserId) {
                        return false;
                    }

                    return true;
                };

                // callbacks
                function closeEditMode() {
                    ctrl.onReload();
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
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-detail/visitlog-detail-general-card.cshtml'
    });
})(_);