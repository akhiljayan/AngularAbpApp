(function () {
    appModule.component('membershipEdit', {
        controllerAs: 'vm',
        controller: [
            'abp.services.app.membership', '$stateParams', '$state', '$anchorScroll', '$location',
            function (membershipService, $stateParams, $state, $anchorScroll, $location) {
                var ctrl = this;
                ctrl.loading = false;

                ctrl.$onInit = function () {
                    load();
                };

                ctrl.updateMembership = function (event) {
                    abp.ui.setBusy();
                    membershipService.update(
                        event.model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();
                        if (event.back == true) {
                            $state.go('tenant.memberships');
                        } else {
                            $state.go('tenant.membershipsEdit', { membershipId: result.data.id });
                            $state.transitionTo('tenant.membershipsEdit', { membershipId: result.data.id }, {
                                reload: true,
                                inherit: false,
                                notify: true
                            })
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

                ctrl.copyMembership = function (event) {
                    membershipService.clone(
                        event.model
                    ).then(function (result) {
                        event.success && event.success();
                        ctrl.model = result.data;
                        ctrl.workingModel = ctrl.model;
                        ctrl.mode = 'edit';
                        $state.go('tenant.membershipsEdit', { membershipId: result.data.id });
                    });
                };

                ctrl.terminateMembership = function (event) {
                    membershipService.terminate(
                        event.data
                    ).then(function (result) {
                        event.success && event.success();
                        load();
                        ctrl.isTerminate = true;
                    });
                };

                ctrl.load = function () {
                    load();
                };

                function load() {
                    ctrl.loading = true;
                    membershipService.get($stateParams.membershipId).then(function (result) {
                        ctrl.model = result.data;
                        ctrl.person = ctrl.model.person;
                        $stateParams.id = ctrl.model.person.id;
                        ctrl.loading = false;
                    });
                }

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-edit/membership-edit.cshtml'
    });
})();