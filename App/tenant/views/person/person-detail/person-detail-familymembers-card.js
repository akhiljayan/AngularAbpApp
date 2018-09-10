(function () {
    appModule.component('personDetailFamilymembersCard', {
        bindings: {
            isNew: '<',
            personId: '<',
            referralId: '<',
            membershipId: '<',
            lockCard: '<'
        },
        controller: [
            '$scope', '$filter', '$state', 'abp.services.app.familyMember',
            function ($scope, $filter, $state, familyMemberService) {
                var ctrl = this;

                ctrl.load = function () {
                    ctrl.loadData = true;

                    familyMemberService.getFamilyMembersById(
                        $.extend({
                            personId: ctrl.personId,
                            referralId: ctrl.referralId
                        }, ctrl.requestParams)
                    ).then(function (result) {
                        ctrl.resultCount = result.data.totalCount;

                        for (var i = 0; i < result.data.items.length; i++) {
                            var familyMember = result.data.items[i];
                            var person = familyMember.familyMemberPerson;

                            if (person.dateOfBirth) {
                                person.dateOfBirth = moment(person.dateOfBirth).format($scope.DefaultDateFormat);
                            }

                            person.age = $filter("ageFilter")(person.dateOfBirth);

                            ctrl.familyMembers.push(familyMember);
                        }
                    }).finally(function () {
                        ctrl.loadData = false;
                    });
                };

                ctrl.loadMore = function () {
                    incrementPageNumber();
                    ctrl.load();
                };

                ctrl.addFamilyMembers = function () {
                    $state.go('tenant.familyMembersDetailPersonNew', {
                        personId: ctrl.personId,
                        referralId: ctrl.referralId,
                        membershipId: ctrl.membershipId
                    })
                };

                ctrl.editFamily = function (familyID) {
                    $state.go('tenant.familyMembersDetail', {
                        familyId: familyID,
                        personId: ctrl.personId,
                        referralId: ctrl.referralId,
                        membershipId: ctrl.membershipId
                    })
                };

                function incrementPageNumber() {
                    ctrl.pageNumber++;
                    ctrl.requestParams.skipCount = (ctrl.pageNumber - 1) * ctrl.pageSize;
                }

                ctrl.$onInit = function () {
                    ctrl.appPath = abp.appPath;
                    ctrl.familyMembers = [];
                    ctrl.resultCount = 0;
                    ctrl.pageNumber = 1;
                    ctrl.pageSize = 4;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Create')
                    };
                    ctrl.requestParams = {
                        skipCount: 0,
                        maxResultCount: ctrl.pageSize
                    };
                    ctrl.pageNumber = 1;
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId && changes.personId.currentValue) {
                        ctrl.load();
                    } else if (changes.referralId && changes.referralId.currentValue) {
                        ctrl.load();
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/person/person-detail/person-detail-familymembers-card.cshtml'
    });
})();