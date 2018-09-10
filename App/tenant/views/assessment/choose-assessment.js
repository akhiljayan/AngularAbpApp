(function () {
    appModule.component('chooseAssessment', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: "vm",
        controller: [
            '$state', '$location', 'abp.services.app.assessment', 'abp.services.app.masterLookUp', 
            function ($state, $location, assessmentService, masterLookup) {
                var ctrl = this
                ctrl.tootips = '';

                /**
                 * Binding Functional Marker Assessment "Type" Master Lookup data on mouse hover.
                 */
                ctrl.bindFunctionalMakerTypeMaster = function () {
                    masterLookup.getMasterTypeItemsWithPagination({ type: 'Functional Marker Type' }).then(function (result) {
                        ctrl.masterData = result.data.items;
                        angular.forEach(ctrl.masterData, function (item) {
                            ctrl.tootips += item.description + ', '
                        })
                    });
                };

                ctrl.cancel = function () {
                    ctrl.modalInstance.close();
                };

                ctrl.$onInit = function () {           
                    ctrl.bindFunctionalMakerTypeMaster();
                    ctrl.personId = ctrl.resolve.personId;
                    ctrl.permissions = ctrl.resolve.permissions;
                    ctrl.referralId = ctrl.resolve.referralId;
                    ctrl.template = ctrl.resolve.template;
                };    

                ctrl.createAssessment = function (assessment) {
                    
                    /* $state.params.assessment is the unique short form name of the assessment config. */
                    if (abp.auth.hasPermission(assessment.permissionName + ".Create")) {
                        if (assessment.module.toLowerCase() == 'zbi') {
                            $state.go('tenant.zbiDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'raf') {                             
                            $state.go('tenant.rafDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template, referralId: ctrl.referralId });
                        } else if (assessment.module.toLowerCase() == 'soh') {
                            $state.go('tenant.sohDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'amt') {
                            $state.go('tenant.amtDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'fma') {
                            $state.go('tenant.fmaDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'fra') {
                            $state.go('tenant.fraDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'fast') {
                            $state.go('tenant.fastDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template, referralId: ctrl.referralId });
                        } else if (assessment.module.toLowerCase() == 'gds') {
                            $state.go('tenant.gdsDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'mmse') {
                            $state.go('tenant.mmseDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'ga') {
                            $state.go('tenant.gaDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'ps') {
                            $state.go('tenant.psDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'moca') {
                            $state.go('tenant.mocaDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else if (assessment.module.toLowerCase() == 'glds') {
                            $state.go('tenant.gldsDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template });
                        } else {
                            $state.go('tenant.assessmentDetailPersonMode', { assessment: assessment.module.toLowerCase(), personId: ctrl.personId, description: assessment.moduleDescription, template: ctrl.template, referralId: ctrl.referralId });
                        }
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/assessment/choose-assessment.cshtml'
    });
})();