(function (_) {
    appModule.component('assessmentQuestionView', {
        bindings: {
            mode: '<',
            model: '=',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$stateParams', 'abp.services.app.assessment',
            function ($stateParams, assessmentService) {

                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.isCreateMode = !$stateParams.id;
                ctrl.isNew = 0;
                ctrl.assessment = {};
                ctrl.selectedOptionModel = [];

                ctrl.assessmentQuestionType = app.consts.assessmentQuestionType;
                //Load page and data
                ctrl.load = function () {
                    ctrl.loading = true;
                    getEmptyAssessmentObject();
                };

                //Init method
                ctrl.$onInit = function () {
                    ctrl.load();
                };

                function getEmptyAssessmentObject() {
                    assessmentService.getByName($stateParams.assessment).then(function (result) {
                        ctrl.assessment = result.data;
                        ctrl.model.nextReviewMonth = ctrl.assessment.nextReviewMonth;
                        ctrl.model.isNextReviewMonthRequired = ctrl.assessment.isNextReviewMonthRequired;
                        ctrl.model.isCategoryRequired = ctrl.assessment.isCategoryRequired;
                        ctrl.model.isScoreCalculationRequired = ctrl.assessment.isScoreCalculationRequired;

                        ctrl.model.actualAssessment.assessmentId = ctrl.assessment.id;
                        
                        //if (ctrl.mode == "new") {
                        //    ctrl.model.actualAssessment.assessmentId = ctrl.assessment.id;
                        //};

                        /* Pre-setup for question type YesNoToogle to make it default value to "No" */
                        angular.forEach(ctrl.assessment.assessmentSections, function (section) {

                            for (var index = 0; index < section.questions.length; index++) {
                                var question = section.questions[index];
                                if (question.questionType == ctrl.assessmentQuestionType.YesNoToogle && question.options.length == 2) {
                                    if (ctrl.model.selectedValue[question.id]) {
                                        ctrl.model.selectedValue[question.id] = true;
                                    } else {
                                        ctrl.model.selectedValue[question.id] = false;
                                        angular.forEach(question.options, function (option) {
                                            if (option.description == 'No') {
                                                var jsonObject = { id: option.id, score: option.score, questionId: option.questionId };
                                                ctrl.model.selectedValueList[option.questionId] = JSON.stringify(jsonObject);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });
                    ctrl.loading = false;
                };

                ctrl.onChangeOption = function (questionType) {
                    ctrl.model.totalScore = 0;
                    if (ctrl.model.isScoreCalculationRequired) {
                        for (var key in ctrl.model.selectedValue) {
                            if (ctrl.model.selectedValue.hasOwnProperty(key)) {

                                var dataValue = ctrl.model.selectedValue[key];

                                /* Socre calculation for SingleSelectListing  and SingleSelectDropDown*/
                                if (typeof (dataValue) == 'string' && !ctrl.model.selectedValueList.hasOwnProperty(key)) {

                                    var val = JSON.parse(ctrl.model.selectedValue[key]);
                                    ctrl.model.totalScore += val.score;

                                    /* Socre calculation for SingleSelectDropDown question type */
                                } else if (typeof (dataValue) == 'string' && ctrl.model.selectedValueList.hasOwnProperty(key)) {

                                    var val = JSON.parse(ctrl.model.selectedValueList[key]);
                                    if (val) {
                                        ctrl.model.totalScore += val.score;
                                    }

                                    /* Socre calculation for MultiSelectListing and YesNoToogle question type */
                                } else if (typeof (dataValue) == 'boolean') {

                                    var val = JSON.parse(ctrl.model.selectedValueList[key]);
                                    if (val) {
                                        ctrl.model.totalScore += val.score;
                                    }
                                }
                            }
                        };
                    }
                }

                /* It's handling for Single Select (listing) Option Change.*/
                ctrl.selectOption = function (answerId, questionId, optionDescription, questionType) {
                    
                    if (ctrl.selectedOptionModel[questionId]) {
                        var val = JSON.parse(ctrl.model.selectedValue[questionId]);

                        if (ctrl.selectedOptionModel[questionId] == answerId) {
                            ctrl.model.selectedValue[questionId] = null;
                            ctrl.selectedOptionModel[questionId] = null;
                        } else {
                            ctrl.selectedOptionModel[questionId] = answerId;
                        }

                    } else {
                        ctrl.selectedOptionModel[questionId] = answerId;
                    }

                    /* To show/hide Others,Please Specify field.*/
                    if (optionDescription == 'Others') {
                        ctrl.model.selectedOtherPleaseSpecifyValue[questionId] = true;
                    } else {
                        ctrl.model.selectedOtherPleaseSpecifyValue[questionId] = false;
                        ctrl.model.selectedTextValue[questionId] = null;
                    }

                    ctrl.onChangeOption(questionType);
                }

                /* It's handling for SingleSelectDropDown.*/
                ctrl.onChangeDropDownSingleSelect = function (selected, question) {
                    
                    var object = null;
                    if (selected == null) {
                        ctrl.model.selectedValueList[question.id] = null;
                    } else if (selected != null && ctrl.model.selectedValue[selected.questionId]) {
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
                        ctrl.model.selectedValueList[selected.questionId] = JSON.stringify(jsonObject);
                    }

                    ctrl.onChangeOption(question.questionType);
                }

                /* It's handling for MultiSelectListing (checkbox) Option Check.*/
                ctrl.onCheckOption = function (option, questionType) {
                    
                    if (ctrl.model.selectedValue[option.id] == true) {
                        var jsonObject = { id: option.id, score: option.score, questionId: option.questionId };
                        ctrl.model.selectedValueList[option.id] = JSON.stringify(jsonObject);
                    } else {
                        ctrl.model.selectedValueList[option.id] = null;
                    }

                    ctrl.onChangeOption(questionType);
                }


                /* It's handling for YesNoToogle Option Change.*/
                ctrl.onChangeToogle = function (question) {

                    var YesOptionObj = null; var NoOptionObj = null;
                    angular.forEach(question.options, function (option) {
                        if (option.description == 'Yes') { /* This will get Yes option */
                            YesOptionObj = option;
                        } else {                            /* This will get No option */
                            NoOptionObj = option;
                        }
                    });
                    if (ctrl.model.selectedValue[question.id]) {
                        var jsonObject = { id: YesOptionObj.id, score: YesOptionObj.score, questionId: YesOptionObj.questionId };
                        ctrl.model.selectedValueList[question.id] = JSON.stringify(jsonObject);
                    } else {
                        var jsonObject = { id: NoOptionObj.id, score: NoOptionObj.score, questionId: NoOptionObj.questionId };
                        ctrl.model.selectedValueList[question.id] = JSON.stringify(jsonObject);
                    }

                    ctrl.onChangeOption(question.questionType);
                }

                ctrl.OnChangeMultiSelectDropDown = function () {
                    ctrl.onChangeOption(ctrl.assessmentQuestionType.MultiSelectDropDown);

                };


                ctrl.bindToJson = function (idVal, scoreVal, questionIdVal, descriptionVal, mutualId, questionTypeVal) {
                    if (mutualId == null) {
                        ctrl.model.checkValue[questionIdVal] = false;
                    } else {
                        ctrl.model.checkValue[mutualId] = false;
                    }

                    var jsonObject = { id: idVal, score: scoreVal, questionId: questionIdVal, optionDescription: descriptionVal, questionType: questionTypeVal };
                    return jsonObject;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/assessment/assessment-question-view.cshtml'
    });
})(_);