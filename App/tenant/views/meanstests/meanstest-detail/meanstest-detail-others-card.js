(function (_) {
    appModule.component('meanstestDetailOthersCard', {
        require: {
            parentCtrl: '^meanstestDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope',
            function ($scope) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.parentCtrl.addForm(submitForm);
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model /*&& changes.model.isFirstChange()*/) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                        } else {
                            ctrl.workingModel = _.pick(ctrl.model, [
                                'patientBandId', 'totalHouseholdIncome', 'noOfHouseholdFamilyMembers',
                                'householdPerCapitaIncome', 'remarks'
                            ]);
                        }
                    }
                };

                // event handlers
                ctrl.save = function (event) {
                    $scope.$broadcast('check-select-ui-required');
                    var isValid = submitForm();

                    if (isValid) {
                        ctrl.onUpdate({
                            event: {
                                data: ctrl.workingModel,
                                success: closeEditMode
                            }
                        });

                        event.preventDefault();
                    }
                };

                ctrl.cancel = function () {
                    closeEditMode();
                };

                // callbacks
                function closeEditMode() {
                    ctrl.mode = 'view';
                }

                function submitForm() {
                    ctrl.form.submitted = true;

                    /*
                        Add this statement to not show popout dialog
                        Your changes have not been saved. Leave anyway?
                        when click Save with all mandatory fields are filled
                    */
                    if (ctrl.form.$valid) {
                        ctrl.form.$setPristine();
                    }


                    return ctrl.form.$valid;
                }
            },
        ],
        templateUrl: '~/App/tenant/views/meanstests/meanstest-detail/meanstest-detail-others-card.cshtml'
    });
})(_);