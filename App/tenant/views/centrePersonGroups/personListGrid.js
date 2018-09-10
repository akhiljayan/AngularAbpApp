(function (_) {
    appModule.component('personListGrid', {
        bindings: {
            personModel: '<',
            selectedPersonList: '=',
            selectedPersonObj: '=',
            filterText: '<',
            selectAll: '<',
            onResetSelectAll: '&',
            onFindSamePerson: '&',
            showSelectedPersonList: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$filter',
            function ($filter) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.personListLoading = false;

                ctrl.$onChanges = function (changes) {
                    if (ctrl.personModel && ctrl.personModel.length > 0 &&
                        ctrl.selectedPersonList && ctrl.selectedPersonList.length > 0) {
                        ctrl.load();
                    }

                    if (changes.selectAll && changes.selectAll.currentValue != undefined &&
                        ctrl.personModel && ctrl.personModel.length > 0) {
                        if (changes.selectAll.currentValue) {
                            ctrl.selectAllFn();
                        }
                        else {
                            ctrl.deselectAllFn();
                        }
                    }
                };

                ctrl.selectAllFn = function () {
                    var filterPersonModel = $filter('filter')(ctrl.personModel, ctrl.filterText);

                    for (var i = 0; i < filterPersonModel.length; i++) {
                        var participant = filterPersonModel[i];

                        if (!participant.isCancelled) {
                            participant.selected = true;

                            var found = ctrl.selectedPersonList.indexOf(participant.id) > -1;

                            if (!found && participant.selected) {
                                ctrl.selectedPersonList.push(participant.id);

                                if (!!ctrl.selectedPersonObj) {
                                    ctrl.selectedPersonObj.push(participant);
                                }
                            }
                        }
                    }
                };

                ctrl.deselectAllFn = function () {
                    var filterPersonModel = $filter('filter')(ctrl.personModel, ctrl.filterText);

                    for (var i = 0; i < filterPersonModel.length; i++) {
                        var participant = filterPersonModel[i];

                        participant.selected = false;

                        var index = ctrl.selectedPersonList.indexOf(participant.id);

                        if (index > -1) {
                            ctrl.selectedPersonList.splice(index, 1);

                            if (!!ctrl.selectedPersonObj) {
                                ctrl.selectedPersonObj.splice(index, 1);
                            }
                        }
                    }
                };

                ctrl.load = function () {
                    ctrl.selectedPersonList.filter(function (element) {
                        ctrl.personModel.find(function (obj) {
                            if (obj.id == element) {
                                obj.selected = true;
                                return obj.id == element;
                            }
                        });
                    });

                    // Sort selected first (sort by selected, then fullName)
                    //if (ctrl.selectAll == undefined) {
                    //    ctrl.personModel = _.sortBy((_.sortBy(ctrl.personModel, 'fullName')), 'selected');
                    //}
                };

                ctrl.selectedPerson = function (person) {
                    ctrl.onResetSelectAll();

                    if (!person.isCancelled) {
                        person.selected = !person.selected;

                        var found = ctrl.selectedPersonList.indexOf(person.id) > -1;

                        if (!found && person.selected) {
                            ctrl.selectedPersonList.push(person.id);

                            if (!!ctrl.selectedPersonObj) {
                                ctrl.selectedPersonObj.push(person);
                            }
                        }
                        else if (found && !person.selected) {
                            var index = ctrl.selectedPersonList.indexOf(person.id);
                            ctrl.selectedPersonList.splice(index, 1);

                            if (!!ctrl.selectedPersonObj) {
                                ctrl.selectedPersonObj.splice(index, 1);
                            }
                        }

                        ctrl.onFindSamePerson({
                            personId: person.id,
                            isSelected: person.selected
                        });
                    }
                };
            }],
        templateUrl: '~/App/tenant/views/centrePersonGroups/personListGrid.cshtml'
    });
})(_);