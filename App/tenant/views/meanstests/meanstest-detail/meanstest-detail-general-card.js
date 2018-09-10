(function (_) {
    appModule.component('meanstestDetailGeneralCard', {
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
            '$scope', '$stateParams', 'abp.services.app.commonLookup',
            function ($scope, $stateParams, commonLookupService) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.$stateParams = $stateParams;
                    ctrl.isPreAdmission = !!$stateParams.referral;
                    ctrl.isPostAdmission = (!!$stateParams.person || !!$stateParams.admission);

                    // fallback
                    if (!ctrl.isPreAdmission && !ctrl.isPostAdmission) {
                        ctrl.isPostAdmission = true;
                    }

                    ctrl.parentCtrl.addForm(submitForm);

                    commonLookupService.findReferrals().then(function (result) {
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
                    if (changes.model /*&& changes.model.isFirstChange()*/) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                            ctrl.model.referralId && ctrl.loadReferralServiceType(ctrl.model.referralId);
                            ctrl.model.personId && ctrl.loadAdmissions(ctrl.model.personId);
                        } else {
                            ctrl.workingModel = _.pick(ctrl.model, [
                                'personId', 'referralId', 'referralServiceTypeId', 'admissionId', 'cancellationReason'
                            ]);

                            //ctrl.model.referralId && ctrl.loadReferralServiceType(ctrl.workingModel.referralId);
                            //ctrl.model.personId && ctrl.loadAdmissions(ctrl.workingModel.personId);

                            ctrl.workingModel.referralId && ctrl.loadReferralServiceType(ctrl.workingModel.referralId);
                            ctrl.workingModel.personId && ctrl.loadAdmissions(ctrl.workingModel.personId);
                        }
                    }
                };

                // event handlers
                ctrl.loadReferralServiceType = function (id) {
                    commonLookupService.findReferralServiceTypes({
                        referralId: id
                    }).then(function (result) {
                        var options = result.data.items;
                        ctrl.referralServiceTypes = options.map(function (option) {
                            return {
                                id: option.value,
                                description: option.name
                            }
                        });
                    });
                };

                ctrl.loadAdmissions = function (id) {
                    commonLookupService.findAdmissions({
                        personId: id
                    }).then(function (result) {
                        var options = result.data.items;
                        ctrl.admissions = options.map(function (option) {
                            return {
                                id: option.value,
                                description: option.name
                            }
                        });
                    });
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
        templateUrl: '~/App/tenant/views/meanstests/meanstest-detail/meanstest-detail-general-card.cshtml'
    });
})(_);