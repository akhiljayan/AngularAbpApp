(function () {
    appModule.component('userUiSelect', {
        bindings: {
            userId: '=',
            label: '<',
            uiselectDisabled: '<',
            onSelect: '&',
            required: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', 'abp.services.app.commonLookup',
            function ($scope, commonLookupService) {
                var ctrl = this;
                ctrl.preuserId = null;

                ctrl.$onInit = function () {
                    if (ctrl.userId != null && typeof ctrl.userId != "undefined" && ctrl.userId != app.consts.EmptyGuid) {
                        //ctrl.disabled = true
                        commonLookupService.getUserById(ctrl.userId).then(function (result) {
                            ctrl.userId = result.data.id;
                        });
                        ctrl.disabled = ctrl.uiselectDisabled;
                    } else {
                        commonLookupService.getUserById(abp.session.userId).then(function (result) {
                            ctrl.userId = result.data.id;
                        });
                    }
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.uiselectDisabled && changes.uiselectDisabled.currentValue) {
                        ctrl.disabled = changes.uiselectDisabled.currentValue;
                    }
                };

                ctrl.$doCheck = function () {
                    if (!angular.equals(ctrl.userId, ctrl.preuserId)) {
                        ctrl.refreshUser(null, null, false);
                        ctrl.preuserId = angular.copy(ctrl.userId);
                    }
                };

                ctrl.select = function (item) {
                    if (item != null) {
                        callback(item.id);
                    }
                };

                function callback(userId) {
                    ctrl.onSelect({ userId: userId });
                }

                ctrl.refreshUser = function ($select, $event, isLoadMore) {
                    if (ctrl.userId == undefined) {
                        ctrl.userId = null;
                    }
                    var id = ctrl.disabled ? ctrl.userId : app.consts.EmptyGuid;

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


                    commonLookupService.findUsersInUiSelect(param).then(function (result) {
                        if (concat) {
                            ctrl.users = ctrl.users.concat(result.data.items);
                        } else {
                            ctrl.users = result.data.items;
                        }
                        ctrl.usersCount = result.data.totalCount;

                    });


                };
            },
        ],
        templateUrl: '~/App/common/directives/userUiSelect.cshtml'
    });
})();