(function () {
    appModule.controller('tenant.views.person.personView.contactInfo', [
        '$scope', '$validator', '$location', '$anchorScroll', 'abp.services.app.postalAdressAutoPopulate',
        function ($scope, $validator, $location, $anchorScroll, poAddressService) {            
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};
            vm.person.nricAddress = {};
            vm.person.residentialAddress = {};
            vm.person.billingAddress = {};
            vm.isFamilyMembers = $scope.vm.isFamilyMembers;

            vm.edit = function () {
                vm.mode = 'edit';

                vm.person = _.pick($scope.vm.person, [
                    'homePhone', 'mobilePhone', 'officePhone', 'email',
                    'nricAddress', 'residentialAddress', 'billingAddress'
                ]);
            };






            vm.sameAsNricAddressChange = function (addressType, clearValue) {
                clearValue = clearValue || false;

                var nricAddress = vm.person.nricAddress;
                if (addressType == 1) {
                    var targetFieldsResidential = ['postalCode', 'blockNo', 'streetName', 'bulidingName', 'unitNo', 'countryId', 'ownershipId', 'typeOfAccommodationId'];
                    // Residential Address
                    if (nricAddress != null && vm.person.residentialAddress.isSameAsNricAddress) {
                        for (var prop in nricAddress) {
                            if (targetFieldsResidential.indexOf(prop) >= 0) {
                                vm.person.residentialAddress[prop] = nricAddress[prop];
                            }
                        }
                    } else {
                        if (clearValue) {
                            vm.person.residentialAddress = {};
                        }
                    }
                } else if (addressType == 2) {
                    // Billing Address
                    var targetFieldsBilling = ['postalCode', 'blockNo', 'streetName', 'bulidingName', 'unitNo', 'countryId'];
                    if (nricAddress != null && vm.person.billingAddress.isSameAsNricAddress) {
                        for (var prop in nricAddress) {
                            if (targetFieldsBilling.indexOf(prop) >= 0) {
                                vm.person.billingAddress[prop] = nricAddress[prop];
                            }
                        }
                    } else {
                        if (clearValue) {
                            vm.person.billingAddress = {};
                        }
                    }
                } else if (addressType == 3) {
                    var targetFieldsResidential = ['postalCode', 'blockNo', 'streetName', 'bulidingName', 'unitNo', 'countryId', 'ownershipId', 'typeOfAccommodationId'];
                    // Residential Address
                    if (nricAddress != null && vm.person.residentialAddress.isSameAsNricAddress) {
                        for (var prop in nricAddress) {
                            if (targetFieldsResidential.indexOf(prop) >= 0) {
                                vm.person.residentialAddress[prop] = nricAddress[prop];
                            }
                        }
                    } else {
                        if (clearValue) {
                            vm.person.residentialAddress = {};
                        }
                    }
                    // Billing Address
                    var targetFieldsBilling = ['postalCode', 'blockNo', 'streetName', 'bulidingName', 'unitNo', 'countryId'];
                    if (nricAddress != null && vm.person.billingAddress.isSameAsNricAddress) {
                        for (var prop in nricAddress) {
                            if (targetFieldsBilling.indexOf(prop) >= 0) {
                                vm.person.billingAddress[prop] = nricAddress[prop];
                            }
                        }
                    } else {
                        if (clearValue) {
                            vm.person.billingAddress = {};
                        }
                    }
                }
            };

            vm.checkForVlidPostalCode = function (model, $for) {
                if (model == "" || model == null) {
                    if ($for == 'billing') {
                        var element = $("#BillingAddress_PostalCode");
                    } else {
                        var element = $("#ResidentialAddress_PostalCode");
                    }
                    showHideErrorForPostalCode(false, element);
                }
            }

            vm.close = function () {
                vm.mode = 'view';
                vm.gotoAnchor('ContactInformation');
            };

            vm.save = function () {
                if (vm.contactInfoForm.validate()) {
                    $scope.$emit('UpdatePerson', vm.person);
                    vm.close();
                }
            };

            vm.gotoAnchor = function (key) {
                var offset = 0;
                offset = 265;
                $location.hash(key);
                $anchorScroll.yOffset = offset;
                $anchorScroll();
            };

            $scope.$watch('contactInfoCtrl.person.email', function (newValue, oldValue) {
                if (newValue === "")
                    $scope.contactInfoCtrl.person.email = null;
            });

            $scope.$on('PersonUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });

            $scope.$on('familyLoadContactInfoView', function (event, data) {
                vm.init();
            });

            $scope.$on('SetPersonDefaults', function (event, data) {
                vm.person = _.pick($scope.vm.person, [
                    'nricAddress', 'residentialAddress', 'billingAddress'
                ]);
            });

            vm.cancel = function () {
                vm.mode = 'view';
                vm.gotoAnchor('ContactInformation');
            };

            vm.init = function () {               
                $scope.vm.contactInfoCtrl = $scope.contactInfoCtrl;
                $scope.contactInfoCtrl.person = vm.person;

                if (vm.isFamilyMembers && vm.mode == "edit") {
                    vm.edit();
                }
            }

            vm.getAddress = function (e, $for, countryId) {
                var poElement = e.target;
                var po = e.target.value;
                var poIsNumbers = /^\d+$/.test(po);
                if (po.length < 6) {
                    showHideErrorForPostalCode(false, poElement);
                    return;
                }

                if (countryId && !isSingapore(countryId)) {
                    showHideErrorForPostalCode(false, poElement);
                    return;
                }

                if (po.length == 6 && poIsNumbers) {
                    poAddressService.getAddress(po).then(function (result) {
                        adress = result.data;
                        if (result.data == null) {
                            showHideErrorForPostalCode(true, poElement);
                            adress = {};
                            if ($for == 'nric') {
                                getAddressNric(adress);
                            } else if ($for == 'recidential') {
                                getAddressRecidential(adress);
                            } else if ($for == 'billing') {
                                getAddressBilling(adress);
                            }
                        } else {
                            if ($for == 'nric') {
                                getAddressNric(adress);
                            } else if ($for == 'recidential') {
                                getAddressRecidential(adress);
                            } else if ($for == 'billing') {
                                getAddressBilling(adress);
                            }
                            showHideErrorForPostalCode(false, poElement);
                        }
                    });
                } else if (po.length == 0) {
                    adress = {};
                    showHideErrorForPostalCode(false, poElement);
                    if ($for == 'nric') {
                        getAddressNric(adress);
                    } else if ($for == 'recidential') {
                        getAddressRecidential(adress);
                    } else if ($for == 'billing') {
                        getAddressBilling(adress);
                    }
                }

                if (!poIsNumbers && po.length == 6) {
                    showHideErrorForPostalCode(true, poElement);
                }
            }

            //vm.validatepostalcode = function (e, $for) {
            //    var poElement = e.target;
            //    var po = e.target.value;
            //    var poIsNumbers = /^\d+$/.test(po);
            //    if (!poIsNumbers && po.length == 6) {
            //        showHideErrorForPostalCode(true, poElement);
            //    } else if (po.length != 6 & po.length != 0) {
            //        showHideErrorForPostalCode(true, poElement);
            //    } else if (po.length == 0) {
            //        showHideErrorForPostalCode(false, poElement);
            //    }
            //}

            getAddressNric = function (adress) {
                vm.person.nricAddress.blockNo = adress.blockNo;
                vm.person.nricAddress.streetName = adress.streetName;
                vm.person.nricAddress.bulidingName = adress.buildingName;
            }

            getAddressRecidential = function (adress) {
                vm.person.residentialAddress.blockNo = adress.blockNo;
                vm.person.residentialAddress.streetName = adress.streetName;
                vm.person.residentialAddress.bulidingName = adress.buildingName;
            }

            getAddressBilling = function (adress) {
                vm.person.billingAddress.blockNo = adress.blockNo;
                vm.person.billingAddress.streetName = adress.streetName;
                vm.person.billingAddress.bulidingName = adress.buildingName;
            }







            vm.init();

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

            function isSingapore(countryId) {
                var countryMaster = $scope.vm.CountryMasterLookUp;

                if (countryMaster) {
                    var singapore = countryMaster.find(function (item) {
                        return item.code.toUpperCase() == 'SG';
                    });

                    if (singapore && countryId == singapore.id) {
                        return true;
                    }
                }

                return false;
            }

            // Validation definition
            vm.validationOptions = {
                rules: {
                    Email: {
                        email: true
                    },
                    //'NricAddress.PostalCode': {
                    //    singaporePostalCode: 'nricAddress',
                    //},
                    'ResidentialAddress.PostalCode': {
                        singaporePostalCode: 'residentialAddress'
                    },
                    'BillingAddress.PostalCode': {
                        singaporePostalCode: 'billingAddress'
                    },
                    'NricAddress.BlockNo': {
                        maxCountBlk: { 'for': 'Block/House No.', 'lengthVal': 5 }
                    },
                    'NricAddress.UnitNo': {
                        maxCountStry: { 'for': 'Storey/Unit No.', 'lengthVal': 10 }
                    },
                }
            };

            $validator.addMethod('singaporePostalCode', function (value, element, options) {
                var address = (function () {
                    return vm.person[options];
                })();

                if ((address && isSingapore(address.countryId)) && (value && value.length != 6)) {
                    return false;
                }

                return true;
            }, 'Please enter 6 digits only.')

            $validator.addMethod('maxCountBlk', function (value, element, options) {
                optionsGlobal = options;
                if (value.length > options.lengthVal && value.length != 0) {
                    return false;
                } else {
                    return true;
                }
            }, 'Block/House No. cannot be more than 5 characters');

            $validator.addMethod('maxCountStry', function (value, element, options) {
                optionsGlobal = options;
                if (value.length > options.lengthVal && value.length != 0) {
                    return false;
                } else {
                    return true;
                }
            }, 'Storey/Unit No. cannot be more than 10 characters');
        }
    ]);
})();