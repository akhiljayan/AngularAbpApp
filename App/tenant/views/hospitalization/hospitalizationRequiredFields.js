(function () {
    appModule.controller('tenant.views.hospitalization.hospitalizationRequiredFields', [
        '$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'abp.services.app.masterLookUp', 'data', 'action','abp.services.app.hospitalization',
        function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, masterLookup, data, action, hospitalizationService) {
            var vm = this;
            vm.saving = false;
            vm.hospitalization = data;
            vm.action = action;
            vm.editMode = false;

            vm.save = function () {
                hospitalizationService.edit(vm.hospitalization).then(function (result) {
                    if (action == "cancel") {
                        hospitalizationService.cancel(result.data.id, vm.hospitalization.cancellationReason).then(function (result) {
                            emitAfterSave();
                        });
                    } else if (action == "confirm") {
                        hospitalizationService.confirm(result.data.id).then(function (result) {
                            emitAfterSave();
                        });
                    }
                });
            };

            function emitAfterSave() {
                $scope.$emit('Created-Updated-Hospitalization');
                $uibModalInstance.dismiss();
            }

            vm.setNameForDrug = function (allergyname) {
                vm.allergy.name = allergyname;
            }

            vm.catagoryChanged = function (category) {
                vm.allergy.name = '';
                vm.allergy.genericDrug.id = undefined;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                //vm.permissions = {
                //    create: abp.auth.hasPermission('Pages.Tenant.Allergies.Create'),
                //    edit: abp.auth.hasPermission('Pages.Tenant.Allergies.Edit'),
                //};

                //vm.allergyCategories = app.consts.allergiesCategories.values;
                //if (personId && template == 'person') {
                //    allergyService.getPersonAllergy(vm.allergyId).then(function (result) {
                //        mapToVmObjects(result);
                //    });
                //} else if (referralId && template == 'referral') {
                //    allergyService.getReferralAllergy(vm.allergyId).then(function (result) {
                //        mapToVmObjects(result);
                //    });
                //}


                //vm.disableSave = false;
                //if (vm.allergyId != app.consts.EmptyGuid) {
                //    vm.editMode = true;
                //}
            }


            init();


            // Validation definition
            //vm.validationOptions = {
            //    rules: {
            //        "HospitalizationTo": {
            //            required: true
            //        }
            //    }
            //};


        }
    ]);
})();