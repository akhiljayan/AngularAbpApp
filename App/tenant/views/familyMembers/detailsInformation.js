(function () {
    appModule.controller('tenant.views.familyMembers.detailsInformation', [
        '$scope', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', '$stateParams', 'abp.services.app.person',
        function ($scope, masterData, masterLookup, $stateParams, personService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.familyMember = {};
            vm.isFamilyMembers = $scope.vm.isFamilyMembers;

            vm.edit = function () {
                vm.mode = 'edit';

                vm.familyMember = _.pick($scope.vm.familyMember, [
                    'typeOfEmergencyContactPersonId', 'typeOfFinancialContactPersonId', 'isDecisionMaker', 'isSubstituteDecisionMaker',
                    'isDeputy', 'isContactForHospitalisation', 'isContactForFuneralArrangement', 'isContactForDeath',
                    'isAuthorisedToPickupPerson', 'isCaregiver', 'isStayWithPerson', 'isCaregiverTrained', 'isCaregiverTrainingRequired',
                    'isCaregiverCompetent', 'caregiverTrainedOn', 'caregiverTrainedById', 'caregiverTrainingProviderId',
                    'otherCaregiverTrainingProvider', "caregiverFromDate", "caregiverToDate"
                ]);
            };

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function () {
                $scope.$emit('UpdateFamilyMember', vm.familyMember);
            };

            $scope.$on('familyLoadDetailsinfoView', function (event, data) {
                vm.init();
            });

            $scope.$on('FamilyMemberUpdated', function (event, data) {
                if (data.event.targetScope == $scope) {
                    if (data.success) {
                        vm.close();
                    }
                }
            });

            vm.preventEvent = function (flag, $event) {
                if (flag) {
                    $event.stopPropagation();
                }
            }

            vm.init = function () {
                $scope.vm.detailsInfo = $scope.detailsInfo;
                $scope.detailsInfo.familyMember = vm.familyMember;

                if (vm.isFamilyMembers && vm.mode == "edit") {
                    vm.edit();
                }
            }

            vm.init();           
            
        }
    ]);
})();