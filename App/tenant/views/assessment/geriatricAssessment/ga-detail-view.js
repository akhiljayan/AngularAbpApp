(function () {
    appModule.component('gaDetailView', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.commonLookup', '$stateParams', '$state', '$anchorScroll', '$location', '$filter', '$rootScope', 'abp.services.app.assessment', 'abp.services.app.geriatricAssessment', 'stateNavigation',
            function ($scope, $uibModal, $timeout, commonFormFunction, commonLookupService, $stateParams, $state, $anchorScroll, $location, $filter, $rootScope, assessmentService, geriatricAssessmentService, stateNavigation) {

                var vm = this;
                $anchorScroll.yOffset = 100;
                vm.personHeaderisPinned = false;
                vm.personDisabled = false;
                vm.appPath = abp.appPath;
                vm.isCreateMode = !$stateParams.id;
                vm.mode = 'new';
                vm.isNew = 0;

                vm.model = { totalscore: 0, actualAssessment: {}, option: {}, nextReviewMonth: 0, isNextReviewMonthRequired: false, isCategoryRequired: false, isScoreCalculationRequired: false };
                vm.model.selectedValue = [];
                vm.model.selectedValueForBalanceSession = [];
                vm.model.selectedValueForGaitSession = [];
                vm.model.checkValue = [];

                vm.selectedOptionModel = [];
                vm.model.confirmationCheck = false;
                vm.model.finalCheck = false;
                vm.assessment = {};



                vm.assessmentQuestionType = app.consts.assessmentQuestionType;
                vm.categoryColorCodes = app.consts.assessmentCategoryColorCodes;
                vm.option = {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: '#e6e7e8',
                    readOnly: true,
                    dynamicOptions: true
                };

                //Init method
                vm.$onInit = function () {
                    vm.parentForm = $scope.$parent.vm.form;

                    vm.init();

                    //refactor
                    if (vm.model.actualAssessment.personId != app.consts.EmptyGuid && vm.model.actualAssessment.personId != undefined) {
                        vm.personDisabled = true;
                    } else {
                        vm.model.actualAssessment.personId = undefined;
                    }
                    if ($stateParams.personId && $stateParams.personId != undefined && $stateParams.personId != app.consts.EmptyGuid) {
                        vm.personDisabled = true;
                    }
                    if ($stateParams.id && $stateParams.id != undefined && $stateParams.id != app.consts.EmptyGuid) {
                        vm.personDisabled = true;
                    }
                };

                vm.$doCheck = function () {

                    if (!angular.equals(vm.preAssessmentName, vm.model.actualAssessment.assessmentName) && vm.model.actualAssessment.assessmentName != undefined) {
                        vm.generateChart(vm.model.actualAssessment.personId);
                        vm.preAssessmentName = angular.copy(vm.model.actualAssessment.assessmentName);
                    }

                    if (!angular.equals(vm.preTotalScore, vm.model.totalScore) && $stateParams.assessment != undefined) {                        
                        if (vm.categories != undefined && vm.categories.length != 0) {
                            vm.option.barColor = getColorCode(vm.model.totalScore);
                            vm.model.category = vm.getCategoryDescription(vm.model.totalScore);
                        } else {
                            assessmentService.getCategories($stateParams.assessment).then(function (result) {
                                vm.categories = result.data;
                                vm.option.barColor = getColorCode(vm.model.totalScore);
                                vm.model.category = vm.getCategoryDescription(vm.model.totalScore);
                            });
                        }
                        vm.preTotalScore = vm.model.totalScore;
                    }                    
                };


                // Bind Family Member & AssessmentChart when person is changed.
                vm.generateChart = function (personId) {
                    if (!personId)
                        return;

                    assessmentService.getAssessmentChart({ PersonId: personId, AssessmentDate: vm.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template, ReferralId: vm.model.actualAssessment.referralId }).then(function (result) {

                        /* IF there is no previous confirmed assessment, the chart won't show. */
                        vm.assessmentChartData = result.data.assessmentDateList;
                        if (vm.assessmentChartData.length == 0)
                            return;

                        var colorlist = [];
                        for (var key in result.data.colorCode) {
                            if (result.data.colorCode.hasOwnProperty(key)) {
                                var colorcode = result.data.colorCode[key];
                                colorlist.push(app.consts.assessmentCategoryColorCodes.values[colorcode].rgbValue);
                            };
                        };
                        vm.assessmentConfig = {
                            'labels': result.data.assessmentDateList,
                            'data': result.data.totalScoreList,
                            'colors': colorlist,
                            'mainTitle': $stateParams.description,
                            'xaxisTitle': "Assessment Date",
                            'yaxixTitle': "Score",
                            'pointStyle': 'circle',
                            'lineColor': "#eaeaea",
                            'tooltipLabelPrefix': '',
                            'showMinMax': false,
                            'minArr': 0,
                            'maxArr': 100,
                            'minMaxLabel': { 'min': '0', 'max': '100' },
                            'minMaxColor': { 'min': '#7173f2', 'max': '#7173f2' },
                            'minMaxBorder': { 'min': 0, 'max': 100 },
                            'maxYVal': 100,
                        }
                    });

                    if (vm.isNew && $stateParams.template == 'person') {
                        /* Upon selecting person, system to display the message if there is any pending confirmation record
                         * System will not block to continue */
                        assessmentService.existPendingUnconfirmedRecords({ PersonId: personId, AssessmentDate: vm.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template }).then(function (result) {
                            if (result.data) {
                                abp.message.info("System found unconfirmed assessment!");
                            }
                        });
                    }
                };


                // Load
                vm.load = function () {
                    
                    vm.loading = true;

                    if ($stateParams.id) {
                        vm.actualAssessmentId = $stateParams.id;
                        vm.mode = 'view';
                        geriatricAssessmentService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {
                            vm.model.actualAssessment = result.data;                            

                            for (var i = 0; i < vm.model.actualAssessment.answers.length; i++) {
                                var val = vm.model.actualAssessment.answers[i];
                                if (val.question.mutuallyExclusiveQuestionId != null) {
                                    vm.model.selectedValue[val.question.mutuallyExclusiveQuestionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                } else {
                                    if (val.question.questionType == vm.assessmentQuestionType.SingleSelectListing) {

                                        vm.model.selectedValue[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                    }
                                }

                                // To bind options again on respective section : Balance or Gait section
                                if (val.question.assessmentSectionTitle == 'Balance Tests (Subject seated on hand, armless chair)') {
                                    vm.model.selectedValueForBalanceSession[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                } else if (val.question.assessmentSectionTitle == 'Gait Tests') {
                                    vm.model.selectedValueForGaitSession[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });
                                }
                            }
                            
                            vm.model.isConfirmed = vm.model.actualAssessment.isConfirmed;
                            vm.model.isCancelled = vm.model.actualAssessment.isCancelled;
                            vm.model.disabled = vm.model.actualAssessment.isConfirmed || vm.model.actualAssessment.isCancelled;
                            vm.model.totalScore = vm.model.actualAssessment.totalScore;

                            vm.generateChart(vm.model.actualAssessment.personId);
                        });
                    } else {
                        vm.isNew = 1;
                        vm.mode = 'new';
                        vm.actualAssessmentId = app.consts.EmptyGuid;
                        geriatricAssessmentService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {

                            vm.model.actualAssessment = result.data;

                            if ($stateParams.assessment) {
                                vm.model.actualAssessment.assessmentName = $stateParams.assessment;
                            }
                            vm.model.actualAssessment.personId = null;
                            if ($stateParams.personId) {
                                vm.model.actualAssessment.personId = $stateParams.personId;
                            }   
                            if ($stateParams.template == 'person') {
                                vm.model.actualAssessment.state = 2;
                            }
                        });
                    }

                    vm.loading = false;
                };

                //Init method
                vm.init = function () {
                    
                    if ($stateParams.assessment) {
                        vm.permissions = {
                            edit: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Edit'),
                            confirm: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Confirm'),
                            cancel: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Cancel'),
                            delete: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Delete'),
                            copyExisting: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.CopyExisting')
                        };

                        getEmptyAssessmentObject();
                        vm.load();
                        getCategories();
                    }
                };

                // Save method
                vm.save = function (closed) {
                    
                    commonFormFunction.setFormSubmitted(vm.form);

                    vm.model.confirmationCheck = false;

                    if (!vm.form.$valid) {
                        abp.message.warn('Please provide a value for * fields.', 'Mandatory fields required !');
                        return;
                    }
                    commonFormFunction.setPristine();
                    convertAnswer();
                    if ($stateParams.id) {
                        geriatricAssessmentService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        geriatricAssessmentService.createPersonAssessment(vm.model.actualAssessment).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            } else {
                                if (typeof $stateParams.personId != 'undefined') {
                                    $state.go('tenant.gaDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                } else {
                                    $state.go('tenant.gaDetail', { assessment: $stateParams.assessment, id: result.data.id });
                                }

                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }

                vm.close = function () {
                    if (typeof $stateParams.personId != 'undefined') {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.profile, $stateParams.personId);
                    } else if ($stateParams.close == 'Careboard') {
                        $state.go('tenant.dashboard.careboard');
                    } else {
                        $state.go('tenant.assessment', { assessment: $stateParams.assessment, description: $stateParams.description })
                    }
                };

                vm.confirm = function () {
                    vm.model.confirmationCheck = true;

                    commonFormFunction.setFormSubmitted(vm.form);

                    if (vm.model.isNextReviewMonthRequired && vm.model.actualAssessment.nextReviewDate == null)
                        return;

                    if (vm.form.$valid) {
                        abp.message.confirm(
                            'Please click Ok to continue',
                            'You are about to Confirm the Assessment',
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    convertAnswer(true);
                                    geriatricAssessmentService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                                        geriatricAssessmentService.confirm(vm.actualAssessmentId).then(function (result) {
                                            vm.load();
                                            abp.notify.info(app.localize('ConfirmedSuccessfully'));
                                        });
                                    }).finally(function () {
                                        vm.saving = false;
                                    });
                                };
                            });
                    } else {
                        abp.message.warn('Please provide a value for * fields.', 'Mandatory fields required !');
                    }
                };

                vm.cancel = function () {
                    abp.message.confirm(
                        'Please click Ok to continue',
                        'You are about to Cancel the Assessment',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openValidationPopUp("cancel");
                            };
                        });
                };

                vm.clone = function () {
                    vm.loading = true;
                    vm.message = 'Please click Ok to continue';
                    vm.cloneTitle = 'You are about to copy the assessment';

                    /*
                     * Before clone, System to validate to show warning message of person's existing unconfirmed records if any
                     */
                    if ($stateParams.template == 'person') {
                        assessmentService.existPendingUnconfirmedRecords(
                            { PersonId: vm.model.actualAssessment.personId, ReferralId: null, AssessmentDate: vm.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template }
                        ).then(function (result) {
                            if (result.data)
                                vm.cloneTitle += '<br/>*Note: System detected unconfirmed assessment.';
                            vm.actualClone(vm.cloneTitle, vm.message);
                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                };
                vm.actualClone = function (title, message) {
                    abp.message.confirm(
                        message,
                        title,
                        function (isCloned) {
                            if (isCloned) {
                                geriatricAssessmentService.clone(vm.model.actualAssessment.id).then(function (result) {
                                    if (typeof $stateParams.personId != 'undefined') {
                                        $state.go('tenant.gaDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                    } else {
                                        $state.go('tenant.gaDetail', { assessment: $stateParams.assessment, id: result.data.id });
                                    }
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            };
                        });
                };

                vm.delete = function () {

                    if (!vm.permissions.delete) {
                        return;
                    }
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                geriatricAssessmentService.deletePersonAssessment(
                                    vm.model.actualAssessment.id
                                ).then(function () {
                                    abp.notify.info("Deleted");
                                    $rootScope.close();
                                });
                            }
                        }
                    );
                };

                function convertAnswer(isConfirm) {
                    if (isConfirm) {
                        for (var item in vm.model.checkValue) {
                            if (vm.model.checkValue.hasOwnProperty(item)) {
                                vm.model.checkValue[item] = true;
                            }
                        }
                    }

                    vm.model.actualAssessment.answers = [];

                    //Balance Session
                    for (var key in vm.model.selectedValueForBalanceSession) {
                        if (vm.model.selectedValue.hasOwnProperty(key)) {
                            vm.model.checkValue[key] = false;

                            var dataValue = vm.model.selectedValue[key];

                            /* Converting answer for SingleSelectListing  and SingleSelectDropDown*/
                            if (typeof (dataValue) == 'string') {

                                var val = JSON.parse(vm.model.selectedValue[key]);
                                var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };

                                vm.model.actualAssessment.answers.push(answer);
                            }
                        }
                    };

                    //Gait Session
                    for (var key in vm.model.selectedValueForGaitSession) {
                        if (vm.model.selectedValue.hasOwnProperty(key)) {
                            vm.model.checkValue[key] = false;

                            var dataValue = vm.model.selectedValue[key];

                            /* Converting answer for SingleSelectListing  and SingleSelectDropDown*/
                            if (typeof (dataValue) == 'string') {

                                var val = JSON.parse(vm.model.selectedValue[key]);
                                var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };

                                vm.model.actualAssessment.answers.push(answer);
                            }
                        }
                    };
                };

                function openValidationPopUp(reason) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/assessment/assessmentRequiredFields.cshtml',
                        controller: 'tenant.views.assessment.assessmentRequiredFields as vm',
                        backdrop: 'static',
                        scope: $scope,
                        resolve: {
                            data: function () {
                                return vm.model.actualAssessment;
                            },
                            action: function () {
                                return reason;
                            }
                        }
                    });
                    modalInstance.result.then(function (confirm) {
                        vm.load();
                    });
                };

                function getEmptyAssessmentObject() {
                    assessmentService.getByName($stateParams.assessment).then(function (result) {
                        vm.assessment = result.data;
                        vm.model.nextReviewMonth = vm.assessment.nextReviewMonth;
                        vm.model.isNextReviewMonthRequired = vm.assessment.isNextReviewMonthRequired;
                        vm.model.isCategoryRequired = vm.assessment.isCategoryRequired;
                        vm.model.isScoreCalculationRequired = vm.assessment.isScoreCalculationRequired;

                        vm.model.actualAssessment.assessmentId = vm.assessment.id;
                    });
                };


                // To calculate total score
                vm.onChangeOption = function () {
                    vm.model.totalScore = 0;
                    vm.model.actualAssessment.balanceTotalScore = 0;
                    vm.model.actualAssessment.giatTotalScore = 0;

                    if (vm.model.isScoreCalculationRequired) {                        
                        for (var key in vm.model.selectedValue) {
                            if (vm.model.selectedValue.hasOwnProperty(key)) {

                                var dataValue = vm.model.selectedValue[key];

                                /* Socre calculation for SingleSelectListing */
                                if (typeof (dataValue) == 'string') {
                                    var val = JSON.parse(vm.model.selectedValue[key]);
                                    vm.model.totalScore += val.score;

                                    /* Balance session score calculation*/
                                    if (vm.model.selectedValueForBalanceSession.hasOwnProperty(key)) {
                                        vm.model.actualAssessment.balanceTotalScore += val.score;
                                    }
                                    /* Gait session score calculation*/
                                    if (vm.model.selectedValueForGaitSession.hasOwnProperty(key)) {
                                        vm.model.actualAssessment.giatTotalScore += val.score;
                                    }
                                }                                
                            }
                        };
                    }
                };

                /* It's handling for Single Select (listing) Option Change.*/
                vm.selectOption = function (answerId, questionId, optionDescription, questionType, section) {
                    
                    console.log('section' + section);

                    if (vm.selectedOptionModel[questionId]) {
                        var val = JSON.parse(vm.model.selectedValue[questionId]);

                        if (vm.selectedOptionModel[questionId] == answerId) {
                            vm.model.selectedValue[questionId] = null;
                            vm.selectedOptionModel[questionId] = null;
                            if (section == 'Balance Tests (Subject seated on hand, armless chair)') {
                                vm.model.selectedValueForBalanceSession[questionId] = null;
                            } else if (section == 'Gait Tests') {
                                vm.model.selectedValueForGaitSession[questionId] = null;
                            }
                            
                        } else {
                            vm.selectedOptionModel[questionId] = answerId;
                            if (section == 'Balance Tests (Subject seated on hand, armless chair)') {
                                vm.model.selectedValueForBalanceSession[questionId] = vm.model.selectedValue[questionId];
                            } else if (section == 'Gait Tests') {
                                vm.model.selectedValueForGaitSession[questionId] = vm.model.selectedValue[questionId];
                            }                     
                        }

                    } else {
                        vm.selectedOptionModel[questionId] = answerId;
                        if (section == 'Balance Tests (Subject seated on hand, armless chair)') {
                            vm.model.selectedValueForBalanceSession[questionId] = vm.model.selectedValue[questionId];
                        } else if (section == 'Gait Tests') {
                            vm.model.selectedValueForGaitSession[questionId] = vm.model.selectedValue[questionId];
                        }
                    }                    

                    vm.onChangeOption();
                }

                vm.bindToJson = function (idVal, scoreVal, questionIdVal, descriptionVal, mutualId, questionTypeVal) {
                    if (mutualId == null) {
                        vm.model.checkValue[questionIdVal] = false;
                    } else {
                        vm.model.checkValue[mutualId] = false;
                    }

                    var jsonObject = { id: idVal, score: scoreVal, questionId: questionIdVal, optionDescription: descriptionVal, questionType: questionTypeVal };
                    return jsonObject;
                }

                function getColorCode(score) {
                    if (vm.categories) {
                        for (var key in vm.categories) {
                            if (vm.categories.hasOwnProperty(key)) {
                                var val = vm.categories[key];
                                if (val.minimumValue <= score && score <= val.maximumValue) {
                                    return vm.categoryColorCodes.values[val.colorCode].rgbValue;
                                }
                            }
                        };
                    }
                    //return grey
                    return vm.categoryColorCodes.values[4].rgbValue;
                };

                vm.getCategoryDescription = function (score) {

                    for (var key in vm.categories) {
                        if (vm.categories.hasOwnProperty(key)) {
                            var val = vm.categories[key];
                            if (val.minimumValue <= score && score <= val.maximumValue) {
                                return val.description;
                            }
                        }
                    };
                };

                // GetCategories
                function getCategories() {
                    if ($stateParams.assessment != null) {
                        assessmentService.getCategories($stateParams.assessment).then(function (result) {
                            vm.categories = result.data;
                        });
                    }
                };
            }
        ],

        templateUrl: '~/App/tenant/views/assessment/geriatricAssessment/ga-detail-view.cshtml'
    });
})();