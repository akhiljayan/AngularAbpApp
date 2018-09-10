(function () {
    appModule.controller('tenant.views.languageDialects.createOrEditLanguageDialect', [
        '$uibModal', '$uibModalInstance', 'languageDialectId', 'personId', 'abp.services.app.languageDialect', 'abp.services.app.person', 'permissions', '$filter', 'abp.services.app.languageMaster',
        function ($uibModal, $uibModalInstance, languageDialectId, personId, languageDialectService, personService, permissions, $filter, languageService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = false;
            vm.isEditMode = false;

            vm.person = {};
            vm.languageDialect = {};
            vm.languageDialectMaster = [];
            vm.permissions = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                if (!vm.saving) {
                    vm.saving = true;

                    if (vm.isCreateMode) {
                        //Save LanguageDialect record
                        languageDialectService.createLanguageDialect(vm.languageDialect).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        //Update LanguageDialect record
                        languageDialectService.updateLanguageDialect(vm.languageDialect).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }                
            };

            vm.load = function () {
                vm.isCreateMode = !languageDialectId;
                vm.isEditMode = !vm.isCreateMode;

                if (vm.isCreateMode) {
                    vm.languageDialect = {};
                    vm.languageDialect.personId = personId;

                    personService.getPerson(personId)
                        .then(function (result) {
                            vm.person = result.data;
                            vm.languageDialect.person = vm.person;
                        });
                }
                else if (vm.isEditMode) {
                    //Retrieve existing Language Dialect selected
                    languageDialectService.getLanguageDialectForEdit(
                        { id: languageDialectId }
                    ).then(function (result) {
                        vm.languageDialect = result.data;

                        //For get Language Dialect Type string
                        if (vm.languageDialect.languageDialectType)
                            vm.languageDialect.languageDialectType = $filter('enumText')(vm.languageDialect.languageDialectType, 'languageDialectType');
                    });
                }
            };

            vm.init = function () {
                vm.permissions = permissions;

                languageService.getLanguageItems()
                    .then(function (result) {
                        vm.languageDialectMaster = result.data.items;
                    });

                vm.load();
            };

            vm.init();
        }
    ]);
})();
