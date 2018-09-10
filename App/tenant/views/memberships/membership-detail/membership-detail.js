(function () {
    appModule.component('membershipDetail', {
        bindings: {
            mode: '<',
            model: '=',
            loading: '<',
            onCreate: '&',
            onCopy: '&',
            onSave: '&',
            onUpdate: '&',
            onTerminate: '&',
            onDelete: '&',
            onReload: '&',
            saveSign: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$anchorScroll', '$location', '$uibModal', '$state', '$stateParams', '$rootScope', '$scope', 'abp.services.app.membership', 'abp.services.app.referral', 'abp.services.app.postalAdressAutoPopulate',
            function ($anchorScroll, $location, $uibModal, $state, $stateParams, $rootScope, $scope, membershipService, referralService, poAddressService) {

                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.isTerminate = false;

                // To prevent simultaneous saving of records which would result in duplicated records
                ctrl.isSavingDisabled = false;
                ctrl.personHeaderisPinned = false;
                ctrl.membership = {};
                ctrl.isPinned = true;
                ctrl.IsAgreed = false;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.isPinned = true;
                    ctrl.appPath = abp.appPath;
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Memberships.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Memberships.Edit'),
                        cancel: abp.auth.hasPermission('Pages.Tenant.Memberships.Terminate'),
                    };
                    ctrl.setNavigation();

                    // Others, Please Specify fields are disabled by default
                    ctrl.showOthersRegistrationDocumentType = false;
                    ctrl.showOthersMaritalStatus = false;
                    ctrl.showOthersRace = false;
                    ctrl.showOthersReligion = false;
                    ctrl.showOthersHighestEducation = false;
                    ctrl.showOthersLivingArrangement = false;

                    if (ctrl.model) {
                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                        $stateParams.membershipId = ctrl.model.id;
                        if (ctrl.model.person)
                            $stateParams.id = ctrl.model.person.id;
                        ctrl.initialiseOthersPleaseSpecify();
                    }
                };

                ctrl.setNavigation = function () {
                    ctrl.navigationalMenu = [
                        { key: 'BioData', displayName: 'Bio Data', permission: true },
                        { key: 'ContactInformation', displayName: 'Contact Information', permission: true },
                        { key: 'OtherInformation', displayName: 'Other Information', permission: true },
                        { key: 'LanguageDialect', displayName: 'Spoken Language', permission: true },
                        { key: 'FamilyMembers', displayName: 'Family Members', permission: true },
                        { key: 'SupportNetwork', displayName: 'Support Network', permission: true },
                        { key: 'LivingCondition', displayName: 'Living Condition', permission: true },
                        { key: 'Declaration', displayName: 'Declaration', permission: true },
                        { key: 'AgreementIndemnity', displayName: 'Membership Agreement', permission: true },
                        { key: 'AdministrativeInformation', displayName: 'Administrative Info.', permission: true },
                        { key: 'General', displayName: 'General', permission: true },
                        { key: 'InterestHobbies', displayName: 'Interest and Hobbies', permission: true },
                        { key: 'Allergies', displayName: 'Allergies', permission: true },
                        { key: 'Health', displayName: 'Health', permission: true },
                        { key: 'MedicalInformation', displayName: 'Medical Information', permission: true },
                        { key: 'FinancialStatus', displayName: 'Financial Status', permission: true },
                        { key: 'AssistancesServices', displayName: 'Assistances/ Services', permission: true },
                    ];
                };

                // event handlers
                ctrl.gotoAnchor = function (key) {
                    $location.hash(key);
                    $anchorScroll();
                };

                ctrl.$onChanges = function (changes) {
                    if (ctrl.model) {
                        //ctrl.model = angular.copy(ctrl.model);
                        ctrl.workingModel = ctrl.model;
                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                        $stateParams.membershipId = ctrl.model.id;
                        if (ctrl.model.person)
                            $stateParams.id = ctrl.model.person.id;
                        ctrl.initialiseOthersPleaseSpecify();
                    }
                };

                ctrl.saveSign = function (event) {
                    if (ctrl.signature.isEmpty) {
                        ctrl.workingModel.signatureBody = null;
                    } else {
                        ctrl.model.signatureBody = ctrl.signature.dataUrl;
                    }
                    event.preventDefault();
                };

                // set Others, Please Specify fields based on its dependent fields value on form load
                ctrl.initialiseOthersPleaseSpecify = function () {
                    if (ctrl.model.person) {
                        if (ctrl.model.person.registrationDocumentType)
                            ctrl.initialiseOthersRegistrationDocumentType(ctrl.model.person.registrationDocumentType.description);
                        if (ctrl.model.person.maritalStatus)
                            ctrl.initialiseOthersMaritalStatus(ctrl.model.person.maritalStatus.description);
                        if (ctrl.model.person.race)
                            ctrl.initialiseOthersRace(ctrl.model.person.race.description);
                        if (ctrl.model.person.religion)
                            ctrl.initialiseOthersReligion(ctrl.model.person.religion.description);
                        if (ctrl.model.person.highestEducation)
                            ctrl.initialiseOthersHighestEducation(ctrl.model.person.highestEducation.description);
                        if (ctrl.model.person.livingArrangement)
                            ctrl.initialiseOthersLivingArrangement(ctrl.model.person.livingArrangement.description);
                    }
                };

                ctrl.addForm = function (form) {
                    ctrl.forms.push(form);
                };


                ctrl.save = function (backtolisting) {
                    ctrl.form.submitted = true;
                    if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption && ctrl.model.membershipAgreementOption.code == 'Agree') {
                        ctrl.IsAgreed = true;
                    }
                    else {
                        ctrl.IsAgreed = false;
                    }
                    if (ctrl.form.$invalid) {
                        return;
                    } else {
                        ctrl.form.$setPristine(true);
                    };

                    //Save signaturepad
                    ctrl.signaturePageComponentApi.saveSignature();

                    if (ctrl.mode == 'new') {
                        ctrl.onCreate({
                            $event: {
                                model: ctrl.model,
                                back: backtolisting,
                                success: function () {
                                    ctrl.mode = 'view';
                                    ctrl.IsNewMember = 'false';
                                }
                            }
                        });
                    } else {
                        ctrl.onUpdate({
                            $event: {
                                model: ctrl.model,
                                back: backtolisting,
                                success: function () {
                                    ctrl.mode = 'view';
                                    ctrl.IsNewMember = 'false';
                                }
                            }
                        });
                    }
                    $stateParams.id = ctrl.model.person.id;
                };

                ctrl.copyMembership = function () {
                    if (ctrl.form.$invalid) {
                        return;
                    }
                    abp.message.confirm(
                        'Please click Ok to continue',
                        'You are about to Copy the Membership',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                ctrl.onCopy({
                                    $event: {
                                        model: ctrl.model.id,
                                        success: function () {
                                            ctrl.mode = 'edit';
                                            //setPristine();
                                        }
                                    }
                                });
                            }
                        });
                };

                ctrl.reloadMembership = function () {
                    ctrl.onReload();
                }

                ctrl.getAddress = function (address, event) {
                    console.log(ctrl);
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

                ctrl.registrationDocumentTypeIdOnChange = function () {
                    // Initialize registrationDocumentNumberDisabled flag
                    ctrl.registrationDocumentNumberDisabled = false;

                    if (!ctrl.model.Person.id) {
                        var selectedDocumentType = ctrl.registrationDocumentTypeId;

                        if (selectedDocumentType) {
                            if (ctrl.RegistrationDocumentTypes) {
                                if (selectedDocumentType == ctrl.RegistrationDocumentTypes.nricPink.id) {
                                    var singapore = ctrl.NationalityMasterLookUp.find(function (item) {
                                        return item.code.toUpperCase() == 'SG';
                                    });

                                    if (singapore && ctrl.model.Person.nationalityId != singapore.id) {
                                        ctrl.model.Person.nationalityId = singapore.id;
                                    }
                                } else if (selectedDocumentType == ctrl.RegistrationDocumentTypes.notApplicable.id) {
                                    ctrl.registrationDocumentNumberDisabled = true;
                                    ctrl.model.Person.registrationDocumentNumber = null;
                                } else {
                                    ctrl.model.Person.nationalityId = null;
                                }
                            }
                        } else {
                            ctrl.model.Person.nationalityId = null;
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

                ctrl.checkRegistrationDocumentNumberFormat = function (value) {
                    var selectedRegDocumentType = ctrl.registrationDocumentTypeId;
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

                ctrl.checkExistingRegisterDocument = function () {
                    var regDocId = ctrl.model.person.registrationDocumentTypeId;
                    var regDocNum = ctrl.model.person.registrationDocumentNumber;
                    if ((typeof ctrl.model.person.registrationDocumentTypeId != 'undefined') && (typeof ctrl.model.person.registrationDocumentNumber != 'undefined') && (ctrl.model.person.registrationDocumentTypeId != '') && (ctrl.model.person.registrationDocumentNumber != '')) {
                        membershipService.checkNricAndGetExistingMembershipInfo(
                            { registrationDocumentTypeId: regDocId, registrationDocumentNumber: regDocNum }
                        ).then(function (result) {
                            $stateParams.person = result;
                            $scope.person = result.data.person;
                            if (result.data != null) {
                                var person = result.data.person;
                                ctrl.model.person = person;
                                $stateParams.id = ctrl.model.person.id;
                                ctrl.initialiseOthersPleaseSpecify();
                            }
                        });
                    }
                };

                ctrl.terminateMembership = function (event) {

                    ctrl.model.isCancelling = true;
                    abp.message.confirm(
                        app.localize('MembershipTerminateWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openTerminateMembershipModal();
                            }
                        }
                    );
                };

                function openTerminateMembershipModal() {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-cancellation.cshtml',
                        controller: 'tenant.views.memberships.cancelMembership as vm',
                        backdrop: 'static',
                        resolve: {
                            membershipId: function () {
                                return ctrl.model.id;
                            },
                            permissions: function () {
                                return ctrl.permissions;
                            }
                        }
                    });

                    modalInstance.result.then(function (cancelMembership) {
                        ctrl.onTerminate({
                            $event: {
                                data: {
                                    id: ctrl.model.id,
                                    terminationReasonId: cancelMembership.terminationReasonId,
                                    othersTerminationReason: cancelMembership.othersTerminationReason,
                                    membershipEndDate: cancelMembership.membershipEndDate
                                },

                                success: function () {
                                    ctrl.isTerminate = true;
                                }
                            }
                        });
                    });
                }

                ctrl.returnBoolValue = function (value) {
                    if (value == true)
                        return 'Yes';
                    else if (value == false)
                        return 'No';
                    else
                        return '-';
                }

                ctrl.cancel = function () {
                    $state.go('tenant.memberships');
                };

                ctrl.initialiseOthersRegistrationDocumentType = function (value) {
                    if (value != 'Other') {
                        ctrl.model.person.othersRegistrationDocumentType = null;
                        ctrl.showOthersRegistrationDocumentType = false;
                    }
                    else {
                        ctrl.showOthersRegistrationDocumentType = true;
                    }
                };

                ctrl.initialiseOthersMaritalStatus = function (value) {
                    if (value != 'Others') {
                        ctrl.model.person.othersMaritalStatus = null;
                        ctrl.showOthersMaritalStatus = false;
                    }
                    else {
                        ctrl.showOthersMaritalStatus = true;
                    }
                };

                ctrl.initialiseOthersRace = function (value) {
                    if (value != 'Others') {
                        ctrl.model.person.othersRace = null;
                        ctrl.showOthersRace = false;
                    }
                    else {
                        ctrl.showOthersRace = true;
                    }
                };

                ctrl.initialiseOthersReligion = function (value) {
                    if (value != 'Others') {
                        ctrl.model.person.othersReligion = null;
                        ctrl.showOthersReligion = false;
                    }
                    else {
                        ctrl.showOthersReligion = true;
                    }
                };

                ctrl.initialiseOthersHighestEducation = function (value) {
                    if (value != 'Others') {
                        ctrl.model.person.othersHighestEducation = null;
                        ctrl.showOthersHighestEducation = false;
                    }
                    else {
                        ctrl.showOthersHighestEducation = true;
                    }
                };

                ctrl.initialiseOthersLivingArrangement = function (value) {
                    if (value != 'Others') {
                        ctrl.model.person.othersLivingArrangement = null;
                        ctrl.showOthersLivingArrangement = false;
                    }
                    else {
                        ctrl.showOthersLivingArrangement = true;
                    }
                };
                // callbacks
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail.cshtml'
    });
})();