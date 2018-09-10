(function (_) {
    appModule.component('financialassistanceDetailFinancialassistanceCard', {
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
            'abp.services.app.financialAssistanceType', '$scope', '$filter',
            function (financialAssistanceTypeService, $scope, $filter) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.parentCtrl.addForm(submitForm);

                    financialAssistanceTypeService.getFinancialAssistanceTypes({
                    }).then(function (result) {
                        ctrl.financialAssistanceType = result.data.items;
                        ctrl.getInstruction();
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        /*&& changes.model.isFirstChange()*/
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                        } else {
                            ctrl.workingModel = _.pick(ctrl.model, [
                                'financialAssistanceTypeId', 'applicationDate', 'referenceNo', 'beneficiary', 'effectiveDate', 'expiryDate', 'amount',
                                'percentage', 'status', 'issueDate', 'returnDate', 'remarks'
                            ]);

                            if (ctrl.workingModel.beneficiary != null) {
                                if (ctrl.workingModel.beneficiary == 4)
                                    ctrl.workingModel.beneficiary = 'NursingHome';
                                else
                                    ctrl.workingModel.beneficiary = $filter('enumText')(ctrl.workingModel.beneficiary, 'financialAssistanceBeneficiary');
                            }

                            if (ctrl.workingModel.status != null) {
                                ctrl.workingModel.status = $filter('enumText')(ctrl.workingModel.status, 'financialAssistanceStatus');
                            }
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

                ctrl.getInstruction = function () {
                    var financialAssistanceType = ctrl.financialAssistanceType.find(function (item) {
                        return item.id === ctrl.workingModel.financialAssistanceTypeId;
                    });

                    if (!!financialAssistanceType) {
                        ctrl.instructions = financialAssistanceType.instructions;
                    } else {
                        ctrl.instructions = null;
                    }
                }

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
        templateUrl: '~/App/tenant/views/financialAssistances/financialassistance-detail/financialassistance-detail-financialassistance-card.cshtml'
    });
})(_);