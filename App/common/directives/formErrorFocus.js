(function () {
    appModule.directive('form', ['$timeout', '$window', function ($timeout, $window) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs, formCtrl) {


                var $win = angular.element($window); // wrap window object as jQuery object
                var userAgent = $window.navigator.userAgent;
                var mywindow = $(window);
                var isTab = window.matchMedia('(max-width: 780px)').matches;
                var isipadOriPhone = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android|IEMobile/i);

                if (angular.element(element).hasClass('scrollable-form-body')) {
                    if (isTab || isipadOriPhone) {
                        angular.element(element).removeClass('scrollable-form-body');
                    }
                }


                // set up event handler on the form element
                element.on('submit', function () {
                    // find the first invalid element
                    var firstInvalid = element[0].querySelector('.ng-invalid');
                    // if we find one, set focus
                    if (firstInvalid) {
                        if (angular.element(firstInvalid).hasClass('ui-select-container')) {
                            var uiSelect = angular.element(firstInvalid).controller('uiSelect');
                            uiSelect.focusser[0].focus();
                        } else {
                            firstInvalid.focus();
                            //firstInvalid.select();
                        }
                    }

                });

                scope.$on('focus-on-error-field', function () {
                    var firstInvalid = element[0].querySelector('.ng-invalid');
                    // if we find one, set focus
                    if (firstInvalid) {
                        //if (angular.element(firstInvalid).hasClass('ui-select-container') || angular.element(firstInvalid).hasClass('ui-select-search')) {
                        //    var uiSelect = angular.element(firstInvalid).controller('uiSelect');
                        //    uiSelect.focusser[0].focus();
                        //    //uiSelect.open = true;
                        //    //uiSelect.activate();
                        //} else {
                        //    firstInvalid.focus();
                        //    firstInvalid.select();
                        //}
                    }

                });
            }
        };
    }]);
})();