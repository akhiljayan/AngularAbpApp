(function () {
    appModule.controller('tenant.views.person.personTag', [
        '$scope',
        function ($scope) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};

            vm.edit = function () {
                vm.mode = 'edit';

                vm.person = _.pick($scope.vm.person, [
                    'tags'
                ]);
            };

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function () {
                $scope.$emit('UpdatePerson', vm.person);
            };

            vm.cancel = function () {
                vm.mode = 'view';
            };

            vm.init = function () {
                $scope.vm.personTagCtrl = $scope.personTagCtrl;
                $scope.personTagCtrl.person = vm.person;
            }

            vm.init();

            $scope.$on('PersonUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });
        }
    ]);
})();