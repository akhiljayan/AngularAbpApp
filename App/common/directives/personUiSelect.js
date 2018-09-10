(function () {
    appModule.component('personUiSelect', {
        bindings: {
            personId: '=',
            uiselectDisabled: '<',
            onSelect: '&',
            hasAdmission: '<',
            hasPreAdmission: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', 'abp.services.app.commonLookup',
            function ($scope, commonLookupService) {
                var ctrl = this;
                ctrl.prepersonId = null;

                ctrl.$onInit = function () {
                    if (ctrl.personId != null && ctrl.personId != undefined && ctrl.personId != app.consts.EmptyGuid) {
                        ctrl.disabled = true;
                    }
                 
                };

                ctrl.$onChanges = function (changes) {
         
                    if (changes.uiselectDisabled && changes.uiselectDisabled.currentValue) {
                        ctrl.disabled = changes.uiselectDisabled.currentValue;
                    }

                };

                ctrl.$doCheck = function () {
                   
                        if (!angular.equals(ctrl.personId, ctrl.prepersonId)) {
                            ctrl.refreshPerson(null, null, false);
                            ctrl.prepersonId = angular.copy(ctrl.personId);
                        }
                     
                };

                ctrl.select = function (item) {
                    if (item != null) {
                        callback(item.id);
                    }
                   
                };

                function callback(personId) {
                    ctrl.onSelect({ personId: personId });
                }

         
                ctrl.refreshPerson = function ($select, $event, isLoadMore) {

                    if (ctrl.personId == undefined) {
                        ctrl.personId = null;
                    }
                    var id = ctrl.disabled ? ctrl.personId : app.consts.EmptyGuid;

                    //Only Require to modify the above
                    var result = app.consts.grid.defaultPageSize;
                    var skipcount = 0;
                    var concat = false;
                    var searchValue = null;
                    if ($select != null) {
                        searchValue = $select.search;
                    }
                    if (isLoadMore) {
                        if (!$event) {
                            ctrl.page = 1;
                        } else {
                            $event.stopPropagation();
                            $event.preventDefault();
                            ctrl.page++;
                        }
                        skipcount = ctrl.page * result;
                        concat = true;
                    } else {
                        ctrl.page = 0;
                    }
                    var param = { id: id, filter: searchValue, skipCount: skipcount, maxResultCount: result };
                    // Normal get Person Lookup 
                    if (!(ctrl.hasAdmission || ctrl.hasPreAdmission)) {
                        commonLookupService.findActivePatient(param).then(function (result) {
                            if (concat) {
                                ctrl.persons = ctrl.persons.concat(result.data.items);
                            } else {
                                ctrl.persons = result.data.items;
                            }
                            ctrl.personsCount = result.data.totalCount;

                        });
                    }
                    /*
                        Person Lookup for Referral Person
                        with Open Referral Service Type and
                        Person with active admission
                    */
                    else {
                        commonLookupService.findPatients($.extend({ hasAdmission: ctrl.hasAdmission }, param)).then(function (result) {
                            if (concat) {
                                ctrl.persons = ctrl.persons.concat(result.data.items);
                            } else {
                                ctrl.persons = result.data.items;
                            }
                            ctrl.personsCount = result.data.totalCount;

                        });
                    }

                };
            },
        ],
        templateUrl: '~/App/common/directives/personUiSelect.cshtml'
    });
})();