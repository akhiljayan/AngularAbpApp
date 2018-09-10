(function (_) {
    appModule.component('membershipDetailInteresthobbiesCard', {
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

                // lifecycle hooks
                ctrl.$onInit = function () {                 
                };

                ctrl.$onChanges = function (changes) {

                    //debugger;
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

                ctrl.returnBoolValue = function (value) {
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }

                ctrl.cancel = function () {
                    closeEditMode();
                };

                // callbacks
                function closeEditMode() {
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                ctrl.initialiseInterestHobbyOthersDescription = function () {
                    if (ctrl.workingModel.interestHobbyOthers != true) {
                        ctrl.workingModel.interestHobbyOthersDescription = null;
                    }
                };               
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-interesthobbies-card.cshtml'
    });
})(_);