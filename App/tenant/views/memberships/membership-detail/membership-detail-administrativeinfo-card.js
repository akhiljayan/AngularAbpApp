(function (_) {
    appModule.component('membershipDetailAdministrativeinfoCard', {
        require: {
            parentCtrl: '^membershipDetail'
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
            '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', '$filter',
            function ($stateParams, commonLookupService, userService, patientService, membershipService, $filter) {
                var ctrl = this;
                ctrl.IsAgreed = false;
                // Others, Please Specify fields are disabled by default
                ctrl.showOthersModeOfReference = false;
                ctrl.userMaster = [];

                // lifecycle hooks
                ctrl.$onInit = function () {
                    if (ctrl.model) {
                        ctrl.bindUserMaster();
                        ctrl.load(); 
                    }               
                };

                ctrl.$onChanges = function (changes) { 
                    ctrl.workingModel = ctrl.model;
                    ctrl.bindUserMaster();
                    ctrl.load();   
                };

                // Load
                ctrl.load = function () {
                    ctrl.loading = true;
                    ctrl.applicationFilterStatus = app.consts.applicationFilterStatus.values;

                    if (ctrl.mode == 'new') {
                        ctrl.model.applicationStatus = 0; //Pending
                        // default to current login user on new record
                        ctrl.model.enteredByUserId = abp.session.userId;
                    }

                    if (ctrl.model) {
                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                        ctrl.initialiseOthersPleaseSpecify();
                    }                                      
                    ctrl.loading = false;
                };

                // Bind User lookup list
                ctrl.bindUserMaster = function () {
                    userService.getUsers({
                    }).then(function (result) {
                        var options = result.data.items;
                        ctrl.userMaster = options.map(function (option) {
                            return {
                                id: option.id,
                                description: option.name
                            }
                        });
                    });
                };

                // set Others, Please Specify fields based on its dependent fields value on form load
                ctrl.initialiseOthersPleaseSpecify = function () {
                    if (ctrl.model.modeOfReference)
                        ctrl.initialiseOthersModeOfReference(ctrl.model.modeOfReference.description);
                };

                ctrl.save = function (event) {                   
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

                // callbacks
                function closeEditMode() {                   
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                ctrl.onChangeApplicationStatus = function (value) {
                    ctrl.model.applicationStatus = value;
                };

                ctrl.returnBoolValue = function (value) {                  
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }

                ctrl.initialiseOthersModeOfReference = function (value) {
                    if (value != 'Others') {
                        ctrl.workingModel.othersModeOfReference = null;
                        ctrl.showOthersModeOfReference = false;
                    }
                    else {
                        ctrl.showOthersModeOfReference = true;
                    }
                };  

                ctrl.onChangeMembershipFeePayable = function () {
                    if (ctrl.workingModel.membershipFeePayable != true) {
                        ctrl.workingModel.membershipFee = null;
                    }
                };                               
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-administrativeinfo-card.cshtml'
    });
})(_);