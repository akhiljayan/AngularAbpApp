(function () {
    appModule.controller('tenant.views.document.uploadFile', [
        '$scope', '$stateParams', '$http', 'appSession', '$uibModalInstance', 'FileUploader', 'module', 'recordId', 'personId', 'abp.services.app.document',
        function ($scope, $stateParams, $http, appSession, $uibModalInstance, fileUploader, module, recordId, personId, documentService) {
            var vm = this;
            vm.module = module;
            vm.recordId = recordId;
            vm.personId = personId;
            vm.removeEnabled = false;
            vm.tags = [];

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadFileAsync',
                headers: {
                    "X-XSRF-TOKEN": abp.security.antiForgery.getToken(),
                    "Module": vm.module,
                    "RecordId": vm.recordId,
                    "PersonId": vm.personId
                },
                queueLimit: 10,
                autoUpload: false,
                removeAfterUpload: false,
                filters: [{
                    name: 'documentFilter',
                    fn: function (item, options) {

                        // Get the file name
                        var fileName = item.name;

                        // Check if the file is executable and need to be blocked accordingly
                        if (fileName.indexOf('.exe') > -1 || fileName.indexOf('.app') > -1) {
                            abp.message.error(app.localize('ExecutableNotAllowed'));
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
                vm.saving = true;

                if (vm.tags.length > 0) {

                    if (vm.uploader.queue.length > 0) {

                        vm.documentFile = [];

                        for (var i = 0; i < vm.uploader.queue.length; i++) {

                            var fileName = vm.uploader.queue[i].file.name;
                            var fileSize = vm.uploader.queue[i].file.size;
                            var fileType = vm.uploader.queue[i].file.type;

                            var documentFile = {
                                originalFileName: fileName,
                                fileSize: fileSize,
                                fileType: fileType,
                                module: vm.module,
                                recordId: vm.recordId,
                                personId: vm.personId,
                            };

                            vm.documentFile.push(documentFile);
                        }

                        documentService.createUpdateTagForDocumentFile({
                            documentFile: vm.documentFile,
                            tags: vm.tags,
                        }).then(function (response) {
                            abp.message.info(response.data.message);
                        }).finally(function () {
                            vm.saving = false;
                            $uibModalInstance.close();
                        });
                    }

                } else {
                    vm.saving = false;
                    $uibModalInstance.close();
                }
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.downloadFile = function (downloadPath) {
                window.open(downloadPath, '_blank', '');
            }

            vm.uploader.onAfterAddingFile = function(item) {
                vm.removeEnabled = true;
            }; 

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    abp.notify.success(app.localize('UploadedFileSuccessfully'));
                    $("#divDocumentFileTag").show();
                } else {
                    abp.message.error(response.error.message);
                }
            };

            vm.uploader.onCancel = function(response, status, headers) {
                vm.removeEnabled = true;
            };

            vm.uploader.onProgressAll = function (progress) {
                vm.removeEnabled = false;
            };

            vm.uploader.onCompleteAll = function () {
                vm.removeEnabled = true;
            };
        }
    ]);
})();
