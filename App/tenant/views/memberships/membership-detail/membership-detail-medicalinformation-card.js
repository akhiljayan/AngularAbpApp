(function (_) {
    appModule.component('membershipDetailMedicalinformationCard', {
       
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
            function ($stateParams, membershipService, $filter, masterLookUp) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.$stateParams = $stateParams;
                    masterLookUp.getMasterTypeItems({
                        type: 'Physical Disability'
                    }).then(function (result) {
                        ctrl.physicalDisability = result.data;
                        ctrl.manageCheckbox();
                    });
                   
                    ctrl.showOthersMembershipPhysicalDisability = false;
                };

                ctrl.$onChanges = function (changes) {                    
                    ctrl.workingModel = ctrl.model;
                    if (ctrl.model) {
                        ctrl.manageCheckbox();
                    }       
                };
                
                ctrl.onChangePhysicalDisability = function ($index) {
                    ctrl.checkOthersSelected($index);
                    ctrl.model.membershipPhysicalDisability = [];
                    for (var i = 0; i < ctrl.physicalDisability.length; i++) {
                        if (ctrl.physicalDisability[i].selected) {
                            var physicalobject = {
                                tenantId: abp.session.tenantId,
                                membershipId: ctrl.model.id,
                                physicalDisabilityId: ctrl.physicalDisability[i].id
                            };
                            ctrl.model.membershipPhysicalDisability.push(physicalobject);
                        };

                    };
                };

                ctrl.manageCheckbox = function () {
                    if (ctrl.model.membershipPhysicalDisability && ctrl.physicalDisability) {
                        angular.forEach(ctrl.model.membershipPhysicalDisability, function (li) {
                            var found = ctrl.physicalDisability.find(function (m) { return m.id === li.physicalDisabilityId });
                            var index = ctrl.physicalDisability.indexOf(found);
                            if (index != -1) {
                                ctrl.physicalDisability[index].selected = true;
                            }
                        });
                    }
                };

                ctrl.checkOthersSelected = function ($index) {
                    if ($index.description == 'Others' && !$index.selected) {
                        ctrl.workingModel.othersMembershipPhysicalDisability = null;
                        ctrl.showOthersMembershipPhysicalDisability = false;
                    }
                    else if ($index.description == 'Others' && $index.selected)
                        ctrl.showOthersMembershipPhysicalDisability = true;
                }                
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-medicalinformation-card.cshtml'
    });
})(_);