(function () {
    appModule.component('visitlogNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.visitLog', '$stateParams',
            function (visitLogService, $stateParams) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    /*
                        Set seconds and milliseconds to 0 for resolve visit date time overlap issue
                        By default abp.clock.now() will generate seconds and milliseconds
                        and select from date time picker, the seconds and milliseconds will default to 0
                    */
                    var currentDateTime = abp.clock.now();
                    currentDateTime.setSeconds(0, 0);

                    ctrl.mode = 'new';
                    ctrl.model = {
                        personId: $stateParams.person,
                        admissionId: $stateParams.admission,
                        visitDateTimeIn: currentDateTime,
                        visitDateTimeOut: currentDateTime,
                        contactType: "HomeVisit",
                        attendedByUserId: abp.session.userId,
                        isFutile: false,
                    };
                };

                ctrl.createVisitLog = function (event) {
                    ctrl.model.renderedServices = [];

                    if (ctrl.model.categories) {
                        for (var i = 0; i < ctrl.model.categories.length; i++) {
                            var category = ctrl.model.categories[i];

                            for (var x = 0; x < category.visitServices.length; x++) {
                                if (category.visitServices[x].isChecked) {
                                    ctrl.model.renderedServices.push(category.visitServices[x]);
                                }
                            }
                        }
                    }

                    visitLogService.createVisitLog(
                        ctrl.model
                    ).then(function (result) {
                        event.success && event.success(result.data);
                    }).finally(function (result) {
                        event.final && event.final();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog-new/visitlog-new.cshtml'
    });
})();