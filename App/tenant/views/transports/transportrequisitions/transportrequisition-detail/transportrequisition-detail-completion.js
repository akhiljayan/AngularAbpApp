(function () {
    appModule.component('completeTransportRequisition', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controllerAs: 'vm',
        controller: [
            'abp.services.app.masterLookUp', 'abp.services.app.user',
            function (masterLookupService, userService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.saving = false;

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

                                if (role.roleName == 'Admin') {
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
                        type: 'Vehicle Type'
                    }).then(function (result) {
                        ctrl.vehicleTypeMaster = result.data;
                    });
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.resolve) {
                        ctrl.workingModel = angular.copy(ctrl.resolve.transportRequisition);
                        ctrl.permissions = ctrl.resolve.permissions;
                        ctrl.workingModel.pickupStatus = 'Completed';

                        if (ctrl.workingModel.tripType == 'TwoWays') {
                            ctrl.workingModel.returnStatus = 'Completed';
                        }
                    }
                };

                ctrl.cancel = function () {
                    ctrl.modalInstance.dismiss();
                };

                ctrl.save = function () {
                    if (!ctrl.saving) {
                        ctrl.saving = true;

                        //Complete Transport Requisition record
                        ctrl.modalInstance.close(ctrl.workingModel);

                        ctrl.saving = false;
                    }
                };
            }
        ],
        templateUrl: "~/App/tenant/views/transports/transportrequisitions/transportrequisition-detail/transportrequisition-detail-completion.cshtml"
    });
})();