/***
Global Directives
***/

// Route State Load Spinner(used on page or content load)
appModule.directive('ngSpinnerBar', [  
    '$rootScope', '$state', '$previousState', 'sliderState',
    function ($rootScope, $state, $previousState, sliderState) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    sliderState.hookStateExecution(event, toState, toParams, element);

                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);

                    //Reset slider for non person navigation
                    if (toState.name != 'tenant.personDetail') {
                        sliderState.setPerson(null);
                    }

                    //Reset sliderSticky navigation history
                    sliderState.stickyMenuNavigationHappened = null;
                    //reset
                    sliderState.isCurrentStateChangeIsFromSlider = false;
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                    sliderState.isCurrentStateChangeIsFromSlider = false;
                    //Reset sliderSticky navigation history
                    sliderState.stickyMenuNavigationHappened = null;
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                    sliderState.isCurrentStateChangeIsFromSlider = false;
                    //Reset sliderSticky navigation history
                    sliderState.stickyMenuNavigationHappened = null;
                });

                $rootScope.$on('$stateChangeCancel', function () {
                    element.addClass('hide'); // hide spinner bar
                    sliderState.isCurrentStateChangeIsFromSlider = false;
                    //Reset sliderSticky navigation history
                    sliderState.stickyMenuNavigationHappened = null;
                });
            }
        };
    }
]);

// Handle global LINK click
appModule.directive('a',
    function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    });

// Handle Dropdown Hover Plugin Integration
appModule.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});