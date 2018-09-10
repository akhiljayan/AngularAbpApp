(function () {
    appModule.controller('tenant.views.irms.attachmentView', [
        '$scope', '$timeout', '$stateParams', 'abp.services.app.iRMSReferral', '$element',
        function ($scope, $timeout, $stateParams, referralService, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.referralAttachmentsList = [];

            parent.vm.setAttachmentNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'Attachment', displayName: app.localize('Attachment'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.referralAttachmentsList &&
                    vm.referral.referralAttachmentsList.length > 0) {
                    vm.referralAttachmentsList = vm.referral.referralAttachmentsList;
                }

                vm.loading = false;
            });

            vm.download = function () {

                var downloadWindow = window.open();

                referralService.getIRMSReferralAttachmentByRegNo(decodeURIComponent($stateParams.id))
                    .then(function (result) {
                        var url = result.data;
                        downloadWindow.location = url;
                        downloadWindow.target = '_blank';
                        downloadWindow.focus();
                    });
            };

            vm.init = function () {
                parent.vm.setBioDataNavigation();
            };

            vm.init();
        }
    ]);
})();