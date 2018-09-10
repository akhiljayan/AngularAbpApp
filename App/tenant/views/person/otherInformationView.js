(function () {
    appModule.controller('tenant.views.person.otherInformationView', [
        '$scope', '$stateParams', 'abp.services.app.person',
        function ($scope, $stateParams, personService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};
            vm.isFamilyMembers = $scope.vm.isFamilyMembers;

            vm.edit = function () {
                vm.mode = 'edit';

                vm.person = _.pick($scope.vm.person, [
                    'highestEducationId', 'lastOccupationId', 'liftLandingId', 'livingArrangementId',
                    'remarks'
                ]);
            };

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function () {
                $scope.$emit('UpdatePerson', vm.person);
                vm.close();
            };

            $scope.$on('PersonUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });

            $scope.$on('familyLoadOtherInfoView', function (event, data) {
                vm.init();
            });

            vm.init = function () {
                $scope.vm.otherInformation = $scope.otherInformation;
                $scope.otherInformation.person = vm.person;

                if (vm.isFamilyMembers && vm.mode == "edit") {
                    vm.edit();
                }
            }

            vm.init();
        }
    ]);
})();