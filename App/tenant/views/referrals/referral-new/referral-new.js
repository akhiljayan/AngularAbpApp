(function () {
    appModule.component('referralNew', {
        controller: [
            '$state', 'abp.services.app.referral',
            function ($state, referralService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.model = {};

                    ctrl.defaults();
                };

                ctrl.defaults = function () {
                    abp.ui.setBusy();
                    referralService.get(app.consts.EmptyGuid).then(function (result) {
                        ctrl.model = result.data;
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.createReferral = function (event) {
                    abp.ui.setBusy();

                    referralService.create(
                        event.model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();

                        $state.go('tenant.referralEdit', { id: result.data.id });
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/referrals/referral-new/referral-new.cshtml'
    });
})();