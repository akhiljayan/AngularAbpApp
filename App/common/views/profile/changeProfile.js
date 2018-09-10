(function () {
    appModule.controller('common.views.profile.changeProfile', [
        '$scope', 'appSession', '$uibModalInstance', 'FileUploader', 'abp.services.app.profile',
        function ($scope, appSession, $uibModalInstance, fileUploader, profileService) {
            var vm = this;
            var $jcropImage = null;
            vm.uploadedFileName = null;

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Profile/UploadProfilePicture',
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

                        //File size check
                        if (item.size > 1048576) //1MB
                        {
                            abp.message.warn(app.localize('ProfilePicture_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.save = function () {
                profileService.updateCurrentUserProfile(vm.model)
                    .then(function () {
                        if (vm.uploadedFileName) {
                            var resizeParams = {};
                            if ($jcropImage) {
                                resizeParams = $jcropImage.data("Jcrop").tellSelect();
                            }

                            profileService.updateProfilePicture({
                                fileName: vm.uploadedFileName,
                                x: parseInt(resizeParams.x),
                                y: parseInt(resizeParams.y),
                                width: parseInt(resizeParams.w),
                                height: parseInt(resizeParams.h)
                            }).then(function () {
                                $jcropImage.data('Jcrop').destroy();
                                $jcropImage = null;
                                $('#HeaderProfilePicture').attr('src', app.getUserProfilePicturePath());
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                $uibModalInstance.close();
                            });
                        } else {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
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

            vm.removeUpload = function () {
                $("#fileinput").val('');
                vm.uploadedFileName = null;
                $('#ProfilePictureResize').attr('src', '');
                if ($jcropImage) {
                    $jcropImage.data('Jcrop').destroy();
                }
                $jcropImage = null;
            };

            function init() {
                profileService.getCurrentUserProfileForEdit({
                    id: appSession.user.id
                }).then(function (result) {
                    vm.model = result.data;
                });
            }

            init();
        }
    ]);
})();