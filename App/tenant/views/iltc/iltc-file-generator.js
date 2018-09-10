(function () {
    appModule.component('iltcFileGenerator', {
        bindings: {
            maintitle: '<'
        },
        controllerAs: "vm",
        controller: [
            '$state', '$location', '$sce', 'abp.services.app.centreServices',
            function ($state, $location, $sce, appService) {                
                var ctrl = this;

                ctrl.loading = false;
                ctrl.hideILTCFrame = true;
                ctrl.url = null;

                ctrl.selectedInstitution = null;                
                ctrl.institutions = [];

                ctrl.$onInit = function () {                  

                    ctrl.permissions = {
                        fileGenerator: abp.auth.hasPermission('Pages.Tenant.ILTC.FileGenerator')
                    };
                    ctrl.bindInstitutionDropDown();
                };

                /* To bind Institute Code from Centre Service Type Master Config */
                ctrl.bindInstitutionDropDown = function () {
                    ctrl.loading = true;
                    appService.getILTCInstitutionCodes().then(function (result) {                        
                        ctrl.institutions = result.data;
                        if (ctrl.institutions.length == 1) {
                            ctrl.selectedInstitution = ctrl.institutions[0];
                            ctrl.url = $sce.trustAsResourceUrl(ctrl.selectedInstitution.url);                            
                        }                   
                    }).finally(function () {
                        ctrl.loading = false;
                        ctrl.hideILTCFrame = false;
                    });
                };

                ctrl.onChangeInstitutionCode = function () {                    
                    if (ctrl.selectedInstitution != null) {
                        ctrl.url = $sce.trustAsResourceUrl(ctrl.selectedInstitution.url);
                        ctrl.hideILTCFrame = false;
                    } else {
                        ctrl.url = null;
                        ctrl.hideILTCFrame = true;                  
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/iltc/iltc-file-generator.cshtml'
    });
})();