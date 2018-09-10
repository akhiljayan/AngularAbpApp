(function () {
    appModule.component('personDetail', {
        bindings: {
            model: '<',
            onCreate: '&',
            onUpdate: '&',
            onDelete: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$rootScope', '$state', '$stateParams', 'abp.services.app.postalAdressAutoPopulate', '$anchorScroll', '$location', 'abp.services.app.person',
            function ($rootScope, $state, $stateParams, poAddressService, $anchorScroll, $location, personService) {
                var ctrl = this;
                ctrl.isPinned = false;

                ctrl.$onInit = function () {
                    updateRecordStatus();
                    ctrl.appPath = abp.appPath;
                    ctrl.mode = ctrl.isNewPerson ? 'edit' : '';
                    ctrl.permissions = {
                        createPerson: abp.auth.hasPermission('Pages.Tenant.Person.Create'),
                        editPerson: abp.auth.hasPermission('Pages.Tenant.Person.Edit'),
                        viewPerson: abp.auth.hasPermission('Pages.Tenant.Person.View'),
                        deletePerson: abp.auth.hasPermission('Pages.Tenant.Person.Delete'),
                        createFamilyMember: abp.auth.hasPermission('Pages.Tenant.FamilyMembers.Create')
                    };
                    ctrl.setPersonDetailsNavigation();
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

                    if (ctrl.isNewPerson) {
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

                ctrl.deletePerson = function () {
                    if (!ctrl.permissions.deletePerson) {
                        return;
                    }

                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onDelete({
                                    $event: {
                                        id: ctrl.model.id
                                    }
                                });
                            }
                        }
                    );
                };

                ctrl.getAddress = function (address) {
                    var postalCode = event.target.value;
                    var isNumber = /^\d+$/.test(postalCode);

                    if (postalCode.length == 6 && isNumber) {
                        poAddressService.getAddress(
                            postalCode
                        ).then(function (result) {
                            var addressResult = result.data;

                            //showHideErrorForPostalCode(addressResult == null, event.target);

                            if (addressResult == null) {
                                addressResult = {};
                            }

                            address.blockNo = addressResult.blockNo;
                            address.streetName = addressResult.streetName;
                            address.bulidingName = addressResult.buildingName;
                        });
                    } else if (postalCode.length == 0) {
                        address.blockNo = null;
                        address.streetName = null;
                        address.bulidingName = null;

                        //showHideErrorForPostalCode(false, event.target);
                    }

                    if (!isNumber && postalCode.length == 6) {
                        //showHideErrorForPostalCode(true, event.target);
                    }
                };

                ctrl.copyAddress = function (srcAddress, dstAddress, resetAddress) {
                    if (srcAddress != null && dstAddress.isSameAsNricAddress) {
                        dstAddress.postalCode = srcAddress.postalCode;
                        dstAddress.blockNo = srcAddress.blockNo;
                        dstAddress.streetName = srcAddress.streetName;
                        dstAddress.bulidingName = srcAddress.bulidingName;
                        dstAddress.unitNo = srcAddress.unitNo;
                        dstAddress.countryId = srcAddress.countryId;

                        if (dstAddress.hasOwnProperty('ownershipId')) {
                            dstAddress.ownershipId = srcAddress.ownershipId;
                        }

                        if (dstAddress.hasOwnProperty('typeOfAccommodationId')) {
                            dstAddress.typeOfAccommodationId = srcAddress.typeOfAccommodationId;
                        }
                    } else {
                        if (resetAddress) {
                            dstAddress.postalCode = null;
                            dstAddress.blockNo = null;
                            dstAddress.streetName = null;
                            dstAddress.bulidingName = null;
                            dstAddress.unitNo = null;
                            dstAddress.countryId = null;

                            if (dstAddress.hasOwnProperty('ownershipId')) {
                                dstAddress.ownershipId = null;
                            }

                            if (dstAddress.hasOwnProperty('typeOfAccommodationId')) {
                                dstAddress.typeOfAccommodationId = null;
                            }
                        }
                    }
                };

                ctrl.printPatientLabel = function () {
                    personService.printPatientLabel(
                        $stateParams.id
                    ).then(function (result) {
                        var url = result.data;
                        url = window.location.origin + ctrl.appPath + url;

                        var reportWindow = window.open();
                        reportWindow.location = url;
                        reportWindow.target = '_blank';
                        reportWindow.locationbar.visible = false;
                        reportWindow.focus();
                    });
                };

                function updateRecordStatus() {
                    ctrl.isNewPerson = !ctrl.model.id;
                }

                function showHideErrorForPostalCode(valFlag, po) {
                    //var element = $("#NricAddress_PostalCode");
                    var element = angular.element(po);
                    var parent = $(element).parent();

                    var parentEl = angular.element(parent);
                    var checkPblock = parentEl[0].querySelector(".invalid_postalcode_error");

                    if (valFlag) {
                        var errorhtml = '<p class="help-block control-label invalid_postalcode_error" style="color:#00bfb5">Invalid Postal Code! Please enter a valid postal code.</p>';
                        parentEl[0].insertAdjacentHTML('beforeend', errorhtml);
                    } else {
                        angular.element(checkPblock).remove();
                        //$("p").remove(":contains('The postal code entered is invalid')");                   
                    }
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

                ctrl.registrationDocumentTypeIdOnChange = function () {
                    // Initialize registrationDocumentNumberDisabled flag
                    ctrl.registrationDocumentNumberDisabled = false;

                    if (!ctrl.model.id) {
                        var selectedDocumentType = ctrl.model.registrationDocumentTypeId;

                        if (selectedDocumentType) {
                            if (ctrl.RegistrationDocumentTypes) {
                                if (selectedDocumentType == ctrl.RegistrationDocumentTypes.nricPink.id) {
                                    var singapore = ctrl.NationalityMasterLookUp.find(function (item) {
                                        return item.code.toUpperCase() == 'SG';
                                    });

                                    if (singapore && ctrl.model.nationalityId != singapore.id) {
                                        ctrl.model.nationalityId = singapore.id;
                                    }
                                } else if (selectedDocumentType == ctrl.RegistrationDocumentTypes.notApplicable.id) {
                                    ctrl.registrationDocumentNumberDisabled = true;
                                    ctrl.model.registrationDocumentNumber = null;
                                } else {
                                    ctrl.model.nationalityId = null;
                                }
                            }
                        } else {
                            ctrl.model.nationalityId = null;
                        }
                    }
                };

                ctrl.registrationDocumentTypeMasterDataInitialized = function (result) {
                    if (ctrl.RegistrationDocumentMasterData) {
                        ctrl.RegistrationDocumentTypes = {
                            nricBlue: ctrl.RegistrationDocumentMasterData.find(function (item) { return item.code.toUpperCase() == 'NRICPINK'; }),
                            nricPink: ctrl.RegistrationDocumentMasterData.find(function (item) { return item.code.toUpperCase() == 'NRICPINK'; }),
                            fin: ctrl.RegistrationDocumentMasterData.find(function (item) { return item.code.toUpperCase() == 'FIN'; }),
                            notApplicable: ctrl.RegistrationDocumentMasterData.find(function (item) { return item.code.toUpperCase() == 'NOTAPPLICABLE'; })
                        };
                    }
                };

                ctrl.setChineseHoroscope = function () {
                    if (ctrl.model.dateOfBirth) {
                        var birthYear = new Date(ctrl.model.dateOfBirth).getFullYear();
                        var index = (birthYear - 4) % 12;

                        ctrl.model.chineseHoroscopeId = ctrl.ChineseHoroscopeMasterData[index].id;
                    } else {
                        ctrl.model.chineseHoroscopeId = null;
                    }
                };

                ctrl.checkRegistrationDocumentNumberFormat = function (value) {
                    var selectedRegDocumentType = ctrl.model.registrationDocumentTypeId;
                    var isValidFormat = true;

                    if (!ctrl.RegistrationDocumentTypes || !selectedRegDocumentType) {
                        return true;
                    }

                    if (selectedRegDocumentType != null && selectedRegDocumentType != ctrl.RegistrationDocumentTypes.notApplicable.id) {
                        if (selectedRegDocumentType == null) {
                            isValidFormat = false;
                        } else {
                            if (selectedRegDocumentType == ctrl.RegistrationDocumentTypes.nricBlue.id ||
                                selectedRegDocumentType == ctrl.RegistrationDocumentTypes.nricPink.id) {
                                isValidFormat = isValidNric('nric', value);
                            } else if (selectedRegDocumentType == ctrl.RegistrationDocumentTypes.fin.id) {
                                isValidFormat = isValidNric('fin', value);
                            }
                        }
                    }

                    if (!isValidFormat) {
                        return abp.localization.localize("InvalidIDFormat");
                    } else {
                        return isValidFormat;
                    }
                }

                ctrl.setPersonDetailsNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'BioData', displayName: 'Bio Data', permission: true },
                        { key: 'ContactInformation', displayName: 'Contact Information', permission: true },
                        { key: 'OtherInformation', displayName: 'Other Information', permission: true },
                        { key: 'LanguageDialect', displayName: 'Language Dialect', permission: abp.auth.hasPermission('Pages.Tenant.LanguageDialects') },
                        { key: 'FamilyMembersCaregiver', displayName: 'Family Members Caregiver', permission: true },
                        { key: 'Social', displayName: 'Social', permission: true },
                        { key: 'SocialReports', displayName: 'Social Reports', permission: abp.auth.hasPermission('Pages.Tenant.SocialReports') },
                        { key: 'LifeEvent', displayName: 'Life Event', permission: true },
                        { key: 'HashSymbolTags', displayName: '# Tags', permission: true },
                        { key: 'MeansTesting', displayName: 'Means Testing', permission: abp.auth.hasPermission('Pages.Tenant.MeansTests') },
                        { key: 'FinancialAssistance', displayName: 'Financial Assistance', permission: abp.auth.hasPermission('Pages.Tenant.FinancialAssistances') }
                    ];
                };

                ctrl.setProfileNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'Allergies', displayName: 'Allergies', permission: abp.auth.hasPermission('Pages.Tenant.Allergies') },
                        { key: 'medicalhistory', displayName: 'Medical History', permission: abp.auth.hasPermission('Pages.Tenant.MedicalHistory') },
                        { key: 'medicationhistory', displayName: 'Medication History', permission: abp.auth.hasPermission('Pages.Tenant.MedicationHistory') }
                    ];
                };

                ctrl.setStatusNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'Prescription', displayName: 'Prescription', permission: abp.auth.hasPermission('Pages.Tenant.Prescriptions') },
                        { key: 'specialcares', displayName: 'Special Cares', permission: abp.auth.hasPermission('Pages.Tenant.SpecialCare') },
                        { key: 'VitalSign', displayName: 'Vital Sign', permission: abp.auth.hasPermission('Pages.Tenant.VitalSign') },
                        { key: 'MedicalAlert', displayName: 'Medical Alert', permission: abp.auth.hasPermission('Pages.Tenant.MedicalAlert') },
                        { key: 'Assessment', displayName: 'Assessment', permission: abp.auth.hasPermission('Pages.Tenant.Assessment') },
                        { key: 'Diagnosis', displayName: 'Diagnosis', permission: abp.auth.hasPermission('Pages.Tenant.Diagnosis') }
                    ];
                };

                ctrl.setCareNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'OwnNotes', displayName: 'Own Notes', permission: true },
                        { key: 'SharedNotes', displayName: 'Shared Notes', permission: true },
                        { key: 'PersonProblems', displayName: 'Problem List / Care Plan', permission: (abp.auth.hasPermission('Pages.Tenant.PersonProblems') || abp.auth.hasPermission('Pages.Tenant.CarePlans')) },
                        { key: 'ProgressNote', displayName: 'Progress Note', permission: abp.auth.hasPermission('Pages.Tenant.ProgressNotes') }
                    ];
                };

                ctrl.setEncounterNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'VisitLogs', displayName: 'Visit Logs', permission: abp.auth.hasPermission('Pages.Tenant.VisitLogs') },
                        { key: 'Hospitalization', displayName: 'Hospitalization', permission: abp.auth.hasPermission('Pages.Tenant.Hospitalization') },
                        { key: 'MedicalAppointment', displayName: 'Medical Appointment', permission: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment') }
                    ];
                };

                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.close = function () {
                    $rootScope.close();
                };

                function isValidNric(type, regdocumentno) {
                    if (regdocumentno == null || regdocumentno.length != 9) {
                        return false;
                    }

                    var st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
                    var fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
                    var weights = [2, 7, 6, 5, 4, 3, 2];

                    var data = regdocumentno.toUpperCase();
                    var prefix = data[0];
                    var suffix = data[8];
                    var weightedSum = 0;

                    for (var i = 1; i <= 7; i++) {
                        weightedSum += (parseInt(data[i], 10) * weights[i - 1]);
                    }

                    var offset = (prefix == 'T' || prefix == 'G') ? 4 : 0;
                    var index = (weightedSum + offset) % 11;
                    var checksum = null;

                    if (type == 'nric' && (prefix == 'S' || prefix == 'T')) {
                        checksum = st[index];
                    } else if (type == 'fin' && (prefix = 'F' || prefix == 'G')) {
                        checksum = fg[index];
                    }

                    return suffix === checksum;
                }
            }
        ],
        templateUrl: '~/App/tenant/views/persons/person-detail/person-detail.cshtml'
    });
})();