(function (_) {
    appModule.component('visitlogDetailRenderedservices', {
        require: {
            parentCtrl: '^visitlogDetailGeneralCard'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
        },
        controllerAs: 'vm',
        controller: ['$scope', '$filter', '$state',
            function ($scope, $filter, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {

                };

                ctrl.countSubItems = function (index) {
                    var renderedServiceObj = ctrl.model[index] || {};
                    var checkedObj = !!renderedServiceObj.visitServices && $filter('filter')(renderedServiceObj.visitServices, { isChecked: true });

                    return (checkedObj.length > 0);
                }

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.workingModel = ctrl.model;

                        if (ctrl.workingModel) {
                            for (var i = 0; i < ctrl.workingModel.length; i++) {
                                var category = ctrl.workingModel[i];

                                for (var x = 0; x < category.visitServices.length; x++) {
                                    if (category.visitServices[x].isChecked) {
                                        category.DefaultOpen = true;
                                        break;
                                    }
                                }
                            }
                        } 
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-detail/visitlog-detail-renderedservices.cshtml'
    });
})(_);