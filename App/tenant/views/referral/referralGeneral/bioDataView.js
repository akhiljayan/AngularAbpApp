(function () {
    appModule.controller('tenant.views.referral.bioDataView', [
        '$scope', '$timeout', '$stateParams', '$validator', '$filter', 'abp.services.app.person', 'abp.services.app.referral','$element',
        function ($scope, $timeout, $stateParams, $validator, $filter, personService, referralService, $element) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};

            //close cancel
            vm.close = function () {
                vm.mode = 'view';
            };
            //Edit function
            vm.edit = function () {
                vm.mode = 'edit';
                vm.person = _.pick($scope.vm.person, [
                    'salutationId', 'fullName', 'surname', 'genderId', 'maritalStatusId',
                    'registrationDocumentTypeId', 'registrationDocumentNumber', 'dateOfIssue',
                    'dateOfBirth', 'chineseHoroscopeId', 'raceId', 'nationalityId', 'citizenshipId',
                    'religionId', 'placeOfWorship'
                ]);
            };
            //Save method
            vm.save = function () {
                vm.bioDataForm.validate() // TODO: Fix this workaround for 1st required field is not valiated one 1st round
                if (vm.bioDataForm.validate()) {
                    $scope.$emit('UpdatePerson', vm.person);
                }
            };
            //Initialization
            vm.init = function () {
                $scope.vm.bioData = $scope.bioData;
                $scope.bioData.person = vm.person;
            };
            //Check if Register document number already exists
            vm.checkExistingRegisterDocument = function () {
              //  if (!$stateParams.id) {
                    var regDocId = vm.person.registrationDocumentTypeId;
                    var regDocNum = vm.person.registrationDocumentNumber;
                    if ((typeof vm.person.registrationDocumentTypeId != 'undefined') && (typeof vm.person.registrationDocumentNumber != 'undefined') && (vm.person.registrationDocumentTypeId != '') && (vm.person.registrationDocumentNumber != '')) {
                        referralService.checkNricAndGetExistingReferralInfo(
                        { registrationDocumentTypeId: vm.person.registrationDocumentTypeId, registrationDocumentNumber: vm.person.registrationDocumentNumber }
                        ).then(function (result) {
                            if (result.data != null) {
                                var person = result.data.person;
                                vm.person = person;
                                $scope.vm.contactInfoCtrl.person = person;
                                $scope.vm.otherInformation.person = person;
                            }
                        });
                    }
               // } 
            };
            //Show no message

            //Load biodata view
            vm.loadBioDataView = function () {
                var line_1 = [
                    { placeholder: getDescription($scope.vm.person.registrationDocumentType), displayName: "Registration Document Type" },
                    { placeholder: $scope.vm.person.registrationDocumentNumber, displayName: "NRIC/Fin/Passport Type" },
                    { placeholder: $filter('date')($scope.vm.person.dateOfIssue, "dd-MMM-yyyy"), displayName: "Date of issue" }
                ];
                var line_2 = [
                    { placeholder: $filter('date')($scope.vm.person.dateOfBirth, "dd-MMM-yyyy"), displayName: "Date of Birth" },
                    { placeholder: $scope.vm.age ? $scope.vm.age : '-', displayName: "Age" },
                    { placeholder: getDescription($scope.vm.person.chineseHoroscope), displayName: "Chinese Horoscope" }
                ];
                var line_3 = [
                    { placeholder: getDescription($scope.vm.person.race), displayName: "Race" },
                    { placeholder: getDescription($scope.vm.person.nationality), displayName: "Nationality" },
                    { placeholder: getDescription($scope.vm.person.citizenship), displayName: "Citizenship" }
                ];
                var line_4 = [
                    { placeholder: getDescription($scope.vm.person.religion), displayName: "Religion" },
                    { placeholder: $scope.vm.person.placeOfWorship, displayName: "Place of Worship" }
                ];
                vm.line_1 = line_1.filter(function (n) { return n.placeholder != undefined && n.placeholder != '' });
                vm.line_2 = line_2.filter(function (n) { return n.placeholder != undefined && n.placeholder != '' });
                vm.line_3 = line_3.filter(function (n) { return n.placeholder != undefined && n.placeholder != '' });
                vm.line_4 = line_4.filter(function (n) { return n.placeholder != undefined && n.placeholder != '' });
            }
            

            //Brodcast,on and emit functions
            $scope.$on('vmReferral', function (events, data) {
                vm.referral = data;
            });
            $scope.$on('loadBioDataView', function (event, data) {
                vm.loadBioDataView();
            });
            $scope.$on('ReferralUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });



            
            //init call
            vm.init();

            // Validation definition
            vm.validationOptions = {
                rules: {
                    "Person.RegistrationDocumentNumber": {
                        registrationDocumentNumber: {
                            registrationDocumentType: function () {
                                return vm.person.registrationDocumentTypeId;
                            },
                            registrationDocumentTypeMaster: function () {
                                return regDocumentTypes;
                            }
                        },
                    }
                },
                messages: {
                    RegistrationDocumentNumber: {
                        remote: function () {
                            return abp.localization.localize("DuplicateIDFormat")
                        }
                    },
                    "Person.RegistrationDocumentNumber": {
                        required: "You must provide a value for NRIC/Fin/Passport No.."
                    }

                }
            };
            //Registration document number validator
            $validator.addMethod('registrationDocumentNumber', function (value, element, options) {
                var typesToCheck = {};
                var selectedRegDocumentType = null;
                if (!options.registrationDocumentTypeMaster) {
                    return true;
                }
                typesToCheck = (typeof options.registrationDocumentTypeMaster === 'function')
                    ? options.registrationDocumentTypeMaster()
                    : options.registrationDocumentTypeMaster;
                selectedRegDocumentType = (typeof options.registrationDocumentType === 'function')
                    ? options.registrationDocumentType()
                    : options.registrationDocumentType;
                if (!selectedRegDocumentType) {
                    return true;
                }
                if (selectedRegDocumentType != null && selectedRegDocumentType != typesToCheck.notApplicable) {
                    if (value == null) {
                        return false;
                    } else {
                        if (selectedRegDocumentType == typesToCheck.nricBlue ||
                            selectedRegDocumentType == typesToCheck.nricPink) {
                            return isValidNric('nric', value)
                        } else if (selectedRegDocumentType == typesToCheck.fin) {
                            return isValidNric('fin', value)
                        }
                    }
                }
                return true;
            }, abp.localization.localize("InvalidIDFormat"));
            //Date range validator
            $validator.addMethod('daterange', function (value, element, options) {
                    var min = options[0] || new Date(0);
                    var max = options[1] || new Date();
                    var val = value;
                    min = min.setHours(0, 0, 0, 0);
                    max = max.setHours(0, 0, 0, 0);
                    if (!(val instanceof Date)) {
                        val = new Date(Date.parse(val));
                    }
                    val = val.setHours(0, 0, 0, 0);
                    return this.optional(element) || val.valueOf() <= max.valueOf();
                }, 'Date cannot be a future date.');
            //NRIC validator
            function isValidNric(type, regdocumentno) {
                if (regdocumentno == null || regdocumentno.length != 9) {
                    return false;
                }
                var st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
                var fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
                var weights = [2, 7, 6, 5, 4, 3, 2, ];
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
            };
            //Get master data description
            function getDescription(master) {
                if (master != null && master.description != null) {
                    return master.description;
                }
                return undefined;
            };
        }
    ]);
})();