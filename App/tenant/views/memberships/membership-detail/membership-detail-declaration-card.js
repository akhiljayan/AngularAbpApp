(function (_) {
    appModule.component('membershipDetailDeclarationCard', {
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
            '$scope', '$timeout', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', '$filter', 'abp.services.app.masterLookUp',
            function ($scope, $timeout, $stateParams, commonLookupService, userService, patientService, membershipService, $filter, masterLookup) {
                var ctrl = this;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    masterLookup.getMasterTypeItems({
                        type: 'Membership Declaration'
                    }).then(function (result) {
                        ctrl.membershipdeclaration = result.data;
                        $timeout(ctrl.manageCheckbox(), 1000);
                    });
                    if (ctrl.model) {
                        userService.getOUUsers({}).then(function (result) {
                            var options = result.data.items;
                            ctrl.users = options.map(function (option) {
                                return {
                                    id: option.id,
                                    description: option.name
                                }
                            });
                        });
                    }
                };

                ctrl.$onChanges = function (changes) {
                    ctrl.workingModel = ctrl.model;
                    if (ctrl.model) {
                        $timeout(ctrl.manageCheckbox(), 1000);
                    }
                };

                ctrl.save = function (event) {
                    ctrl.onUpdate({
                        event: {
                            data: ctrl.model,
                            success: closeEditMode
                        }
                    });
                    event.preventDefault();
                };

                ctrl.cancel = function () {
                    closeEditMode();
                };

                ctrl.declaration = function ($index) {
                    var count = 0;
                    angular.forEach(ctrl.membershipdeclaration, function (item) {
                        if (item.isActive) {
                            ctrl.model = item;
                        }
                    });
                }

                // callbacks
                function closeEditMode() {
                    ctrl.onReload();
                    ctrl.mode = 'view';
                }

                ctrl.declarationonchange = function ($index) {
                    ctrl.model.membershipDeclaration = [];
                    for (var i = 0; i < ctrl.membershipdeclaration.length; i++) {
                        if (ctrl.membershipdeclaration[i].selected) {
                            var declarationobject = {
                                tenantId: abp.session.tenantId,
                                membershipId: ctrl.model.id,
                                membershipDeclarationMasterId: ctrl.membershipdeclaration[i].id
                            };
                            ctrl.model.membershipDeclaration.push(declarationobject);
                        };
                    };
                };

                ctrl.manageCheckbox = function () {
                    if (ctrl.model && ctrl.model.membershipDeclaration && ctrl.membershipdeclaration) {
                        angular.forEach(ctrl.model.membershipDeclaration, function (li) {
                            var found = ctrl.membershipdeclaration.find(function (m) { return m.id === li.membershipDeclarationMasterId });
                            var index = ctrl.membershipdeclaration.indexOf(found);
                            if (index != -1) {
                                ctrl.membershipdeclaration[index].selected = true;
                            }
                        });
                    };
                };
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-declaration-card.cshtml'
    });
})(_);