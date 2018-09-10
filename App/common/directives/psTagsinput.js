(function (angular, _) {
    appModule.directive('psTagsinput', [
        function () {
            function convertHashtagToString(hashtag) {
                if (angular.isObject(hashtag)) {
                    return hashtag.name;
                }

                return hashtag;
            }

            return {
                restrict: 'EA',
                scope: {
                    model: '=ngModel'
                },
                template: '<select multiple></select>',
                replace: false,
                link: function (scope, element, attrs) {
                    if (!angular.isArray(scope.model)) {
                        scope.model = [];
                    }

                    var select = $('select', element);

                    select.tagsinput();

                    for (var i = 0; i < scope.model.length; i++) {
                        select.tagsinput('add', convertHashtagToString(scope.model[i]));
                    }

                    select.on('itemAdded', function (event) {
                        if (_.findIndex(scope.model, { name: event.item }) === -1) {
                            scope.model.push({
                                name: event.item,
                                id: ''
                            });
                        }
                    });

                    select.on('itemRemoved', function (event) {
                        var index = _.findIndex(scope.model, { name: event.item });

                        if (index >= 0) {
                            scope.model.splice(index, 1);
                        }
                    });

                    var prev = scope.model.slice();

                    scope.$watch('model', function () {
                        if (!angular.isArray(scope.model)) {
                            scope.model = [];
                        }

                        var added = scope.model.filter(function (item) {
                            return _.findIndex(prev, { name: item.name }) === -1;
                        });

                        var removed = prev.filter(function (item) {
                            return _.findIndex(scope.model, { name: item.name }) === -1;
                        });

                        prev = scope.model.slice();

                        for (var i = 0; i < removed.length; i++) {
                            select.tagsinput('remove', convertHashtagToString(removed[i]));
                        }

                        select.tagsinput('refresh');

                        for (var i = 0; i < added.length; i++) {
                            select.tagsinput('add', convertHashtagToString(added[i]));
                        }
                    }, true);
                }
            };
        }
    ]);
})(angular, _);