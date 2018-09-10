(function () {
    appModule.controller('tenant.views.assessment.assessmentNavigation', [
        '$scope', '$timeout', '$state', '$location', 'abp.services.app.dynamicPermission', 'abp.services.app.masterLookUp', 
        function ($scope, $timeout, $state, $location, dynamicPermissionService, masterLookup) {
            var ctrl = this;
            ctrl.tootips = '';

            ctrl.getDynamicPermission = function () {
                dynamicPermissionService.getGrantedAssessmentPermission($.extend({ action: '.View' }, null)).then(function (result) {
                    ctrl.permissions = result.data;
                }).finally(function () {
                    ctrl.loading = false;
                });
            };

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

            //Load function
            ctrl.init = function () {
                ctrl.loading = true;
                ctrl.getDynamicPermission();
                ctrl.bindFunctionalMakerTypeMaster();
            };
            
            ctrl.init();       

            ctrl.viewAssessment = function (assessment) {
                $state.go('tenant.assessment', { assessment: assessment.module.toLowerCase(), description: assessment.moduleDescription });                  
            };

            $scope.$watch('$viewContentLoaded', bindJqueryEvents);
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {

                    });
                }, 0);
            }
        }
    ]);
})();
