(function (_) {
    appModule.component('financialassistanceDetailGeneralCard', {
        require: {
            parentCtrl: '^financialassistanceDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$stateParams', 'abp.services.app.commonLookup',
            function ($stateParams, commonLookupService) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.navigation = false;
                    ctrl.$stateParams = $stateParams;

                    ctrl.isPreAdmission = !!$stateParams.referral;
                    ctrl.isPostAdmission = !!$stateParams.person;

                    // fallback
                    if (!ctrl.isPreAdmission && !ctrl.isPostAdmission) {
                        ctrl.isPostAdmission = true;

                        if (ctrl.mode != 'new') {
                            ctrl.navigation = true;
                        }
                    }

                    ctrl.parentCtrl.addForm(submitForm);


                    commonLookupService.findReferrals({
                    }).then(function (result) {
                        var options = result.data.items;
                        ctrl.referrals = options.map(function (option) {
                            return {
                                id: option.value,
                                description: option.name
                            }
                        });
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        /* && changes.model.isFirstChange()*/
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                        } else {
                            ctrl.workingModel = _.pick(ctrl.model, [
                                'personId', 'referralId', 'cancellationReason'
                            ]);
                        }
                    }
                };

                // event handlers
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
            }
        ],
        templateUrl: '~/App/tenant/views/financialassistances/financialassistance-detail/financialassistance-detail-general-card.cshtml'
    });
})(_);