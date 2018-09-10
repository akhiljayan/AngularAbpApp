(function () {
    appModule.controller('tenant.views.irms.serviceApplicationView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.serviceApplicationList = {
                "currentLocationOfPatient": "-",
                "homeAddress": "-",
                "homeTelephone": "-",
                "institution": "-",
                "othersInstitutionValue": "-",
                "briefSocialHistory": "-",
                "hospitalExpectedDischargeDate": "-",
                "isPatientKnownToOtherCommunity": "-",
                "otherCommunityService": "-",
                "patientRequiresFollowUpAtOPDSpecialistClinicMR": "-",
                "otherRemarks": "-",
            };
            vm.servicePreferencesList = {
                "diet": "-",
                "othersDiet": "-",
                "location": "-",
                "yesLocationSpecifyValue": "-",
                "preferredServiceProvider": "-",
                "applicantFees": "-",
                "relegion": "-",
                "otherReligion": "-",
                "duration": "-",
                "otherDuration": "-",
                "dayCareFrequency": "-",
                "dayCareTransportRequired": "-",
                "dayCareStairCrawlRequired": "-",
                "dayCareEscortRequired": "-",
            };

            vm.referralServiceTypeList = {
                "referralServiceType": "-",
            };
            vm.referralAssignmentInfoList = [];

            vm.personInChargeList = {
                "personinChargeName": "-",
                "personinChargeDesignation": "-",
                "personinChargeContactNo": "-",
                "personinChargeEmail": "-",
            };
            vm.knowntoMSW_CM_CCList = {
                "isPatientKnownTo": "-",
                "name": "-",
                "designation": "-",
                "telephone": "-",
                "fax": "-",
                "handPhone": "-",
                "email": "-",
            };
            vm.therapistDetailsList = [];
            vm.patientTCUList = [];
            vm.homeCareMedicalServiceList = [];
            vm.homeCareNursingServiceList = [];
            vm.homeCareTherapyServiceList = [];
            vm.reasonForNHRespiteCareList = [];
            vm.seniorHomeCareEnsuiteList = {
                "seniorHomeCareService": "-"
            };
            vm.seniorHomeCareMealsOrEscortList = {
                "seniorHomeCareService": "-"
            };
            vm.reasonForCBNSList = [];
            vm.hospiceReferralServiceList = {
                "hospiceServiceProvider": "-",
                "hospiceHospital": "-",
                "hospiceConsultant": "-",
                "hospiceOtherConsultant": "-",
                "isPatientHospiceService": "-",
                "isHospicePalliativeCareTeam": "-",
                "othersHospiceCare": "-",
                "isHospicePatientInform": "-",
                "copdChecked": "-",
                "copDforName": "-",
                "copDforDesignation": "-",
                "copDforPhone": "-",
                "copDforEmail": "-",
                "isProjectDiginity": "-"
            };
            vm.reasonForHospiceReferralList = [];
            vm.informedOfDiagnosisList = {
                "informedOfDiagnosis": "-"
            };
            vm.informedOfPrognosisList = {
                "informedOfPrognosis": "-"
            };
            vm.reasonForProjectDignityList = [];
            vm.chReferralServiceList = {
                "assignToCH": "-",
                "typeofWardCH": "-",
                "chkApplicantCH": "-",
                "chcscCardHolder": "-",
                "chIndustrialAccident": "-",
                "chPoliceCase": "-",
                "specifyPoliceCase": "-",
                "chkCOPDCH": "-",
                "copDforNameCH": "-",
                "copDforDesignationCH": "-",
                "copDforPhoneCH": "-",
                "copDforEmailCH": "-"
            };
            vm.reasonForCHReferralList = [];
            vm.subAcuteReasonListList = [];
            vm.admittedCHThisCalenderYearList = [];
            vm.typeOfWardCHList = [];
            vm.financialInformationList = {
                "iltcTestCompleted": "-",
                "noILTCTestCompleted": "-",
                "paRefNo": "-",
                "mfecNo": "-",
            };

            parent.vm.setServiceApplicationNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'ReferralServiceType', displayName: app.localize('ReferralServiceType'), permission: true },
                    { key: 'ReferralAssignmentServiceProvider', displayName: app.localize('ReferralAssignmentServiceProvider'), permission: true },
                    { key: 'ServicePreferences', displayName: app.localize('ServicePreferences'), permission: true },
                    { key: 'PatientCurrentLocation', displayName: app.localize('PatientCurrentLocation'), permission: true },
                    { key: 'DischargePlanning', displayName: app.localize('DischargePlanning'), permission: true },
                    { key: 'PersonInCharge', displayName: app.localize('PersonInCharge'), permission: true },
                    { key: 'KnownToMSW_CM_CC', displayName: app.localize('KnownToMSW_CM_CC'), permission: true },
                    { key: 'TherapistDetails', displayName: app.localize('TherapistDetails'), permission: true },
                    { key: 'PatientTCU', displayName: app.localize('PatientTCU'), permission: true },
                    { key: 'FinancialInformation', displayName: app.localize('FinancialInformation'), permission: true },
                    { key: 'OtherRemarks', displayName: app.localize('OtherRemarks'), permission: true },
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.serviceApplicationList &&
                    vm.referral.serviceApplicationList.length > 0) {
                    vm.serviceApplicationList = vm.referral.serviceApplicationList[0];

                    vm.serviceApplicationList.homeAddress = vm.constructAddress(
                        vm.serviceApplicationList.homeBlock,
                        vm.serviceApplicationList.homeLevel,
                        vm.serviceApplicationList.homeUnit,
                        vm.serviceApplicationList.homeStreet,
                        "",
                        vm.serviceApplicationList.homePostalCode);
                }

                if (vm.referral.servicePreferencesList &&
                    vm.referral.servicePreferencesList.length > 0) {
                    vm.servicePreferencesList = vm.referral.servicePreferencesList[0];
                }

                if (vm.referral.referralServiceTypeList &&
                    vm.referral.referralServiceTypeList.length > 0) {
                    vm.referralServiceTypeList = vm.referral.referralServiceTypeList[0];
                }

                vm.referralAssignmentInfoList = vm.referral.referralAssignmentInfoList;

                if (vm.referral.personInChargeList &&
                    vm.referral.personInChargeList.length > 0) {
                    vm.personInChargeList = vm.referral.personInChargeList[0];
                }

                if (vm.referral.knowntoMSW_CM_CCList &&
                    vm.referral.knowntoMSW_CM_CCList.length > 0) {
                    vm.knowntoMSW_CM_CCList = vm.referral.knowntoMSW_CM_CCList[0];
                }

                vm.therapistDetailsList = vm.referral.therapistDetailsList;
                vm.patientTCUList = vm.referral.patientTCUList;

                vm.homeCareMedicalServiceList = vm.referral.homeCareMedicalServiceList;
                vm.homeCareNursingServiceList = vm.referral.homeCareNursingServiceList;
                vm.homeCareTherapyServiceList = vm.referral.homeCareTherapyServiceList;

                vm.reasonForNHRespiteCareList = vm.referral.reasonForNHRespiteCareList;

                if (vm.referral.seniorHomeCareEnsuiteList &&
                    vm.referral.seniorHomeCareEnsuiteList.length > 0) {
                    vm.seniorHomeCareEnsuiteList = vm.referral.seniorHomeCareEnsuiteList[0];
                }

                if (vm.referral.seniorHomeCareMealsOrEscortList &&
                    vm.referral.seniorHomeCareMealsOrEscortList.length > 0) {
                    vm.seniorHomeCareMealsOrEscortList = vm.referral.seniorHomeCareMealsOrEscortList[0];
                }

                vm.reasonForCBNSList = vm.referral.reasonForCBNSList;

                if (vm.referral.hospiceReferralServiceList &&
                    vm.referral.hospiceReferralServiceList.length > 0) {
                    vm.hospiceReferralServiceList = vm.referral.hospiceReferralServiceList[0];
                }
                
                vm.reasonForHospiceReferralList = vm.referral.reasonForHospiceReferralList;

                if (vm.referral.informedOfDiagnosisList &&
                    vm.referral.informedOfDiagnosisList.length > 0) {
                    vm.informedOfDiagnosisList = vm.referral.informedOfDiagnosisList[0];
                }

                if (vm.referral.informedOfPrognosisList &&
                    vm.referral.informedOfPrognosisList.length > 0) {
                    vm.informedOfPrognosisList = vm.referral.informedOfPrognosisList[0];
                }

                vm.reasonForProjectDignityList = vm.referral.reasonForProjectDignityList;

                if (vm.referral.chReferralServiceList &&
                    vm.referral.chReferralServiceList.length > 0) {
                    vm.chReferralServiceList = vm.referral.chReferralServiceList[0];
                }

                vm.reasonForCHReferralList = vm.referral.reasonForCHReferralList;
                vm.subAcuteReasonListList = vm.referral.subAcuteReasonListList;
                vm.admittedCHThisCalenderYearList = vm.referral.admittedCHThisCalenderYearList;
                vm.typeOfWardCHList = vm.referral.typeOfWardCHList;

                if (vm.referral.financialInformationList &&
                    vm.referral.financialInformationList.length > 0) {
                    vm.financialInformationList = vm.referral.financialInformationList[0];
                }
                
                vm.loading = false;
            });

            vm.constructAddress = function (block, level, unit, street1, street2, postalCode) {

                var address = "";

                if (block) {
                    address = "BLK " + block;
                }

                if (street1) {

                    if (address) {
                        address = address + " " + street1;
                    } else {
                        address = street1;
                    }
                }

                if (street2) {

                    if (address) {
                        address = address + ", " + street2;
                    } else {
                        address = street2;
                    }
                }

                if (level) {
                    address = address + " #" + level;
                }

                if (unit) {
                    address = address + "-" + unit;
                }


                if (postalCode) {

                    if (address) {
                        address = address + ", Singapore " + postalCode;
                    } else {
                        address = "Singapore " + postalCode;
                    }
                }

                return address;
            }

            vm.init = function () {
                parent.vm.setServiceApplicationNavigation();
            };

            vm.init();
        }
    ]);
})();