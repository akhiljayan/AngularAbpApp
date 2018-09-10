(function () {
    appModule.component('simplePaginator', {
        bindings: {
            data: '<',
            key: '<',
            pageSize: '<',
            smallPageSize: '<',
            onPageChanged: '&'
        },
        controller: [
            '$scope',
            function ($scope) { 
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.pageSizes = app.consts.grid.defaultPageSizes;
                ctrl.paginator = { maxResultCount: ctrl.pageSize, skipCount: 0 };
                ctrl.data = { totalCount: 0, items: [{}] };
                ctrl.currentPage = 1;
                ctrl.recordFrom = 0;
                ctrl.key = "Default";
                ctrl.recordTo = 0;

                if (ctrl.onPageChanged) {
                    ctrl.onPageChanged({
                        requestParams: ctrl.paginator
                    });
                }
            };

            ctrl.$onChanges = function (changes) {
                if (changes.key) {
                    if ((changes.key.previousValue == undefined && typeof changes.key.currentValue === 'string') || (changes.key.previousValue && typeof changes.key.currentValue === 'string' && typeof changes.key.previousValue === 'string' && changes.key.currentValue != changes.key.previousValue)) {
                        ctrl.reset();
                    }
                }

                if (changes.data && changes.data.currentValue) {
                    ctrl.data = changes.data.currentValue;

                    var totalCount = (ctrl.data.totalCount != null ? ctrl.data.totalCount : ctrl.data.length);

                    ctrl.recordFrom = Math.min(totalCount, (ctrl.currentPage - 1) * ctrl.pageSize + 1);
                    ctrl.recordTo = Math.min(totalCount, ctrl.currentPage * ctrl.pageSize);
                }

                if (changes.pageSize) {
                    if (!ctrl.pageSize) {
                        ctrl.pageSize = app.consts.grid.defaultPageSize;

                        if (ctrl.smallPageSize) {
                            ctrl.pageSize = app.consts.grid.smallPageSize;
                        }
                    }
                }
            };

            ctrl.pageChanged = function () {
                ctrl.paginator.maxResultCount = ctrl.pageSize;
                ctrl.paginator.skipCount = (ctrl.currentPage - 1) * ctrl.pageSize;

                ctrl.onPageChanged({
                    requestParams: ctrl.paginator
                });
            };

            ctrl.reset = function () {
                ctrl.currentPage = 1;
                ctrl.pageChanged();
            };

            ctrl.select = function (item) {
                ctrl.onSelect({
                    item: item
                });
            };
        }],
        templateUrl: '~/App/common/directives/simplePaginator.cshtml'
    });
})();