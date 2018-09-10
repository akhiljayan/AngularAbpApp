(function () {
    appModule.component('fastDetailView', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.commonLookup', '$stateParams', '$state', '$anchorScroll', '$location', 'abp.services.app.user', '$filter', '$rootScope', 'abp.services.app.familyMember', 'abp.services.app.functionalAssessmentStagingTool', 'abp.services.app.assessment', 'stateNavigation',
            function ($scope, $uibModal, $timeout, commonFormFunction, commonLookupService, $stateParams, $state, $anchorScroll, $location, userService, $filter, $rootScope, familyMemberService, functionalAssmtStagingToolService, assessmentService, stateNavigation) {

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

                vm.model.selectedConsecutiveValueList = [];
                vm.model.selectedUnconsecutiveValueList = [];

                vm.model.selectedTextValue = [];                
                vm.selectedOptionModel = [];
                vm.model.confirmationCheck = false;
                vm.assessment = {};
                vm.model.familyMemberCaregiverMaster = [];
                vm.model.userMaster = [];

                

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
                    dynamicOptions: true,
                    step: 0.1
                };

                //Init method
                vm.$onInit = function () {
                    
                    vm.parentForm = $scope.$parent.vm.form;
                    vm.isPreAdmission = ($stateParams.template == 'referral');
                    vm.isPostAdmission = ($stateParams.template == 'person');
                                        
                    vm.init();

                    /* To bind Referral Lookup */
                    if ($stateParams.template == 'referral' && $stateParams.referralId) {
                        commonLookupService.findReferrals().then(function (result) {
                            var options = result.data.items;
                            vm.referrals = options.map(function (option) {
                                return {
                                    id: option.value,
                                    description: option.name
                                }
                            });
                        });
                        vm.onChangeReferral($stateParams.referralId);
                    } else if ($stateParams.template == 'person' && $stateParams.personId) {                        
                        vm.onChangePerson($stateParams.personId);
                    }
                    
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
                    if (!angular.equals(vm.preFASTStage, vm.model.actualAssessment.fastStage) && vm.model.actualAssessment.assessmentId != undefined) {

                        if (vm.categories != undefined && vm.categories.length != 0) {
                            vm.option.barColor = getColorCode(vm.model.actualAssessment.fastStage);
                        } else {
                            assessmentService.getCategories($stateParams.assessment).then(function (result) {
                                vm.categories = result.data;
                                vm.option.barColor = getColorCode(vm.model.actualAssessment.fastStage);
                            });
                        }
                        vm.preFASTStage = vm.model.actualAssessment.fastStage;
                    }            
                };

                vm.onChangePerson = function (personId) {
                    
                    vm.bindFamilyMemberLookup(personId, null);
                    vm.generateChart(personId);
                    if (vm.isNew) {
                        vm.checkExistingPendingConfirmationAssessment(personId, null);
                    }

                }
                vm.onChangeReferral = function (referralId) {
                    
                    vm.bindFamilyMemberLookup(null, referralId);
                    vm.generateChart(referralId);
                    if (vm.isNew) {
                        vm.checkExistingPendingConfirmationAssessment(null, referralId);
                    }
                }


                // Bind Family Member & AssessmentChart when person is changed.
                vm.generateChart = function (Id) {
                    
                    if (!Id)
                        return;  

                    assessmentService.getAssessmentChart({ PersonId: vm.model.actualAssessment.personId, AssessmentDate: vm.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template, ReferralId: vm.model.actualAssessment.referralId }).then(function (result) {
                        
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
                     
                };


                /*
                 * Upon person or referral change, system to display the message if there is any pending confirmation record
                 * System will not block to continue
                 */                 
                vm.checkExistingPendingConfirmationAssessment = function (personId, referralId) {
                    
                    assessmentService.existPendingUnconfirmedRecords({ PersonId: personId, ReferralId: referralId, AssessmentDate: vm.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template }).then(function (result) {
                        if (result.data) {
                            abp.message.info("System found unconfirmed assessment!");
                        }
                    });
                };

                vm.bindFamilyMemberLookup = function (personId, referralId) {
                    
                    familyMemberService.getFamilyMemberLookupById($.extend({ PersonId: personId, ReferralId: referralId }, { maxResultCount: 50 })).then(function (result) {
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
                        vm.model.actualAssessment.familyMemeberCaregiverRelationship = null;

                        vm.disabledNameOfCaregiver = false;
                        vm.disabledRelationship = false;
                    } else {
                        vm.model.actualAssessment.nameOfCaregiver = selected.description;
                        vm.model.actualAssessment.relationshipId = selected.relationshipId;
                        vm.model.actualAssessment.familyMemeberCaregiverRelationship = selected.relationshipDescription;

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
                        functionalAssmtStagingToolService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {
                            
                            vm.model.actualAssessment = result.data;
                            vm.model.actualAssessment.isReplicatedToPerson = (vm.model.actualAssessment.personId != null && vm.model.actualAssessment.state == 1) ? true : false;

                            for (var i = 0; i < vm.model.actualAssessment.answers.length; i++) {
                                var val = vm.model.actualAssessment.answers[i];

                                if (val.question.mutuallyExclusiveQuestionId != null) {
                                    vm.model.selectedValue[val.question.mutuallyExclusiveQuestionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "optionDescription": val.option.description, "questionType": val.question.questionType });

                                } else {
                                    if (val.question.questionType == vm.assessmentQuestionType.SingleSelectListing) {
                                        vm.model.selectedValue[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "description": val.option.description, "sequence": val.option.displayOrder });

                                    } else if (val.question.questionType == vm.assessmentQuestionType.TextBox) {
                                        vm.model.selectedTextValue[val.questionId] = val.answerTextValue;

                                    } else if (val.question.questionType == vm.assessmentQuestionType.MultiSelectListing) {                                        

                                        vm.model.selectedConsecutiveValueList[val.optionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "description": val.option.description, "sequence": val.option.displayOrder });
                                        vm.model.selectedValue[val.optionId] = true;

                                    }
                                }
                            }

                            if (vm.model.actualAssessment.familyMemberCaregiverId != null) {
                                vm.disabledNameOfCaregiver = true;
                                vm.disabledRelationship = true;
                            }

                            vm.model.isConfirmed = vm.model.actualAssessment.isConfirmed;
                            vm.model.isCancelled = vm.model.actualAssessment.isCancelled;
                            vm.model.disabled = vm.model.actualAssessment.isConfirmed || vm.model.actualAssessment.isCancelled || vm.model.actualAssessment.isReplicatedToPerson;                        
                            vm.model.totalScore = vm.model.actualAssessment.totalScore;

                            if ($stateParams.template == 'person') {
                                vm.onChangePerson(vm.model.actualAssessment.personId);
                            } else {
                                vm.onChangeReferral(vm.model.actualAssessment.referralId);
                            }
                        });
                    } else {
                        vm.isNew = 1;
                        vm.mode = 'new';
                        vm.actualAssessmentId = app.consts.EmptyGuid;
                        functionalAssmtStagingToolService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {
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

                            vm.model.actualAssessment.referralId = null;
                            if ($stateParams.referralId) {
                                vm.model.actualAssessment.referralId = $stateParams.referralId;
                            }
                            if ($stateParams.template == 'referral') {
                                vm.model.actualAssessment.state = 1;
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
                        getEmptyAssessmentObject();
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
                        functionalAssmtStagingToolService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        functionalAssmtStagingToolService.createPersonAssessment(vm.model.actualAssessment).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            } else {
                                if (typeof $stateParams.personId != 'undefined') {
                                    $state.go('tenant.fastDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                } else {
                                    $state.go('tenant.fastDetail', { assessment: $stateParams.assessment, id: result.data.id });
                                }

                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }

                vm.close = function () {
                    if (typeof $stateParams.personId != 'undefined' && $stateParams.template == 'person') {
                        stateNavigation.closeToPerson(app.consts.personTabs.tabs.profile, $stateParams.personId);
                    } else if ($stateParams.close == 'Careboard') {
                        $state.go('tenant.dashboard.careboard');
                    } else if (typeof $stateParams.referralId != 'undefined' && $stateParams.template == 'referral') {
                        stateNavigation.closeToReferral(app.consts.referralTabs.tabs.medical, $stateParams.referralId);
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
                                    functionalAssmtStagingToolService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                                        functionalAssmtStagingToolService.confirm(vm.actualAssessmentId).then(function (result) {
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
                    } else if ($stateParams.template == 'referral') {
                        assessmentService.existPendingUnconfirmedRecords(
                            { PersonId: null, ReferralId: vm.model.actualAssessment.referralId, AssessmentDate: vm.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template }
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
                                functionalAssmtStagingToolService.clone(vm.model.actualAssessment.id).then(function (result) {
                                    if (typeof $stateParams.personId != 'undefined' || typeof $stateParams.referralId != 'undefined') {
                                        $state.go('tenant.fastDetailPersonMode', { template: $stateParams.template, description: $stateParams.description, assessment: $stateParams.assessment, id: result.data.id, referralId: $stateParams.referralId, personId: $stateParams.personId });
                                    } else {
                                        $state.go('tenant.fastDetail', { template: $stateParams.template, description: $stateParams.description, assessment: $stateParams.assessment, id: result.data.id });
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
                                functionalAssmtStagingToolService.deletePersonAssessment(
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
                                vm.model.checkValue[key] = false;
                            }
                            /* Socre calculation for MultiSelect Checkbox Question Type. */
                            else if (typeof (dataValue) == 'boolean') {
                                var val = JSON.parse(vm.model.selectedConsecutiveValueList[key]);
                                if (val) {
                                    var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                    vm.model.actualAssessment.answers.push(answer);
                                    vm.model.checkValue[key] = false;
                                }
                            }
                        }
                    };

                    for (var key in vm.model.selectedTextValue) {
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


                // To calculate score [FAST Disability Score]
                vm.onChangeOption = function (consecutive, missingindex, sortedList) {
                    
                    vm.model.totalScore = 0;                    
                    var fast_Stage, fast_DisabilityScore;
                    if (consecutive) {
                        // Get the biggest array obj stage as "FAST Stage" and socre as "FAST Disability Score".                     

                        fast_Stage = sortedList[sortedList.length - 1].description;
                        fast_DisabilityScore = sortedList[sortedList.length - 1].score;

                        vm.model.actualAssessment.fastDisabilityScore = Math.round(10 * fast_DisabilityScore) / 10;                        
                        vm.model.actualAssessment.fastStage = parseInt(fast_Stage);

                        vm.model.totalScore = fast_DisabilityScore;                        
                        
                    } else {
                        // Get the smallest array obj before missingindex stage as "FAST Stage".

                        fast_Stage = sortedList[missingindex - 1].description;                                                
                        fast_DisabilityScore = sortedList[missingindex - 1].score;

                        for (var i = missingindex; i <= sortedList.length - 1; i++) {
                            var optionId = sortedList[i].id;
                            var jsonObj = JSON.parse(vm.model.selectedUnconsecutiveValueList[optionId]);
                            if (jsonObj) {
                                fast_DisabilityScore += jsonObj.score;
                            }
                        }

                        vm.model.actualAssessment.fastDisabilityScore = Math.round(10 * fast_DisabilityScore) / 10;
                        vm.model.actualAssessment.fastStage = parseInt(fast_Stage);

                        vm.model.totalScore = fast_DisabilityScore;
                    }
                };

                /* It's handling for MultiSelectListing (checkbox) Option Check.*/
                vm.onCheckOption = function (option, questionType) {

                    if (vm.model.selectedValue[option.id] == true) {
                        var jsonObject = { id: option.id, score: option.score, questionId: option.questionId, description: option.description, sequence: option.displayOrder };
                        vm.model.selectedConsecutiveValueList[option.id] = JSON.stringify(jsonObject);
                    } else {
                        vm.model.selectedConsecutiveValueList[option.id] = null;
                    }

                    // To setup array object list from key,value pair array list for sorting.
                    $scope.checkedList = [];
                    for (var key in vm.model.selectedConsecutiveValueList) {
                        var val = JSON.parse(vm.model.selectedConsecutiveValueList[key]);
                        if (val) {
                            $scope.checkedList.push(val);
                        }                        
                    }

                    // To sort out the array object based on the sequence (Stage).
                    $scope.sortedList = $filter('orderBy')($scope.checkedList, 'sequence', false);

                    // To find consecutive or non consecutive stage from sorted list.
                    var missing, missingindex, current, previous, consecutive;                    
                    for (var i = 1; i <= $scope.sortedList.length - 1; i++) {

                        var currentObj = $scope.sortedList[i];
                        current = currentObj.sequence - 1;
                        var previousObj = $scope.sortedList[i - 1];
                        previous = previousObj.sequence;

                        if (current != previous) {
                            missing = true;
                            break;
                        } else {
                            missing = false;
                            continue;
                        }                        
                    }

                    // To set consecutive or non consecutive
                    if (missing == true) {
                        missingindex = i;
                        consecutive = false;
                    }
                    else {
                        consecutive = true;
                    }
                    vm.onChangeOption(consecutive, missingindex, $scope.sortedList);
                }

                vm.bindToJson = function (idVal, scoreVal, questionIdVal, descriptionVal, mutualId, questionTypeVal, displayOrder) {
                    
                    if (mutualId == null) {
                        vm.model.checkValue[questionIdVal] = false;
                    } else {
                        vm.model.checkValue[mutualId] = false;
                    }

                    var jsonObject = { id: idVal, score: scoreVal, questionId: questionIdVal, optionDescription: descriptionVal, questionType: questionTypeVal, sequence: displayOrder };

                    if (questionTypeVal == vm.assessmentQuestionType.MultiSelectListing) {
                        var JsonObjectTemp = { id: idVal, score: scoreVal, questionId: questionIdVal, optionDescription: descriptionVal, questionType: questionTypeVal, sequence: displayOrder };
                        if (JsonObjectTemp.optionDescription == '1' || JsonObjectTemp.optionDescription == '2' || JsonObjectTemp.optionDescription == '3' || JsonObjectTemp.optionDescription == '4' || JsonObjectTemp.optionDescription == '5') {
                            JsonObjectTemp.score = 1;
                            vm.model.selectedUnconsecutiveValueList[idVal] = JSON.stringify(JsonObjectTemp);
                        } else {
                            JsonObjectTemp.score = 0.2;
                            vm.model.selectedUnconsecutiveValueList[idVal] = JSON.stringify(JsonObjectTemp);
                        }
                    }

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

                // GetCategories
                function getCategories() {
                    if ($stateParams.assessment != null) {
                        assessmentService.getCategories($stateParams.assessment).then(function (result) {
                            vm.categories = result.data;
                        });
                    }
                };

                //Comparer Function  
                function GetSortOrder(prop) {
                    return function (a, b) {
                        if (a[prop] > b[prop]) {
                            return 1;
                        } else if (a[prop] < b[prop]) {
                            return -1;
                        }
                        return 0;
                    }
                }
            }
        ],

        templateUrl: '~/App/tenant/views/assessment/functionalAssessmentStagingTool/fast-detail-view.cshtml'
    });
})();