(function (angular, $) {
    appModule.directive('multiSelect', function () {

        function link(scope, element, attrs) {
            var options = {
                enableClickableOptGroups: true,
                includeSelectAllOption: true,
                numberDisplayed: 1,
                nonSelectedText: "Select " + attrs["label"],
                onDropdownShow: function (event) {
                    if (attrs.isDisableActiveOptions == 'true') {
                        var nextSibling = event.relatedTarget.nextSibling;

                        for (var i = 1; i < nextSibling.children.length; i++) {
                            var nextSiblingChild = nextSibling.children[i];
                            var inputCbx = $(nextSiblingChild).children().children().children();

                            if ($(nextSiblingChild).hasClass('active')) {
                                $(nextSiblingChild).addClass('disabled');
                                inputCbx.prop('disabled', true);
                            }
                        }
                    }
                },
                onChange: function (elem, checked) {
                    element.change();
                }
            };
            element.multiselect(options);

            scope.$watch(attrs['optionchange'], function (v) {
                element.multiselect('rebuild');
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    });
})(angular, $);