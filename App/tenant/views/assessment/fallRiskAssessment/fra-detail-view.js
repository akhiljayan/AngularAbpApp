﻿(function () {
    appModule.component('fraDetailView', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.commonLookup', '$stateParams', '$state', '$anchorScroll', '$location', 'abp.services.app.user', '$filter', '$rootScope', 'abp.services.app.person', 'abp.services.app.assessment', 'stateNavigation',
            function ($scope, $uibModal, $timeout, commonFormFunction, commonLookupService, $stateParams, $state, $anchorScroll, $location, userService, $filter, $rootScope, personService, assessmentService, stateNavigation) {

                var vm = this;
                $anchorScroll.yOffset = 100;
                vm.personHeaderisPinned = true;
                vm.personDisabled = false;
                vm.appPath = abp.appPath;
                vm.isCreateMode = !$stateParams.id;
                vm.mode = 'new';
                vm.isNew = 0;

                vm.model = { totalscore: 0, actualAssessment: {}, option: {}, nextReviewMonth: 0, isNextReviewMonthRequired: false, isCategoryRequired: false, isScoreCalculationRequired: false };
                vm.model.selectedValue = [];
                vm.model.checkValue = [];
                vm.model.selectedTextValue = [];
                vm.model.selectedValueList = [];
                vm.selectedOptionModel = [];
                vm.model.confirmationCheck = false;
                vm.assessment = {};
                vm.assessmentQuestionType = app.consts.assessmentQuestionType;

                //Init method
                vm.$onInit = function () {
                    
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
                    /* Set up Next Review Date */
                    if (vm.model.isNextReviewMonthRequired) {
                        if (!angular.equals(vm.nextReviewMonth, vm.model.nextReviewMonth)) {
                            if (vm.model.actualAssessment.nextReviewDate == null) {
                                vm.nextReviewMonth = vm.model.nextReviewMonth;
                                var assessmentDate = moment(vm.model.actualAssessment.assessmentDate);
                                vm.model.actualAssessment.nextReviewDate = assessmentDate.add(vm.nextReviewMonth, 'month');
                            }
                        }
                    }

                };

                vm.onPersonChange = function (personId) {
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
                        assessmentService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {
                            
                            vm.model.actualAssessment = result.data;
                            for (var i = 0; i < vm.model.actualAssessment.answers.length; i++) {
                                var val = vm.model.actualAssessment.answers[i];
                                if (val.question.mutuallyExclusiveQuestionId != null) {
                                    vm.model.selectedValue[val.question.mutuallyExclusiveQuestionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                } else {
                                    if (val.question.questionType == vm.assessmentQuestionType.SingleSelectListing) {
                                        vm.model.selectedValue[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                    } else if (val.question.questionType == vm.assessmentQuestionType.TextBox) {

                                        vm.model.selectedTextValue[val.questionId] = val.answerTextValue;

                                    } else if (val.question.questionType == vm.assessmentQuestionType.YesNoToogle && val.question.options.length == 2) {

                                        vm.model.selectedValueList[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "questionType": val.question.questionType });

                                        vm.model.selectedValue[val.questionId] = val.option.description == 'Yes' ? true : false;
                                    } else if (val.question.questionType == vm.assessmentQuestionType.SingleSelectDropDown) {

                                        vm.model.selectedValueList[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "questionType": val.question.questionType });
                                        vm.model.selectedValue[val.questionId] = val.optionId;
                                    }
                                }
                            }

                            vm.model.isConfirmed = vm.model.actualAssessment.isConfirmed;
                            vm.model.isCancelled = vm.model.actualAssessment.isCancelled;
                            vm.model.disabled = vm.model.actualAssessment.isConfirmed || vm.model.actualAssessment.isCancelled;                            
                            vm.model.totalScore = vm.model.actualAssessment.totalScore;
                        });
                    } else {
                        vm.isNew = 1;
                        vm.mode = 'new';
                        vm.actualAssessmentId = app.consts.EmptyGuid;
                        assessmentService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {                            
                            vm.model.actualAssessment = result.data;                            

                            if ($stateParams.assessment) {
                                vm.model.actualAssessment.assessmentName = $stateParams.assessment;
                            }
                            vm.model.actualAssessment.personId = null;
                            if ($stateParams.personId) {
                                vm.model.actualAssessment.personId = $stateParams.personId;  
                                vm.onPersonChange($stateParams.personId);
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
                        vm.load();
                        getEmptyAssessmentObject();
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
                        assessmentService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        assessmentService.createPersonAssessment(vm.model.actualAssessment).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            } else {
                                if (typeof $stateParams.personId != 'undefined') {
                                    $state.go('tenant.fraDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                } else {
                                    $state.go('tenant.fraDetail', { assessment: $stateParams.assessment, id: result.data.id });
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
                    if (vm.model.actualAssessment.nextReviewDate == null || vm.model.actualAssessment.nextReviewDate == "") {
                        vm.isNextReviewDateEmpty = true;
                        return;
                    }

                    commonFormFunction.setFormSubmitted(vm.form);

                    if (vm.form.$valid) {
                        abp.message.confirm(
                            'Please click Ok to continue',
                            'You are about to Confirm the Assessment',
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    convertAnswer(true);
                                    assessmentService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                                        assessmentService.confirm(vm.actualAssessmentId).then(function (result) {
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
                                assessmentService.clone(vm.model.actualAssessment.id).then(function (result) {
                                    if (typeof $stateParams.personId != 'undefined') {
                                        $state.go('tenant.fraDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                    } else {
                                        $state.go('tenant.fraDetail', { assessment: $stateParams.assessment, id: result.data.id });
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
                                assessmentService.deletePersonAssessment(
                                    vm.model.actualAssessment.id
                                ).then(function () {
                                    abp.notify.info("Deleted");
                                    $rootScope.close();
                                });
                            }
                        }
                    );
                };

                // Convert Answers
                function convertAnswer(isConfirm) {
                    
                    if (isConfirm) {
                        for (var item in vm.model.checkValue) {
                            if (vm.model.checkValue.hasOwnProperty(item)) {
                                vm.model.checkValue[item] = true;
                            }
                        }
                    }

                    vm.model.actualAssessment.answers = [];
                    for (var key in vm.model.selectedValue) {
                        if (vm.model.selectedValue.hasOwnProperty(key)) {
                            vm.model.checkValue[key] = false;

                            var dataValue = vm.model.selectedValue[key];

                            /* Socre calculation for SingleSelectListing question type */
                            if (typeof (dataValue) == 'string' && !vm.model.selectedValueList.hasOwnProperty(key)) {

                                var val = JSON.parse(vm.model.selectedValue[key]);
                                var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                vm.model.actualAssessment.answers.push(answer);

                                /* Socre calculation for SingleSelectDropDown question type */
                            } else if (typeof (dataValue) == 'string' && vm.model.selectedValueList.hasOwnProperty(key)) {

                                var val = JSON.parse(vm.model.selectedValueList[key]);
                                if (val) {
                                    var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                    vm.model.actualAssessment.answers.push(answer);
                                }

                                /* Socre calculation for YesNoToogle question type */
                            } else if (typeof (dataValue) == 'boolean') {

                                var val = JSON.parse(vm.model.selectedValueList[key]);
                                if (val) {
                                    var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                    vm.model.actualAssessment.answers.push(answer);
                                }
                            }
                        }
                    };

                    for (var key in vm.model.selectedTextValue) {
                        /*
                         * To exclude Others,Please Specify field value to not create separate answer.
                         */
                        if (!vm.model.selectedValue.hasOwnProperty(key)) {
                            if (vm.model.selectedTextValue.hasOwnProperty(key)) {
                                var val = vm.model.selectedTextValue[key];
                                if (val) {
                                    vm.model.checkValue[key] = false;
                                    var answer = { questionId: key, optionId: null, actualAssessmentId: vm.actualAssessmentId, answerTextValue: val, answerDateTimeValue: null };
                                    vm.model.actualAssessment.answers.push(answer);
                                }
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

                // Get Assessment Config
                function getEmptyAssessmentObject() {
                    assessmentService.getByName($stateParams.assessment).then(function (result) {
                        vm.assessment = result.data;
                        vm.model.nextReviewMonth = vm.assessment.nextReviewMonth;
                        vm.model.isNextReviewMonthRequired = vm.assessment.isNextReviewMonthRequired;
                        vm.model.isCategoryRequired = vm.assessment.isCategoryRequired;
                        vm.model.isScoreCalculationRequired = vm.assessment.isScoreCalculationRequired;

                        vm.model.actualAssessment.assessmentId = vm.assessment.id;

                        /* Pre-setup for question type YesNoToogle to make it default value to "No" */
                        angular.forEach(vm.assessment.assessmentSections, function (section) {

                            for (var index = 0; index < section.questions.length; index++) {
                                var question = section.questions[index];
                                if (question.questionType == vm.assessmentQuestionType.YesNoToogle && question.options.length == 2) {
                                    if (vm.model.selectedValue[question.id]) {
                                        vm.model.selectedValue[question.id] = true;
                                    } else {
                                        vm.model.selectedValue[question.id] = false;
                                        angular.forEach(question.options, function (option) {
                                            if (option.description == 'No') {
                                                var jsonObject = { id: option.id, score: option.score, questionId: option.questionId };
                                                vm.model.selectedValueList[option.questionId] = JSON.stringify(jsonObject);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        
                    });
                };

                vm.onChangeOption = function (questionType) {
                    vm.model.totalScore = 0;
                    if (vm.model.isScoreCalculationRequired) {
                        for (var key in vm.model.selectedValue) {
                            if (vm.model.selectedValue.hasOwnProperty(key)) {

                                var dataValue = vm.model.selectedValue[key];

                                /* Socre calculation for SingleSelectListing  and SingleSelectDropDown*/
                                if (typeof (dataValue) == 'string' && !vm.model.selectedValueList.hasOwnProperty(key)) {

                                    var val = JSON.parse(vm.model.selectedValue[key]);
                                    vm.model.totalScore += val.score;

                                    /* Socre calculation for SingleSelectDropDown question type */
                                } else if (typeof (dataValue) == 'string' && vm.model.selectedValueList.hasOwnProperty(key)) {

                                    var val = JSON.parse(vm.model.selectedValueList[key]);
                                    if (val) {
                                        vm.model.totalScore += val.score;
                                    }

                                    /* Socre calculation for MultiSelectListing and YesNoToogle question type */
                                } else if (typeof (dataValue) == 'boolean') {

                                    var val = JSON.parse(vm.model.selectedValueList[key]);
                                    if (val) {
                                        vm.model.totalScore += val.score;
                                    }
                                }
                            }
                        };
                    }
                }

                /* It's handling for Single Select (listing) Option Change.*/
                vm.selectOption = function (answerId, questionId, optionDescription, questionType) {
                    if (vm.selectedOptionModel[questionId]) {
                        var val = JSON.parse(vm.model.selectedValue[questionId]);

                        if (vm.selectedOptionModel[questionId] == answerId) {
                            vm.model.selectedValue[questionId] = null;
                            vm.selectedOptionModel[questionId] = null;
                        } else {
                            vm.selectedOptionModel[questionId] = answerId;
                        }

                    } else {
                        vm.selectedOptionModel[questionId] = answerId;
                    }

                    vm.onChangeOption(questionType);
                }

                /* It's handling for SingleSelectDropDown.*/
                vm.onChangeDropDownSingleSelect = function (selected, question) {
                    var object = null;
                    if (selected == null) {
                        vm.model.selectedValueList[question.id] = null;
                    } else if (selected != null && vm.model.selectedValue[selected.questionId]) {
                        angular.forEach(question.options, function (option) {
                            if (option.id == selected.id) {
                                object = {
                                    id: option.id,
                                    score: option.score,
                                    questionId: option.questionId,
                                    questionType: question.questionType
                                };
                            }
                        });

                        var jsonObject = { id: object.id, score: object.score, questionId: object.questionId, questionType: object.questionType };
                        vm.model.selectedValueList[selected.questionId] = JSON.stringify(jsonObject);
                    }

                    vm.onChangeOption(question.questionType);
                }

                /* It's handling for YesNoToogle Option Change.*/
                vm.onChangeToogle = function (question) {

                    var YesOptionObj = null; var NoOptionObj = null;
                    angular.forEach(question.options, function (option) {
                        if (option.description == 'Yes') { /* This will get Yes option */
                            YesOptionObj = option;
                        } else {                            /* This will get No option */
                            NoOptionObj = option;
                        }
                    });
                    if (vm.model.selectedValue[question.id]) {
                        var jsonObject = { id: YesOptionObj.id, score: YesOptionObj.score, questionId: YesOptionObj.questionId, questionType: question.questionType };
                        vm.model.selectedValueList[question.id] = JSON.stringify(jsonObject);
                    } else {
                        var jsonObject = { id: NoOptionObj.id, score: NoOptionObj.score, questionId: NoOptionObj.questionId, questionType: question.questionType };
                        vm.model.selectedValueList[question.id] = JSON.stringify(jsonObject);
                    }

                    vm.onChangeOption(question.questionType);
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

                //On change Assessment Date
                vm.calculateNextReviewDate = function () {
                    if (vm.model.isNextReviewMonthRequired) {
                        var nextReviewMonth = vm.model.nextReviewMonth;
                        var assessmentDate = moment(vm.model.actualAssessment.assessmentDate);
                        vm.model.actualAssessment.nextReviewDate = assessmentDate.add(nextReviewMonth, 'month');
                    }
                };
            }
        ],

        templateUrl: '~/App/tenant/views/assessment/fallRiskAssessment/fra-detail-view.cshtml'
    });
})();