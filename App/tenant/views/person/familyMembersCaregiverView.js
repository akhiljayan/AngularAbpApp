(function () {
    appModule.controller('tenant.views.person.familyMembersCaregiverView', [
        '$scope','$state', '$stateParams', '$filter', '$location', 'abp.services.app.familyMember',
        function ($scope,$state, $stateParams, $filter, $location, familyMemberService) {
            var vm = this;
            vm.appPath = abp.appPath;
            vm.familyMembers = [];
            vm.resultCount = 0;
            vm.pageNumber = 1;
            vm.pageSize = 4;

            var requestParams = {
                skipCount: 0,
                maxResultCount: vm.pageSize
            };

            vm.load = function () {
                vm.loadData = true;
                familyMemberService.getFamilyMembersByPersonId(
                    $.extend({ personId: $stateParams.id }, requestParams)
                ).then(function (result) {
                    vm.resultCount = result.data.totalCount;

                    for (var i = 0; i < result.data.items.length; i++) {
                        var familyMember = result.data.items[i];
                        var person = familyMember.familyMemberPerson;

                        if (person.dateOfBirth) {
                            person.dateOfBirth = moment(person.dateOfBirth).format($scope.DefaultDateFormat);
                        }

                        person.age = $filter("ageFilter")(person.dateOfBirth);

                        vm.familyMembers.push(familyMember);
                    }
                    vm.loadData = true;
                });
            }

            vm.loadMore = function () {
                incrementPageNumber();
                vm.load();
            };

            vm.addFamilyMembers = function () {
                var path = "/tenant/familyMembers//" + ($scope.vm.person.id);
                $location.path(path);
            };

            vm.editFamily = function (familyID) {
               // var path = "/tenant/familyMembers/" + familyID + "/" + ($scope.vm.person.id);
                $state.go('tenant.familyMembersDetail', { familyId: familyID, personId : $scope.vm.person.id});
                
            };

            function incrementPageNumber() {
                vm.pageNumber++;
                requestParams.skipCount = (vm.pageNumber - 1) * vm.pageSize;
            }

            function init() {
                vm.pageNumber = 1;
                vm.load();
            }

            init();
        }
    ]);
})();