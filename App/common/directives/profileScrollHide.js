(function () {
    appModule.directive('hideOnScroll', [
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var $win = angular.element($window); // wrap window object as jQuery object
                    var userAgent = $window.navigator.userAgent;
                    var mywindow = $(window);
                    var mypos = mywindow.scrollTop();
                    var up = false;
                    var newscroll;
                    var isTab = window.matchMedia('(max-width: 780px)').matches;
                    var isipadOriPhone = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android|IEMobile/i);
                    var sticky = element;
                    //if (typeof sticky != "undefined") {
                    //    var pos = sticky.offset().top + 150;
                    //    $win.on("scroll", function () {
                    //        if (win.scrollTop() > pos) {
                    //            sticky.addClass("stickyhead");
                    //        } else {
                    //            sticky.removeClass("stickyhead");
                    //        }
                    //    });
                    //}
                    $win.on('scroll', function (e) {
                        if (attrs.pinned == 'false' && !isTab && !isipadOriPhone) {
                            newscroll = mywindow.scrollTop();
                            if (newscroll > mypos && !up) {
                                element.slideToggle();
                                up = !up;
                            } else if (newscroll < mypos && up) {
                                element.slideToggle();
                                up = !up;
                            }
                            mypos = newscroll;
                        }
                    });
                }
            };
        }
    ]);
})();