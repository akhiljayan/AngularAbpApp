(function () {
    appModule.directive('minimizeModal', [
        function () {
            return {
                restrict: 'E',
                template: '<a class="minimize-modal no-decoration"><i class="fa fa-minus-square" style="color:#c1c1c1; vertical-align: text-top;padding-top: 1px;"></i></a>',
                link: function (scope, element, attrs, parentController) {
                    var minimizeButton = angular.element(element.find('a.minimize-modal'));
                    var body = element.parents("body");
                    var parentModal = element.parents("div[uib-modal-window]");
                    var backdrop = body.find("div[uib-modal-backdrop]");
                    var portlet = parentModal.find("div.portlet");
                    var portletBody = portlet.find("div.portlet-body");
                    minimizeButton.bind('click', function () {
                        parentModal.toggleClass("minimize");
                        if (minimizeButton.find("i").hasClass('fa-minus-square')) {
                            backdrop.hide();
                            minimizeButton.find("i").addClass("fa-window-maximize");
                            minimizeButton.find("i").removeClass("fa-minus-square");
                            element.addClass("margin-left-10");
                            body.removeClass("modal-open");
                            portlet.addClass("minimise-border");
                            portletBody.addClass("display-none");
                        } else {
                            backdrop.show();
                            minimizeButton.find("i").removeClass("fa-window-maximize");
                            minimizeButton.find("i").addClass("fa-minus-square");
                            element.removeClass("margin-left-10");
                            body.addClass("modal-open");
                            portlet.removeClass("minimise-border");
                            portletBody.removeClass("display-none");
                        }
                    });
                }
            };
        }
    ]);
})();