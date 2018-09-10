(function () {
    appModule.component('fmaDetailView', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.commonLookup', '$stateParams', '$state', '$anchorScroll', '$location', 'abp.services.app.user', '$filter', '$rootScope', 'abp.services.app.functionalMarker', 'abp.services.app.assessment', 'stateNavigation',
            function ($scope, $uibModal, $timeout, commonFormFunction, commonLookupService, $stateParams, $state, $anchorScroll, $location, userService, $filter, $rootScope, functionalMarkerService, assessmentService, stateNavigation) {

                var vm = this;
                $anchorScroll.yOffset = 100;
                vm.personHeaderisPinned = true;
                vm.appPath = abp.appPath;
                vm.isCreateMode = !$stateParams.id;
                vm.mode = 'new';
                vm.isNew = 0;

                vm.model = { totalscore: 0, actualAssessment: {}, option: {}, nextReviewMonth: 0, isNextReviewMonthRequired: false, isCategoryRequired: false, isScoreCalculationRequired: false };
                vm.model.confirmationCheck = false;

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
                                
                // Category to bind ActualAssessment - AssessmentCategory field.
                vm.onChangeCategory = function (selected) {
                    if (selected != null) {
                        vm.model.actualAssessment.assessmentCategory = selected.description;
                    } else {
                        vm.model.actualAssessment.assessmentCategory = null
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
                        functionalMarkerService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {
                            
                            vm.model.actualAssessment = result.data;

                            vm.model.isConfirmed = vm.model.actualAssessment.isConfirmed;
                            vm.model.isCancelled = vm.model.actualAssessment.isCancelled;
                            vm.model.disabled = vm.model.actualAssessment.isConfirmed || vm.model.actualAssessment.isCancelled;                            
                            vm.model.totalScore = vm.model.actualAssessment.totalScore;
                        });
                    } else {
                        vm.isNew = 1;
                        vm.mode = 'new';
                        vm.actualAssessmentId = app.consts.EmptyGuid;
                        functionalMarkerService.getPersonAssessmentById(vm.actualAssessmentId).then(function (result) {
                            
                            vm.model.actualAssessment = result.data;
                            vm.model.actualAssessment.categoryId = null;

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

                            if (vm.model.actualAssessment.nextReviewDate == null) {
                                var assessmentDate = moment(vm.model.actualAssessment.assessmentDate);
                                vm.model.actualAssessment.nextReviewDate = assessmentDate.add(vm.model.nextReviewMonth, 'month');
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
                    if ($stateParams.id) {
                        functionalMarkerService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            }
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        functionalMarkerService.createPersonAssessment(vm.model.actualAssessment).then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            if (closed) {
                                vm.close();
                            } else {
                                if (typeof $stateParams.personId != 'undefined') {
                                    $state.go('tenant.fmaDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                } else {
                                    $state.go('tenant.fmaDetail', { assessment: $stateParams.assessment, id: result.data.id });
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

                    if (vm.model.isNextReviewMonthRequired && vm.model.actualAssessment.nextReviewDate == null)
                        return;

                    if (vm.form.$valid) {
                        abp.message.confirm(
                            'Please click Ok to continue',
                            'You are about to Confirm the Assessment',
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    functionalMarkerService.updatePersonAssessment(vm.model.actualAssessment).then(function () {
                                        functionalMarkerService.confirm(vm.actualAssessmentId).then(function (result) {
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
                                functionalMarkerService.clone(vm.model.actualAssessment.id).then(function (result) {
                                    if (typeof $stateParams.personId != 'undefined') {
                                        $state.go('tenant.fmaDetailPersonMode', { assessment: $stateParams.assessment, id: result.data.id, personId: $stateParams.personId });
                                    } else {
                                        $state.go('tenant.fmaDetail', { assessment: $stateParams.assessment, id: result.data.id });
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
                                functionalMarkerService.deletePersonAssessment(
                                    vm.model.actualAssessment.id
                                ).then(function () {
                                    abp.notify.info("Deleted");
                                    $rootScope.close();
                                });
                            }
                        }
                    );
                };

                // Get Assessment Config
                function getEmptyAssessmentObject() {
                    assessmentService.getByName($stateParams.assessment).then(function (result) {
                        vm.assessment = result.data;
                        vm.model.nextReviewMonth = vm.assessment.nextReviewMonth;
                        vm.model.isNextReviewMonthRequired = vm.assessment.isNextReviewMonthRequired;
                        vm.model.isCategoryRequired = vm.assessment.isCategoryRequired;
                        vm.model.isScoreCalculationRequired = vm.assessment.isScoreCalculationRequired;
                    });
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

        templateUrl: '~/App/tenant/views/assessment/functionalMarker/fma-detail-view.cshtml'
    });
})();