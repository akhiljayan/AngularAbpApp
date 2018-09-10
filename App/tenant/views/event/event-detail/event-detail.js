(function () {
    appModule.component('centreEventDetail', {
        bindings: {
            mode: '<',
            model: '<',
            loading: '<',
            onSave: '&',
            onDelete: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$state', '$rootScope', 'abp.services.app.centre', 'abp.services.app.membershipBooking', 'commonFormFunction', '$filter', 'FileUploader',
            function ($state, $rootScope, centre, membershipBookingService, commonFormFunction, $filter, fileUploader) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.eventInChineese = "";
                var $jcropImage = null;
                ctrl.uploadedFileName = null;
                ctrl.showDelete = false;
                ctrl.showExistingPicOnEdit = true;

                ctrl.uploader = new fileUploader({
                    url: abp.appPath + 'Blob/UploadPicture',
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
                            if ('|jpg|jpeg|png|'.indexOf(type) === -1) {
                                abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                                return false;
                            }

                            return true;
                        }
                    }]
                });

                ctrl.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.success) {
                        ctrl.showExistingPicOnEdit = false;
                        var $pictureResize = $('#PictureResize');

                        var newCanvasHeight = response.result.height * $pictureResize.width() / response.result.width;
                        $pictureResize.height(newCanvasHeight + 'px');

                        var profileFilePath = abp.appPath + 'Temp/Downloads/' + response.result.fileName + '?v=' + new Date().valueOf();
                        ctrl.uploadedFileName = response.result.fileName;

                        if ($jcropImage) {
                            $jcropImage.data('Jcrop').destroy();
                        }

                        $pictureResize.attr('src', profileFilePath);
                        $jcropImage = $pictureResize.Jcrop({
                            trueSize: [response.result.width, response.result.height],
                            setSelect: [0, 0, 100, 100],
                            aspectRatio: 1
                        });
                    } else {
                        abp.message.error(response.error.message);
                    }
                };



                ctrl.$onInit = function () {
                    ctrl.eventStatus = app.consts.eventStatus;
                    updateRecordStatus();
                    setDefaultValues();
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Events.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Events.Edit'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Events.Delete'),
                        confirm: abp.auth.hasPermission('Pages.Tenant.Events.Confirm'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.Events.Cancel')
                    };

                    centre.getAllCentresLookUpInUserOU().then(function (result) {
                        ctrl.centrelist = result.data;
                    });


                    membershipBookingService.getAllActiveEvents().then(function (result) {
                        ctrl.eventList = result.data;
                    });

                    if (ctrl.model) {
                        ctrl.getImageName(ctrl.model.pictureId, "Event");
                        controlDeleteFlag(ctrl.model.validRegisteredUserCount);
                    }

                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.model = angular.copy(ctrl.model);
                        updateRecordStatus();
                        setDefaultValues();
                        ctrl.getImageName(ctrl.model.pictureId, "Event");
                        controlDeleteFlag(ctrl.model.validRegisteredUserCount);
                    }
                };

                ctrl.saveEventRegistration = function () {
                    commonFormFunction.setFormSubmitted(ctrl.form);
                    ctrl.form.submitted = true;

                    if (ctrl.form.$invalid) {
                        return;
                    }
                    var resizeRequestParams = {};
                    if (ctrl.uploadedFileName) {
                        var resizeParams = {};
                        if ($jcropImage) {
                            resizeParams = $jcropImage.data("Jcrop").tellSelect();

                            resizeRequestParams = {
                                fileName: ctrl.uploadedFileName,
                                x: parseInt(resizeParams.x),
                                y: parseInt(resizeParams.y),
                                width: parseInt(resizeParams.w),
                                height: parseInt(resizeParams.h)
                            };
                        }
                    }

                    if (ctrl.isNewRecord) {
                        ctrl.onSave({
                            $event: {
                                model: ctrl.model,
                                imageparams: resizeRequestParams,
                                success: function () {
                                    //setPristine();
                                    ctrl.mode = '';
                                    resetJcropImage();
                                }
                            }
                        });
                    }
                    else {
                        ctrl.onSave({
                            $event: {
                                model: ctrl.model,
                                imageparams: resizeRequestParams,
                                success: function () {
                                    ctrl.mode = '';
                                    //setPristine();
                                    resetJcropImage();
                                }
                            }
                        });
                    }

                };

                ctrl.updateDeleteFlag = function (event) {
                    if (event.flag) {
                        ctrl.showDelete = true;
                    }
                };

                ctrl.getImageName = function (id, name) {
                    membershipBookingService.generateEventImageName(id, name).then(function (imageResult) {
                        ctrl.model.eventImageName = imageResult.data;
                        ctrl.eventImageName = imageResult.data;
                        ctrl.popover = {
                            templateUrl: "~/App/tenant/views/event/event-detail/components/popOverImageDisplay.cshtml",
                            picture: id,
                            title: name,
                            appPath: abp.appPath,
                            placement: 'bottom'
                        };
                    });
                };

                ctrl.eventSelected = function (eventId) {
                    ctrl.eventInChinese = $filter('filter')(ctrl.eventList, function (m) { return m.id === eventId; })[0].descriptionInChinese;
                }

                ctrl.deleteCentrePersonGroup = function () {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onDelete();
                            }
                        }
                    );
                };

                ctrl.close = function () {
                    //$state.go('tenant.eventSetupList');
                    $rootScope.close();
                };

                ctrl.preventUnwantedChars = function ($event) {
                    if ([69, 187, 188, 189, 190].includes($event.keyCode)) {
                        $event.preventDefault();
                    }
                }

                ctrl.ticketsPrint = function () {
                    var reportWindow = window.open();
                    membershipBookingService.ticketPrinting(ctrl.model.id).then(function (result) {
                        ctrl.url = result.data;
                        var location = window.location.origin + abp.appPath + ctrl.url;
                        reportWindow.location = location;
                        reportWindow.target = '_blank';
                        reportWindow.locationbar.visible = false;
                        reportWindow.focus();
                    });
                };

                ctrl.deleteEvent = function (id) {
                    abp.message.confirm(
                        'The system will Delete this Event Record. To continue, click Ok.',
                        'Are you sure ?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                membershipBookingService.deleteEvent(id).then(function (result) {
                                    abp.notify.info(app.localize('Event Deleted Successfully.'));
                                    $state.go('tenant.eventSetupList');
                                });
                            }
                        });
                };

                ctrl.test = function () {
                    alert("SDfsdfsf");
                }


                function updateRecordStatus() {
                    ctrl.isNewRecord = !ctrl.model.id;
                    ctrl.mode = ctrl.isNewRecord ? 'edit' : '';
                }

                function setDefaultValues() {
                    if (ctrl.model.activityEvent) {
                        ctrl.eventInChinese = ctrl.model.activityEvent.descriptionInChinese
                    }
                }

                function controlDeleteFlag(userCount) {
                    ctrl.showDelete = userCount <= 0;
                };

                function resetJcropImage() {
                    if ($jcropImage != null) {
                        $jcropImage.data('Jcrop').destroy();
                        $jcropImage = null;
                    }
                }
            }
        ],
        templateUrl: '~/App/tenant/views/event/event-detail/event-detail.cshtml'
    });
})();