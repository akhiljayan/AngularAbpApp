(function () {
    appModule.controller('tenant.views.dashboard.editMomentPost', [
        '$scope', '$uibModalInstance', 'abp.services.app.post', 'postId', 'FileUploader',
        function ($scope, $uibModalInstance, momentPostService, postId, fileUploader) {
            var vm = this;
            vm.saving = false;
            vm.post = null;
            vm.appPath = abp.appPath;
            vm.uploadedFileName = null;

            vm.save = function () {
                if (!$('#momentsForm').valid())
                    return
                vm.saving = true;
                var hashTags = $("#postHashTag").tagsinput('items');
                vm.post.hashtags = [];
                for (var tag in hashTags) {                    
                    var tagObject = { id: "",name: "" };
                    tagObject.name = hashTags[tag];
                    vm.post.hashtags.push(tagObject);
                }

                var personTags = $("#personTags").tagsinput('items');
                vm.post.personTags = [];
                for (var tag in personTags) {
                    var tagObject = { postId: vm.post.id , person: { id: "" } };;
                    tagObject.person.id = personTags[tag].value;
                    vm.post.personTags.push(tagObject);
                }
                
                vm.post.attachments = [];
                vm.uploadedFileName && vm.post.attachments.push({
                    fileName: vm.uploadedFileName
                });

                momentPostService.updatePost(vm.post).then(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Post/UploadPhoto',
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

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    vm.uploadedFileName = response.result.fileName;
                } else {
                    abp.message.error(response.error.message);
                }
            };

            function init() {
                vm.loading = true;
                momentPostService.getPost({ Id : postId })
                    .then(function (result) {
                        vm.post = result.data;
                        if (vm.post.hashtags && vm.post.hashtags.length > 0) {
                            for (var index in vm.post.hashtags) {
                                $('#postHashTag').tagsinput('add', vm.post.hashtags[index].name);
                            }
                        }
                        if (vm.post.personTags && vm.post.personTags.length > 0) {
                            
                            for (var index in vm.post.personTags) {
                                var username = vm.post.personTags[index].person.name;
                                var id = vm.post.personTags[index].person.id;
                                var obj = { name: username, value: id };
                                $('#personTags').tagsinput('add', obj);
                            }
                        }
                        vm.loading = false;
                    });
            }

            init();

        }
    ]);
})();