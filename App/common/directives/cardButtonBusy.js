(function () {
    appModule.directive('cardButtonBusy', function () {
        return {
            restrict: 'A',
            scope: {
                cardButtonBusy: '='
            },
            link: function ($scope, element, attrs) {

                var disabledBefore = false;
                var $button = $(element);
                var buttonOriginalText = null;

                var $icon = $button.find('i');
                var iconOriginalClasses = null;
                var iconOriginalText = null;

                $scope.$watch('cardButtonBusy', function () {
                    if ($scope.cardButtonBusy) {
                        //disable button
                        $button.attr('disabled', 'disabled');
                        //change icon
                        if ($icon.length) {
                            $icon.html("");
                            iconOriginalClasses = $icon.attr('class');
                            iconOriginalText = $icon.html();
                            $icon.removeClass();
                            $icon.html("");
                            $button.addClass("loading-link-button");
                            $icon.addClass('fa fa-spin fa-spinner font-18-main');
                        }

                        disabledBefore = true;
                    } else {
                        if (!disabledBefore) {
                            return;
                        }

                        //enable button
                        $button.removeAttr('disabled');
                        //restore icon
                        if ($icon.length && iconOriginalClasses) {
                            $icon.removeClass();
                            $button.removeClass("loading-link-button");
                            $icon.addClass(iconOriginalClasses);
                            $icon.html(iconOriginalText);
                        }
                    }
                });
            }
        };
    });
})();