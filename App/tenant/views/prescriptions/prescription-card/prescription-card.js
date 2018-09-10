(function () {
    appModule.component('prescriptionCard', {
        bindings: {
            mode: '<',
            personId: '<'
        },
        controller: [
            'abp.services.app.prescription', '$state', '$uibModal', '$filter', 'abp.services.app.unitOfMeasurement',
            function (prescriptionService, $state, $uibModal, $filter, unitOfMeasurementService) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.medicalProfession = 'Nurse';

                // Enabled/Disabled Rules
                var defaultActionBtn = { 'Add/Copy': true, 'Void': false, 'Complete': false, 'Stop': false, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': true };

                var doctorProvisionalAction = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': false, 'Confirm': true, 'PrintPrescription': true };
                var doctorConfirmedAction = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': true };
                var doctorUncheckedAction = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': false, 'Confirm': true, 'PrintPrescription': true };

                var nurseProvisionalAction = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': true };
                var nurseConfirmedAction = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': true };
                var nurseUncheckedAction = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': true, 'Confirm': false, 'PrintPrescription': true };

                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Prescriptions.Create'),
                        void: abp.auth.hasPermission('Pages.Tenant.Prescriptions.Void'),
                        complete: abp.auth.hasPermission('Pages.Tenant.Prescriptions.Complete'),
                        stop: abp.auth.hasPermission('Pages.Tenant.Prescriptions.Stop'),
                        counterCheck: abp.auth.hasPermission('Pages.Tenant.Prescriptions.CounterCheck'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.Prescriptions.Confirm'),
                        printPrescription: abp.auth.hasPermission('Pages.Tenant.Prescriptions.PrintPrescription')
                    };

                    ctrl.selectedData = [];

                    ctrl.title = abp.localization.localize('Prescriptions');
                    ctrl.views = app.consts.prescriptionViews.values;
                    ctrl.view = 0; // Default to active view

                    ctrl.action = arrayToObject(defaultActionBtn);

                    prescriptionService.getCurrentUserMedicalProfile(
                    ).then(function (result) {
                        if (result.data != null && result.data.medicalProfession != null) {
                            ctrl.medicalProfession = $filter('enumText')(result.data.medicalProfession, 'medicalProfession');
                        }
                    });

                    // Unit Of Measurement Master
                    unitOfMeasurementService.getUnitOfMeasurements({}
                    ).then(function (result) {
                        ctrl.unitOfMeasurementMaster = result.data.items;
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        changes.personId.currentValue && ctrl.load();
                    }
                };

                ctrl.changeView = function (view) {
                    defaultActionBtn = { 'Add/Copy': true, 'Void': false, 'Complete': false, 'Stop': false, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': false };
                    ctrl.action = arrayToObject(defaultActionBtn);

                    ctrl.selectedData = [];
                    ctrl.view = view;
                    ctrl.load();
                };

                ctrl.handleAction = function (action) {
                    if (action != 'PrintPrescription') {
                        var modalInstance = $uibModal.open({
                            windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                            component: 'prescriptionDetail',
                            backdrop: 'static',
                            //backdropClass: 'backdropColor-Remove',
                            size: 'lg',
                            //windowClass: 'draggableModal',
                            //openedClass: 'dragModal',
                            resolve: {
                                action: function () {
                                    return action;
                                },
                                data: function () {
                                    if (action === 'Add/Copy' && angular.isArray(ctrl.selectedData)) {
                                        for (var i = 0; i < ctrl.selectedData.length; i++) {
                                            ctrl.selectedData[i].orderedDate = abp.clock.today();
                                        }
                                    }

                                    return ctrl.selectedData;
                                },
                                personId: function () {
                                    return ctrl.personId;
                                }
                            }
                        });

                        modalInstance.result.then(function (result) {
                            ctrl.load();
                            defaultActionBtn = { 'Add/Copy': true, 'Void': false, 'Complete': false, 'Stop': false, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': true };
                            ctrl.action = arrayToObject(defaultActionBtn);

                            ctrl.selectedData = [];
                        });
                    } else {
                        var reportFolder = "IngoTPCC";
                        var reportFileName = "rpt_PrescriptionByPatient";

                        if (ctrl.permissions.printPrescription) {
                            var prescriptionIds = "";
                            for (var i = 0; i < ctrl.selectedData.length; i++) {
                                if (i == 0) {
                                    prescriptionIds = ctrl.selectedData[i].id;
                                } else {
                                    prescriptionIds = prescriptionIds + ", " + ctrl.selectedData[i].id;
                                }
                            }

                            prescriptionService.printPrescriptionReport(
                                ctrl.personId, prescriptionIds
                            ).then(function (result) {
                                var url = result.data;
                                url = window.location.origin + ctrl.appPath + url;

                                var reportWindow = window.open();
                                reportWindow.location = url;
                                reportWindow.target = '_blank';
                                reportWindow.locationbar.visible = false;
                                reportWindow.focus();
                            });
                        }
                    }
                };

                ctrl.onSelect = function (event) {
                    var isExists = ctrl.selectedData.filter(function (obj) {
                        return obj.id == event.data.id;
                    });

                    if (isExists.length == 0) {
                        ctrl.selectedData.push(event.data);
                    } else {
                        if (!event.data.isChecked) {
                            var index = ctrl.selectedData.indexOf(event.data);
                            ctrl.selectedData.splice(index, 1);
                        }
                    }

                    btnActionDisable(ctrl.selectedData)
                };

                function btnActionDisable(selectedList) {
                    var similarObj = [];
                    defaultActionBtn = { 'Add/Copy': true, 'Void': true, 'Complete': true, 'Stop': true, 'Counter-Check': true, 'Confirm': true, 'PrintPrescription': true };

                    for (var i = 0; i < selectedList.length; i++) {
                        // Status = Inactive/Referral, disabled all button beside Add/Copy
                        if (selectedList[i].status == 1 || selectedList[i].status == 99) {
                            defaultActionBtn = { 'Add/Copy': true, 'Void': false, 'Complete': false, 'Stop': false, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': false };
                            break;
                        } else {
                            if (ctrl.medicalProfession == 'Doctor') {
                                // Provisional
                                if (selectedList[i].orderStatus == 0) {
                                    similarObj = commonPropertiesWithTrueValue(defaultActionBtn, doctorProvisionalAction);
                                }
                                // Confirmed
                                else if (selectedList[i].orderStatus == 1) {
                                    similarObj = commonPropertiesWithTrueValue(defaultActionBtn, doctorConfirmedAction);
                                }
                                // Unchecked
                                else if (selectedList[i].orderStatus == 6) {
                                    similarObj = commonPropertiesWithTrueValue(defaultActionBtn, doctorUncheckedAction);
                                }
                            } else {
                                // Provisional
                                if (selectedList[i].orderStatus == 0) {
                                    similarObj = commonPropertiesWithTrueValue(defaultActionBtn, nurseProvisionalAction);
                                }
                                // Confirmed
                                else if (selectedList[i].orderStatus == 1) {
                                    similarObj = commonPropertiesWithTrueValue(defaultActionBtn, nurseConfirmedAction);
                                }
                                // Unchecked
                                else if (selectedList[i].orderStatus == 6) {
                                    similarObj = commonPropertiesWithTrueValue(defaultActionBtn, nurseUncheckedAction);

                                    if (selectedList[i].creatorUserId == abp.session.userId) {
                                        Object.keys(similarObj).filter(function (item) {
                                            if (similarObj[item] == 'Counter-Check') {
                                                delete similarObj[item];
                                            }
                                        });
                                    }
                                }
                            }

                            for (var property in defaultActionBtn) {
                                if (similarObj.indexOf(property) == -1) {
                                    defaultActionBtn[property] = false;
                                }
                            }
                        }
                    }

                    if (selectedList.length == 0) {
                        defaultActionBtn = { 'Add/Copy': true, 'Void': false, 'Complete': false, 'Stop': false, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': false };
                    }

                    ctrl.action = arrayToObject(defaultActionBtn);
                }

                function commonPropertiesWithTrueValue(o1, o2) {
                    return Object.keys(o1).filter(function (item) {
                        if (item in o2) {
                            if (o1[item] == o2[item] && o1[item] == true) {
                                return true;
                            }
                        }
                    });
                }

                function arrayToObject(btnArray) {
                    for (var property in btnArray) {
                        if (btnArray[property]) {
                            if (property == 'Add/Copy') {
                                btnArray[property] = ctrl.permissions.create;
                            } else if (property == 'Void') {
                                btnArray[property] = ctrl.permissions.void;
                            } else if (property == 'Complete') {
                                btnArray[property] = ctrl.permissions.complete;
                            } else if (property == 'Stop') {
                                btnArray[property] = ctrl.permissions.stop;
                            } else if (property == 'Counter-Check') {
                                btnArray[property] = ctrl.permissions.counterCheck;
                            } else if (property == 'Confirm') {
                                btnArray[property] = ctrl.permissions.confirm;
                            } else if (property == 'PrintPrescription') {
                                btnArray[property] = ctrl.permissions.printPrescription;
                            }
                        }
                    }

                    var result = [];

                    for (var key in btnArray) {
                        result.push({
                            action: key,
                            showBtn: btnArray[key],
                        });
                    }

                    return result;
                }

                ctrl.load = function (requestParams) {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;
                    ctrl.key = getFilterKeys();

                    prescriptionService.getPagedPrescriptionsByCriteria(
                        $.extend({
                            view: ctrl.view,
                            filter: ctrl.filter,
                        }, { personId: ctrl.personId }, requestParams)
                    ).then(function (result) {
                        ctrl.data = result.data;
                        ctrl.orderStatusCounts = result.data.orderStatusCounts;
                    }).finally(function () {
                        ctrl.loading = false;
                    });

                    prescriptionService.hasAdmissions(
                        ctrl.personId
                    ).then(function (result) {
                        ctrl.enabledActionBtn = result.data;
                    });
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                };

                ctrl.onPageChanged = function (requestParams) {
                    defaultActionBtn = { 'Add/Copy': true, 'Void': false, 'Complete': false, 'Stop': false, 'Counter-Check': false, 'Confirm': false, 'PrintPrescription': false };
                    ctrl.action = arrayToObject(defaultActionBtn);

                    ctrl.selectedData = [];
                    ctrl.load(requestParams);
                };

                function getFilterKeys() {
                    var key = "";

                    key = key.concat(ctrl.filter, $filter('enumText')(ctrl.view, 'prescriptionViews'));

                    return key;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/prescriptions/prescription-card/prescription-card.cshtml'
    });
})();