(function () {
    appModule.controller('tenant.views.familyMembers.generalView', [
        '$scope', '$stateParams', 'abp.services.app.person',
        function ($scope, $stateParams, personService) {
            var vm = this;
            vm.familyMember = {};
            vm.mode = $scope.vm.mode;
            vm.isFamilyMembers = $scope.vm.isFamilyMembers;

            vm.edit = function () {
                vm.mode = 'edit';

                vm.familyMember = _.pick($scope.vm.familyMember, [
                    'personId', 'familyMemberPersonId', 'relationshipId', 'isLegalNextOfKin', 'referralId'
                ]);


            };

            vm.init = function () {
                $scope.vm.generalData = $scope.generalData;
                $scope.generalData.familyMember = vm.familyMember;

                /*
                vm.familyMember = _.pick($scope.vm.familyMember, [
                    'personId', 'familyMemberPersonId', 'relationshipId', 'isLegalNextOfKin'
                ]);
                */

                if (vm.isFamilyMembers && vm.mode == "edit") {
                    vm.edit();
                }
            }


        


            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function () {
                $scope.$emit('UpdateFamilyMember', vm.familyMember);
            };

            $scope.$on('FamilyMemberUpdated', function (event, data) {
                if (data.event.targetScope == $scope) {
                    if (data.success) {
                        vm.close();
                    }
                }
            });

            vm.onSelect = function (item, model) {
                //if (model) {
                $scope.$emit('FamilyMemberChanged', { selectedId: model });
                //}
            };

            $scope.$on('familyLoadGeneralView', function (event, data) {
                vm.init();
            });

            vm.init();
        }
    ]);
})();