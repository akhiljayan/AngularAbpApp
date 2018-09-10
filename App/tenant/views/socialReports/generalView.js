(function () {
    appModule.controller('tenant.views.socialReports.generalView', [
        '$scope', '$stateParams', '$validator', 'abp.services.app.commonLookup',
        function ($scope, $stateParams, $validator, commonLookupService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.socialReport = {};

            vm.edit = function () {
                vm.mode = 'edit';

                vm.socialReport = _.pick($scope.vm.socialReport, [
                    'personId', 'reportTypeId', 'byReferralId', 'reportedDate', 'reportedById',
                    'socialBackgroundFamilyBackground', 'subject', 'premorbidConditionADLFunctionalStatusAndCareNeed',
                    'socialCriteriaAssessment', 'financialBackgroundFinancialAssessment', 'additionalAssistance'
                ]);
            };

            $scope.$on('loadGeneralView', function (event, data) {
                if (data.reportedById) {
                    commonLookupService.getUserById(data.reportedById).then(function (result) {
                        vm.socialReport.reportedById = result.data.id + '';
                    });
                }
                vm.edit();
            });

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function () {
                $scope.$emit('UpdateSocialReport', vm.socialReport);
            };

            $scope.$on('SocialReportUpdated', function (event, data) {
                if (data.event.targetScope == $scope) {
                    if (data.success) {
                        vm.close();
                    }
                }
            });

            vm.init = function () {
                $scope.vm.generalCtrl = vm;
                $scope.vm.generalCtrl.socialReport = vm.socialReport;
            }

            vm.init();
        }
    ]);
})();