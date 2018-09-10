(function (_) {
    appModule.component('membershipDetailFinancialstatusCard', {
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
            '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.membership', '$filter',
            function ($stateParams, commonLookupService, membershipService, $filter) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {           
                };

                ctrl.$onChanges = function (changes) {                    
                    ctrl.workingModel = ctrl.model;                           
                };

                ctrl.returnBoolValue = function (value) {                   
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }

                ctrl.onChangePublicAssistanceRecipient = function () {
                    if (ctrl.workingModel.publicAssistanceRecipient != true) {
                        ctrl.workingModel.paCardNumber = null;
                    }
                };

                ctrl.onChangeSalary = function () {
                    if (ctrl.workingModel.salary != true) {
                        ctrl.workingModel.salaryAmount = null;
                    }
                };

                ctrl.onChangePersonalSavings = function () {
                    if (ctrl.workingModel.personalSavings != true) {
                        ctrl.workingModel.savingsAmount = null;
                    }
                };

                ctrl.initialiseFinancialStatusOthersDescription = function () {                   
                    if (ctrl.workingModel.financialStatusOthers != true) {
                        ctrl.workingModel.financialStatusOthersDescription = null;
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-financialstatus-card.cshtml'
    });
})(_);