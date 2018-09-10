(function (_) {
    appModule.component('investigationDetailGeneralCard', {
        require: {
            parentCtrl: '^investigationDetail'
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
            '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.masterLookUp', '$filter',
            function ($stateParams, commonLookupService, masterLookup, $filter) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.$stateParams = $stateParams;

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

                    masterLookup.getMasterTypeItems({
                        type: 'Investigation Type'
                    }).then(function (result) {
                        ctrl.investigationTypesMaster = result.data;
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        if (ctrl.mode == 'new') {
                            ctrl.workingModel = ctrl.model;
                        } else {
                            ctrl.workingModel = _.pick(ctrl.model, [
                                'personId', 'referralId', 'investigationDate', 'documentsReferenceNo',
                                'investigationTypeId', 'subject', 'resultType', 'resultDate', 'remarks', 'attachments'
                            ]);

                            if (angular.isNumber(ctrl.workingModel.resultType)) {
                                if (ctrl.workingModel.resultType == 99) {
                                    ctrl.workingModel.resultType = 'NotConclusive';
                                } else {
                                    ctrl.workingModel.resultType = $filter('enumText')(ctrl.workingModel.resultType, 'investigationResultType');
                                }
                            }
                        };
                    }
                };

                ctrl.setInvestigationTypeDescription = function (investigationTypeId) {
                    if (!investigationTypeId) {
                        ctrl.workingModel.investigationType = null;
                        ctrl.workingModel.othersInvestigationType = null;
                        return;
                    }

                    masterLookup.getMasterTypeItems({
                        type: 'Investigation Type'
                    }).then(function (result) {
                        ctrl.investigationTypesMaster = result.data;

                        for (var i = 0; i < ctrl.investigationTypesMaster.length; i++) {
                            if (ctrl.investigationTypesMaster[i].id == investigationTypeId) {
                                ctrl.workingModel.investigationType = ctrl.investigationTypesMaster[i].description;
                                break;
                            }
                        }

                        if (ctrl.workingModel.investigationType != 'Others') {
                            ctrl.workingModel.othersInvestigationType = null;
                        }
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
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                function submitForm() {
                    ctrl.form.submitted = true;

                    if (ctrl.form.$valid) {
                        ctrl.form.$setPristine();
                    }

                    return ctrl.form.$valid;
                }

                ctrl.validateResultDate = function () {
                    if (ctrl.workingModel.resultDate) {
                        var investigationDate = ctrl.workingModel.investigationDate;
                        investigationDate = new Date(investigationDate).setHours(0, 0, 0, 0);

                        var resultDate = new Date(ctrl.workingModel.resultDate).setHours(0, 0, 0, 0);
                        var isValid = resultDate > investigationDate;

                        if (!isValid) {
                            return "Result Date must be after Investigation Date.";
                        } else {
                            return isValid;
                        }
                    } else {
                        return true;
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/investigations/investigation-detail/investigation-detail-general-card.cshtml'
    });
})(_);