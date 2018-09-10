(function (_) {
    appModule.component('membershipDetailSupportnetworkCard', {
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
            '$scope','$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', '$filter',
            function ($scope,$stateParams, commonLookupService, userService, patientService, membershipService, $filter) {
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
                   // debugger;
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



                //Populate Admission Date based on Admission Selected
               

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

                ctrl.initialiseSupportNetworkOthersDescription = function () {
                   // debugger;
                    if (ctrl.workingModel.supportNetworkOthers != true) {
                        ctrl.workingModel.supportNetworkOthersDescription = null;
                    }
                };               
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-supportnetwork-card.cshtml'
    });
})(_);