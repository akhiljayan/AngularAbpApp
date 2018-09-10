(function () {
    appModule.component('prescriptionDrugOrderstatusCount', {
        bindings: {
            orderStatusCounts: '<'
        },
        controller: [
            '$state',
            function ($state) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    // Set default and sequence
                    ctrl.output = [
                        { 'key': 'unchecked', 'value': 0 },
                        { 'key': 'provisional', 'value': 0 },
                        { 'key': 'confirmed', 'value': 0 },
                        { 'key': 'voided', 'value': 0 },
                        { 'key': 'stopped', 'value': 0 },
                        { 'key': 'completed', 'value': 0 },
                        { 'key': 'referral', 'value': 0 }
                    ];
                };

                ctrl.$onChanges = function (changes) {
                    if (!!ctrl.output) {
                        for (var i = 0; i < ctrl.output.length; i++) {
                            var fieldName = ctrl.output[i].key;
                            ctrl.output[i].value = ctrl.orderStatusCounts[fieldName] || 0;
                        }
                    }
                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                }
            }
        ],
        templateUrl: '~/App/tenant/views/prescriptions/prescription-drug-orderstatus-count/prescription-drug-orderstatus-count.cshtml'
    });
})();
