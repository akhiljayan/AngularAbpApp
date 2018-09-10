(function () {
    appModule.component('transportrequisitionDetailBookingCard', {
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
            'abp.services.app.masterLookUp', 'abp.services.app.user', '$filter',
            function (masterLookupService, userService, $filter) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    masterLookupService.getMasterTypeItems({
                        type: 'Vehicle Type'
                    }).then(function (result) {
                        ctrl.transportTypeMaster = result.data;
                    });

                    userService.getUsers({
                    }).then(function (result) {
                        var users = result.data.items;

                        ctrl.users = users.map(function (option) {
                            return {
                                id: option.id,
                                description: option.name
                            }
                        });
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        if (ctrl.isNumber(ctrl.model.tripType)) {
                            ctrl.model.tripType = ctrl.model.tripType == 0 ? 'OneWay' : 'TwoWays';
                        }

                        if (ctrl.isNumber(ctrl.model.purpose)) {
                            ctrl.model.purpose = $filter('enumText')(ctrl.model.purpose, 'transportRequisitionPurpose');
                        }

                        if (ctrl.model.transportTypeId == "00000000-0000-0000-0000-000000000000") {
                            ctrl.model.transportTypeId = null;
                        }
                    }
                };

                ctrl.loadTransportTypeDetails = function (transportTypeId) {
                    if (!transportTypeId) {
                        ctrl.model.transportType = null;
                        ctrl.model.othersTransportType = null;
                        return;
                    }

                    masterLookupService.getMasterTypeItems({
                        type: 'Vehicle Type'
                    }).then(function (result) {
                        var transportTypes = result.data;

                        for (var i = 0; i < transportTypes.length; i++) {
                            if (transportTypes[i].id == transportTypeId) {
                                ctrl.model.transportType = transportTypes[i];
                                break;
                            }
                        }

                        if (ctrl.model.transportType.description != 'Others') {
                            ctrl.model.othersTransportType = null;
                        }
                    });
                };

                ctrl.plannedPickupDateTimeValidator = function (appointmentDateTime, plannedPickupDateTime) {
                    if (!plannedPickupDateTime) {
                        return true;
                    }

                    plannedPickupDateTime = Date.parse(plannedPickupDateTime);

                    if (appointmentDateTime) {
                        appointmentDateTime = Date.parse(appointmentDateTime);

                        if (plannedPickupDateTime >= appointmentDateTime) {
                            return false;
                        }
                    }

                    return true;
                };

                ctrl.test = function (inputDate) {
                    if (inputDate) {
                        return new Date(inputDate);
                    } else {
                        return new Date();
                    }
                }

                ctrl.isNumber = function (text) {
                    return angular.isNumber(text);
                };
            }
        ],
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail-booking-card.cshtml"

    });
})();