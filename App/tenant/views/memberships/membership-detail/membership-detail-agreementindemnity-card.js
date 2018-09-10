(function (_) {
    appModule.component('membershipDetailAgreementindemnityCard', {
        require: {
            parentCtrl: '^membershipDetail'
        },
        bindings: {
            mode: '<',
            model: '=',
            permissions: '<',
            onUpdate: '&',
            onReload: '&',
            onSave: '&',
            savesignatureapi: "=" //Save signature from parent
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$timeout', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.person', 'abp.services.app.membership', '$filter', 'abp.services.app.masterLookUp',
            function ($scope, $timeout, $stateParams, commonLookupService, userService, patientService, membershipService, $filter, masterLookup) {

                var ctrl = this;
                ctrl.IsAgreed = false;
                ctrl.membershipStatus = app.consts.membershipStatus;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.savesignatureapi = {};
                    ctrl.savesignatureapi.saveSignature = saveSignature;

                    ctrl.agreementLabel = abp.setting.get('App.Membership.MembershipAgreementAndIndemnity');
                    masterLookup.getMasterTypeItems({
                        type: 'Membership Agreement Options'
                    }).then(function (result) {
                        ctrl.membershipagreement = result.data;
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
                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                    }
                };

                ctrl.$onChanges = function (changes) {
                    ctrl.workingModel = ctrl.model;
                    if (ctrl.model) {
                        if (ctrl.model.applicationStatus == 1 && ctrl.model.membershipAgreementOption.code == 'Agree') {
                            ctrl.IsAgreed = true;
                        }
                        else {
                            ctrl.IsAgreed = false;
                        }
                        ctrl.dataurl = ctrl.model.signatureBody;
                        $timeout(ctrl.manageCheckbox(), 1000);
                    }
                };

                //Saving signature
                function saveSignature() {
                    ctrl.signature = $scope.$$childHead.accept();
                    if (ctrl.signature.isEmpty) {
                        ctrl.workingModel.signatureBody = null;
                    } else {
                        ctrl.model.signatureBody = ctrl.signature.dataUrl;
                    }
                    //event.preventDefault();
                };

                ctrl.accept = function () {
                    return {
                        isEmpty: $scope.dataurl === EMPTY_IMAGE,
                        dataUrl: $scope.dataurl
                    };
                };

                ctrl.clear = function (event) {
                    ctrl.dataurl = null;
                    ctrl.signature = null;
                    ctrl.workingModel.signatureBody = null;
                    ctrl.workingModel.signatureDate = null;


                    ctrl.parentCtrl.form.SignatureDate.$setPristine(false);
                    var dateElements = angular.element('[ng-model="vm.workingModel.signatureDate"]');
                    angular.forEach(dateElements, function (elm) {
                        var angularElm = angular.element(elm);
                        if (angularElm.hasClass('ng-touched')) {
                            angularElm.removeClass('ng-touched');
                        }
                    });
                    //angular.forEach(dateElements, function (elm) {
                    //    var angularElm = angular.element(elm);
                    //    var parent = angularElm.parent();
                    //    var parentFormElm = parent.parent('div.form-md-line-input').first();
                    //    if (angularElm.hasClass('has-error')) {
                    //        angularElm.removeClass('has-error');
                    //        angular.element(parentFormElm).removeClass('has-error');
                    //        var hasErrorChild = parent[0].querySelector("span.help-block.has-error");
                    //        angular.element(hasErrorChild).remove();
                    //    }
                    //});
                }

                //ctrl.cancel = function () {
                //    closeEditMode();
                //};

                //// callbacks
                //function closeEditMode() {
                //    ctrl.onReload();
                //    ctrl.mode = 'view';
                //}

                ctrl.manageCheckbox = function () {
                    if (ctrl.model && ctrl.model.membershipAgreementOption && ctrl.membershipagreement) {
                        var found = ctrl.membershipagreement.find(function (m) { return m.id === ctrl.model.membershipAgreementOption.id });
                        var index = ctrl.membershipagreement.indexOf(found);
                        if (index != -1) {
                            ctrl.membershipagreement[index].selected = true;
                        }
                    };
                };


                ctrl.onChangeAgreement = function (selected) {
                    ctrl.model.membershipAgreementOption = null;
                    ctrl.model.membershipAgreementOptionId = null;
                    for (var i = 0; i < ctrl.membershipagreement.length; i++) {
                        if (ctrl.membershipagreement[i].code != selected.code) {
                            ctrl.membershipagreement[i].selected = false;
                        }
                        if (ctrl.membershipagreement[i].selected) {
                            ctrl.model.membershipAgreementOption = ctrl.membershipagreement[i];
                            ctrl.model.membershipAgreementOptionId = ctrl.membershipagreement[i].id;
                        }
                    }

                    if (selected.selected && selected.code == 'Agree') {
                        ctrl.model.membershipStatus = ctrl.membershipStatus.Active;
                    }
                    else if (selected.selected && selected.code == 'Disagree') {
                        ctrl.model.membershipStatus = ctrl.membershipStatus.Withdrawn;
                    }
                    else {
                        ctrl.model.membershipStatus = ctrl.membershipStatus.Active;
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/memberships/membership-detail/membership-detail-agreementindemnity-card.cshtml'
    });
})(_);