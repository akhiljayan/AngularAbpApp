(function () {
    appModule.controller('tenant.views.genogram.detail', [
        '$scope', '$stateParams', '$http', 'appSession', '$uibModal', '$uibModalInstance', 'template', 'genogramId', 'abp.services.app.genogram',
        function ($scope, $stateParams, $http, appSession, $uibModal, $uibModalInstance, template, genogramId, genogramService) {
            var vm = this;
            vm.template = template;
            vm.genogramId = genogramId;

            vm.$onInit = function () {
                vm.data = [];

                vm.permissions = {
                    view: abp.auth.hasPermission('Pages.Tenant.Genogram.View'),
                };

                vm.getGeongram();
            };

            vm.getGeongram = function () {
                vm.loading = true;

                if (vm.template == 'person') {

                    genogramService.getPersonGenogram(vm.genogramId).then(function (result) {
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loadImage(vm.template, vm.data.id);
                        vm.loading = false;
                    });
                } else if (vm.template == 'referral') {

                    genogramService.getReferralGenogram(vm.genogramId).then(function (result) {
                        vm.data = result.data;
                    }).finally(function () {
                        vm.loadImage(vm.template, vm.data.id);
                        vm.loading = false;
                    });
                }
            }

            vm.loadImage = function (template, id) {
                var element = angular.element('#genogram-detail');
                var imagePath = abp.appPath + 'Genogram/GetGenogramImage?id=' + vm.genogramId + '&template=' + vm.template;
                element.append('<img src="' + imagePath + '" class="genogram-image-size" border="0">');
            }

            vm.download = function () {
                var downloadFilePath = abp.appPath + 'Genogram/Download?id=' + vm.genogramId + '&template=' + vm.template;
                window.open(downloadFilePath, '_blank', '');
            }

            vm.close = function () {
                $uibModalInstance.close();
            };
        }
    ]);
})();
