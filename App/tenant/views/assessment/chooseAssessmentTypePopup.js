(function () {
    appModule.controller('tenant.views.assessment.chooseAssessmentTypePopup', [
        '$scope', '$rootScope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'template', 'abp.services.app.assessment', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $timeout, $uibModal, $uibModalInstance, personId, template, assessmentService, personService) {
            debugger;
            var vm = this;            
            vm.personId = personId;
            vm.assessmentList = [];
            vm.radiovalue = { value: null };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Assessment.Create')
                };
                
                assessmentService.getAll().then(function (result) {
                    vm.assessmentList = result.data;
                });
            };

            init();

            vm.onChangeSelect = function (assessment) {
 
            };
            
        }]);
})();