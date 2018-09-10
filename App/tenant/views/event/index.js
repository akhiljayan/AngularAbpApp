(function () {
    appModule.component('eventRegistrationIndex', {
        controller: [
            'abp.services.app.membershipBooking', 'abp.services.app.centre', '$timeout',
            function (membershipBookingService, centreService, $timeout) {
                var ctrl = this;
                ctrl.selectAll = undefined;

                ctrl.$onInit = function () {
                    ctrl.centre = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Events.Create')
                    };

                    centreService.getAllCentresLookUpInUserOU(
                    ).then(function (result) {
                        ctrl.centres = result.data;
                        ctrl.selectAllOption();
                    });
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                    ctrl.load();
                };

                ctrl.load = function (requestParams) {
                    ctrl.loading = true;

                    membershipBookingService.getAllEvents($.extend({ filter: ctrl.filter, centreId: ctrl.centre}, requestParams)).then(function (result) {
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.selectCentre = function (centre) {
                    debugger;
                    ctrl.selectAll = undefined;

                    $timeout(function () {
                        centre.isChecked = !centre.isChecked;

                        if (centre.isChecked) {
                            var index = ctrl.centre.indexOf(centre.id);

                            if (index < 0) {
                                ctrl.centre.push(centre.id);
                            }
                        } else {
                            var index = ctrl.centre.indexOf(centre.id);

                            if (index >= 0) {
                                ctrl.centre.splice(index, 1);
                            }
                        }

                        ctrl.load();
                    });

                    event.preventDefault();
                    event.stopPropagation();
                };

                ctrl.selectAllOption = function () {
                    var i;
                    ctrl.selectAll = !ctrl.selectAll;

                    if (ctrl.selectAll){
                        if (ctrl.centre.length == 0) {
                            for (i = 0; i, i < ctrl.centres.length; i++) {
                                ctrl.centre.push(ctrl.centres[i].id);
                                ctrl.centres[i].isChecked = true;
                            }
                        }
                        else {
                            ctrl.centre = [];
                            for (i = 0; i, i < ctrl.centres.length; i++) {
                                ctrl.centre.push(ctrl.centres[i].id);
                                ctrl.centres[i].isChecked = true;
                            }
                        }
                    }
                    else {
                        ctrl.centre = [];
                        for (i = 0; i, i < ctrl.centres.length; i++) {
                            ctrl.centres[i].isChecked = false;
                        }
                    }

                    ctrl.load();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/event/index.cshtml'
    });
})();
