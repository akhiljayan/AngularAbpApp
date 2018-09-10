(function (abp) {
    appModule.component('genogramCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<'
        },
        controller: [
            '$scope', '$filter', '$state', '$timeout', '$uibModal', 'uiGridConstants', 'abp.services.app.genogram',
            function ($scope, $filter, $state, $timeout, $uibModal, uiGridConstants, genogramService) {
                var ctrl = this;
                ctrl.latestData = [];
                ctrl.allData = [];
                ctrl.data = [];
                ctrl.totalCount = 0;
                ctrl.pageNumber = 1;
                ctrl.pageSize = 5;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.data = [];

                    ctrl.permissions = {
                        view: abp.auth.hasPermission('Pages.Tenant.Genogram.View'),
                        upload: abp.auth.hasPermission('Pages.Tenant.Genogram.Upload'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Genogram.Delete'),
                    };

                    ctrl.showFullDetails = true;
                    ctrl.getGenogram();
                };

                // event handlers
                ctrl.create = function () {
                    openModalForUpload(ctrl.template, ctrl.personId, ctrl.referralId);
                };

                ctrl.delete = function (id) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {

                                ctrl.showFullDetails = false;

                                if (ctrl.personId && ctrl.template == 'person') {
                                    genogramService.deletePersonGenogram(id).then(function (result) {
                                    }).finally(function () {
                                        ctrl.getGenogram();
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                    });
                                } else if (ctrl.referralId && ctrl.template == 'referral') {
                                    genogramService.deleteReferralGenogram(id).then(function (result) {
                                    }).finally(function () {
                                        ctrl.getGenogram();
                                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                                    });
                                }
                            }
                        }
                    );
                };

                ctrl.view = function (id) {
                    openModalForDetail(ctrl.template, id);
                };

                ctrl.toggleDetail = function () {

                    if (ctrl.showFullDetails == true) {
                        ctrl.data = ctrl.latestData;
                        ctrl.showFullDetails = false;
                    } else {
                        ctrl.data = ctrl.allData;
                        ctrl.showFullDetails = true;
                    }
                }

                $scope.$on('vmReferral', function (events, data) {
                    ctrl.referralId = data.id;
                    ctrl.personId = data.personId;
                    ctrl.getGenogram();
                });

                // callbacks
                ctrl.load = function (requestParams) {
                    ctrl.getGenogram();
                };

                ctrl.getGenogram = function () {
                    ctrl.loading = true;

                    ctrl.latestData = [];
                    ctrl.allData = [];
                    ctrl.data = [];

                    if (ctrl.template == 'person') {

                        if (ctrl.personId) {
                            genogramService.getAllPersonGenogram(
                                $.extend({
                                    personId: ctrl.personId
                                }, ctrl.requestParams)
                            ).then(function (result) {
                                ctrl.totalCount = result.data.totalCount;
                                ctrl.latestData = [];

                                if (result.data.items.length > 0) {
                                    ctrl.latestData.push(result.data.items[0]);
                                }

                                ctrl.allData = result.data.items;
                                ctrl.toggleDetail();

                            }).finally(function () {
                                ctrl.loading = false;
                            });
                        } else {
                            ctrl.loading = false;
                        }
                    } else if (ctrl.template == 'referral') {

                        if (ctrl.referralId) {
                            genogramService.getAllReferralGenogram(
                                $.extend({
                                    referralId: ctrl.referralId
                                }, ctrl.requestParams)
                            ).then(function (result) {
                                ctrl.totalCount = result.data.totalCount;
                                ctrl.latestData = [];

                                if (result.data.items.length > 0) {
                                    ctrl.latestData.push(result.data.items[0]);
                                }

                                ctrl.allData = result.data.items;
                                ctrl.toggleDetail();

                            }).finally(function () {
                                ctrl.loading = false;
                            });
                        } else {
                            ctrl.loading = false;
                        }
                    }
                }

                function openModalForDetail(template, genogramId) {

                    var templateurl = '~/App/tenant/views/genogram/genogram-detail.cshtml';
                    var controller = 'tenant.views.genogram.detail as vm';

                    var modalInstance = $uibModal.open({
                        templateUrl: templateurl,
                        controller: controller,
                        backdrop: 'static',
                        size: 'xlg',
                        scope: $scope,
                        resolve: {
                            template: function () {
                                return template;
                            },
                            genogramId: function () {
                                return genogramId;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.showFullDetails = false;
                        ctrl.getGenogram();
                    });
                };

                function openModalForUpload(template, personId, referralId) {

                    var templateurl = '~/App/tenant/views/genogram/genogram-upload.cshtml';
                    var controller = 'tenant.views.genogram.upload as vm';

                    var modalInstance = $uibModal.open({
                        templateUrl: templateurl,
                        controller: controller,
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            template: function () {
                                return template;
                            },
                            personId: function () {
                                return personId;
                            },
                            referralId: function () {
                                return referralId;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        ctrl.showFullDetails = false;
                        ctrl.getGenogram();
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/genogram/genogram-card.cshtml'
    });
})(abp);