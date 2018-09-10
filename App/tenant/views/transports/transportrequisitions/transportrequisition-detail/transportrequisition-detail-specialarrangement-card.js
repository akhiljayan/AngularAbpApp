(function () {
    appModule.component('transportrequisitionDetailSpecialarrangementCard', {
        require: {
            parentCtrl: '^transportrequisitionDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$filter',
            function ($filter) {
                var ctrl = this;

                ctrl.countSubItems = function (index) {
                    var specialArrangementCategoryObj = ctrl.model.categories[index] || {};
                    var checkedObj = !!specialArrangementCategoryObj.specialArrangements && $filter('filter')(specialArrangementCategoryObj.specialArrangements, { isChecked: true });

                    return (checkedObj.length > 0);
                }

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        if (ctrl.model.categories) {
                            for (var i = 0; i < ctrl.model.categories.length; i++) {
                                var category = ctrl.model.categories[i];
                                for (var x = 0; x < category.specialArrangements.length; x++) {
                                    if (category.specialArrangements[x].isChecked) {
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
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail-specialarrangement-card.cshtml"
    });
})();