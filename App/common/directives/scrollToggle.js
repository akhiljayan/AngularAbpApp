appModule.directive('scrollToggle', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'AC',
        scope: {
            scrollToggle: '=',
            toggleIf: '='
        },
        link: function (scope, element, attributes) {
            //scope.$watch('$viewContentLoaded', scrollMoveUp);
            $timeout(function () {
                var mypos = 0;
                var newscroll;
                $window.onscroll = function () {
                    newscroll = $window.scrollY;
                    if (newscroll < mypos) {
                        element.slideDown("slow");
                        var parentEle = element.parent('div#referral-view').first();
                        var sidebar = angular.element(parentEle[0].querySelector(".sidebar-nav-fixed-annimate"));
                        sidebar.removeClass("slidedown");
                        sidebar.addClass("slideup");
                        var parentEle = element.parent('div#referral-view').first();
                        var tab = angular.element(parentEle[0].querySelector(".page-tabs-animate"));
                        tab.slideToggle({ top: "235px" });

                    }else if(newscroll > mypos){
                        element.slideUp("slow");
                        var parentEle = element.parent('div#referral-view').first();
                        var sidebar = angular.element(parentEle[0].querySelector(".sidebar-nav-fixed-annimate"));
                        sidebar.removeClass("slideup");
                        sidebar.addClass("slidedown");
                        var parentEle = element.parent('div#referral-view').first();
                        var tab = angular.element(parentEle[0].querySelector(".page-tabs-animate"));
                        tab.slideToggle({top: "130px" });
                    }
                    mypos = newscroll;
                };
            });

        }
    };
}]);