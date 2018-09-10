(function () {
    appModule.component('admissionDetail', {
        bindings: {
            admission: '<',
            discharge: '<',
            referralServicetype: '<',
            person: '<',
            minAdmitedDate: '<',
            disableAction: '<',
            onCreate: '&',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$rootScope', '$scope', '$state', '$filter', '$stateParams', '$anchorScroll', '$location', 'abp.services.app.admission', 'abp.services.app.referral', 'abp.services.app.masterLookUp', 'abp.services.app.centre', 'abp.services.app.report', 'commonFormFunction',
            function ($rootScope, $scope, $state, $filter, $stateParams, $anchorScroll, $location, admissionService, referralService, masterLookup, centre, reportService, commonFormFunction) {
                var ctrl = this;
                ctrl.isPinned = true;
                ctrl.isSavingDisabled = false;
                ctrl.dischargeAdmission = false;

                ctrl.statusimageencoded = app.consts.image64.admissionDischargeStstus;

                ctrl.$onInit = function () {
                    ctrl.dischargeTemp = ctrl.discharge;
                    loadMasterLookup();
                    updateRecordStatus();
                    ctrl.appPath = abp.appPath;
                    ctrl.mode = ctrl.isNewAdmission ? 'edit' : '';


                    ctrl.permissions = {
                        editAdmission: abp.auth.hasPermission('Pages.Tenant.Admission.Edit_Admission'),
                        editDischarge: abp.auth.hasPermission('Pages.Tenant.Admission.Edit_Discharge'),
                        view: abp.auth.hasPermission('Pages.Tenant.Admission.View'),
                        discharge: abp.auth.hasPermission('Pages.Tenant.Admission.Discharge'),
                        print: abp.auth.hasPermission('Pages.Tenant.Admission.Print')
                    };
                    ctrl.setAdmissionsNavigation();
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.admission) {
                        ctrl.admission = angular.copy(ctrl.admission);
                        updateRecordStatus();
                        ctrl.setAdmissionsNavigation();
                    }
                    if (changes.referralServicetype || changes.discharge || changes.person || changes.minAdmitedDate) {
                        ctrl.referralServicetype = angular.copy(ctrl.referralServicetype);
                        ctrl.discharge = angular.copy(ctrl.discharge);
                        ctrl.person = angular.copy(ctrl.person);
                        ctrl.minAdmitedDate = angular.copy(ctrl.minAdmitedDate);
                    }
                };

                ctrl.changeEditMode = function () {
                    if (ctrl.permissions.editAdmission) {
                        ctrl.mode = 'edit';
                    }
                    if (ctrl.permissions.editDischarge) {
                        ctrl.dischargeMode = 'edit'
                    }
                    if (!ctrl.permissions.editAdmission && ctrl.permissions.editDischarge) {
                        ctrl.gotoAnchor('GeneralDischarge');
                    }
                };

                ctrl.changeModeOnCancel = function () {
                    ctrl.mode = '';
                    ctrl.dischargeMode = '';
                    if ($stateParams.action == 'admitted') {
                        ctrl.dischargeFlag = false; 
                        ctrl.discharge = {};
                        ctrl.discharge = ctrl.dischargeTemp;
                    }
                };

                ctrl.checkPermisionForEdit = function () {
                    if ($stateParams.action == 'admitted') {
                        return (!ctrl.isNewAdmission && ctrl.permissions.editAdmission && !(ctrl.mode == 'edit' || ctrl.dischargeMode == 'edit'));
                    } else {
                        return ((!ctrl.isNewAdmission && (ctrl.permissions.editAdmission || ctrl.permissions.editDischarge)) && !(ctrl.mode == 'edit' || ctrl.dischargeMode == 'edit'));
                    }
                };

                ctrl.save = function () {
                    ctrl.isSavingDisabled = true;
                    commonFormFunction.setFormSubmitted(ctrl.form);
                    ctrl.form.submitted = true;
                    if (ctrl.form.$invalid) {
                        ctrl.isSavingDisabled = false;
                        return;
                    } else {
                        ctrl.form.$setPristine(true);
                    }
                    if (ctrl.isNewAdmission) {
                        ctrl.isSavingDisabled = true;
                        ctrl.onCreate({
                            $event: {
                                admission: ctrl.admission,
                                discharge: ctrl.discharge,
                                success: function () {
                                    //setPristine();
                                }
                            }
                        });
                    } else {
                        ctrl.onUpdate({
                            $event: {
                                admission: ctrl.admission,
                                discharge: ctrl.discharge,
                                dischargeFlag: ctrl.dischargeFlag,
                                success: function () {
                                    ctrl.mode = '';
                                    ctrl.dischargeMode = '';
                                    //setPristine();
                                }
                            }
                        });
                    }
                };

                ctrl.checkForDischarge = function () {
                    return (!ctrl.isNewAdmission && !ctrl.dischargeFlag && ctrl.permissions.discharge);
                };

                function updateRecordStatus() {
                    ctrl.isNewAdmission = !ctrl.admission.id || ctrl.admission.id == app.consts.EmptyGuid;
                    if (ctrl.admission.status == app.consts.admissionFilterStatus.Discharged || ctrl.admission.status == app.consts.admissionFilterStatus.Deceased) {
                        ctrl.dischargeAdmission = true
                    } else { ctrl.dischargeAdmission = false }
                }

                function setPristine() {
                    /*
                        Add this statement to not show popout dialog
                        Your changes have not been saved. Leave anyway?
                        when click Save with all mandatory fields are filled
                    */

                    if (ctrl.form.$valid) {
                        ctrl.form.$setPristine();
                    }
                }

                ctrl.setAdmissionsNavigation = function () {
                    if (!ctrl.isNewAdmission && ctrl.admission.status == app.consts.admissionFilterStatus.Discharged) {
                        ctrl.dischargeFlag = true;
                        ctrl.navigationalMenu = [
                            { key: 'General', displayName: 'General', permission: true },
                            { key: 'GeneralDischarge', displayName: 'Discharge', permission: true }
                        ];
                    } else {
                        ctrl.dischargeFlag = false;
                        ctrl.navigationalMenu = [
                            { key: 'General', displayName: 'General', permission: true }
                        ];
                    }

                };

                //Show discharge flag
                ctrl.showDischarge = function () {
                    abp.message.confirm(
                        'Please click Ok to continue',
                        'You are about to Discharge "' + ctrl.person + '" from "' + ctrl.referralServicetype.serviceType.description + '"',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.mode = '';
                                ctrl.dischargeFlag = true;
                                ctrl.dischargeMode = "edit";
                                ctrl.gotoAnchor('GeneralDischarge');
                                ctrl.navigationalMenu.push({ key: 'GeneralDischarge', displayName: 'Discharge', permission: true });
                                $scope.$apply();
                            }
                        });
                };

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.close = function () {
                    //TODO: refactoring this after KL side rootscope nacigation completed 
                    if ($stateParams.referralId) {
                        $state.go('tenant.referralDetail', { id: $stateParams.referralId });
                    } else if ($stateParams.close == "person") {
                        $state.go('tenant.personDetail', { id: ctrl.admission.personId });
                    } else {
                        $state.go('tenant.admission');
                    }
                };

                //Get description from master data by Id
                ctrl.getMasterDataDescription = function (Id, masterData) {
                    var data = $filter('filter')(masterData, function (m) { return m.id === Id; });
                    if (typeof data != 'undefined' && data != null) {
                        var dataDescription = data[0];
                    } else {
                        var dataDescription = null;
                    }
                    if (typeof dataDescription != 'undefined' && dataDescription != null) {
                        return dataDescription.description;
                    } else {
                        return "";
                    }
                };

                function loadMasterLookup() {
                    centre.getAllCentresLookUpInUserOU().then(function (result) {
                        ctrl.centreLookup = result.data;
                    });

                    masterLookup.getMasterTypeItems({
                        type: 'ILTC Episode Service Type'
                    }).then(function (result) {
                        ctrl.iltcEpisodeServiceType = result.data;
                    });
                };

                ctrl.validateAdmissionDate = function () {
                    var approvalDate = ctrl.minAdmitedDate;
                    var admissionDate = ctrl.admission.admittedOn;
                    if (!admissionDate || !approvalDate) {
                        return true;
                    }
                    if (approvalDate > admissionDate) {
                        return false;
                    }
                    return true;
                };

                ctrl.validateDischargeDate = function () {
                    var admissionDate = ctrl.admission.admittedOn;
                    var dischargeDate = ctrl.admission.plannedDischargeDate;
                    if (!admissionDate || !dischargeDate) {
                        return true;
                    }
                    if (admissionDate > dischargeDate) {
                        return false;
                    }
                    return true;
                };

                ctrl.getImage = function (code) {
                    return 'data:image/png;base64,' + code;
                };

                //Print
                ctrl.print = function () {
                    var reportWindow = window.open();

                    reportService.printAdmissionReport(ctrl.admission.id).then(function (result) {
                        ctrl.url = result.data;
                        reportWindow.location = ctrl.url;
                        reportWindow.target = '_blank';
                        reportWindow.locationbar.visible = false;
                        reportWindow.focus();
                    });
                };

                // find length of stay for new admission
                ctrl.admittedOnChanged = function () {
                    if (ctrl.admission.admittedOn) {
                        var todayDate = Date.now();
                        var admittedDate = Date.parse(ctrl.admission.admittedOn);
                        // find days difference
                        ctrl.admission.lengthOfStay = Math.floor((todayDate - admittedDate) / 86400000) + 1;
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/admissions/admission-detail/admission-detail.cshtml'
    });
})();