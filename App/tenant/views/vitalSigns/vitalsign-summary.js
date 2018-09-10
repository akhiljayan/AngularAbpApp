(function (abp) {
    appModule.component('vitalsignSummary', {
        bindings: {
            maintitle: '<',
            mode: '<',
            template: '<',
            createTemplate: '<',
            templateDatetimeIn: '<',
            templateDatetimeOut: '<',
            personId: '<',
            isPatient: '<',
            templateId: '<',
            dissableCreation:'<',
        },
        controller: [
            '$scope', '$filter', '$state', '$stateParams', '$uibModal', 'abp.services.app.vitalSign',
            function ($scope, $filter, $state, $stateParams, $uibModal, vitalsignService) {
                var ctrl = this;
                ctrl.filter = "active";
                ctrl.forPerson = true;
                ctrl.vitalSignSource = '';
                ctrl.appPath = abp.appPath;
                var createTemplateUrl;
                var createTemplateController;
                var createResolve = {};
                ctrl.reviseData = false;
                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.vitalsign = "";
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.VitalSign.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.VitalSign.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.VitalSign.View'),
                    };
                };


                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        load();
                    }
                };

                // event handlers
                ctrl.create = function () {
                    if (ctrl.permissions.create) {
                        openCreateOrEditVitalSignModal("create", app.consts.EmptyGuid, ctrl.personId);
                    }
                };

                ctrl.reviceVitalSign = function (id) {
                    if (ctrl.permissions.create) {
                        openCreateOrEditVitalSignModal("edit", app.consts.EmptyGuid, ctrl.personId);
                    }
                }


                // callbacks
                function load() {
                    ctrl.loading = true;
                    if (ctrl.personId && ctrl.template == 'person') {
                        ctrl.forPerson = true;
                        getLatestVitalSigns(ctrl.personId);
                    } else if (ctrl.personId && ctrl.templateId && ctrl.template == 'visitlog') {
                        ctrl.forPerson = false;
                        ctrl.vitalSignSource = app.consts.vitalSignSource.VisitLog;
                        GetPersonVitalSignsForSorce(ctrl.personId, ctrl.templateId, ctrl.vitalSignSource);
                    }
                };

                function getLatestVitalSigns(personId) {
                    vitalsignService.getPersonLatestVitalSign(personId).then(function (result) {
                        ctrl.vitalsign = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                function GetPersonVitalSignsForSorce(personId, templateId, vitalSignSource) {
                    var param = { 'personId': personId, 'sourceId': templateId, 'source': vitalSignSource }
                    vitalsignService.getPersonVitalSignsForSorce(param).then(function (result) {
                        ctrl.vitalsign = result.data;
                        if (ctrl.vitalsign) {
                            ctrl.reviseData = true;
                        }
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                }

                ctrl.GetBmiValue = function (weight, height) {
                    var bmi;
                    if (weight && height) {
                        bmi = $.roundDecimal((weight / ((height * height) / 10000)), 2);
                    } else {
                        bmi = "-";
                    }
                    return bmi;
                };

                ctrl.getLatestUrineTakenOnDate = function (vitalsign) {
                    var arrayDates = [];
                    if (vitalsign.urinePH.values) {
                        if (vitalsign.urinePH.values.length > 0) arrayDates.push(new Date(vitalsign.urinePH.values[0].takenOn));
                    }
                    if (vitalsign.urineBlood) {
                        if (vitalsign.urineBlood.length > 0) arrayDates.push(new Date(vitalsign.urineBlood[0].takenOn));
                    }
                    if (vitalsign.urineKetone) {
                        if (vitalsign.urineKetone.length > 0) arrayDates.push(new Date(vitalsign.urineKetone[0].takenOn));
                    }
                    if (vitalsign.urineGlucose) {
                        if (vitalsign.urineGlucose.length > 0) arrayDates.push(new Date(vitalsign.urineGlucose[0].takenOn));
                    }
                    if (vitalsign.unrineLuekocytes) arrayDates.push(new Date(vitalsign.unrineLuekocytes[0].takenOn));
                    if (vitalsign.urineNitirte) arrayDates.push(new Date(vitalsign.urineNitirte[0].takenOn));
                    if (arrayDates.length > 0) {
                        var maxDate = new Date(Math.max.apply(null, arrayDates));
                        return $filter('dateTimeFormat')(maxDate);
                    } else {
                        return '-';
                    }
                };

                ctrl.getLatestUrineTakenOnDateForSorce = function (vitalsign) {
                    var arrayDates = [];
                    if (vitalsign.urinePH.values) {
                        if (vitalsign.urinePH.values.length > 0) arrayDates.push(new Date(vitalsign.urinePH.values[0].takenOn));
                    }
                    if (vitalsign.urineBlood) {
                        if (vitalsign.urineBlood.length > 0) arrayDates.push(new Date(vitalsign.urineBlood[0].takenOn));
                    }
                    if (vitalsign.urineKetone) {
                        if (vitalsign.urineKetone.length > 0) arrayDates.push(new Date(vitalsign.urineKetone[0].takenOn));
                    }
                    if (vitalsign.urineGlucose) {
                        if (vitalsign.urineGlucose.length > 0) arrayDates.push(new Date(vitalsign.urineGlucose[0].takenOn));
                    }
                    if (vitalsign.unrineLuekocytes.length > 0) arrayDates.push(new Date(vitalsign.unrineLuekocytes[0].takenOn));
                    if (vitalsign.urineNitirte.length > 0) arrayDates.push(new Date(vitalsign.urineNitirte[0].takenOn));
                    if (arrayDates.length > 0) {
                        var maxDate = new Date(Math.max.apply(null, arrayDates));
                        return $filter('dateTimeFormat')(maxDate);
                    } else {
                        return '-';
                    }
                };

                ctrl.viewReports = function () {
                    vitalsignService.viewPatientVitalSign(ctrl.personId).then(function (result) {
                        var url = result.data;
                        url = window.location.origin + ctrl.appPath + url;
                        
                        var reportWindow = window.open();
                        reportWindow.location = url;
                        reportWindow.target = '_blank';
                        reportWindow.locationbar.visible = false;
                        reportWindow.focus();
                    });
                };


                load();

                $scope.$on('Created-new-vitalsign', function () {
                    load();
                });


                ctrl.viewCharts = function () {
                    //openChartViewModal(ctrl.personId);
                    $state.go("tenant.vitalSignChart", { personId: ctrl.personId });
                }

                //Charts modal 
                function openChartViewModal(pid) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/vitalSigns/vitalSignCharts/viewChart.csht ml',
                        controller: 'tenant.views.vitalSigns.vitalSignsChart.viewCharts as vm',
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            personId: function () {
                                return pid;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        load();
                    });
                };

                //create edit
                function openCreateOrEditVitalSignModal(action, id, pid) {
                    if (ctrl.personId && ctrl.createTemplate == 'person') {
                        createResolve = {
                            action: function () { return action; },
                            vitalSignId: function () { return id; },
                            template: function () { return ctrl.template; },
                            templateId: function () { return ctrl.templateId; },
                            templateDateIn: function () { return ctrl.templateDatetimeIn; },
                            templateDateOut: function () { return ctrl.templateDatetimeOut; },
                            personId: function () { return pid; },
                        };
                    } else if (ctrl.personId && ctrl.templateId && ctrl.createTemplate == 'visitlog') {
                        createResolve = {
                            action: function () { return action; },
                            vitalSignId: function () { return id; },
                            template: function () { return ctrl.createTemplate; },
                            templateId: function () { return ctrl.templateId; },
                            templateDateIn: function () { return ctrl.templateDatetimeIn; },
                            templateDateOut: function () { return ctrl.templateDatetimeOut; },
                            personId: function () { return ctrl.personId; },
                        };
                    }


                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/vitalSigns/createOrEditVitalSigns.cshtml',
                        controller: 'tenant.views.vitalSigns.createOrEditVitalSigns as vm',
                        backdrop: 'static',
                        //windowClass: 'larger-modal',
                        size: 'lg',
                        scope: $scope,
                        resolve: createResolve
                    });
                    modalInstance.result.then(function () {
                        load();
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/vitalSigns/vitalsign-summary.cshtml'
    });
})(abp);