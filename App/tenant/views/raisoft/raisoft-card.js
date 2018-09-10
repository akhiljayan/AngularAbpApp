(function () {
    appModule.component('raisoftCard', {
        bindings: {
            maintitle: '<',
            personId: '<',
            mode: '<',
            isPatient: '<'
        },
        controller: [
            'abp.services.app.raisoft', '$state', '$uibModal', '$filter',
            function (raisoftService, $state, $uibModal, $filter) {
                var ctrl = this;
                ctrl.raisoftPerson = [];
                ctrl.scales = [];
                ctrl.caps = [];
                ctrl.rug = [];
                ctrl.permissions = {};
                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.raisoft = "";
                    ctrl.permissions = {
                        GoToRaisoft: abp.auth.hasPermission('Pages.Tenant.Raisoft.GoToRaisoft')
                    };
                    ctrl.enabledActionBtn = abp.auth.hasPermission('Pages.Tenant.Raisoft.GoToRaisoft');
                    ctrl.rugopen = false;
                    ctrl.capsopen = false;
                    ctrl.scalesopen = false;
                };


                ctrl.$onChanges = function (changes) {
                    if (!ctrl.personId || !ctrl.isPatient) {
                        return;
                    }
                    ctrl.load();
                };

                ctrl.action = [];
               

                ctrl.load = function () {
                    getPerson();
                    ctrl.action.push(
                        {
                            action: "GoToRaisoft",
                            showBtn: abp.auth.hasPermission('Pages.Tenant.Raisoft.GoToRaisoft')
                        }
                    );
                };

                function getPerson() {
                    ctrl.loading = true;
                    raisoftService.getPerson(ctrl.personId).then(function (result) {
                        //debugger;
                        ctrl.raisoftPerson = result.data;
                        ctrl.scales = result.data.assessment.scales;
                        ctrl.caps = result.data.assessment.caps;
                        ctrl.rug = result.data.assessment.rug;
                        if (result.data.isCaseCreated) { ctrl.raisoft = "true";}
                        //console.log(result.data.assessment.scales);
                        ctrl.data = result.data;

                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

              

                ctrl.calculatePercent = function (minValue, maxValue, value) {
                    var returnPercentage = '';
                    if (value != '' && value != null && typeof value != 'undefined') {
                        var perc = ((value - minValue) * 100) / (maxValue - minValue);
                        if (perc >= 1) {
                            returnPercentage = perc + "%";
                        } else if (perc <= 0) {
                            returnPercentage = 'negative';
                        } else if (perc > 100) {
                            returnPercentage = 'maximum';
                        }
                    } else {
                        returnPercentage = 'empty';
                    }
                    return returnPercentage;
                };

                ctrl.handleAction = function (action) {      
                    debugger;
                    if (ctrl.raisoftPerson == null)
                    {                       
                        abp.message.error(abp.localization.localize('RaisoftFailedToLoad'));
                        return;
                    }

                    if (ctrl.raisoftPerson.isCaseCreated) {
                        ctrl.loading = true;
                        raisoftService.contextSwitchToRaisoft(ctrl.personId).then(function (result) {
                           // debugger;
                            var html = result.data;
                            //console.log(html);
                            var wnd = window.open("about:blank", "");
                            wnd.document.write(html);
                            wnd.document.close();
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                        
                    } else {
                        abp.message.confirm(
                            'Please click Ok to continue',
                            'System will create a new Person/Case in Raisoft. Do you wish to proceed?',
                            function (isConfirmed) {

                                if (isConfirmed) {
                                    ctrl.loading = true;
                                    raisoftService.createPersonCase(ctrl.personId).then(function (result) {
                                        if (result.data == true) {
                                            ctrl.raisoftPerson.isCaseCreated = true;
                                            raisoftService.contextSwitchToRaisoft(ctrl.personId).then(function (result) {
                                                //debugger;
                                                var html = result.data;
                                                //console.log(html);
                                                var wnd = window.open("about:blank", "");
                                                wnd.document.write(html);
                                                wnd.document.close();
                                            }).finally(function () {
                                                ctrl.loading = false;
                                            });

                                        }
                                    });
                                }
                            });
                    }

                };

                ctrl.L = function (localizedName) {
                    return abp.localization.localize(localizedName);
                };
            }
        ],
        templateUrl: '~/App/tenant/views/raisoft/raisoft-card.cshtml'
    });
})();