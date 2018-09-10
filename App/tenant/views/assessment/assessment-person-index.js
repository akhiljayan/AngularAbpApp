(function () {
    appModule.component('assessmentPersonIndex', {
        bindings: {
            maintitle: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            isPatient: '<',
            isReferral: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$stateParams', '$filter', '$location', '$state', '$uibModal', 'abp.services.app.assessment', 'abp.services.app.dynamicPermission',
            function ($scope, $stateParams, $filter, $location, $state, $uibModal, assessmentService, dynamicPermissionService) {
                
                var ctrl = this;

                ctrl.filter = null;                 

                ctrl.permissions = [];
                ctrl.viewPermissions = [];
                ctrl.selectedModules = "";
                ctrl.selectedPeriod = "";
                ctrl.years = [];       

                ctrl.$onInit = function () {
                    ctrl.categoryColorCodes = app.consts.assessmentCategoryColorCodes;
                    ctrl.bindFilterDropdown();  
                    ctrl.getDynamicPermission();
                    if (ctrl.template == 'person') {
                        ctrl.headingAppend = '- Confirmed';               
                        ctrl.selectedFilter = 1; /* Assessment card to default to 'Confirmed' filter in Person */
                    } else if (ctrl.template == 'referral') {
                        ctrl.headingAppend = '- All';               
                        ctrl.selectedFilter = 999; /* Assessment card to default to 'All Assessment' filter in Referral */
                    }
                };
                
                ctrl.getDynamicPermission = function () {
                    dynamicPermissionService.getGrantedAssessmentPermission($.extend({ Mode: ctrl.template }, null)).then(function (result) {
                        ctrl.permissions = result.data;
                        for (i = 0; i < ctrl.permissions.length; i++) {
                            angular.forEach(ctrl.permissions[i].data, function (item) {
                                if (abp.auth.hasPermission(item.permissionName + '.View')) {
                                    ctrl.viewPermissions.push(item);
                                }
                            });
                        }
                    });                    
                };

                ctrl.bindFilterDropdown = function () {
                    
                    var currentYear = (new Date()).getFullYear();
                    for (i = 0; i < 8; i++) {
                        ctrl.years[i] = currentYear - i;                        
                    }
                    
                }

                ctrl.loadResults = function (requestParams) {
                    ctrl.requestParams = requestParams;
                    ctrl.searchValue();
                }

                //Filter functions
                ctrl.clearFilter = function () {
                    ctrl.filter = "";
                };
                
                ctrl.assessmentStatusFilterSelection = function (dataFilter) {
                    var appendValue = $filter('enumText')(dataFilter, 'Status');
                    if (!appendValue) {
                        ctrl.headingAppend = '- All'
                    }
                    else {
                        ctrl.headingAppend = '- ' + appendValue;
                    }
                    //SERTCH WITH PARAMS
                    ctrl.selectedFilter = dataFilter;
                    ctrl.searchValue();
                };
                
                ctrl.searchValue = function () {
                    ctrl.loading = true;
                    if (ctrl.template == 'person') {
                        assessmentService.getPersonAssessmentTimeline($.extend({ filter: ctrl.filter, status: ctrl.selectedFilter, personId: $stateParams.id, assessmentCode: ctrl.selectedModules, assessmentPeriod: ctrl.selectedPeriod }, ctrl.requestParams)).then(function (result) {                            
                            ctrl.assessmentList = result.data.items;
                            ctrl.data = result.data;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    } else if (ctrl.template == 'referral') {
                        assessmentService.getReferralAssessmentTimeline($.extend({ filter: ctrl.filter, status: ctrl.selectedFilter, referralId: $stateParams.id, assessmentCode: ctrl.selectedModules, assessmentPeriod: ctrl.selectedPeriod }, ctrl.requestParams)).then(function (result) {
                            ctrl.assessmentList = result.data.items;
                            ctrl.data = result.data;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    }                    
                };

                /* To show popup model assesment listing */
                ctrl.addAssessment = function () {
                    if (ctrl.template == 'referral') {
                        openModelForChooseAssessment(null, ctrl.template, $stateParams.id);
                    } else if (ctrl.template == 'person') {
                        openModelForChooseAssessment($stateParams.id, ctrl.template, null);
                    }                    
                };

                //create edit
                function openModelForChooseAssessment(prsnId, template, refId) {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'chooseAssessment',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            },
                            referralId: function () {
                                return refId;
                            },
                            template: function () {
                                return template;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        var requestParams = { skipCount: 0 };
                        ctrl.loadResults(requestParams);
                    });
                };

                // View Assessment Detail Info
                ctrl.view = function (id, assessment, assmtDescription) {
                    
                    if (ctrl.template == 'person') {
                        ctrl.personId = $stateParams.id;
                    } else if (ctrl.template == 'referral') {
                        ctrl.referralId = $stateParams.id;
                    }
                    
                    /* $state.params.assessment is the unique short form name of the assessment config. */
                    if (abp.auth.hasPermission('Pages.Tenant.Assessment.' + assessment.toUpperCase() + '.Create')) {

                        if (assessment.toLowerCase() == 'zbi') {
                            $state.go('tenant.zbiDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template});
                        } else if (assessment.toLowerCase() == 'raf') {
                            $state.go('tenant.rafDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template, referralId: ctrl.referralId });                                                        
                        } else if (assessment.toLowerCase() == 'soh') {
                            $state.go('tenant.sohDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template});
                        } else if (assessment.toLowerCase() == 'amt') {
                            $state.go('tenant.amtDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'fma') {
                            $state.go('tenant.fmaDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'fra') {
                            $state.go('tenant.fraDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'fast') {
                            $state.go('tenant.fastDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template, referralId: ctrl.referralId });
                        } else if (assessment.toLowerCase() == 'gds') {
                            $state.go('tenant.gdsDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'mmse') {
                            $state.go('tenant.mmseDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'ga') {
                            $state.go('tenant.gaDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'ps') {
                            $state.go('tenant.psDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'moca') {
                            $state.go('tenant.mocaDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else if (assessment.toLowerCase() == 'glds') {
                            $state.go('tenant.gldsDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template });
                        } else {
                            $state.go('tenant.assessmentDetailPersonMode', { assessment: assessment.toLowerCase(), id: id, personId: ctrl.personId, description: assmtDescription, template: ctrl.template, referralId: ctrl.referralId });
                        }
                    }
                };
            }
        ],

        templateUrl: '~/App/tenant/views/assessment/assessment-person-index.cshtml'
    });
})();