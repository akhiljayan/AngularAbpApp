(function (_) {
    appModule.component('membershipDetailAssistanceservicesCard', {
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
            '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', '$filter', 'abp.services.app.masterLookUp', 'abp.services.app.financialAssistanceType',
            function ($stateParams, commonLookupService, userService, patientService, membershipService, $filter, masterLookup, financialAssistanceTypeService) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                   
                    masterLookup.getMasterTypeItems({
                        type: 'Membership Services'
                    }).then(function (result) {
                        ctrl.assistanceservicerequired = result.data;
                        ctrl.manageCheckbox();
                        });
                   
                    masterLookup.getMasterTypeItems({
                        type: 'Financial Assistance Type'
                    }).then(function (result) {
                        ctrl.financialAssistanceType = result.data;                        
                    });
                };
                
                ctrl.$onChanges = function (changes) {
                    ctrl.workingModel = ctrl.model;
                    if (ctrl.model) {
                        ctrl.manageCheckbox();
                    }
                };

                ctrl.addMembershipService = function (li) {
                    return true;
                }

                ctrl.assistanceservicesonchange = function ($index) {
                    ctrl.model.membershipAssistanceService = [];
                    for (var i = 0; i < ctrl.assistanceservicerequired.length; i++) {
                        if (ctrl.assistanceservicerequired[i].selected) {
                            var serviceobject = {
                                tenantId: abp.session.tenantId,
                                membershipId: ctrl.model.id,
                                membershipServiceId: ctrl.assistanceservicerequired[i].id
                            };
                            ctrl.model.membershipAssistanceService.push(serviceobject);
                        };
                    };
                };

                ctrl.manageCheckbox = function () {
                    angular.forEach(ctrl.assistanceservicerequired, function (li) {
                        var contains = $filter('filter')(ctrl.model.membershipAssistanceService, function (m) { return m.membershipServiceId == li.id }).length;
                        if (contains) {
                            li.selected = true;
                        } else {
                            li.selected = false;
                        }

                    });
                };

                ctrl.save = function (event) {
                   // debugger;
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
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-assistanceservices-card.cshtml'
    });
})(_);