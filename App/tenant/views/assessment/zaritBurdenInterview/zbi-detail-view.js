(function () {
    appModule.component('zbiDetailView', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.commonLookup', '$stateParams', '$state', '$anchorScroll', '$location', 'abp.services.app.user', '$filter', '$rootScope', 'abp.services.app.zaritBurdenInterview', 'abp.services.app.familyMember', 'abp.services.app.assessment', 'stateNavigation',
            function ($scope, $uibModal, $timeout, commonFormFunction, commonLookupService, $stateParams, $state, $anchorScroll, $location, userService, $filter, $rootScope, zaritBurdenInterviewService, familyMemberService, assessmentService, stateNavigation) {            
                
                var vm = this;
                $anchorScroll.yOffset = 100;
                vm.personHeaderisPinned = true;
                vm.appPath = abp.appPath;
                vm.isCreateMode = !$stateParams.id;
                vm.mode = 'new';
                vm.isNew = 0;
                vm.model = { totalscore: 0, actualAssessment: {}, option: {}, nextReviewMonth: 0, isNextReviewMonthRequired: false, isCategoryRequired: false, isScoreCalculationRequired: false };
                vm.model.selectedValue = [];
                vm.model.selectedTextValue = [];
                vm.model.selectedDateTimeValue = [];
                vm.model.selectedValueList = [];
                vm.model.checkValue = [];
                vm.model.selectedOtherPleaseSpecifyValue = [];
                vm.model.confirmationCheck = false;

                vm.model.selectedDropDownOption = [];
                vm.assessmentQuestionType = app.consts.assessmentQuestionType;   


                vm.model.familyMemberCaregiverMaster = [];
                vm.model.userMaster = [];


                vm.$onInit = function () {
                    vm.init();
                };

                // Bind Family Member when person is changed in Child Component [assessment-general-view].
                vm.$doCheck = function () {
                    if (vm.model.actualAssessment.personId != undefined && !angular.equals(vm.model.previousPersonId, vm.model.actualAssessment.personId)) {
                        vm.bindFamilyMemberLookup(vm.model.actualAssessment.personId);

                        vm.model.previousPersonId = angular.copy(vm.model.actualAssessment.personId);                                    
                    }
                };

                vm.bindFamilyMemberLookup = function (personId) {

                    familyMemberService.getFamilyMemberLookupById($.extend({ personId: personId }, { maxResultCount: 50 })).then(function (result) {
                        var options = result.data.items;
                        vm.model.familyMemberCaregiverMaster = options.map(function (option) {
                            return {
                                id: option.id,
                                description: option.fullName,
                                relationshipId: option.relationshipId,
                                relationshipDescription: option.relationshipDescription
                            }
                        });
                    });
                }

                // Get Family Member Relationship
                vm.OnChangeFamilyMember = function (selected) {
                    if (selected == null) {
                        vm.model.actualAssessment.nameOfCaregiver = null;
                        vm.model.actualAssessment.relationshipId = null;

                        vm.disabledNameOfCaregiver = false;
                        vm.disabledRelationship = false;
                    } else {
                        vm.model.actualAssessment.nameOfCaregiver = selected.description;
                        vm.model.actualAssessment.relationshipId = selected.relationshipId;

                        vm.disabledNameOfCaregiver = true;
                        vm.disabledRelationship = true;
                    }                    
                }
                // Bind NameOfAssessor                
                vm.bindUserMaster = function () {
                    userService.getUsers({
                    }).then(function (result) {
                        var options = result.data.items;
                        vm.model.userMaster = options.map(function (option) {
                            return {
                                id: option.id,
                                description: option.name
                            }
                        });
                    });
                };
                                
                // Load
                vm.load = function () {
                    
                    vm.loading = true;

                    if ($stateParams.id) {
                        vm.actualAssessmentId = $stateParams.id;
                        vm.mode = 'view';
                        zaritBurdenInterviewService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {

                            vm.model.actualAssessment = result.data;
                            for (var i = 0; i < vm.model.actualAssessment.answers.length; i++) {
                                var val = vm.model.actualAssessment.answers[i];
                                if (val.question.mutuallyExclusiveQuestionId != null) {
                                    vm.model.selectedValue[val.question.mutuallyExclusiveQuestionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                } else {
                                    if (val.question.questionType == vm.assessmentQuestionType.SingleSelectListing || val.question.questionType == vm.assessmentQuestionType.SingleSelectDropDown) {

                                        vm.model.selectedValue[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                        /* SingleSelectListing with OpenOption -> Others,Please Specify field value handling.*/
                                        if (val.question.openOption && val.option.description == 'Others') {

                                            vm.model.selectedTextValue[val.questionId] = val.answerTextValue;
                                            vm.model.selectedOtherPleaseSpecifyValue[val.questionId] = true;
                                        }


                                    } else if (val.question.questionType == vm.assessmentQuestionType.TextBox) {

                                        vm.model.selectedTextValue[val.questionId] = val.answerTextValue;

                                    } else if (val.question.questionType == vm.assessmentQuestionType.DateTime) {

                                        vm.model.selectedDateTimeValue[val.questionId] = val.answerDateTimeValue;

                                    } else if (val.question.questionType == vm.assessmentQuestionType.MultiSelectListing) {


                                        vm.model.selectedValueList[val.optionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "questionType": val.question.questionType });
                                        vm.model.selectedValue[val.optionId] = true;

                                    } else if (val.question.questionType == vm.assessmentQuestionType.YesNoToogle && val.question.options.length == 2) {


                                        vm.model.selectedValueList[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "questionType": val.question.questionType });
                                        vm.model.selectedValue[val.questionId] = val.option.description == 'Yes' ? true : false;

                                        /* Data binding for MultiSelectDropDown Control */
                                    } else if (val.question.questionType == vm.assessmentQuestionType.MultiSelectDropDown) {
                                        if (!vm.model.selectedValue[val.questionId]) {
                                            var multiSelectDropDownOptions = vm.model.actualAssessment.answers.filter(function (item) {
                                                return item.questionId == val.option.questionId;
                                            });

                                            vm.multiSelectDropDownList = [];
                                            angular.forEach(multiSelectDropDownOptions, function (val) {
                                                var jsonObject = { id: val.optionId, score: val.option.score, questionId: val.option.questionId, optionDescription: val.option.description, questionType: val.question.questionType };
                                                vm.multiSelectDropDownList.add(jsonObject);
                                            });

                                            vm.model.selectedValue[val.questionId] = vm.multiSelectDropDownList;
                                        }

                                    }
                                }
                            }

                            if (vm.model.actualAssessment.familyMemberCaregiverId != null) {
                                vm.disabledNameOfCaregiver = true;
                                vm.disabledRelationship = true;
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
                        zaritBurdenInterviewService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {                            
                            vm.model.actualAssessment = result.data;

                            vm.model.actualAssessment.nameOfAssessorId = abp.session.userId;
                            vm.model.actualAssessment.relationshipId = null;
                            
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
                        
                        vm.bindUserMaster();
                        vm.load();
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
                        zaritBurdenInterviewService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        zaritBurdenInterviewService.createPersonAssessment(vm.model.actualAssessment).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            } else {
                                if (typeof $stateParams.personId != 'undefined') {
                                    $state.go('tenant.zbiDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                } else {
                                    $state.go('tenant.zbiDetail', { assessment: $stateParams.assessment, id: result.data.id });
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
                                    zaritBurdenInterviewService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                                        zaritBurdenInterviewService.confirm(vm.actualAssessmentId).then(function (result) {
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
                                zaritBurdenInterviewService.clone(vm.model.actualAssessment.id).then(function (result) {
                                    if (typeof $stateParams.personId != 'undefined') {
                                        $state.go('tenant.zbiDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                    } else {
                                        $state.go('tenant.zbiDetail', { assessment: $stateParams.assessment, id: result.data.id });
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
                                zaritBurdenInterviewService.deletePersonAssessment(
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
                    for (var key in vm.model.selectedValue) {
                        if (vm.model.selectedValue.hasOwnProperty(key)) {
                            vm.model.checkValue[key] = false;

                            var dataValue = vm.model.selectedValue[key];


                            /* Converting answer for SingleSelectListing  and SingleSelectDropDown*/
                            if (typeof (dataValue) == 'string') {
                                var val = JSON.parse(vm.model.selectedValue[key]);

                                var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };

                                /* To get Others, Please Specify value when the question is OpenOption*/
                                if (val.optionDescription == 'Others') {
                                    var otherPleaseSpecifyVal = vm.model.selectedTextValue[val.questionId];
                                    answer.answerTextValue = otherPleaseSpecifyVal;
                                }


                                vm.model.actualAssessment.answers.push(answer);

                                /* Converting answer for MultiSelectListing and YesNoToogle question type */
                            } else if (typeof (dataValue) == 'boolean') {
                                var val = JSON.parse(vm.model.selectedValueList[key]);
                                if (val) {
                                    var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                    vm.model.actualAssessment.answers.push(answer);
                                }

                                /* Converting answer for MultiSelectDropDown */
                            } else if (typeof (dataValue) == 'object') {
                                angular.forEach(dataValue, function (val) {
                                    var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                    vm.model.actualAssessment.answers.push(answer);
                                });

                            }
                        }
                    };

                    /* Converting answer for TextBox Question Type.*/
                    for (var key in vm.model.selectedTextValue) {
                        /*
                         * To exclude Others,Please Specify field value for no duplicate answer.
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

                    /* Converting answer for DateTime Question Type.*/
                    for (var key in vm.model.selectedDateTimeValue) {
                        if (vm.model.selectedDateTimeValue.hasOwnProperty(key)) {
                            vm.model.checkValue[key] = false;
                            var val = vm.model.selectedDateTimeValue[key];
                            if (val) {
                                var answer = { questionId: key, optionId: null, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: val };
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
            }
        ],

        templateUrl: '~/App/tenant/views/assessment/zaritBurdenInterview/zbi-detail-view.cshtml'
    });
})();