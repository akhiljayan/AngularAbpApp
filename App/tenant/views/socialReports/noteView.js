(function () {
    appModule.controller('tenant.views.socialReports.noteView', [
        '$scope', '$stateParams',
        function ($scope, $stateParams) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.socialReport = {};

            vm.edit = function () {
                vm.mode = 'edit';
                
                vm.socialReport = _.pick($scope.vm.socialReport, [
                    'note', 'confidentialNote'
                ]);
            };

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
                $scope.vm.noteCtrl = vm;
                $scope.vm.noteCtrl.socialReport = vm.socialReport;
            }

            vm.init();
        }
    ]);
})();