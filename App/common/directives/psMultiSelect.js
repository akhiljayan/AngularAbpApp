(function (angular, $) {
    appModule.directive('psMultiselect', [
        '$parse', '$timeout',
        function ($parse, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var ngMode = $parse(attrs.ngModel);
                    var isInitialized = false;

                    var selectionLimit = attrs.msSelectionLimit;

                    element.multiSelect({
                        selectableHeader: (attrs.msSourceTitle ? '<label>' + attrs.msSourceTitle + '</label>' : false),
                        selectionHeader: (attrs.msDestinationTitle ? '<label>' + attrs.msDestinationTitle + '</label>' : false),
                        keepOrder: (attrs.msKeepSortOrder != undefined && attrs.msKeepSortOrder == "true" ? true : false),
                        sortable: (attrs.msSortable != undefined && attrs.msSortable == "true" ? true : false),
                        afterSelect: function (value) {

                            var that = this;

                            if (selectionLimit != undefined && selectionLimit > 0) {
                                if (this.$element.val().length > selectionLimit) {
                                    abp.message.error(attrs.msSelectionLimitMessage);
                                    element.multiSelect('deselect', value[0]);
                                }
                            }
                        }
                    });

                    scope.$watch(attrs.repeat, function (value) {

                        if (value == null)
                            return;
 
                        value.forEach(function (item) {
                            element.multiSelect("addOption", { value: item.id, text: item.description });
                        });
                    });

                    scope.$watch(attrs.ngModel, function (value) {

                        if (value != undefined &&
                            value.length > 0) {

                            if (isInitialized == false) {
                                isInitialized = true;

                                element.multiSelect("refresh");
                                element.multiSelect({ keepOrder: true });
                            }
                        }
                    });
                }
            };
        }
    ]);
})(angular, $);