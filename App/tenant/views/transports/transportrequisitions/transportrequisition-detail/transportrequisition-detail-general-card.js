(function () {
    appModule.component('transportrequisitionDetailGeneralCard', {
        require: {
            parentCtrl: '^transportrequisitionDetail'
        },
        bindings: {
            mode: '<',
            model: '<',
            permissions: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.masterLookUp', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.familyMember', 'abp.services.app.medicalAppointment', '$filter',
            function (masterLookupService, commonLookupService, userService, personService, familyMemberService, medicalAppointmentService, $filter) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    userService.getUsers({
                    }).then(function (result) {
                        var users = result.data.items;
                        var staffs = [];

                        for (var i = 0; i < users.length; i++) {
                            var staff = users[i];
                            var notIncluded = false;

                            // Admin role checking
                            for (var j = 0; j < staff.roles.length; j++) {
                                var role = staff.roles[j];

                                if (role.roleName == 'Admin' || staff.name == "System Service") {
                                    notIncluded = true;
                                    break;
                                }
                            }

                            if (!notIncluded) {
                                staffs.push(staff);
                            }
                        }

                        ctrl.staffs = staffs.map(function (option) {
                            return {
                                id: option.id,
                                description: option.name
                            }
                        });
                    });

                    masterLookupService.getMasterTypeItems({
                        type: 'Request For'
                    }).then(function (result) {
                        ctrl.requestForMaster = result.data;
                        });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        // Load Master Data
                        ctrl.loadAdmissions(ctrl.model.personId);
                        ctrl.loadMedicalAppointments(ctrl.model.personId);
                        ctrl.loadEscorts(ctrl.model.personId);
                        ctrl.loadFamilyMembers(ctrl.model.personId);
                       
                        if (angular.isNumber(ctrl.model.staffType)) {
                            ctrl.model.staffType = $filter('enumText')(ctrl.model.staffType, 'staffType');
                        }
                    }
                };

                ctrl.processRequestFor = function (requestForId) {
                    if (!requestForId) {
                        return;
                    }

                    ctrl.clearData();

                    masterLookupService.getMasterTypeItems({
                        type: 'Request For'
                    }).then(function (result) {
                        var requestForMaster = result.data;

                        for (var i = 0; i < requestForMaster.length; i++) {
                            if (requestForMaster[i].id == requestForId) {
                                ctrl.model.requestFor = requestForMaster[i];
                            }
                        }

                        if (ctrl.model.requestFor.description == "Person") {
                            ctrl.loadEscorts();
                        }
                    });

                };

                ctrl.loadAdmissions = function (id) {
                    if (!id) {
                        ctrl.admissions = [];
                        return;
                    }
                    var options = {};
                    options['OnlyAdmitted'] = "true";

                    commonLookupService.findAdmissions({
                        personId: id,
                        options: options
                    }).then(function (result) {
                        var options = result.data.items;

                        ctrl.admissions = options.map(function (option) {
                            return {
                                id: option.value,
                                description: option.name
                            };
                        });

                        if (ctrl.admissions.length == 1) {
                            ctrl.model.admissionId = ctrl.admissions[0].id;
                            ctrl.populateAdmissionDate(ctrl.model.admissionId);
                        }
                    });
                };

                //Populate Admission Date based on Admission Selected
                ctrl.populateAdmissionDate = function (admissionId) {
                    if (!admissionId) {
                        ctrl.model.admittedOn = null;
                        ctrl.model.dischargedOn = null;
                        return;
                    }

                    admissionService.get(
                        admissionId
                    ).then(function (result) {
                        var admission = result.data;
                        ctrl.model.admittedOn = admission.admittedOn;
                        ctrl.model.dischargedOn = admission.dischargedOn;
                    });
                };

                ctrl.loadMedicalAppointments = function (id) {
                    if (!id) {
                        ctrl.medicalAppointments = [];
                        return;
                    }

                    medicalAppointmentService.getAllMedicalAppointmentByPersonId({
                        personId: id,
                        //filterStatus: 2 // Confirmed
                    }).then(function (result) {
                        var options = result.data.items;

                        ctrl.allMedicalAppointments = options.map(function (option) {
                            return {
                                id: option.id,
                                description: option.appointmentLocation + ' (' + moment(option.appointmentDateTime).format('DD-MMM-YYYY h:mm a') + ')'
                            };
                        });

                        // filted cancelled medicalAppointment
                        ctrl.medicalAppointments = options.reduce(function (filtered, option) {
                            if (!option.isCancelled) {
                                var someNewValue = { id: option.id, description: option.appointmentLocation + ' (' + moment(option.appointmentDateTime).format('DD-MMM-YYYY h:mm a') + ')' }
                                filtered.push(someNewValue);
                            }
                            return filtered;
                        }, []);
                    });
                };

                ctrl.loadEscorts = function (id) {
                    var options = {};
                    options['NoDeceased'] = "true";
                    commonLookupService.findPersons({
                       options: options
                    }).then(function (result) {
                        var escorts = result.data.items;

                        // Remove selected person from escorts

                        ctrl.escorts = escorts.map(function (option) {
                            return {
                                id: option.id,
                                description: option.description
                            };
                        });
                    });
                };

                //ctrl.loadEscortDetails = function (escortId) {
                //    if (!escortId) {
                //        ctrl.model.escortName = null;
                //        return;
                //    }

                //    personService.getPersonForEdit({
                //        id: escortId
                //    }).then(function (result) {
                //        var escort = result.data;
                //        ctrl.model.escortName = escort.fullName;
                //    });
                //};

                ctrl.loadFamilyMembers = function (id) {
                    if (!id) {
                        ctrl.familyMemberCaregivers = [];
                        return;
                    }

                    familyMemberService.getFamilyMembersById({
                        personId: id
                    }).then(function (result) {
                        var familyMembers = result.data.items;

                        ctrl.familyMemberCaregivers = familyMembers.map(function (option) {
                            var name = option.familyMemberPerson.fullName;
                            var registrationDocumentNumber = option.familyMemberPerson.registrationDocumentNumber ? option.familyMemberPerson.registrationDocumentNumber : '-';

                            return {
                                id: option.id,
                                description: name + ' (' + registrationDocumentNumber + ')'
                            };
                        });
                    });
                };

                ctrl.loadFamilyMemberCaregiverDetails = function (familyMemberCaregiverId) {
                    if (!familyMemberCaregiverId) {
                        ctrl.model.familyMemberCaregiverContact = null;
                        return;
                    }

                    familyMemberService.getFamilyMemberByGuid(
                        familyMemberCaregiverId
                    ).then(function (result) {
                        var familyMemberCaregiver = result.data.familyMemberPerson;
                        ctrl.model.familyMemberCaregiverContact = familyMemberCaregiver.mobilePhone;
                    });
                };

                ctrl.clearOthersStaffType = function (staffType) {
                    if (staffType != 'Others') {
                        ctrl.model.othersStaffType = null;
                    }
                };

                // This method is used to clear all irrelevant data when changing Request For
                ctrl.clearData = function () {
                    ctrl.model.personId = null;
                    ctrl.model.admissionId = null;
                    ctrl.model.tCUId = null;
                    ctrl.model.escortId = null;
                    ctrl.model.escortName = null;
                    ctrl.model.familyMemberCaregiverId = null;
                    ctrl.model.familyMemberCaregiverContact = null;
                    ctrl.model.plannedVehicleNumber = null;
                    ctrl.model.staffId = null;
                    ctrl.model.staffType = null;
                    ctrl.model.othersStaffType = null;
                }

                ctrl.disableAdmission = function () {
                    var disable = true;

                    if (ctrl.mode == "new") {
                        if (ctrl.admissions.length > 1) {
                            disable = false;
                        }
                    } else {
                        if (ctrl.model.purpose == 'TCU' && !!ctrl.model.tCUId) {
                            disable = false;
                        }
                    }

                    return disable;
                }

                ctrl.getTCUName = function (Id) {
                    if (Id && ctrl.allMedicalAppointments) {
                        var tcu = ctrl.allMedicalAppointments.find(function (x) {
                            return x.id == Id;
                        });
                        if (tcu) {
                            return tcu.description;
                        }
                    }
                };
            }
        ],
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail-general-card.cshtml"
    });
})();