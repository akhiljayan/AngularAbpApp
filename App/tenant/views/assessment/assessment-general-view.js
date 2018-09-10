(function (_) {
    appModule.component('assessmentGeneralView', {
        bindings: {
            mode: '<',
            model: '=',
            permissions: '<',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.assessment',
            function ($scope, $stateParams, commonLookupService, assessmentService) {

                var ctrl = this;
                ctrl.personDisabled = false;
                ctrl.categoryColorCodes = app.consts.assessmentCategoryColorCodes;                
                ctrl.option = {
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
                ctrl.$onInit = function () {
                    
                    ctrl.parentForm = $scope.$parent.vm.form;

                    ctrl.$stateParams = $stateParams;
                    ctrl.isPreAdmission = ($stateParams.template == 'referral');
                    ctrl.isPostAdmission = ($stateParams.template == 'person');

                    /* To bind Referral Lookup */
                    if ($stateParams.template == 'referral') {                        
                        commonLookupService.findReferrals().then(function (result) {
                            var options = result.data.items;                            
                            ctrl.referrals = options.map(function (option) {                                
                                return {
                                    id: option.value,
                                    description: option.name
                                }
                            });
                        });
                        ctrl.onChangeReferral($stateParams.referralId);
                    } else if ($stateParams.template == 'person' && $stateParams.personId) {
                        ctrl.onChangePerson($stateParams.personId);
                    }

                    //to refactor person lookup show/hide
                    if (ctrl.model.actualAssessment.personId != app.consts.EmptyGuid && ctrl.model.actualAssessment.personId != undefined) {
                        ctrl.personDisabled = true;
                    } else {
                        ctrl.model.actualAssessment.personId = undefined;
                    }
                    if ($stateParams.personId && $stateParams.personId != undefined && $stateParams.personId != app.consts.EmptyGuid) {
                        ctrl.personDisabled = true;
                    }
                    if ($stateParams.id && $stateParams.id != undefined && $stateParams.id != app.consts.EmptyGuid) {
                        ctrl.personDisabled = true;
                    }
                };

                
                ctrl.$doCheck = function () {
                    
                    if (!angular.equals(ctrl.preAssessmentName, ctrl.model.actualAssessment.assessmentName) && ctrl.model.actualAssessment.assessmentName != undefined) {
                        assessmentService.getCategories(ctrl.model.actualAssessment.assessmentName).then(function (result) {
                            ctrl.categories = result.data;
                            ctrl.generateChart(ctrl.model.actualAssessment.personId);
                        });

                        ctrl.preAssessmentName = angular.copy(ctrl.model.actualAssessment.assessmentName);
                    }

                    if (!angular.equals(ctrl.preTotalScore, ctrl.model.totalScore) && $stateParams.assessment != undefined) {                        
                        if (ctrl.categories != undefined && ctrl.categories.length != 0 ) {
                            ctrl.option.barColor = getColorCode(ctrl.model.totalScore);
                            ctrl.model.category = ctrl.getCategoryDescription(ctrl.model.totalScore);
                        } else {
                            assessmentService.getCategories($stateParams.assessment).then(function (result) {
                                ctrl.categories = result.data;
                                ctrl.option.barColor = getColorCode(ctrl.model.totalScore);
                                ctrl.model.category = ctrl.getCategoryDescription(ctrl.model.totalScore);
                            });
                        }
                        ctrl.preTotalScore = ctrl.model.totalScore;

                    }

                    if (ctrl.model.isNextReviewMonthRequired) {                        
                        if (!angular.equals(ctrl.nextReviewMonth, ctrl.model.nextReviewMonth)) {                            
                            if (ctrl.model.actualAssessment.nextReviewDate == null && !$stateParams.id) {
                                ctrl.nextReviewMonth = ctrl.model.nextReviewMonth;
                                var assessmentDate = moment(ctrl.model.actualAssessment.assessmentDate);
                                ctrl.model.actualAssessment.nextReviewDate = assessmentDate.add(ctrl.nextReviewMonth, 'month');
                            }
                        }
                    }

                };

                ctrl.onChangePerson = function (personId) {
                    
                    ctrl.generateChart(personId);
                    if (ctrl.mode == 'new') {
                        ctrl.checkExistingPendingConfirmationAssessment(personId, null);
                    }

                }
                ctrl.onChangeReferral = function (referralId) {

                    ctrl.generateChart(referralId);
                    if (ctrl.mode == 'new') {
                        ctrl.checkExistingPendingConfirmationAssessment(null, referralId);
                    }
                }

                ctrl.generateChart = function (Id) {
                    
                    if (!Id)
                        return;

                    assessmentService.getAssessmentChart({ PersonId: ctrl.model.actualAssessment.personId, AssessmentDate: ctrl.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template, ReferralId: ctrl.model.actualAssessment.referralId }).then(function (result) { 
                        /* IF there is no previous confirmed assessment, the chart won't show. */
                        ctrl.assessmentChartData = result.data.assessmentDateList;
                        if (ctrl.assessmentChartData.length == 0)
                            return;


                        var colorlist = [];
                        for (var key in result.data.colorCode) {
                            if (result.data.colorCode.hasOwnProperty(key)) {
                                var colorcode = result.data.colorCode[key];
                                colorlist.push(app.consts.assessmentCategoryColorCodes.values[colorcode].rgbValue);
                            };
                        };
                        ctrl.assessmentConfig = {
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
                }


                /*
                 * Upon person or referral change, system to display the message if there is any pending confirmation record
                 * System will not block to continue
                 */                
                ctrl.checkExistingPendingConfirmationAssessment = function (personId, referralId) {                    
                    assessmentService.existPendingUnconfirmedRecords({ PersonId: personId, ReferralId: referralId, AssessmentDate: ctrl.model.actualAssessment.assessmentDate, AssessmentType: $stateParams.assessment, Template: $stateParams.template }).then(function (result) {
                        if (result.data) {
                            abp.message.info("System found unconfirmed assessment!");
                        }
                    });
                };

                ctrl.calculateNextReviewDate = function () {
                    if (ctrl.model.isNextReviewMonthRequired) {
                        var nextReviewMonth = ctrl.model.nextReviewMonth;
                        var assessmentDate = moment(ctrl.model.actualAssessment.assessmentDate);
                        ctrl.model.actualAssessment.nextReviewDate = assessmentDate.add(nextReviewMonth, 'month');
                    }
                };

                function getColorCode(score) {
                    for (var key in ctrl.categories) {
                        if (ctrl.categories.hasOwnProperty(key)) {
                            var val = ctrl.categories[key];
                            if (val.minimumValue <= score && score <= val.maximumValue) {
                                return ctrl.categoryColorCodes.values[val.colorCode].rgbValue;
                            }
                        }
                    };
                    //return grey
                    return ctrl.categoryColorCodes.values[4].rgbValue;
                };

                ctrl.getCategoryDescription = function (score) {

                    for (var key in ctrl.categories) {
                        if (ctrl.categories.hasOwnProperty(key)) {
                            var val = ctrl.categories[key];
                            if (val.minimumValue <= score && score <= val.maximumValue) {
                                return val.description;
                            }
                        }
                    };
                };     
            }
        ],
        templateUrl: '~/App/tenant/views/assessment/assessment-general-view.cshtml'
    });
})(_);