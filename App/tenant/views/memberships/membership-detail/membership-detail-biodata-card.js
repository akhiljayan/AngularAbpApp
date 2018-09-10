(function (_) {
    appModule.component('membershipDetailBiodataCard', {
        require: {
            parentCtrl: '^membershipDetail'
        },
        bindings: {
            mode: '<',
            model: '=',
            permissions: '<',
            onUpdate: '&',
            onReload: '&'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.masterLookUp', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', '$filter', 'abp.services.app.referral', 
            function ($scope, $stateParams, commonLookupService, masterLookup, userService, personService, membershipService, $filter, referralService) {
                //debugger;
                var ctrl = this;
                 ctrl.$onInit = function () {
                    
                 };
                
                ctrl.$onChanges = function (changes) {
                   
                    console.log('ctrl.model');
                    console.log(ctrl.model);
                    if (changes.model /*&& changes.model.isFirstChange()*/) {

                        if (ctrl.mode == 'new') {
                            ctrl.model = angular.copy(ctrl.model);
                            //ctrl.model.personId && ctrl.loadAdmissions(ctrl.model.personId);
                        } else {
                            
                        };
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

                ctrl.checkExistingRegisterDocument = function () {
                    //debugger;
                    var regDocId = ctrl.model.registrationDocumentTypeId;
                    var regDocNum = ctrl.model.registrationDocumentNumber;
                    if ((typeof ctrl.model.registrationDocumentTypeId != 'undefined') && (typeof ctrl.model.registrationDocumentNumber != 'undefined') && (ctrl.model.registrationDocumentTypeId != '') && (ctrl.model.registrationDocumentNumber != '')) {
                        referralService.checkNricAndGetExistingReferralInfo(
                            { registrationDocumentTypeId: ctrl.model.registrationDocumentTypeId, registrationDocumentNumber: ctrl.model.registrationDocumentNumber }
                        ).then(function (result) {
                            $stateParams.person = result;
                            $scope.person = result.data.person;
                            if (result.data != null) {
                                var person = result.data.person;
                                ctrl.model = person;
                                
                            }
                        });
                    }
                    
                };
               
                function loadMasterLookup(referralServiceTypeId) {
                    centre.getAllCentresLookUpInUserOU().then(function (result) {
                        vm.centreLookup = result.data;
                    });


                }

                function loadParentProperties() {
                    $scope.$on('vmScopeProperties', function (events, data) {
                        vm.admission = data.vmAdmission;
                        vm.referralServiceType = data.vmReferralServiveType;
                        loadMasterLookup(vm.referralServiceType.serviceTypeId);
                    });
                }


                ctrl.save = function (event) {
                   
                    ctrl.onUpdate({
                        event: {
                            data: ctrl.model,
                            success: closeEditMode
                        }
                    });

                    event.preventDefault();
                };

                ctrl.edit = function () {
                    ctrl.mode = 'edit';
                    ctrl.person = _.pick($scope.ctrl.person, [
                        'salutationId', 'fullName', 'surname', 'genderId', 'maritalStatusId',
                        'registrationDocumentTypeId', 'registrationDocumentNumber', 'dateOfIssue',
                        'dateOfBirth', 'chineseHoroscopeId', 'raceId', 'nationalityId', 'citizenshipId',
                        'religionId', 'placeOfWorship'
                    ]);
                };
                ctrl.cancel = function () {
                   // debugger;
                    closeEditMode();
                };

         
                function closeEditMode() {
                   // debugger;
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-biodata-card.cshtml'
    });
})(_);