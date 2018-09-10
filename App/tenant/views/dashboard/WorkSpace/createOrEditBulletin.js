(function () {
    appModule.controller('tenant.views.dashboard.workspace.createOrEditBulletin', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.bulletin', 'bulletinId', 'action', 'lookupModal', 'abp.services.app.masterLookUp', 'abp.services.app.user', '$q',
        function ($scope, $uibModal, $uibModalInstance, bulletinService, bulletinId, action, lookupModal, masterLookup, userService, $q) {
            var vm = this;
            vm.saving = false;
            vm.referral = null;
            vm.creatorName = '';
            vm.modifierName = '';

            vm.save = function () {
                vm.saving = true;
                if ($scope.isEmptyGuid(bulletinId)) {
                    bulletinService.createBulletin(vm.bulletin).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    bulletinService.updateBulletin(vm.bulletin).then(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.selectOrgUnit = function () {
                openSelectOrgUnitModal(null);
            };

            vm.test = function (evnt) {
                for (var i in CKEDITOR.instances) {
                    CKEDITOR.instances[i].focus();
                }
            }

            function openSelectOrgUnitModal(id) {
                selectOrgUnitModal.open({
                    callback: function (selectedItem) {
                        vm.patient.organizationUnitName = selectedItem.displayName;
                        vm.patient.organizationUnitId = selectedItem.id;
                    }
                });

            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            //CKEDITOR.replace('bulletin-text', {
            //    wordcount : { showWordCount: true, showCharCount: true, showParagraphs: false, maxCharCount: 200 }
            //});



            function init() {
                vm.loading = true;
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Delete'),
                    pin: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Pin'),
                    unpin: abp.auth.hasPermission('Pages.Tenant.Dashboard.Bulletin.Unpin')
                };

                bulletinService.getBulletin(bulletinId)
                    .then(function (result) {
                        vm.bulletin = result.data;
                        if (vm.bulletin.categoryId == app.consts.EmptyGuid) {
                            vm.bulletin.categoryId = null;
                        };
                        
                        
                        vm.bulletin.effectiveDate = vm.bulletin.effectiveDate;                       

                        vm.loading = false;

                        if (action == 'View')
                            vm.bulletin.disabled = true;
                        else
                            vm.bulletin.disabled = false;
                    });



                masterLookup.getMasterTypeItems({
                    type: 'Category'
                }).then(function (result) {
                    vm.categoryMaster = result.data;

                });

            }

            init();

        }
    ]);
})();