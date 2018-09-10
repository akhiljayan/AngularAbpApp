(function () {
    appModule.controller('tenant.views.assessment.index', [
        '$scope', '$state', '$stateParams', '$timeout', '$location', '$anchorScroll', '$filter', 'abp.services.app.assessment', 'abp.services.app.dynamicPermission',
        function ($scope, $state, $stateParams,  $timeout, $location, $anchorScroll, $filter, assessmentService, dynamicPermissionService) {
            $anchorScroll.yOffset = 70;
            var vm = this;
            vm.appPath = abp.appPath;
            vm.filter = null;            
            vm.selectedFilter = 0;
            vm.headingAppend = " - " + $filter('enumText')(vm.selectedFilter, 'Status');
          
            vm.todaysDate = moment().format();

            /*  ColorCode binding for MBI Assessment Category */
            vm.categoryColorCodes = app.consts.assessmentCategoryColorCodes;

            vm.options = [
                {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: vm.categoryColorCodes.values[0].rgbValue,
                    readOnly: "true",
                    dynamicOptions: "true"
                },
                {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: vm.categoryColorCodes.values[1].rgbValue,
                    readOnly: "true",
                    dynamicOptions: "true"
                },
                {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: vm.categoryColorCodes.values[2].rgbValue,
                    readOnly: "true",
                    dynamicOptions: "true"
                },
                {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: vm.categoryColorCodes.values[3].rgbValue,
                    readOnly: "true",
                    dynamicOptions: "true"
                },
                {
                    fontSize: 30,
                    size: 80,
                    trackWidth: 10,
                    barWidth: 10,
                    trackColor: '#e6e7e8',
                    barColor: vm.categoryColorCodes.values[4].rgbValue,
                    readOnly: "true",
                    dynamicOptions: "true"
                },
            ];

            // Return ng-knob option dynamically.
            vm.getOption = function (assessment, colorCode) {
                var returnOption = vm.options[colorCode];
                if (assessment == 'FAST') {
                    returnOption.step = 0.1;
                }

                return returnOption;
            }                       

            vm.init = function () {
                vm.loading = true;
                if ($state.params.assessment) {
                    vm.title = $state.params.description;
                    vm.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Assessment.' + $state.params.assessment.toUpperCase() + '.View')
                    };
                }

                vm.assessmentDetailsOpen = false;
            };

            
            //Search Function
            vm.searchValue = function () {
                vm.loading = true;
                assessmentService.getAllActualAssessment($.extend({ filter: vm.filter, status: vm.selectedFilter, assessmentType: $state.params.assessment }, vm.requestParams)).then(function (result) {
                    
                    vm.assessmentList = result.data.items;
                    vm.data = result.data;
                    vm.loading = false;
                });
            };

            //Create
            vm.create = function () {
                
                /* $state.params.assessment is the unique short form name of the assessment config. */
                if (vm.permissions.create) {
                    if ($state.params.assessment == 'zbi') { //Zarit Burden Interview
                        $state.go('tenant.zbiDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'raf') { //Resident Assessment Form
                        $state.go('tenant.rafDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'soh') { //State of Health
                        $state.go('tenant.sohDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'amt') { //Abbreviated Mental Test
                        $state.go('tenant.amtDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'fma') { //Functional Markers Assessment
                        $state.go('tenant.fmaDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'fra') { //Fall Risk Assessment
                        $state.go('tenant.fraDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'fast') { //Functional Assessment Staging Tool
                        $state.go('tenant.fastDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'gds') { //Geriatric Depression Scale
                        $state.go('tenant.gdsDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'mmse') { //Mini Mental State Examination
                        $state.go('tenant.mmseDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'ga') { //Geriatric Assessment
                        $state.go('tenant.gaDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'ps') { //Pain Assessment
                        $state.go('tenant.psDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'moca') { //Montreal Cognitivie Assessment
                        $state.go('tenant.mocaDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person' });
                    } else if ($state.params.assessment == 'glds') { //Global Deterioration Scale - GDS
                        $state.go('tenant.gldsDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person' });
                    } else {
                        $state.go('tenant.assessmentDetail', { assessment: $state.params.assessment, description: $state.params.description, template: 'person' })
                    }
                }                
            };


            //Get all records
            vm.getAll = function () {
                vm.headingAppend = "";
                vm.filter = "";
            };

            vm.showAll = function () {
                vm.selectedFilter.value = "";
                vm.searchValue();
            };

            //Filter function
            vm.assessmentStatusFilterSelection = function (dataFilter) {
                var appendValue = $filter('enumText')(dataFilter, 'Status');
                if (!appendValue) {
                    vm.headingAppend = '- All'
                }
                else {
                    vm.headingAppend = '- ' + appendValue;
                }
                //SERTCH WITH PARAMS
                vm.selectedFilter = dataFilter;
                vm.key = dataFilter.toString();
                vm.searchValue();
            };


            //Clear Filter
            vm.clearFilter = function () {
                vm.filter = "";
            };

            //View
            vm.view = function (id) {
                
                if (vm.permissions.view) {
                    /* $state.params.assessment is the unique short form name of the assessment config. */
                    if ($state.params.assessment == 'zbi') {
                        $state.go('tenant.zbiDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'raf') {
                        $state.go('tenant.rafDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'soh') {
                        $state.go('tenant.sohDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'amt') {
                        $state.go('tenant.amtDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'fma') {
                        $state.go('tenant.fmaDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'fra') {
                        $state.go('tenant.fraDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'fast') {
                        $state.go('tenant.fastDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'gds') {
                        $state.go('tenant.gdsDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'mmse') { //Mini Mental State Examination
                        $state.go('tenant.mmseDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'ga') { //Mini Mental State Examination
                        $state.go('tenant.gaDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person' });
                    } else if ($state.params.assessment == 'ps') { //Pain Assessment
                        $state.go('tenant.psDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    } else if ($state.params.assessment == 'moca') { //Mini Mental State Examination
                        $state.go('tenant.mocaDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person' });
                    } else if ($state.params.assessment == 'glds') { //Global Deterioration Scale
                        $state.go('tenant.gldsDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person' });
                    } else {
                        $state.go('tenant.assessmentDetail', { assessment: $state.params.assessment, id: id, description: $state.params.description, template: 'person'  });
                    }                    
                }
            };

            //Page increment function
            vm.incrementPageNumber = function () {
                vm.requestParams.skipCount = (vm.currentPage - 1) * vm.pageSize;
            };

            vm.init();

            vm.loadResults = function (requestParams) {
                vm.requestParams = requestParams;
                vm.searchValue();
            }

        }
    ]);
})();