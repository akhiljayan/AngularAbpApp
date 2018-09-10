(function () {
    appModule.component('timeLineIndex', {
        bindings: {
            patientFullname: '<',
            isPatient: '<',
            filter: '<',
            patientId: '<',
            module: '<',
            template: '<',
            //loading: '=',
            patientSelected: '=',
            patientTimeline: '=',
        },
        controllerAs: 'vm',
        controller: ['$scope', '$stateParams', '$uibModal', '$filter', '$location', '$anchorScroll', 'abp.services.app.timeLine', 'abp.services.app.masterData',
            function ($scope, $stateParams, $uibModal, $filter, $location, $anchorScroll, timeLineAppService, masterData) {
                var ctrl = this;
                $anchorScroll.yOffset = 70;
                ctrl.searchModules = [];
                ctrl.addLifeEvents = true;
                ctrl.pageSizes = [5, 10, 20, 30, 50, 100];
                ctrl.catagoryIds = { socialId: "", medicalId: "" , serviceId: ""};
                ctrl.timeLineModulesMain = app.consts.timeLineModules;
                ctrl.timeLineModules = app.consts.timeLineModules.values;
                ctrl.timeLineColors = app.consts.timelineAssesmentColor;
                ctrl.moduleCheckBox = [];
                ctrl.currentUserId = abp.session.userId;


                //Pagination for all timeline
                ctrl.pageSizeAll = 30;
                ctrl.requestParamsAll = { maxResultCount: ctrl.pageSizeAll, skipCount: 0 };
                ctrl.currentPageAll = 1;
                ctrl.recordFromAll = 0;
                ctrl.recordToAll = 0;
                ctrl.resetAll = function () {
                    ctrl.currentPageAll = 1;
                    ctrl.pageChangedAll();
                };
                ctrl.pageChangedAll = function () {
                    ctrl.requestParamsAll.maxResultCount = ctrl.pageSizeAll;
                    ctrl.requestParamsAll.skipCount = (ctrl.currentPageAll - 1) * ctrl.pageSizeAll;
                    ctrl.getAllTimeLines(ctrl.patientId);
                    ctrl.gotoAnchor();
                };
                ctrl.changeFromToCountAll = function () {
                    ctrl.recordFromAll = Math.min(ctrl.allTimeLineTotal, (ctrl.currentPageAll - 1) * ctrl.pageSizeAll + 1);
                    ctrl.recordToAll = Math.min(ctrl.allTimeLineTotal, ctrl.currentPageAll * ctrl.pageSizeAll);
                };
                //Pagination for mediacal timeline
                ctrl.pageSizeMedical = 30;
                ctrl.requestParamsMedical = { maxResultCount: ctrl.pageSizeMedical, skipCount: 0 };
                ctrl.currentPageMedical = 1;
                ctrl.recordFromMedical = 0;
                ctrl.recordToMedical = 0;
                ctrl.resetMedical = function () {
                    ctrl.currentPageMedical = 1;
                    ctrl.pageChangedMedical();
                };
                ctrl.pageChangedMedical = function () {
                    ctrl.requestParamsMedical.maxResultCount = ctrl.pageSizeMedical;
                    ctrl.requestParamsMedical.skipCount = (ctrl.currentPageMedical - 1) * ctrl.pageSizeMedical;
                    ctrl.getMedicalTimeLines(ctrl.patientId, ctrl.catagoryIds.medicalId);
                    ctrl.gotoAnchor();
                };
                ctrl.changeFromToCountMedical = function () {
                    ctrl.recordFromMedical = Math.min(ctrl.medicalTimeLineTotal, (ctrl.currentPageMedical - 1) * ctrl.pageSizeMedical + 1);
                    ctrl.recordToMedical = Math.min(ctrl.medicalTimeLineTotal, ctrl.currentPageMedical * ctrl.pageSizeMedical);
                };
                //Pagination for social timeline
                ctrl.pageSizeSocial = 30;
                ctrl.requestParamsSocial = { maxResultCount: ctrl.pageSizeSocial, skipCount: 0 };
                ctrl.currentPageSocial = 1;
                ctrl.recordFromSocial = 0;
                ctrl.recordToSocial = 0;
                ctrl.resetSocial = function () {
                    ctrl.currentPage = 1;
                    ctrl.pageChangedSocial();
                };
                ctrl.pageChangedSocial = function () {
                    ctrl.requestParamsSocial.maxResultCount = ctrl.pageSizeSocial;
                    ctrl.requestParamsSocial.skipCount = (ctrl.currentPageSocial - 1) * ctrl.pageSizeSocial;
                    ctrl.getSocialTimeLines(ctrl.patientId, ctrl.catagoryIds.socialId);
                    ctrl.gotoAnchor();
                };
                ctrl.changeFromToCountSocial = function () {
                    ctrl.recordFromSocial = Math.min(ctrl.socialTimeLineTotal, (ctrl.currentPageSocial - 1) * ctrl.pageSizeSocial + 1);
                    ctrl.recordToSocial = Math.min(ctrl.socialTimeLineTotal, ctrl.currentPageSocial * ctrl.pageSizeSocial);
                };
                //Pagination for Service timeline
                ctrl.pageSizeService = 30;
                ctrl.requestParamsService = { maxResultCount: ctrl.pageSizeService, skipCount: 0 };
                ctrl.currentPageService = 1;
                ctrl.recordFromService = 0;
                ctrl.recordToService = 0;
                ctrl.resetService = function () {
                    ctrl.currentPage = 1;
                    ctrl.pageChangedService();
                };
                ctrl.pageChangedService = function () {
                    ctrl.requestParamsService.maxResultCount = ctrl.pageSizeService;
                    ctrl.requestParamsService.skipCount = (ctrl.currentPageService - 1) * ctrl.pageSizeService;
                    ctrl.getServiceTimeLines(ctrl.patientId, ctrl.catagoryIds.serviceId);
                    ctrl.gotoAnchor();
                };
                ctrl.changeFromToCountService = function () {
                    ctrl.recordFromService = Math.min(ctrl.serviceTimeLineTotal, (ctrl.currentPageService - 1) * ctrl.pageSizeService + 1);
                    ctrl.recordToService = Math.min(ctrl.serviceTimeLineTotal, ctrl.currentPageService * ctrl.pageSizeService);
                };
                //END OF PAGINATION SECTION//

                ctrl.cancel = function () {
                    ctrl.patientSelected = false;
                    ctrl.patientTimeline = '';
                };

                ctrl.gotoAnchor = function () {
                    $location.hash('timeline');
                    $anchorScroll();
                };

                ctrl.preventScroll = function (event) {
                    if (ctrl.template == 'person') {
                        event.stopPropagation();
                        angular.element(event.currentTarget).tab('show');
                    } else {
                        return true;
                    }
                    
                };

                ctrl.selectedDocType = "";

                ctrl.$onInit = function () {
                    //ctrl.loading = false;
                    ctrl.permissions = {
                        createLifeEvent: abp.auth.hasPermission('Pages.Tenant.LifeEvents.Create'),
                        editLifeEvent: abp.auth.hasPermission('Pages.Tenant.LifeEvents.Edit'),
                        deleteLifeEvent: abp.auth.hasPermission('Pages.Tenant.LifeEvents.Delete')
                    };
                    masterData.getMasterDataTypeItems({
                        type: 'LifeEventCategory'
                    }).then(function (result) {
                        ctrl.catagory = result.data;
                        ctrl.catagoryIds.socialId = $filter('filter')(ctrl.catagory, function (m) { return (m.code === 'Social' || m.description === 'Social'); })[0].id;
                        ctrl.catagoryIds.medicalId = $filter('filter')(ctrl.catagory, function (m) { return (m.code === 'Medical' || m.description === 'Medical'); })[0].id;
                        ctrl.catagoryIds.serviceId = $filter('filter')(ctrl.catagory, function (m) { return (m.code === 'Service' || m.description === 'Service'); })[0].id;
                        ctrl.loadTimeLine();
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.patientId && changes.patientId.previousValue.length > 0) {
                        ctrl.loadTimeLine();
                    }
                };

                ctrl.loadTimeLine = function () {
                    if (ctrl.patientId) {
                        ctrl.getAllTimeLines();
                        ctrl.getSocialTimeLines();
                        ctrl.getMedicalTimeLines();
                        ctrl.getServiceTimeLines();
                    }
                };

                ctrl.getAllTimeLines = function () {
                    ctrl.loading = true;
                    timeLineAppService.getAllTimeLineForPerson($.extend({
                        personId: ctrl.patientId,
                        modules: ctrl.searchModules,
                        filter: ctrl.filter
                    }, ctrl.requestParamsAll)).then(function (result) {
                        ctrl.test = result.data.items;
                        ctrl.allTimeline = result.data.items;
                        ctrl.allTimeLineTotal = result.data.totalCount;
                        ctrl.changeFromToCountAll();
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.getMedicalTimeLines = function () {
                    ctrl.loading = true;
                    timeLineAppService.getCategoryTimeLineForPerson($.extend({
                        personId: ctrl.patientId,
                        eventCategory: ctrl.catagoryIds.medicalId,
                        modules: ctrl.searchModules,
                        filter: ctrl.filter
                    }, ctrl.requestParamsMedical)).then(function (result) {
                        ctrl.medicalTimeline = result.data.items;
                        ctrl.medicalTimeLineTotal = result.data.totalCount;
                        ctrl.changeFromToCountMedical();
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.getSocialTimeLines = function () {
                    ctrl.loading = true;
                    timeLineAppService.getCategoryTimeLineForPerson($.extend({
                        personId: ctrl.patientId,
                        eventCategory: ctrl.catagoryIds.socialId,
                        modules: ctrl.searchModules,
                        filter: ctrl.filter
                    }, ctrl.requestParamsSocial)).then(function (result) {
                        ctrl.socialTimeline = result.data.items;
                        ctrl.socialTimeLineTotal = result.data.totalCount;
                        ctrl.changeFromToCountSocial();
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.getServiceTimeLines = function () {
                    ctrl.loading = true;
                    timeLineAppService.getCategoryTimeLineForPerson($.extend({
                        personId: ctrl.patientId,
                        eventCategory: ctrl.catagoryIds.serviceId,
                        modules: ctrl.searchModules,
                        filter: ctrl.filter
                    }, ctrl.requestParamsService)).then(function (result) {
                        ctrl.serviceTimeline = result.data.items;
                        ctrl.serviceTimeLineTotal = result.data.totalCount;
                        ctrl.changeFromToCountService();
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.createLifeEvent = function () {
                    openCreateOrEditLifeEventModal(null, false);
                };

                ctrl.editLifeEvent = function (isEditable, sourseId, isSignificantEvent) {
                    if (isEditable && ctrl.permissions.editLifeEvent) {
                        openCreateOrEditLifeEventModal(sourseId, isSignificantEvent);
                    }
                }

                ctrl.deleteTimeLine = function (id) {
                    abp.message.confirm(
                        app.localize('DeleteTimeLine'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.loading = true;
                                timeLineAppService.deleteTimeLineEvent(id).then(function (result) {
                                    ctrl.loadTimeLine();
                                }).finally(function () {
                                    ctrl.loading = false;
                                });
                            }
                        }
                    );
                };

                //Add value to filter search by module
                ctrl.addSearchModule = function (module, event) {
                    if (event.target.checked) {
                        ctrl.searchModules.push(module);
                    } else {
                        var index = ctrl.searchModules.indexOf(module);
                        if (index > -1) {
                            ctrl.searchModules.splice(index, 1);
                        }
                    }
                    ctrl.loadTimeLine();
                }


                ctrl.showAllModules = function () {
                    if (ctrl.searchModules.length == 0) {
                        for (i = 0; i < ctrl.timeLineModules.length; ++i) {
                            ctrl.moduleCheckBox[i] = false;
                        }
                        ctrl.loadTimeLine();
                    }
                }


                ctrl.timeLineDBMigration = function () {
                    timeLineAppService.setUpTimeLineForExistingPersons().then(function () {
                        swal("Time Line Migration Compleated");
                    });
                };

                function openCreateOrEditLifeEventModal(lifeEventId, isSignificantEvent) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/lifeEvents/createOrEditLifeEvent.cshtml',
                        controller: 'tenant.views.lifeEvents.createOrEditLifeEvent as vmx',
                        backdrop: 'static',
                        resolve: {
                            lifeEventId: function () {
                                return lifeEventId;
                            },
                            personId: function () {
                                return ctrl.patientId;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            },
                            significantLifeEventFlag: function () {
                                return isSignificantEvent;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        ctrl.loadTimeLine();
                    });
                }
            }
        ],
        templateUrl: '~/App/tenant/views/timeLine/index.cshtml'
    });
})(_);
