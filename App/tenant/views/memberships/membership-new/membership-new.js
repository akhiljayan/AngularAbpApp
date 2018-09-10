(function () {
    appModule.component('membershipNew', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membership', '$stateParams', '$state', '$anchorScroll', '$location',
            function (membershipService, $stateParams, $state, $anchorScroll, $location) {
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
                    load();
                };

                ctrl.createMembership = function (event) {
                    abp.ui.setBusy();
                    membershipService.create(
                        event.model
                    ).then(function (result) {
                        debugger;
                        abp.notify.info(app.localize('SavedSuccessfully'));   
                        event.success && event.success();
                        if (event.back == true) {
                            $state.go('tenant.memberships');
                        } else {
                            $state.go('tenant.membershipsEdit', { membershipId: result.data.id });
                        }
                    }).catch(function (error) {
                        if (error.data) {
                            var errorMsg = abp.localization.localize('CompletedWithNoAgreement');
                            if (error.data.message == errorMsg)
                                ctrl.gotoAnchor("AgreementIndemnity");
                        }
                    }).finally(function (callback) {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;
                    var id = app.consts.EmptyGuid;
                    membershipService.get(id).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.person = ctrl.model.person;
                        $stateParams.id = id;
                        ctrl.loading = false;
                    });
                }

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-new/membership-new.cshtml'
    });
})();