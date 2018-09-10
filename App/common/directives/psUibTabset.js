appModule.directive('psUibTabset', function () {
    return {
        transclude: {
            psUibTabNavigation: '?psUibTabNavigation',
            psUibTabButton: '?psUibTabButton',
            psUibTabPersonHeader: '?psUibTabPersonHeader'
        },
        replace: true,
        scope: {
            isPinned: '=?'
        },
        bindToController: {
            active: '=?',
            type: '@',
            tabTemplate: '=?',
        },
        controller: 'UibTabsetController',
        controllerAs: 'tabset',
        templateUrl: function (element, attrs) {
            if (attrs.tabTemplate && attrs.tabTemplate == "false") {
                return attrs.templateUrl || 'uib/template/tabs/ps-tabset-notab.html';
            } else {
                return attrs.templateUrl || 'uib/template/tabs/ps-tabset.html';
            }
            
        },
        link: function (scope, element, attrs) {
            scope.toggleIsPinned = function () {
                scope.isPinned = !scope.isPinned;
            };

            scope.vertical = angular.isDefined(attrs.vertical) ?
                scope.$parent.$eval(attrs.vertical) : false;
            scope.justified = angular.isDefined(attrs.justified) ?
                scope.$parent.$eval(attrs.justified) : false;
        }
    };
});

appModule.directive('psUibTab', ['$parse', function ($parse) {
    return {
        require: '^psUibTabset',
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'uib/template/tabs/ps-tab.html';
        },
        transclude: true,
        scope: {
            heading: '@',
            index: '=?',
            classes: '@?',
            onSetNavigation: '&setNavigation',
            onSelect: '&select', //This callback is called in contentHeadingTransclude
            //once it inserts the tab's content into the dom
            onDeselect: '&deselect'
        },
        controller: function () {
            //Empty controller so other directives can require being 'under' a tab
        },
        controllerAs: 'tab',
        link: function (scope, elm, attrs, tabsetCtrl, transclude) {
            scope.disabled = false;
            if (attrs.disable) {
                scope.$parent.$watch($parse(attrs.disable), function (value) {
                    scope.disabled = !!value;
                });
            }

            if (angular.isUndefined(attrs.index)) {
                if (tabsetCtrl.tabs && tabsetCtrl.tabs.length) {
                    scope.index = Math.max.apply(null, tabsetCtrl.tabs.map(function (t) { return t.index; })) + 1;
                } else {
                    scope.index = 0;
                }
            }

            if (angular.isUndefined(attrs.classes)) {
                scope.classes = '';
            }

            scope.select = function (evt) {
                if (!scope.disabled) {
                    var index;
                    for (var i = 0; i < tabsetCtrl.tabs.length; i++) {
                        if (tabsetCtrl.tabs[i].tab === scope) {
                            index = i;
                            break;
                        }
                    }

                    tabsetCtrl.select(index, evt);
                    scope.onSetNavigation();
                }
            };

            tabsetCtrl.addTab(scope);
            scope.$on('$destroy', function () {
                tabsetCtrl.removeTab(scope);
            });

            //We need to transclude later, once the content container is ready.
            //when this link happens, we're inside a tab heading.
            scope.$transcludeFn = transclude;
        }
    };
}]);

appModule.directive('psUibTabHeadingTransclude', function () {
    return {
        restrict: 'A',
        require: '^psUibTab',
        link: function (scope, elm) {
            scope.$watch('headingElement1', function updateHeadingElement(heading) {
                if (heading) {
                    elm.html('');
                    elm.append(heading);
                }
            });
        }
    };
});

