(function () {
    appModule.controller('tenant.views.assessment.assessmentDetailView', [
        '$scope', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.commonLookup', '$stateParams', '$state', 'abp.services.app.assessment', '$anchorScroll', '$location', 'abp.services.app.user', '$filter', '$rootScope', 'stateNavigation',
        function ($scope, $uibModal, $timeout, commonFormFunction, commonLookupService, $stateParams, $state, assessmentService, $anchorScroll, $location, userService, $filter, $rootScope, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 100;
            vm.personHeaderisPinned = true;
            vm.appPath = abp.appPath;
            vm.isCreateMode = !$stateParams.id;
            vm.mode = 'new';
            vm.isNew = 0;

            vm.assessment = {};
            vm.model = { totalscore: 0, actualAssessment: {},  option: {}, nextReviewMonth: 0, isNextReviewMonthRequired: false, isCategoryRequired: false, isScoreCalculationRequired: false };
            vm.model.selectedValue = [];
            vm.model.selectedTextValue = [];
            vm.model.selectedDateTimeValue = [];
            vm.model.selectedValueList = [];
            vm.model.checkValue = [];
            vm.model.selectedOtherPleaseSpecifyValue = [];
            vm.model.confirmationCheck = false;
            vm.model.assessmentId = $scope.EmptyGuid;           

            vm.model.selectedDropDownOption = [];
            vm.assessmentQuestionType = app.consts.assessmentQuestionType;                  
                   
            
            //Load page and data
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

                                } else if (val.question.questionType == vm.assessmentQuestionType.SingleSelectDropDown) {

                                    vm.model.selectedValueList[val.questionId] = JSON.stringify({ "id": val.optionId, "score": val.option.score, "questionId": val.option.questionId, "questionType": val.question.questionType });
                                    vm.model.selectedValue[val.questionId] = val.optionId;
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

                        vm.model.isConfirmed = vm.model.actualAssessment.isConfirmed;
                        vm.model.isCancelled = vm.model.actualAssessment.isCancelled;
                        vm.model.disabled = vm.model.actualAssessment.isConfirmed || vm.model.actualAssessment.isCancelled || vm.model.actualAssessment.isReplicatedToPerson;
                        vm.model.totalScore = vm.model.actualAssessment.totalScore;
                    });
                } else {
                    vm.isNew = 1;
                    vm.mode = 'new';
                    vm.actualAssessmentId = $scope.EmptyGuid;
                    assessmentService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {      
                        
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

                /* 
                 * routing navigation label function is calling only one time and 
                 * cannot bind assessment dynamically in label function
                 * Solution: overwrite label.default in init to be able to show assessment label dynamic as change
                 * */
                if ($state.current.ncyBreadcrumb.label.default != undefined) {
                    $state.current.ncyBreadcrumb.label.default = $state.params.description;
                }

                if ($stateParams.assessment) {
                    vm.permissions = {
                        edit: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Edit'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Cancel'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Delete'),
                        copyExisting: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.CopyExisting')
                    };                    
                    vm.load();
                }
            };            

            vm.init();


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
                            if (typeof $stateParams.personId != 'undefined' || typeof $stateParams.referralId != 'undefined') {
                                $state.go('tenant.assessmentDetailPersonMode', { template: $stateParams.template, description: $stateParams.description, assessment: $stateParams.assessment, id: result.data.id, referralId: $stateParams.referralId, personId: $stateParams.personId });
                            } else {
                                $state.go('tenant.assessmentDetail', { template: $stateParams.template, description: $stateParams.description, assessment: $stateParams.assessment, id: result.data.id });
                            }

                        }
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

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
                            assessmentService.clone(vm.model.actualAssessment.id).then(function (result) {
                                if (typeof $stateParams.personId != 'undefined' || typeof $stateParams.referralId != 'undefined') {
                                    $state.go('tenant.assessmentDetailPersonMode', { template: $stateParams.template, description: $stateParams.description, assessment: $stateParams.assessment, id: result.data.id, referralId: $stateParams.referralId, personId: $stateParams.personId });
                                } else {
                                    $state.go('tenant.assessmentDetail', { template: $stateParams.template, description: $stateParams.description, assessment: $stateParams.assessment, id: result.data.id });
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

            function convertAnswer(isConfirm) {
                
                if (isConfirm) {
                    for (var item in vm.model.checkValue) {
                        if (vm.model.checkValue.hasOwnProperty(item)) {
                            vm.model.checkValue[item] = true;
                        }
                    }
                }

                /* Mobiliy Status assessment is custom category and not based on the totalScore. */
                if ($stateParams.assessment == 'ms') {
                    for (var key in vm.model.selectedValue) {
                        if (vm.model.selectedValue.hasOwnProperty(key)) {
                            var val = JSON.parse(vm.model.selectedValue[key]);
                            vm.model.actualAssessment.assessmentCategory = val.optionDescription;
                        }
                    }
                }

                vm.model.actualAssessment.answers = [];
                for (var key in vm.model.selectedValue) {
                    if (vm.model.selectedValue.hasOwnProperty(key)) {
                        vm.model.checkValue[key] = false;

                        var dataValue = vm.model.selectedValue[key];


                        /* Converting answer for SingleSelectListing  and SingleSelectDropDown*/
                        if (typeof (dataValue) == 'string' && !vm.model.selectedValueList.hasOwnProperty(key)) {

                            var val = JSON.parse(vm.model.selectedValue[key]);
                            var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };

                            /* To get Others, Please Specify value when the question is OpenOption*/
                            if (val.optionDescription == 'Others') {
                                var otherPleaseSpecifyVal = vm.model.selectedTextValue[val.questionId];
                                answer.answerTextValue = otherPleaseSpecifyVal;
                            }
                            vm.model.actualAssessment.answers.push(answer);                            
                        }
                        /* Socre calculation for SingleSelectDropDown question type */
                        else if (typeof (dataValue) == 'string' && vm.model.selectedValueList.hasOwnProperty(key)) {

                            var val = JSON.parse(vm.model.selectedValueList[key]);
                            if (val) {
                                var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                vm.model.actualAssessment.answers.push(answer);
                            }

                            
                        }
                        /* Socre calculation for YesNoToogle question type */
                        else if (typeof (dataValue) == 'boolean') {
                            var val = JSON.parse(vm.model.selectedValueList[key]);
                            if (val) {
                                var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                                vm.model.actualAssessment.answers.push(answer);
                            }

                            
                        }
                        /* Converting answer for MultiSelectDropDown */
                        //else if (typeof (dataValue) == 'object') {
                        //    angular.forEach(dataValue, function (val) {
                        //        var answer = { questionId: val.questionId, optionId: val.id, actualAssessmentId: vm.actualAssessmentId, answerTextValue: null, answerDateTimeValue: null };
                        //        vm.model.actualAssessment.answers.push(answer);
                        //    });
                        //}
                    }
                };

                /* Converting answer for TextBox Question Type.*/
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
            }

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
    ]);
})();