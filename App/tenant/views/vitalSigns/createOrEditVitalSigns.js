(function () {
    appModule.controller('tenant.views.vitalSigns.createOrEditVitalSigns', [
               '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'action', 'vitalSignId', 'templateDateIn', 'templateDateOut', 'personId', 'template', 'templateId', 'abp.services.app.vitalSign', 'abp.services.app.commonLookup',
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, action, vitalSignId, templateDateIn, templateDateOut, personId, template, templateId, vitalSignService, commonLookupService) {
            var vm = this;
            vm.saving = false;
            vm.vitalSignId = vitalSignId;
            vm.source = "";
            vm.action = action;
            vm.personId = personId;
            vm.editMode = false;
            vm.loading = true;
            vm.vitalSign = [];
            vm.luekocytesValue = app.consts.urineLuekocytes.values;
            vm.nitriteValue = app.consts.urineNitrite.values;
            vm.templateDateOut = templateDateOut;
            if ((templateDateOut || templateDateIn) && template != 'person') {
                if (templateDateOut != templateDateIn) {
                    vm.minimumDate = templateDateIn;
                } else if (templateDateOut == templateDateIn) {
                    var d = new Date(templateDateOut);
                    d.setSeconds(d.getSeconds() + 10);
                    vm.templateDateOut = d.toISOString();
                    vm.minimumDate = templateDateIn;
                } else {
                    vm.minimumDate = null;
                }
            }


            if (personId != app.consts.EmptyGuid) {
                vm.enablePerson = false;
                vm.personDisabled = true;
            } else {
                vm.enablePerson = true;
                vm.personDisabled = false;
            }

            vm.save = function (vitalSigns) {
                if (!vm.saving) {
                    vm.saving = true;
                    vitalSignService.create(vitalSigns).then(function (result) {
                        broadcastAfterSave();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.preventUnwantedChars = function ($event) {
                if ([69, 187, 188, 189].includes($event.keyCode)) {
                    $event.preventDefault();
                }
            }

            function broadcastAfterSave() {
                $scope.$emit('Created-new-vitalsign');
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.VitalSign.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.VitalSign.Edit'),
                };

                vm.disableSave = false;
                if (vm.vitalSignId != app.consts.EmptyGuid && !personId) {
                    vm.editMode = true;
                }

                if (action == 'edit') {
                    if (template == 'visitlog') {
                        vm.source = app.consts.vitalSignSource.VisitLog;
                        getSourceVitalSignData(personId, templateId, vm.source);
                    }
                } else {
                    vitalSignService.getVitalSignById(vm.vitalSignId).then(function (result) {
                        vm.vitalSign = result.data;
                        vm.vitalSign.sourceId = templateId;
                        if (template == 'visitlog') {
                            vm.vitalSign.vitalSignSource = app.consts.vitalSignSource.VisitLog;
                            vm.vitalSign.takenOn = templateDateIn;
                        };
                        if (vm.vitalSign.personId == undefined || vm.vitalSign.personId == app.consts.EmptyGuid) {
                            vm.vitalSign.personId = null;
                            vm.personId = null;
                            if (personId != app.consts.EmptyGuid) {
                                vm.vitalSign.personId = personId;
                            }
                        }
                        vm.loading = false;
                    });
                }
            };

            function getSourceVitalSignData(personId, templateId, source) {
                var param = { 'personId': personId, 'sourceId': templateId, 'source': source }
                vitalSignService.getPersonVitalSignsForSorce(param).then(function (result) {
                    vm.vitalSign = result.data;
                    if (vm.vitalSign.personId == undefined || vm.vitalSign.personId == app.consts.EmptyGuid) {
                        vm.vitalSign.personId = "";
                        if (personId != app.consts.EmptyGuid) {
                            vm.vitalSign.personId = personId;
                        }
                    }
                    vm.loading = false;
                });
            }

            init();



        }]);
})();