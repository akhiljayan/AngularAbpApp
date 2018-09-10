(function () {
    appModule.controller('tenant.views.person.bioDataView', [
        '$scope', '$stateParams', '$filter', 'abp.services.app.person', '$validator',
        function ($scope, $stateParams, $filter, personService, $validator) {           
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};

            vm.isFamilyMembers = $scope.vm.isFamilyMembers;
            vm.registrationDocumentNumberDisabled = false;

            vm.edit = function () {
                vm.mode = 'edit';

                vm.person = _.pick($scope.vm.person, [
                    'salutationId', 'fullName', 'surname', 'genderId', 'maritalStatusId',
                    'registrationDocumentTypeId', 'registrationDocumentNumber', 'dateOfIssue',
                    'dateOfBirth', 'chineseHoroscopeId', 'raceId', 'nationalityId', 'citizenshipId',
                    'religionId', 'placeOfWorship'
                ]);
            };

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.setChineseHoroscope = function () {
                if (vm.person.dateOfBirth) {
                    var birthYear = new Date(vm.person.dateOfBirth).getFullYear();
                    var index = (birthYear - 4) % 12;

                    vm.person.chineseHoroscopeId = $scope.vm.chineseHoroscopeMaster[index].id;
                }
                else {
                    vm.person.chineseHoroscopeId = null;
                }
            };

            vm.save = function () {
                vm.bioDataForm.validate() // TODO: Fix this workaround for 1st required field is not valiated one 1st round
                if (vm.bioDataForm.validate()) {
                    $scope.$emit('UpdatePerson', vm.person);
                }
            };

            $scope.$on('loadBioDataView', function (event, data) {
                vm.loadBioDataView();
            });

            $scope.$on('PersonUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });

            $scope.$on('familyLoadBioDataView', function (event, data) {
                vm.init();
                vm.loadBioDataView();
            });

            $scope.$on('SetPersonDefaults', function (event, data) {
                vm.person = _.pick($scope.vm.person, [
                    'nationalityId'
                ]);
            });

            vm.registrationDocumentNumberOnBlur = function () {
                if (vm.person.registrationDocumentNumber) {
                    $scope.$emit('RegistrationDocumentNumberOnBlur', vm.person.registrationDocumentNumber);
                }
            };

            vm.registrationDocumentTypeIdOnChange = function () {
                // Initialize registrationDocumentNumberDisabled flag
                vm.registrationDocumentNumberDisabled = false;

                if (!$scope.vm.person.id) {
                    var selectedDocumentType = vm.person.registrationDocumentTypeId;

                    if (selectedDocumentType) {
                        var nricPink = $scope.vm.RegistrationDocumentMasterData.find(function (item) {
                            return item.code.toUpperCase() == 'NRICPINK';
                        });

                        var notApplicable = $scope.vm.RegistrationDocumentMasterData.find(function (item) {
                            return item.code.toUpperCase() == 'NOTAPPLICABLE';
                        });

                        if (selectedDocumentType == nricPink.id) {
                            var singapore = $scope.vm.NationalityMasterLookUp.find(function (item) {
                                return item.code.toUpperCase() == 'SG';
                            });

                            if (singapore && vm.person.nationalityId != singapore.id) {
                                vm.person.nationalityId = singapore.id;
                            }
                        } else if (selectedDocumentType == notApplicable.id) {
                            vm.registrationDocumentNumberDisabled = true;
                        } else {
                            vm.person.nationalityId = null;
                        }
                    } else {
                        vm.person.nationalityId = null;
                    }
                }
            };

            vm.loadBioDataView = function () {
                var line_1 = [
                    { placeholder: getDescription($scope.vm.person.registrationDocumentType), displayName: "Registration Document Type" },
                    { placeholder: $scope.vm.person.registrationDocumentNumber, displayName: "NRIC/Fin/Passport No." },
                    { placeholder: $filter('date')($scope.vm.person.dateOfIssue, 'dd-MMM-yyyy'), displayName: "Date of Issue" }
                ];
                var line_2 = [
                    { placeholder: $filter('date')($scope.vm.person.dateOfBirth, 'dd-MMM-yyyy'), displayName: "Date of Birth" },
                    { placeholder: $filter("ageFilter")($scope.vm.person.dateOfBirth), displayName: "Age" },
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

                //var line_1 = [getDescription($scope.vm.person.registrationDocumentType), $scope.vm.person.registrationDocumentNumber, $scope.vm.person.dateOfIssue];
                //var line_2 = [$scope.vm.person.dateOfBirth, $scope.vm.age + ' Yrs', $scope.vm.person.chineseHoroscope];
                //var line_3 = [getDescription($scope.vm.person.race), getDescription($scope.vm.person.nationality), getDescription($scope.vm.person.citizenship)];
                //var line_4 = [getDescription($scope.vm.person.religion), $scope.vm.person.placeOfWorship];

                //vm.line_1 = line_1.filter(function (n) { return n != undefined }).join(" &bull; ");
                //vm.line_2 = line_2.filter(function (n) { return n != undefined }).join(" &bull; ");
                //vm.line_3 = line_3.filter(function (n) { return n != undefined }).join(" &bull; ");
                //vm.line_4 = line_4.filter(function (n) { return n != undefined }).join(" &bull; ");
            }

            function getDescription(master) {
                if (master != null && master.description != null) {
                    return master.description;
                }

                return undefined;
            }

            vm.init = function () {
                $scope.vm.bioData = $scope.bioData;
                $scope.bioData.person = vm.person;

                if (vm.isFamilyMembers && vm.mode == 'edit') {
                    vm.edit();
                }
            }

            vm.init();

            // Validation definition
            vm.validationOptions = {
                rules: {
                    FullName: {
                        required: true
                    },
                    RegistrationDocumentNumber: {
                        registrationDocumentNumber: {
                            registrationDocumentType: function () {
                                return vm.person.registrationDocumentTypeId;
                            },
                            registrationDocumentTypeMaster: function () {
                                return regDocumentTypes;
                            }
                        },
                        remote: $.jqueryRemoteExtend({
                            url: "api/services/app/person/isRegistrationDocumentUnique",
                            data: {
                                documentNumber: function () {
                                    return vm.person.registrationDocumentNumber;
                                },
                                personId: function () {
                                    return $scope.vm.person.id
                                },
                                skip: function () {
                                    return !!vm.isFamilyMembers;
                                }
                            }
                        })
                    },
                },
                messages: {
                    RegistrationDocumentNumber: {
                        remote: function () {
                            return abp.localization.localize("DuplicateIDFormat")
                        }
                    }
                }
            };

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

            $validator.addMethod('daterange', function (value, element, options) {
                var min = options[0] || new Date(0);
                var max = options[1] || new Date();
                var val = value;

                min = min.setHours(0, 0, 0, 0);
                max = max.setHours(0, 0, 0, 0);

                if (!(val instanceof Date)) {
                    val = new Date(val);
                }

                val = val.setHours(0, 0, 0, 0);

                return this.optional(element) || val.valueOf() <= max.valueOf();
            }, 'Date cannot be a future date.')

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
            }
        }
    ]);
})();