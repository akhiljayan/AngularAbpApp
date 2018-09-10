(function () {
    appModule.component('upcomingbirthdayCard', {
        controller: [
            '$state', '$stateParams', '$sce', '$filter','abp.services.app.person',
            function ($state, $stateParams, $sce, $filter,personService) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.totalCount = 0;
                ctrl.personSize = 4;
                ctrl.seeMore = true;
                ctrl.seeLess = false;

                ctrl.$onInit = function () {
                    ctrl.load();
                }

                ctrl.load = function () {
                    ctrl.loading = true;
                    personService.getUpcomingBirthday().then(function (result) {
                        ctrl.model = result.data;
                        ctrl.totalCount = ctrl.model.length;
                        for (var i = 0; i < ctrl.model.length; i++) {
                            ctrl.model[i].birthdayDayName = $filter('date')(ctrl.model[i].dateOfBirth, 'EEE');
                            preparePersonPopoverContent(ctrl.model[i]);
                        }
                        ctrl.loading = false;
                    });
                }

                function preparePersonPopoverContent(person) {
                    var html = '<span>Like:</span><br/>';
                    html += '<span class="bold">' + (person.likes || '-')+'</span><br/><br/>';
                    html += '<span>Hobbies:</span><br/>';
                    html += '<span class="bold">' + (person.hobbies || '-') +'</span><br/><br/>';
                    html += '<span>What makes him/her happy:</span><br/>';
                    html += '<span class="bold">' + (person.whatMakesHimOrHerHappy || '-') +'</span>';
                    person.popoverContent = $sce.trustAsHtml(html);
                }

                ctrl.loadMore = function () {
                    ctrl.personSize = ctrl.totalCount;
                    ctrl.seeMore = false;
                    if (ctrl.totalCount == ctrl.personSize) {
                        ctrl.seeLess = true;
                    }
                }

                ctrl.showLess = function () {
                    ctrl.personSize = 4;
                    if (ctrl.totalCount != ctrl.personSize) {
                        ctrl.seeMore = true;
                        ctrl.seeLess = false;
                    }
                }

                ctrl.viewPatient = function (id) {
                    $state.go('tenant.personDetail', { id: id });
                }
            }
        ],

        templateUrl: '~/App/tenant/views/dashboard/CareBoard/UpcomingBirthday/upcomingbirthday-card/upcomingbirthday-card.cshtml'
    });
})();