appModule.directive('psUibTabContentTransclude', function () {
    return {
        restrict: 'A',
        require: '^psUibTabset',
        link: function (scope, elm, attrs) {
            var tab = scope.$eval(attrs.psUibTabContentTransclude).tab;

            //Now our tab is ready to be transcluded: both the tab heading area
            //and the tab content area are loaded.  Transclude 'em both.
            tab.$transcludeFn(tab.$parent, function (contents) {
                angular.forEach(contents, function (node) {
                    if (isTabHeading(node)) {
                        //Let tabHeadingTransclude know.
                        tab.headingElement1 = node;
                    } else {
                        elm.append(node);
                    }
                });
            });
        }
    };

    function isTabHeading(node) {
        return node.tagName && (
            node.hasAttribute('uib-tab-heading') ||
            node.hasAttribute('data-uib-tab-heading') ||
            node.hasAttribute('x-uib-tab-heading') ||
            node.tagName.toLowerCase() === 'uib-tab-heading' ||
            node.tagName.toLowerCase() === 'data-uib-tab-heading' ||
            node.tagName.toLowerCase() === 'x-uib-tab-heading' ||
            node.tagName.toLowerCase() === 'uib:tab-heading'
        );
    }
});

appModule.directive('psUibTabNavigation', function () {
    return {
        require: '^psUibTabset',
        replace: true,
        transclude: true,
        scope: {
            navigationMenu: '=',
            onGotoAnchor: '&gotoAnchor'
        },
        controller: function () {
        },
        templateUrl: function (element, attrs) {
            return 'uib/template/tabs/ps-tab-avigation.html';
        },
        link: function (scope, elm, attrs, tabsetCtrl, transclude) {
        }
    };
});

appModule.run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/tabs/ps-tabset.html",
        "<div class=\"row\">\n" +
        "   <div id=\"main-header-with-tab header-sticky-index\" class=\"row main-header-with-tab\" hide-on-scroll sticky offset=\"75\" pinned=\"{{ isPinned }}\" style=\"z-index:1000 !important;\">\n" + 
        "       <div class=\"row bg-white header-sticky-index\" style=\"height: 86px; padding: 6px 0px; border-bottom:0.2px solid #d8d8d8;box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.18)\">\n" +
        "           <div ng-transclude=\"psUibTabPersonHeader\"></div>\n " +
        "	        <div class=\"col-xs-1 col-sm-1 text-right pull-right\" style=\"margin-top:-15px\">\n" +
        "		        <span ng-if=\"!isPinned\" class=\"mt-comment-date otherText\" ng-click=\"toggleIsPinned()\">\n" +
        "			        <i class=\"icon-pin font-default\"></i>\n" +
        "		        </span>\n" +
        "		        <span ng-if=\"isPinned\" class=\"mt-comment-date otherText\" ng-click=\"toggleIsPinned()\">\n" +
        "			        <i class=\"icon-pin fontStealGreen\"></i>\n" +
        "		        </span>\n" +
        "	        </div>\n" +
        "       </div>\n" +
        "       <div class=\"row\" id=\"person-tabs header-sticky-index\" style=\"height: 45px;top:0px;background-color:#f9f9f9;margin-bottom: 10px; box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.18)\">\n" +
        //Tabbed template
        "	        <div class=\"col-md-12 col-sm-12\" ng-if=\"!vm.loading\">\n" +
        "               <div class=\"col-md-1 col-sm-1 tabbable-line\" style=\"text-align:left\">\n" +
        "                   <div ng-transclude=\"psUibTabNavigation\"></div>\n" +
        "               </div>\n" +
        "               <div class=\"col-md-8 col-sm-6 tabbable-line\" style=\"text-align:left\">\n" +
        "                   <ul class=\"nav nav-{{tabset.type || 'tabs'}} persontabs\" responsive-tabs scroll-to-top tab-navigation-hash ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
        "               </div>\n" +
        "               <div class=\"col-md-3 col-sm-5\">\n" +
        "                   <div ng-transclude=\"psUibTabButton\"></div>\n " +
        "               </div>\n" +
        "           </div>\n" +
        "       </div>\n" +
        "   </div>\n" +
        "   <div class='clear' style='clear:both'></div>\n" +
        "   <div class=\"tab-content\" style=\"padding-top:10px\">\n" +
        "       <div class=\"tab-pane\"\n" +
        "           ng-repeat=\"tab in tabset.tabs\"\n" +
        "           ng-class=\"{active: tabset.active === tab.index}\"\n" +
        "           ps-uib-tab-content-transclude=\"tab\">\n" +
        "       </div>\n" +
        "   </div>\n" +
        "</div >\n" +
        "");
}]);

