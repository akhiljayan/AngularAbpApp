(function (_) {
    appModule.component('visitlogDetailRenderedservicesCard', {
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: ['$scope', '$filter', '$state', 
            function ($scope, $filter, $state) {
                var ctrl = this;

                ctrl.$onInit = function () {

                };

                ctrl.countSubItems = function (index) {
                    var renderedServiceObj = ctrl.model.categories[index] || {};
                    var checkedObj = !!renderedServiceObj.visitServices && $filter('filter')(renderedServiceObj.visitServices, { isChecked: true });

                    return (checkedObj.length > 0);
                }

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.workingModel = _.pick(ctrl.model, [
                            'categories'
                        ]);

                        if (ctrl.workingModel.categories) {
                            for (var i = 0; i < ctrl.workingModel.categories.length; i++) {
                                var category = ctrl.workingModel.categories[i];

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

                ctrl.save = function (event) {
                    ctrl.workingModel.renderedServices = [];

                    for (var i = 0; i < ctrl.workingModel.categories.length; i++) {
                        var category = ctrl.workingModel.categories[i];

                        for (var x = 0; x < category.visitServices.length; x++) {
                            if (category.visitServices[x].isChecked) {
                                ctrl.workingModel.renderedServices.push(category.visitServices[x]);
                            }
                        }
                    }

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
                    $state.reload();
                };

                function closeEditMode() {
                    ctrl.mode = 'view';
                }
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-detail/visitlog-detail-renderedservices-card.cshtml'
    });
})(_);