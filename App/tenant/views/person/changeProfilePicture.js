(function () {
    appModule.controller('tenant.views.person.changeProfilePicture', [
        '$scope', '$stateParams', 'appSession', '$uibModalInstance', 'FileUploader', 'abp.services.app.person', 'personId',
        function ($scope, $stateParams, appSession, $uibModalInstance, fileUploader, personService, personId) {
            var vm = this;
            vm.personId = personId;

            var $jcropImage = null;
            vm.uploadedFileName = null;

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Person/UploadProfilePicture',
                headers: {
                    "X-XSRF-TOKEN": abp.security.antiForgery.getToken()
                },
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'imageFilter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|jpg|jpeg|png|gif|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.save = function () {
                if (!vm.uploadedFileName) {
                    return;
                }

                var resizeParams = {};
                if ($jcropImage) {
                    resizeParams = $jcropImage.data("Jcrop").tellSelect();
                }

                personService.updatePersonPicture({
                    personId: vm.personId,
                    fileName: vm.uploadedFileName,
                    x: parseInt(resizeParams.x),
                    y: parseInt(resizeParams.y),
                    width: parseInt(resizeParams.w),
                    height: parseInt(resizeParams.h)
                }).then(function (result) {
                    $jcropImage.data('Jcrop').destroy();
                    $jcropImage = null;

                    $uibModalInstance.close(result);
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getUserProfilePicturePath = function (profilePictureId) {
                return profilePictureId ?
                    (abp.appPath + 'Person/GetPersonPictureById?personPictureName=' + profilePictureId) :
                    (abp.appPath + 'Common/Images/default-profile-picture.png');
            };

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    var $profilePictureResize = $('#ProfilePictureResize');

                    var newCanvasHeight = response.result.height * $profilePictureResize.width() / response.result.width;
                    $profilePictureResize.height(newCanvasHeight + 'px');

                    var profileFilePath = abp.appPath + 'Temp/Downloads/' + response.result.fileName + '?v=' + new Date().valueOf();
                    vm.uploadedFileName = response.result.fileName;

                    if ($jcropImage) {
                        $jcropImage.data('Jcrop').destroy();
                    }

                    $profilePictureResize.attr('src', profileFilePath);
                    $jcropImage = $profilePictureResize.Jcrop({
                        trueSize: [response.result.width, response.result.height],
                        setSelect: [0, 0, 100, 100],
                        aspectRatio: 1
                    });
                } else {
                    abp.message.error(response.error.message);
                }
            };
        }
    ]);
})();
