(function () {
    appModule.controller('tenant.views.irms.personCheck', [
        '$scope', '$uibModalInstance', 'referralRegNo', 'abp.services.app.iRMSReferralConversion',
        function ($scope, $uibModalInstance, referralRegNo, referralConversionService) {
            var vm = this;

            vm.saving = false;
            vm.selectAll = false;
            vm.person = {};

            //Init method
            vm.init = function () {
                vm.setBoolean(false);
            };

            vm.select = function () {
                vm.setBoolean(vm.selectAll);
            };

            vm.setBoolean = function (value) {
                vm.person.gender = value;
                vm.person.dateOfBirth = value;
                vm.person.race = value;
                vm.person.religion = value;
                vm.person.nationality = value;
                vm.person.citizenship = value;
                vm.person.homePhone = value;
                vm.person.mobilePhone = value;
                vm.person.address = value;
                vm.person.liftLanding = value;
                vm.person.livingArrangement = value;
                vm.person.currentLocation = value;
                vm.person.referralDate = value;
                vm.person.submissionDate = value;
                vm.person.admissionDate = value;
                vm.person.dischargedDate = value;
                vm.person.socialBackground = value;
                vm.person.referralRemarks = value;
            };

            vm.proceedToUpdate = function () {

                if (vm.person.gender == true)
                    return true;

                if (vm.person.dateOfBirth == true)
                    return true;

                if (vm.person.race == true)
                    return true;

                if (vm.person.religion == true)
                    return true;

                if (vm.person.nationality == true)
                    return true;

                if (vm.person.citizenship == true)
                    return true;

                if (vm.person.homePhone == true)
                    return true;

                if (vm.person.mobilePhone == true)
                    return true;

                if (vm.person.address == true)
                    return true;

                if (vm.person.liftLanding == true)
                    return true;

                if (vm.person.livingArrangement == true)
                    return true;

                if (vm.person.currentLocation == true)
                    return true;

                if (vm.person.referralDate == true)
                    return true;

                if (vm.person.submissionDate == true)
                    return true;

                if (vm.person.admissionDate == true)
                    return true;

                if (vm.person.dischargedDate == true)
                    return true;

                if (vm.person.socialBackground == true)
                    return true;

                if (vm.person.referralRemarks == true)
                    return true;

                return false;
            };

            vm.getItemChecklist = function () {

                var item = [];

                if (vm.person.gender == true)
                    item.push("Gender");

                if (vm.person.dateOfBirth == true)
                    item.push("Date of Birth");

                if (vm.person.race == true)
                    item.push("Race");

                if (vm.person.religion == true)
                    item.push("Religion");

                if (vm.person.nationality == true)
                    item.push("Nationality");

                if (vm.person.citizenship == true)
                    item.push("Citizenship");

                if (vm.person.homePhone == true)
                    item.push("Home Phone");

                if (vm.person.mobilePhone == true)
                    item.push("Mobile Phone");

                if (vm.person.address == true)
                    item.push("Address");

                if (vm.person.liftLanding == true)
                    item.push("Lift Landing");

                if (vm.person.livingArrangement == true)
                    item.push("Living Arrangement");

                if (vm.person.currentLocation == true)
                    item.push("Current Location");

                if (vm.person.referralDate == true)
                    item.push("Referral Date");

                if (vm.person.submissionDate == true)
                    item.push("Submission Date");

                if (vm.person.admissionDate == true)
                    item.push("Admission Date");

                if (vm.person.dischargedDate == true)
                    item.push("Discharged Date");

                if (vm.person.socialBackground == true)
                    item.push("Social Background");

                if (vm.person.referralRemarks == true)
                    item.push("Referral Remarks");

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
                                    referralConversionService.updateReferralPerson(referralRegNo, vm.person)
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
