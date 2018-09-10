(function () {
    appModule.controller('tenant.views.person.createOrEditCourseSkill', [
        '$scope', '$uibModalInstance', 'id', 'person', 'abp.services.app.person',
        function ($scope, $uibModalInstance, id, person, personService) {
            var vm = this;
            vm.isCreateMode = false;
            vm.isEditMode = false;
            vm.years = [];
            vm.months = [];
            vm.isCreateMode = false;
            vm.isEditMode = true;
            vm.data = {};
            vm.originalReference = {};
            vm.targetIndex = -1;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                person.lifeLearnings = person.lifeLearnings || [];
                person.lifeLearnings.push();
                if (vm.isCreateMode) {
                    if (person.id) {
                        vm.data.personId = person.id;
                        personService.createLifeLearning(vm.data)
                            .then(function (result) {
                                person.lifeLearnings.push(vm.data);
                                $uibModalInstance.close();
                            });
                    }
                    else {
                        person.lifeLearnings.push(vm.data);
                        $uibModalInstance.close();
                    }
                }
                else {
                    personService.updateLifeLearning(vm.data)
                        .then(function (result) {                           
                            jQuery.extend(vm.originalReference, vm.data);
                            $uibModalInstance.close();                            
                        });                    
                }
                
                
            };

            vm.load = function () {
                vm.isCreateMode = !id;
                vm.isEditMode = !vm.isCreateMode;

                if (vm.isCreateMode) {
                    vm.data = {};
                } else if (vm.isEditMode && person.lifeLearnings && person.lifeLearnings.length > 0) {
                    // Workaround to update life long learning
                    for (var i = 0; i < person.lifeLearnings.length; i++) {
                        vm.originalReference = person.lifeLearnings[i];
                        var target = jQuery.extend({}, person.lifeLearnings[i]);

                        if (target.id == id) {
                            vm.targetIndex = i;

                            // Workaround for integer option value
                            target.fromMonth = convertToString(target.fromMonth);
                            target.fromYear = convertToString(target.fromYear);
                            target.toMonth = convertToString(target.toMonth);
                            target.toYear = convertToString(target.toYear);

                            vm.data = target;
                            break;
                        }
                    }
                }
            };

            function convertToString(value) {
                return value == null ? '' : value + '';
            }

            vm.init = function () {
                // init year drop down items
                var today = new Date();
                var toYear = today.getFullYear();
                var fromYear = toYear - 110;

                for (var i = toYear; i >= fromYear; i--) {
                    vm.years.push(i);
                }
                vm.months = app.consts.months;

                vm.load();
            };

            vm.init();
        }
    ]);
})();
