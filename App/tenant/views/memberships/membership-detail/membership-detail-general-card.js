(function (_) {
    appModule.component('membershipDetailGeneralCard', {
        require: {
            parentCtrl: '^membershipDetail'
        },
        bindings: {
            mode: '<',
            model: '=',
            permissions: '<',
            onUpdate: '&',
            onReload: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$timeout', '$filter', '$validator', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', 'abp.services.app.masterLookUp', 'abp.services.app.report',
            function ($scope, $timeout, $filter, $validator, $stateParams, commonLookupService, userService, patientService, membershipService, masterLookup, reportService) {

                var ctrl = this;
                ctrl.membershipStatus = "";
                ctrl.$onInit = function () {
                    loadParentProperties();
                    if (ctrl.model) {
                        ctrl.membershipFilterStatus = app.consts.membershipFilterStatus.values;
                        setMembershipStatus()
                        if (ctrl.mode == 'new')
                            ctrl.model.isCloned = false;

                        /*to get Termination Reason Master Lookup*/
                        masterLookup.getMasterTypeItems({
                            type: 'Termination Reason of Member'
                        }).then(function (result) {
                            ctrl.terminationReasonMaster = result.data;

                        });

                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                    }
                };

                function loadParentProperties() {
                    loadMasterLookup();
                }

                ctrl.$onChanges = function (changes) {
                    ctrl.workingModel = ctrl.model;
                    ctrl.membershipFilterStatus = app.consts.membershipFilterStatus.values;

                    if (ctrl.model) {
                        setMembershipStatus();
                        if (ctrl.mode == 'new') {
                            ctrl.model.isCloned = false;
                        }
                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                    }

                };

                function setMembershipStatus() {
                    ctrl.membershipStatus = (ctrl.mode == 'new' || ctrl.model.membershipStatus == null) ? 'Active' : $filter('enumText')(ctrl.model.membershipStatus, 'membershipFilterStatus');
                };

                ctrl.returnBoolValue = function (value) {
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }

                /*  to get Master look up for centre and servicetype*/
                function loadMasterLookup() {
                    membershipService.getSACCentres().then(function (result) {
                        ctrl.centreLookup = result.data;
                    });

                    membershipService.getSACServiceType().then(function (result) {
                        ctrl.servicetypeLookup = result.data;
                        // only set the value to model for create new record.
                        if (ctrl.mode == 'new')
                            ctrl.model.serviceType = ctrl.servicetypeLookup;
                    });
                }

                ctrl.applicationdateInChanged = function (value) {
                    ctrl.workingModel.applicationdate = value;
                };

                ctrl.save = function (event) {
                    ctrl.onUpdate({
                        event: {
                            data: ctrl.model,
                            success: closeEditMode
                        }
                    });
                    event.preventDefault();
                };

                ctrl.cancel = function () {
                    closeEditMode();
                };

                ctrl.applicationdateInValidator = function (applicationdate) {
                    if (!applicationdate) { return true; }
                    applicationdate = Date.parse(applicationdate);
                };

                function closeEditMode() {
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                ctrl.generateMembershipEndDate = function (membershipStartDate) {
                    if (!!membershipStartDate) {
                        var validityInMonthString = abp.setting.get('App.Membership.MembershipLengthOfValidity');
                        if (validityInMonthString != null) {
                            var validityInMonthInt = parseInt(validityInMonthString);
                            if (!isNaN(validityInMonthInt)) {
                                membershipendDate = new Date(membershipStartDate);
                                membershipendDate.setMonth(membershipendDate.getMonth() + validityInMonthInt);
                                // Minus 1 day as exclude last day
                                membershipendDate.setDate(membershipendDate.getDate() - 1);
                                ctrl.workingModel.membershipEndDate = new Date(membershipendDate);
                            }
                        }
                    }
                };

            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-general-card.cshtml'
    });
})(_);