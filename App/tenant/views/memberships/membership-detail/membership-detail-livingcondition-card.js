(function (_) {
    appModule.component('membershipDetailLivingconditionCard', {
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
                //debugger;
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    //debugger;
                   


                    userService.getOUUsers({
                    }).then(function (result) {
                        //debugger;
                        var options = result.data.items;
                        ctrl.users = options.map(function (option) {
                            return {
                                id: option.id,
                                description: option.name
                            }
                        });
                    });


                };

                ctrl.returnBoolValue = function (value) {
                   
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }

                ctrl.$onChanges = function (changes) {

                            ctrl.workingModel = ctrl.model;
                            
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

                ctrl.initialiseLivingConditionOthersDescription = function () {
                    //debugger;
                    if (ctrl.workingModel.livingConditionOthers != true) {
                        ctrl.workingModel.livingConditionOthersDescription = null;
                    }
                };               
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-livingcondition-card.cshtml'
    });
})(_);