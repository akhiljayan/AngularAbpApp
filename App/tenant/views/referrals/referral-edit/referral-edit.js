(function () {
    appModule.component('referralEdit', {
        controller: [
            '$state', '$stateParams', 'abp.services.app.referral',
            function ($state, $stateParams, referralService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.model = {
                        id: $stateParams.id
                    };

                    ctrl.load($stateParams.id);
                };

                ctrl.load = function (id) {
                    if (!id) {
                        return;
                    }

                    abp.ui.setBusy();

                    referralService.get(id).then(function (result) {
                        ctrl.model = result.data;
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

                ctrl.updateReferral = function (event) {
                    abp.ui.setBusy();

                    referralService.update(
                        event.model
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        event.success && event.success();

                        ctrl.load(ctrl.model.id);
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
                };

            }
        ],
        templateUrl: '~/App/tenant/views/referrals/referral-edit/referral-edit.cshtml'
    });
})();