(function () {
    appModule.component('referralDetail', {
        bindings: {
            model: '<',
            onCreate: '&',
            onUpdate: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$rootScope', '$state', '$stateParams', 'abp.services.app.postalAdressAutoPopulate', '$anchorScroll', '$location', 'abp.services.app.referral',
            function ($rootScope, $state, $stateParams, poAddressService, $anchorScroll, $location, referralService) {
                var ctrl = this;
                ctrl.isPinned = false;

                ctrl.$onInit = function () {
                    updateRecordStatus();
                    ctrl.appPath = abp.appPath;
                    ctrl.mode = ctrl.isNewReferral ? 'edit' : '';
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Referral.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Referral.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Referral.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Referral.Delete'),
                        activate: abp.auth.hasPermission('Pages.Tenant.Referral.Activate'),
                        deActivate: abp.auth.hasPermission('Pages.Tenant.Referral.DeActivate')
                    };
                    ctrl.setReferralDetailsNavigation();
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.model = angular.copy(ctrl.model);
                        updateRecordStatus();

                        if (ctrl.model.isPatient) {
                            ctrl.activeTab = 'care';
                        } else {
                        }
                    }
                };

                ctrl.save = function () {
                    ctrl.form.submitted = true;
                    if (ctrl.form.$invalid) {
                        return;
                    }

                    if (ctrl.isNewReferral) {
                        ctrl.onCreate({
                            $event: {
                                model: ctrl.model,
                                success: function () {
                                    //setPristine();
                                }
                            }
                        });
                    } else {
                        ctrl.onUpdate({
                            $event: {
                                model: ctrl.model,
                                success: function () {
                                    ctrl.mode = '';
                                    //setPristine();
                                }
                            }
                        });
                    }
                };


                function updateRecordStatus() {
                    ctrl.isNewReferral = !ctrl.model.id || ctrl.model.id == app.consts.EmptyGuid;
                }


                function setPristine() {
                    /*
                        Add this statement to not show popout dialog
                        Your changes have not been saved. Leave anyway?
                        when click Save with all mandatory fields are filled
                    */

                    if (ctrl.form.$valid) {
                        ctrl.form.$setPristine();
                    }
                }

                ctrl.setReferralDetailsNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'BioData', displayName: 'Bio Data', permission: true },
                        { key: 'ContactInformation', displayName: 'Contact Information', permission: true },
                        { key: 'OtherInformation', displayName: 'Other Information', permission: true },
                        { key: 'TrigeInfo', displayName: 'Triage Information', permission: true },
                        { key: 'General', displayName: 'General', permission: true },
                        { key: 'ReferralServiceType', displayName: 'Referral Service Type', permission: true },
                        { key: 'ReferralInformation', displayName: 'Referral Information', permission: true },
                    ];
                };

                ctrl.setSocialNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'SocialBackground', displayName: 'Social Background', permission: true },
                        { key: 'FamilyMember', displayName: 'Family Member/Caregivers', permission: true},
                        { key: 'SocialReport', displayName: 'Social Report', permission: true }
                    ];
                };

                ctrl.setMedicalNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'FunctionalStatus', displayName: 'Functional Status', permission: true},
                        { key: 'RAF', displayName: 'RAF', permission: true },
                        { key: 'Allergies', displayName: 'Allergies', permission: abp.auth.hasPermission('Pages.Tenant.Allergies.View') },
                        { key: 'medicalhistories', displayName: 'Medical History', permission: true },
                        { key: 'medicationhistories', displayName: 'Medication History', permission: true},
                        { key: 'specialcares', displayName: 'Special Care', permission: true }
                    ];
                };

                ctrl.setFinancialNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'MeansTesting', displayName: 'Means Testing', permission: true},
                        { key: 'FinancialAssistance', displayName: 'Financial Assistance', permission: true }
                    ];
                };

                ctrl.setAttachmentNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'Document', displayName: 'Document', permission: true }
                    ];

                    $rootScope.$broadcast('refresh-document-ui-grid');
                };

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.close = function () {
                    $rootScope.close();
                };

                //ctrl.getMasterData = function (id) {
                //    masterData.getMasterDataTypeItemDescriptionById(id).then(function (result) {
                //        return result.data;
                //    });
                //};

                //ctrl.getMasterLookupData = function (id) {
                //    masterLookup.getMasterTypeItemValue(id).then(function (result) {
                //        return result.data;
                //    });
                //};

                //Check if Register document number already exists
                ctrl.checkExistingRegisterDocument = function () {
                    if (ctrl.isNewReferral) {
                        var regDocId = ctrl.model.person.registrationDocumentTypeId;
                        var regDocNum = ctrl.model.person.registrationDocumentNumber;
                        if ((typeof ctrl.model.person.registrationDocumentTypeId != 'undefined') && (typeof ctrl.model.person.registrationDocumentNumber != 'undefined') && (ctrl.model.person.registrationDocumentTypeId != '') && (ctrl.model.person.registrationDocumentNumber != '')) {
                            referralService.checkNricAndGetExistingReferralInfo(
                                { registrationDocumentTypeId: ctrl.model.person.registrationDocumentTypeId, registrationDocumentNumber: ctrl.model.person.registrationDocumentNumber }
                            ).then(function (result) {
                                if (result.data != null) {
                                    var person = result.data.person;
                                    ctrl.model.person = person;
                                }
                            });
                        }
                    } else {
                        return;
                    }
                };

            }
        ],
        templateUrl: '~/App/tenant/views/referrals/referral-detail/referral-detail.cshtml'
    });
})();