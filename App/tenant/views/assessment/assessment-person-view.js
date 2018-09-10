(function () {
    appModule.component('assessmentPersonView', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            isPatient: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$stateParams', '$filter', '$location', '$state', '$uibModal', 'abp.services.app.assessment', 'abp.services.app.dynamicPermission',
            function ($scope, $stateParams, $filter, $location, $state, $uibModal, assessmentService, dynamicPermissionService) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.filter = null;
                ctrl.persons = [];
                ctrl.headingAppend = '- All';
                ctrl.selectedFilter = 999;
                ctrl.todaysDate = moment().format();
                ctrl.categoryColorCodes = app.consts.assessmentCategoryColorCodes;
                ctrl.options = [
                    {
                        fontSize: 23,
                        size: 60,
                        trackWidth: 8,
                        barWidth: 8,
                        trackColor: '#e6e7e8',
                        barColor: ctrl.categoryColorCodes.values[0].rgbValue,
                        readOnly: "true",
                        dynamicOptions: "true"
                    },
                    {
                        fontSize: 23,
                        size: 60,
                        trackWidth: 8,
                        barWidth: 8,
                        trackColor: '#e6e7e8',
                        barColor: ctrl.categoryColorCodes.values[1].rgbValue,
                        readOnly: "true",
                        dynamicOptions: "true"
                    },
                    {
                        fontSize: 23,
                        size: 60,
                        trackWidth: 8,
                        barWidth: 8,
                        trackColor: '#e6e7e8',
                        barColor: ctrl.categoryColorCodes.values[2].rgbValue,
                        readOnly: "true",
                        dynamicOptions: "true"
                    },
                ]; 

                ctrl.permissions = [];
                ctrl.permissionValue = []
                ctrl.createPermissions = [];


                ctrl.$onChanges = function () {                    
                    ctrl.showAll();
                };

                ctrl.$onInit = function () {
                    ctrl.loading = true;
                    ctrl.getDynamicPermission();
                };

                ctrl.getDynamicPermission = function () {

                    dynamicPermissionService.getGrantedAssessmentPermission($.extend({ Permissions: null }, null)).then(function (result) {
                        ctrl.permissions = result.data;
                        
                    }).finally(function () {                        
                        angular.forEach(ctrl.permissions, function (item) {
                            ctrl.permissionValue[item.permissionName] = true;
                            if (item.permissionName == 'Pages.Tenant.Assessment.' + item.module + '.Create') {
                                ctrl.createPermissions.push(item);
                            }
                        });
                    });
                };

              
                //Search Function
                ctrl.searchValue = function () {
                    assessmentService.getPersonAssessments($.extend({ filter: ctrl.filter, status: ctrl.selectedFilter, personId: ctrl.personId }, ctrl.requestParams)).then(function (result) {
                        ctrl.assessmentList = result.data.items;
                        ctrl.data = result.data;                        
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                   
                };

                //Get all records
                ctrl.getAll = function () {
                    ctrl.headingAppend = "";
                    ctrl.filter = "";
                };

                ctrl.showAll = function () {
                    ctrl.selectedFilter.value = "";
                    ctrl.searchValue();
                };

                //Filter function
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
                    ctrl.key = dataFilter.toString();
                    ctrl.searchValue();
                };


                //Clear Filter
                ctrl.clearFilter = function () {
                    ctrl.filter = "";
                };

                //View
                ctrl.view = function (id, assessment) {
                    
                    var permissionName = 'Pages.Tenant.Assessment.' + assessment.toUpperCase() + '.View';
                    if (ctrl.permissionValue[permissionName]) {
                        $state.go('tenant.assessmentDetailPersonMode', { assessment: assessment.toLowerCase() , id: id, personId: ctrl.personId });
                    }
                };

                //Page increment function
                ctrl.incrementPageNumber = function () {
                    ctrl.requestParams.skipCount = (ctrl.currentPage - 1) * ctrl.pageSize;
                };


                ctrl.loadResults = function (requestParams) {
                    ctrl.requestParams = requestParams;
                    ctrl.searchValue();
                }

                /*  ColorCode binding for MBI Assessment Category */          

                ctrl.option = {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: '',
                    readOnly: "true"
                };

                ctrl.selectOption = function (colorCode) {
                    var knobSetup = {
                        fontSize: 23,
                        size: 60,
                        trackWidth: 8,
                        barWidth: 8,
                        trackColor: '#e6e7e8',
                        barColor: '',
                        readOnly: "true",
                        dynamicOptions: "true"
                    };
                    knobSetup.barColor = ctrl.categoryColorCodes.values[colorCode].rgbValue;
                    return knobSetup;
                }
           

                /* To show popup model assesment listing */
                ctrl.addAssessment = function () { 
                    openModelForChooseAssessment(ctrl.personId);                   
                };  
                
                //create edit
                function openModelForChooseAssessment(prsnId) {
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
                                return ctrl.createPermissions;
                            }
                        }
                    });
                    //modalInstance.result.then(function () {
                    //    //$state.reload();
                    //});
                };
            }
        ],

        templateUrl: '~/App/tenant/views/assessment/assessment-person-view.cshtml'
    });
})();