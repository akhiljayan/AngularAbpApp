(function () {
    appModule.directive('maximizeWidthModal', [
        function () {
            return {
                restrict: 'E',
                template: '<a class="maximize-modal no-decoration"><i class="fa fa-window-maximize" style="color:#c1c1c1; vertical-align: text-top; padding-top: 1px;"></i></a>',
                link: function (scope, element, attrs, parentController) {
                    var maximizeButton = angular.element(element.find('a.maximize-modal'));
                    var parentModal = element.parents("div[uib-modal-window]");

                    maximizeButton.bind('click', function () {
                        if (parentModal.hasClass("modal-auto-width")) {
                            parentModal.removeClass("modal-auto-width");

                            maximizeButton.find("i").addClass("fa-window-maximize");
                            maximizeButton.find("i").removeClass("fa-window-restore");
                        } else {
                            parentModal.addClass("modal-auto-width");

                            maximizeButton.find("i").addClass("fa-window-restore");
                            maximizeButton.find("i").removeClass("fa-window-maximize");
                        }
                    });
                }
            };
        }
    ]);
})();