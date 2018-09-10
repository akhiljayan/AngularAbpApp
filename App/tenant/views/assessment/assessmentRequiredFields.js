(function () {
    appModule.controller('tenant.views.assessment.assessmentRequiredFields', [
        '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'data', 'action', 'abp.services.app.assessment',
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, masterLookup, data, action, assessmentService) {
            var vm = this;
            vm.saving = false;
            vm.actualAssessment = data;
            vm.action = action;
            vm.editMode = false;

            vm.save = function () {

                if (action == "cancel") {
                    assessmentService.cancel(vm.actualAssessment.id, vm.actualAssessment.cancellationReason).then(function (result) {
                        emitAfterSave();
                    });
                } else if (action == "confirm") {
                    assessmentService.confirm(vm.actualAssessment.id).then(function (result) {
                        emitAfterSave();
                    });
                }

            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-Assessment');
                $uibModalInstance.close("Close");
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
           
            }


            init();


         
        }
    ]);
})();