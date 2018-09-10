(function () {
    appModule.directive('buttonBusy', function () {
          return {
              restrict: 'A',
              scope: {
                  buttonBusy: '='
              },
              link: function ($scope, element, attrs) {

                  var disabledBefore = false;
                  var $button = $(element);
                  var $buttonInnerSpan = $button.find('span');
                  var buttonOriginalText = null;
                  
                  var $icon = $button.find('i');
                  var iconOriginalClasses = null;

                  $scope.$watch('buttonBusy', function () {
                      if ($scope.buttonBusy) {
                          //disable button
                          $button.attr('disabled', 'disabled');
                          //change icon
                          if ($icon.length) {
                              $icon.html("");
                              iconOriginalClasses = $icon.attr('class');
                              $icon.removeClass();
                              $icon.addClass('fa fa-spin fa-spinner');
                          }
                          //change text
                          if (attrs.busyText && $buttonInnerSpan.length) {
                              buttonOriginalText = $buttonInnerSpan.html();
                              $buttonInnerSpan.html(attrs.busyText);
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
                              $icon.addClass(iconOriginalClasses);
                          }
                          //restore text
                          if ($buttonInnerSpan.length && buttonOriginalText) {
                              $buttonInnerSpan.html(buttonOriginalText);
                          }
                      }
                  });
              }
          };
      });
})();


(function () {
    appModule.directive('iconButtonBusy', function () {
        return {
            restrict: 'A',
            scope: {
                iconButtonBusy: '='
            },
            link: function ($scope, element, attrs) {

                var disabledBefore = false;
                var $button = $(element);
                var $buttonInner = $button.find('i');
                var buttonOriginalText = null;

                var $icon = $button.find('span');
                var iconOriginalClasses = null;


                $scope.$watch('iconButtonBusy', function () {
                    if ($scope.iconButtonBusy) {
                        //disable button
                        $button.attr('disabled', 'disabled');
                        $button.addClass('disable-links');
                        //change icon
                        if ($icon.length) {
                            $icon.html("");
                            iconOriginalClasses = $icon.attr('class');
                            $icon.removeClass();
                            $icon.addClass('fa fa-spin fa-spinner');
                        }

                        disabledBefore = true;
                    } else {
                        if (!disabledBefore) {
                            return;
                        }

                        //enable button
                        $button.removeAttr('disabled');
                        $button.removeClass('disable-links');
                        //restore icon
                        if ($icon.length && iconOriginalClasses) {
                            $icon.removeClass();
                            $icon.addClass(iconOriginalClasses);
                        }
                    }
                });
            }
        };
    });
})();