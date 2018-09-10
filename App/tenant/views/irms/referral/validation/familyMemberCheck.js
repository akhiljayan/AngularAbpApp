(function () {
    appModule.controller('tenant.views.irms.familyMemberCheck', [
        '$scope', '$uibModalInstance', 'referralRegNo', 'abp.services.app.iRMSReferralConversion',
        function ($scope, $uibModalInstance, referralRegNo, referralConversionService) {
            var vm = this;

            vm.saving = false;
            vm.selectAll = false;
            vm.familyMember = {};

            //Init method
            vm.init = function () {
                vm.setBoolean(false);
            };

            vm.select = function () {
                vm.setBoolean(vm.selectAll);
            };

            vm.setBoolean = function (value) {
                vm.familyMember.homePhone = value;
                vm.familyMember.mobilePhone = value;
                vm.familyMember.officePhone = value;
                vm.familyMember.email = value;
                vm.familyMember.address = value;
                vm.familyMember.relationship = value;
                vm.familyMember.isCarer = value;
                vm.familyMember.isDecisionMaker = value;
            };

            vm.proceedToUpdate = function () {

                if (vm.familyMember.homePhone == true)
                    return true;

                if (vm.familyMember.mobilePhone == true)
                    return true;

                if (vm.familyMember.officePhone == true)
                    return true;

                if (vm.familyMember.email == true)
                    return true;

                if (vm.familyMember.address == true)
                    return true;

                if (vm.familyMember.relationship == true)
                    return true;

                if (vm.familyMember.isCarer == true)
                    return true;

                if (vm.familyMember.isDecisionMaker == true)
                    return true;

                return false;
            };

            vm.getItemChecklist = function () {

                var item = [];

                if (vm.familyMember.homePhone == true)
                    item.push("Home Phone");

                if (vm.familyMember.mobilePhone == true)
                    item.push("Mobile Phone");

                if (vm.familyMember.officePhone == true)
                    item.push("Office Phone");

                if (vm.familyMember.email == true)
                    item.push("Email");

                if (vm.familyMember.address == true)
                    item.push("Address");

                if (vm.familyMember.relationship == true)
                    item.push("Relationship");

                if (vm.familyMember.isCarer == true)
                    item.push("Is Caregiver");

                if (vm.familyMember.isDecisionMaker == true)
                    item.push("Is Decision Maker");

                return item;
            };

            vm.proceed = function () {

                // Added half second of delay waiting time to fix the first-time clicking issue while subsequent clicking is working
                setTimeout(function () {

                    if (vm.proceedToUpdate() == true) {

                        abp.message.confirm("",
                            app.localize('ConversionDuplicateConfirmation', vm.getItemChecklist().join(', ')),
                            function (isConfirmed) {
                                if (isConfirmed) {

                                    vm.saving = true;
                                    referralConversionService.updateReferralFamilyMember(referralRegNo, vm.familyMember)
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
