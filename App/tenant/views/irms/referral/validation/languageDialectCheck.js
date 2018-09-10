(function () {
    appModule.controller('tenant.views.irms.languageDialectCheck', [
        '$scope', '$uibModalInstance', 'referralRegNo', 'abp.services.app.iRMSReferralConversion',
        function ($scope, $uibModalInstance, referralRegNo, referralConversionService) {
            var vm = this;

            vm.saving = false;
            vm.languageDialect = false;

            //Init method
            vm.init = function () {
                vm.languageDialect = false;
            };


            vm.proceed = function () {

                // Added half second of delay waiting time to fix the first-time clicking issue while subsequent clicking is working
                setTimeout(function () {

                    if (vm.languageDialect == true) {

                        abp.message.confirm("",
                            app.localize('ConversionDuplicateConfirmation', 'Language and Dialect'),
                            function (isConfirmed) {
                                if (isConfirmed) {

                                    vm.saving = true;
                                    referralConversionService.updateReferralLanguageDialect(referralRegNo)
                                        .then(function (result) {
                                            $uibModalInstance.close();
                                        });
                                }
                            }
                        );
                    }
                    else
                    {
                        abp.message.confirm("",
                            app.localize('ConversionNoDuplicateConfirmation'),
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    $uibModalInstance.close();
                                }
                            }
                        );
                    }

                }, 500);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.init();
        }
    ]);
})();
