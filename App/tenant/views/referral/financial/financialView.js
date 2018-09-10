(function () {
    appModule.controller('tenant.views.referral.financialView', [
        '$scope', '$stateParams',
        function ($scope, $stateParams) {
            var financial = this;
            var parent = $scope.$parent;
            financial.mode = $scope.$parent.vm.mode;

            parent.vm.setFinancialNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'MeansTesting', displayName: 'Means Testing' },
                    { key: 'FinancialAssistance', displayName: 'Financial Assistance' }
                ];
            }
            
        }
    ]);
})();