appModule.run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/tabs/ps-tabset-notab.html",
        "<div class=\"row\">\n" +
        "	<div id=\"main-header-with-tab header-sticky-index\" class=\"row main-header-with-tab\" hide-on-scroll offset=\"75\" pinned=\"{{ isPinned }}\" style=\"z-index:1000 !important; left:0px !important; width:100% !important; position:fixed;padding-left: 35px;\">\n" +
        "		<div class=\"row bg-white header-sticky-index\" style=\"height: 95px; padding: 15px 0px; border-bottom:0.2px solid #d8d8d8;box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.18)\">\n" +
        "		   <div ng-transclude=\"psUibTabPersonHeader\"></div>\n" +
        "			<div class=\"col-xs-1 col-sm-1 text-right pull-right\" style=\"margin-top:-15px\">\n" +
        "				<span ng-if=\"!isPinned\" class=\"mt-comment-date otherText\" ng-click=\"toggleIsPinned()\">\n" +
        "					<i class=\"icon-pin font-default\"></i>\n" +
        "				</span>\n" +
        "				<span ng-if=\"isPinned\" class=\"mt-comment-date otherText\" ng-click=\"toggleIsPinned()\">\n" +
        "					<i class=\"icon-pin fontStealGreen\"></i>\n" +
        "				</span>\n" +
        "			</div>\n" +
        "		</div>\n" +
        "		<div class=\"row\" id=\"person-tabs header-sticky-index\" style=\"height: 45px;top:0px;background-color:#f9f9f9;margin-bottom: 10px; box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.18)\">\n" +
        "			<div class=\"col-md-12 col-sm-12\" ng-if=\"!vm.loading && !tabset.tabTemplate\">\n" +
        "			  <div class=\"col-md-1 col-sm-1 tabbable-line\" style=\"text-align:left\">\n" +
        "				   <div ng-transclude=\"psUibTabNavigation\"></div>\n" +
        "			   </div>\n" +
        "			   <div class=\"col-md-11 col-sm-11\">\n" +
        "				   <div ng-transclude=\"psUibTabButton\"></div>\n" +
        "			   </div>\n" +
        "		   </div>\n" +
        "		</div>\n" +
        "	</div>\n" +
        "	<div class='clear' style='clear:both'></div>\n" +
        "	<div class=\"tab-content\" style=\"padding-top:10px;margin-top: 145px;\">\n" +
        "	   <div class=\"tab-pane\" ng-repeat=\"tab in tabset.tabs\" ng-class=\"{active: tabset.active === tab.index}\" ps-uib-tab-content-transclude=\"tab\"></div>\n" +
        "	</div>\n" +
        "</div >\n" +
        "");
}]);




appModule.run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/tabs/ps-tab.html",
        "<li ng-class=\"[{active: active, disabled: disabled}, classes]\">\n" +
        "  <a href ng-click=\"select($event);\" class=\"font-16-important bold txt-align-cntr\" ps-uib-tab-heading-transclude1>{{heading}}</a>\n" +
        "</li>\n" +
        "");
}]);

appModule.run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/tabs/ps-tab-avigation.html",
        "<div class=\"dropdown\">\n" +
        "	<span class=\"dropdown-toggle\" id=\"navigation-menu\" type=\"button\" data-toggle=\"dropdown\" style=\"cursor:pointer;margin-top: 15px; display: inline-block;\">\n" +
        "		<i class=\"ps-icon-section-menu\" style=\"font-size:20px;color:#acacac;\"></i>\n" +
        "	</span>\n" +
        "	<div class=\"dropdown-menu\" aria-labelledby=\"navigation-menu\" role=\"menu\" style=\"width: 200px; background-color:#f9f9f9\">\n" +
        "		<li role=\"presentation\" ng-repeat=\"navigate in navigationMenu\" ng-if=\"navigate.permission\">\n" +
        "			<a role=\"menuitem\" tabindex=\"-1\" class=\"bold\" href=\"#\" ng-click=\"onGotoAnchor({ key: navigate.key })\">{{navigate.displayName}}</a>\n" +
        "		</li>\n" +
        "	</div>\n" +
        "</div>\n" +
        "");
}]);