(function () {
    appModule.controller('tenant.views.referral.attachmentView', [
        '$rootScope', '$scope', '$stateParams',
        function ($rootScope, $scope, $stateParams) {
            var ctrl = this;
            var parent = $scope.$parent;
            ctrl.mode = $scope.attachment.mode;

            parent.vm.setAttachmentNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Document', displayName: 'Document' }
                ];

                $rootScope.$broadcast('refresh-document-ui-grid');
            }
        }
    ]);
})();