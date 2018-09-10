(function () {
    appModule.controller('tenant.views.person.personProfile', [
        '$scope', '$timeout', '$filter', 'abp.services.app.masterLookUp', '$stateParams', 'abp.services.app.person', '$anchorScroll', '$location', 'abp.services.app.user', '$uibModal',
        function ($scope, $timeout, $filter, masterLookup, $stateParams, personService, $anchorScroll, $location, userService, $uibModal) {
            var vm = this;
            $anchorScroll.yOffset = 100;
            vm.appPath = abp.appPath;
            vm.monthNames = abp.consts.months.map(function (i) {
                return i.name;
            });
            vm.loading = false;
            vm.isCreateMode = !$stateParams.id;
            vm.isReadOnlyMode = false;
            vm.age = 0;
            vm.creatorName = '';
            vm.modifierName = '';
            vm.nricAddressIndex = 0;
            vm.residentialAddressIndex = 1;
            vm.billingAddressIndex = 2;
            vm.person = {
                addresses: []
            };

            // init addresses
            for (var i = 0; i < 3; i++) {
                vm.person.addresses.push({
                    addressType: i,
                    postalCode: null,
                    block: null,
                    streetName: null,
                    bulidingName: null,
                    unitNumber: null,
                    countryId: null,
                    ownerShip: null,
                    typeOfAccomodationId: null
                });
            }

            vm.gotoAnchor = function (key) {
                $location.hash(key);
                $anchorScroll();
            };

          

            vm.load = function () {
                if ($stateParams.id) {
                    vm.loading = true;

                    personService.getPerson(
                        $stateParams.id
                    ).then(function (result) {
                        var data = result.data;

                        // workaround for option value

                        data.race = data.race + '';
                        data.nationality = data.nationality + '';
                        data.citizenship = data.citizenship + '';
                        data.religion = data.religion + '';
                        data.liftLanding = convertToString(data.liftLanding);
                        data.livingArrangement = convertToString(data.livingArrangement);

                        if (data.dateOfBirth) {
                            data.dateOfBirth = moment(data.dateOfBirth).format('D MMM YYYY');
                        }

                        if (data.dateOfIssue) {
                            data.dateOfIssue = moment(data.dateOfIssue).format('D MMM YYYY');
                        }

                        // check the address sequence as the sequence will be different after saved 
                        for (var i = 0; i < data.addresses.length; i++) {
                            var address = data.addresses[i];

                            if (address.addressType == 0) {
                                vm.nricAddressIndex = i;
                            } else if (address.addressType == 1) {
                                vm.residentialAddressIndex = i;
                            } else if (address.addressType == 2) {
                                vm.billingAddressIndex = i;
                            }

                            data.addresses[i].ownerShip = convertToString(address.ownerShip);
                        }

                        // bind to person
                        vm.person = data;

                        vm.age = $filter("ageFilter")(vm.person.dateOfBirth);
                        vm.isReadOnlyMode = !vm.person.isActive;

                        userService.getUserForEdit({
                            id: vm.person.creatorUserId
                        }).then(function (result) {
                            vm.creatorName = result.data.user.name;
                        });

                        userService.getUserForEdit({
                            id: vm.person.lastModifierUserId
                        }).then(function (result) {
                            vm.modifierName = result.data.user.name;
                        });

                        //if (vm.person.tags) {
                        //    if (vm.person.tags.length > 0) {
                        //        for (var index in vm.person.tags) {
                        //            $('#hashtags').tagsinput('add', vm.person.tags[index].tag);
                        //        }
                        //    }
                        //}

                        vm.loading = false;
                    });
                }
            };

            vm.save = function (backToListing) {
                if (!$("#personFrom").valid()) {
                    return;
                }

                //vm.person.tags = vm.person.tags || [];
                //var hashTags = $("#hashtags").tagsinput('items');
                //var tags = [];
                //for (var tag in hashTags) {
                //    var tagObject = { tag: "", isDuplicate: false };
                //    tagObject.tag = hashTags[tag];
                //    tags.push(tagObject);
                //}

                //var personTagsNew = [];
                //$.each(vm.person.tags, function (index, item) {
                //    var found = false;
                //    $.each(tags, function (innerIndex, innerItem) {
                //        if (innerItem.tag == item.tag) {
                //            found = true;
                //            innerItem.isDuplicate = true;
                //        }
                //    });
                //    if (!found) {
                //        item.isDeleted = true;
                //        personTagsNew.push(item);
                //    }
                //});
                //vm.person.tags = personTagsNew;
                //$.each(tags, function (index, item) {
                //    if (!item.isDuplicate) {
                //        vm.person.tags.push({ tag: item.tag });
                //    }
                //});

                if ($stateParams.id) {
                    personService.updatePerson(
                        vm.person
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.load();
                    });
                } else {

                    personService.createPerson(
                        vm.person
                    ).then(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));

                        if (backToListing) {
                            $location.path('/tenant/person');
                        } else {
                            $location.path('/tenant/person/' + result.data);
                        }
                    });
                }
            };

            vm.sameAsNricAddressChange = function (addressType) {
                var targetFields = ['postalCode', 'block', 'streetName', 'bulidingName', 'unitNumber',
                    'countryId', 'ownerShip', 'typeOfAccomodationId'];
                var nricAddress = vm.person.addresses[vm.nricAddressIndex];

                if (addressType == 1) {
                    // Residential
                    if (nricAddress != null && vm.person.residentialAddressSameAsNricAddress) {
                        for (var prop in nricAddress) {
                            if (targetFields.indexOf(prop) >= 0) {
                                vm.person.addresses[vm.residentialAddressIndex][prop] = nricAddress[prop];
                            }
                        }
                    }
                } else if (addressType == 2) {
                    // Billing
                    if (nricAddress != null && vm.person.billingAddressSameAsNricAddress) {
                        for (var prop in nricAddress) {
                            if (targetFields.indexOf(prop) >= 0) {
                                (vm.person.addresses[vm.billingAddressIndex][prop] = nricAddress[prop]);
                            }
                        }
                    }
                }
            };

            vm.openCreateOrEditModal = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/person/createOrEditCourseSkill.cshtml',
                    controller: 'tenant.views.person.createOrEditCourseSkill as vm',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return id;
                        },
                        // Workaround to update life long learning
                        person: function () {
                            return vm.person;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //vm.load();
                });
            };

            function convertToString(value) {
                return value == null ? '' : value + '';
            }

            // masters
            vm.salutationMaster = [];
            vm.genderMaster = [];
            vm.countryMaster = [];
            vm.raceMaster = [];
            vm.citizenshipMaster = [];
            vm.highestEducationMaster = [];
            vm.nationalityMaster = [];
            vm.religionMaster = [];
            vm.occupationMaster = [];
            vm.ownershipMaster = [];
            vm.typesOfAccommodationMaster = [];
            vm.maritalStatusMaster = [];
            vm.registrationDocumentMaster = [];
            vm.liftLandingMaster = [];
            vm.livingArrangementMaster = [];

            vm.init = function () {
                // load master 
                masterLookup.getMasterTypeItems({
                    type: 'Salutation'
                }).then(function (result) {
                    vm.salutationMaster = result.data;

                });

                masterLookup.getMasterTypeItems({
                    type: 'Gender'
                }).then(function (result) {
                    vm.genderMaster = result.data;

                });

                masterLookup.getMasterTypeItems({
                    type: 'OwnerShip'
                }).then(function (result) {
                    vm.ownershipMaster = result.data;
                });


                masterLookup.getMasterTypeItems({
                    type: 'RegistrationDocument'
                }).then(function (result) {
                    vm.registrationDocumentMaster = result.data;

                    var nricBlueItem = result.data.filter(function (item) { return item.description == 'NRIC Blue'; });
                    var nricPinkItem = result.data.filter(function (item) { return item.description == 'NRIC Pink'; });
                    var finItem = result.data.filter(function (item) { return item.description == 'Fin'; });
                    var notApplicableItem = result.data.filter(function (item) { return item.description == 'N/A'; });

                    regDocumentTypes = {
                        nricBlue: nricBlueItem.length > 0 ? nricBlueItem[0].id : '',
                        nricPink: nricPinkItem.length > 0 ? nricPinkItem[0].id : '',
                        fin: finItem.length > 0 ? finItem[0].id : '',
                        notApplicable: notApplicableItem.length > 0 ? notApplicableItem[0].id : ''
                    };
                });

                masterLookup.getMasterTypeItems({
                    type: 'LiftLanding'
                }).then(function (result) {
                    vm.liftLandingMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'LivingArrangement'
                }).then(function (result) {
                    vm.livingArrangementMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'MarialStatus'
                }).then(function (result) {
                    vm.maritalStatusMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Country'
                }).then(function (result) {
                    vm.countryMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Race'
                }).then(function (result) {
                    vm.raceMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Citizenship'
                }).then(function (result) {
                    vm.citizenshipMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Highest Education'
                }).then(function (result) {
                    vm.highestEducationMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Nationality'
                }).then(function (result) {
                    vm.nationalityMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Religion'
                }).then(function (result) {
                    vm.religionMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Occupation'
                }).then(function (result) {
                    vm.occupationMaster = result.data;
                });

                masterLookup.getMasterTypeItems({
                    type: 'Type Of Accommodation'
                }).then(function (result) {
                    vm.typesOfAccommodationMaster = result.data;
                });

                vm.load();
            };

            //$scope.$watch('$viewContentLoaded', bindJqueryEvents);

            //function bindJqueryEvents() {
            //    $("#hashtags").tagsinput();
            //}

            vm.init();

            $scope.$watch('$viewContentLoaded', bindJqueryEvents);

            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                        $('input-group date').datepicker();
                        $('#personFrom').ValidateControls({
                            rules: {
                                FullName: {
                                    required: true
                                },
                                DocumentNumber: {
                                    remote: $.jqueryRemoteExtend({
                                        url: "api/services/app/person/checkIdentificationNumberDuplicacy",
                                        data: documentDataObject(),
                                    })
                                }
                            },
                            messages: {
                                DocumentNumber: { remote: function () { return abp.localization.localize("DuplicateIDFormat") } }
                            }
                        });
                    });

                    function documentDataObject() {

                        return {
                            personId: function () { return $('#personFrom input[name="personId"]').text(); }
                        };
                    }

                    function GetValue(selector) {
                        return $(selector).val()
                    }

                    function GetText(selector) {
                        return $(selector).text()
                    }
                }, 0);
            }
        }
    ]);
})();