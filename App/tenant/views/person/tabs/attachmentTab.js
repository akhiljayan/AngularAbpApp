(function () {
    appModule.controller('tenant.views.person.tabs.attachmentTab', [
        '$rootScope', '$scope', '$stateParams', '$location',
        function ($rootScope, $scope, $stateParams, $location) {
            var attachmentTab = this;
            var parent = $scope.$parent;
            attachmentTab.mode = $scope.attachmentTab.mode;
            var hash = $location.hash();

            parent.vm.setAttachmentNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Document', displayName: 'Document' }
                ];

                $rootScope.$broadcast('refresh-document-ui-grid');
            }

            attachmentTab.init = function () {
                parent.vm.setAttachmentNavigation();
            }

            attachmentTab.init();

        }
    ]);
})();