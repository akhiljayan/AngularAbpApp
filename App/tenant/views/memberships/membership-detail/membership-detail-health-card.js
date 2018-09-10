(function (_) {
    appModule.component('membershipDetailHealthCard', {
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
            '$stateParams', 'abp.services.app.membership', '$filter', 'abp.services.app.masterLookUp',
            function ($stateParams, membershipService, $filter, masterLookup) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    masterLookup.getMasterTypeItems({
                        type: 'Level of Care'
                    }).then(function (result) {
                        ctrl.levelOfCare = result.data;
                        ctrl.manageCheckbox();
                    });
                    ctrl.showOtherAmbulatesWith = false;
                    ctrl.showOtherNonAmbulantSpecify = false;

                    ctrl.initialiseOthersPleaseSpecify();
                };

                ctrl.$onChanges = function (changes) {
                    if (ctrl.model) {
                        ctrl.workingModel = ctrl.model;
                        ctrl.manageCheckbox();
                        ctrl.initialiseOthersPleaseSpecify();
                    }
                }

                // return boolean value in View mode
                ctrl.returnBoolValue = function (value) {
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }
                    
                ctrl.onChangeLevelOfCare = function ($index) {   
                    ctrl.model.membershipLevelOfCare = [];
                    for (var i = 0; i < ctrl.levelOfCare.length; i++) {
                        if (ctrl.levelOfCare[i].selected) {
                            var levelOfCareObject = {
                                tenantId: abp.session.tenantId,
                                membershipId: ctrl.model.id,
                                levelOfCareId: ctrl.levelOfCare[i].id
                            };
                            ctrl.model.membershipLevelOfCare.push(levelOfCareObject);
                        };
                    };                        
                };

                ctrl.manageCheckbox = function () {
                    if (ctrl.model.membershipLevelOfCare && ctrl.levelOfCare) {
                        angular.forEach(ctrl.model.membershipLevelOfCare, function (li) {
                            var found = ctrl.levelOfCare.find(function (m) { return m.id === li.levelOfCareId });
                            var index = ctrl.levelOfCare.indexOf(found);
                            if (index != -1) {
                                ctrl.levelOfCare[index].selected = true;
                            }
                        });
                    }
                };

                // set Others, Please Specify fields based on its dependent fields value on form load
                ctrl.initialiseOthersPleaseSpecify = function () {
                    if (ctrl.model) {
                        if (ctrl.model.ambulatesWith)
                            ctrl.initialiseOtherAmbulatesWith(ctrl.model.ambulatesWith.description);
                        if (ctrl.model.nonAmbulantSpecify)
                            ctrl.initialiseOtherNonAmbulantSpecify(ctrl.model.nonAmbulantSpecify.description);
                    }
                };
                             
                ctrl.initialiseOtherAmbulatesWith = function (value) {
                    if (value != 'Others') {
                        ctrl.workingModel.otherAmbulatesWith = null;
                        ctrl.showOtherAmbulatesWith = false;
                    }
                    else {
                        ctrl.showOtherAmbulatesWith = true;
                    }
                };

                ctrl.initialiseOtherNonAmbulantSpecify = function (value) {
                    if (value != 'Others') {
                        ctrl.workingModel.otherNonAmbulantSpecify = null;
                        ctrl.showOtherNonAmbulantSpecify = false;
                    }
                    else {
                        ctrl.showOtherNonAmbulantSpecify = true;
                    }
                };

                // clear the depending fields when set Ambulant to No
                ctrl.onChangeAmbulant = function () {
                    if (ctrl.workingModel.ambulant != true) {
                        ctrl.workingModel.ambulatesWith = null;
                        ctrl.workingModel.ambulatesWithId = null;
                        ctrl.workingModel.otherAmbulatesWith = null;
                        ctrl.showOtherAmbulatesWith = false;
                    }
                };

                // clear the depending fields when set Non-Ambulant to No
                ctrl.onChangeNonAmbulant = function () {
                    if (ctrl.workingModel.nonAmbulant != true) {
                        ctrl.workingModel.nonAmbulantSpecify = null;
                        ctrl.workingModel.nonAmbulantSpecifyId = null;
                        ctrl.workingModel.otherNonAmbulantSpecify = null;
                        ctrl.showOtherNonAmbulantSpecify = false;
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-health-card.cshtml'
    });
})(_);