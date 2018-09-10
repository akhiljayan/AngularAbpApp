(function () {
    appModule.controller('tenant.views.genogram.upload', [
        '$scope', '$stateParams', '$http', 'appSession', '$uibModalInstance', 'FileUploader', 'template', 'personId', 'referralId', 'abp.services.app.genogram',
        function ($scope, $stateParams, $http, appSession, $uibModalInstance, fileUploader, template, personId, referralId, genogramService) {
            var vm = this;
            vm.template = template;
            vm.personId = personId;
            vm.referralId = referralId;

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Genogram/UploadAsync',
                headers: {
                    "X-XSRF-TOKEN": abp.security.antiForgery.getToken(),
                    "Template": vm.template,
                    "PersonId": vm.personId,
                    "ReferralId": vm.referralId
                },
                queueLimit: 10,
                autoUpload: false,
                removeAfterUpload: false,
                filters: [{
                    name: 'imageFilter',
                    fn: function (item, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        var isImageFileType = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);

                        if (isImageFileType == -1) {
                            abp.message.error(app.localize('UploadGenogram_ImageOnly'));
                            return false;
                        }

                        // Set 5 megabytes (MB) as max file size
                        if (item.size > 5242880) {
                            var fileSizeMegabytes = 5;
                            abp.message.error(app.localize('DocumentFile_Warn_SizeLimit', fileSizeMegabytes));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.save = function () {
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    abp.notify.success(app.localize('UploadedFileSuccessfully'));
                } else {
                    abp.message.error(response.error.message);
                }
            };
        }
    ]);
})();
