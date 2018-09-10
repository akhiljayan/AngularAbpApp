(function (angular, $) {
    appModule.directive('jqueryMultiselect', [
        '$document', '$parse', '$timeout',
        function ($document, $parse, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    msRight: '@',
                    msRightAll: '@',
                    msRightSelected: '@',
                    msLeftSelected: '@',
                    msLeftAll: '@',
                    msUndo: '@',
                    msRedo: '@',
                    msMoveUp: '@',
                    msMoveDown: '@',
                    msSearchLeft: '@',
                    msSearchRight: '@',
                    msSelectionLimit: '@',
                    msSelectionLimitMessage: '@',
                    msRequiredMessage: '@',
                    msKeepRenderingSort: '=?',
                },
                link: function (scope, element, attrs) {

                    $(element).jQueryMultiselect({
                        right: '#' + scope.msRight || '',
                        rightAll: '#' + scope.msRightAll || '',
                        rightSelected: '#' + scope.msRightSelected || '',
                        leftSelected: '#' + scope.msLeftSelected || '',
                        leftAll: '#' + scope.msLeftAll || '',
                        undo: '#' + scope.msUndo || '',
                        redo: '#' + scope.msRedo || '',
                        moveUp: '#' + scope.msMoveUp || '',
                        moveDown: '#' + scope.msMoveDown || '',
                        search: {
                            left: (scope.msSearchLeft != undefined && scope.msSearchLeft == "true" ? '<input type="text" name="leftSearch" class="form-control margin-bottom-5" placeholder="Search..." />' : ''),
                            right: (scope.msSearchRight != undefined && scope.msSearchRight == "true" ? '<input type="text" name="rightSearch" class="form-control margin-bottom-5" placeholder="Search..." />' : '')
                        },
                        keepRenderingSort: (scope.msKeepRenderingSort != undefined && scope.msKeepRenderingSort == "true" ? true : false),

                        moveToRight: function (Multiselect, $options, event, silent, skipStack) {

                            var canProceedMoveToRight = true;
                            var $left_options = Multiselect.$left.find('> option:selected');
                            var $right_options = Multiselect.$right.find('> option');

                            if ($left_options.length > 0) {

                                if (scope.msSelectionLimit > 0) {

                                    if (Multiselect.$right.find('option').length == scope.msSelectionLimit) {
                                        canProceedMoveToRight = false;
                                    }

                                    if (($left_options.length + $right_options.length) > 10) {
                                        canProceedMoveToRight = false;
                                    }
                                }

                                if (canProceedMoveToRight == true) {

                                    Multiselect.$right.eq(0).append($left_options);

                                    if (typeof Multiselect.callbacks.sort == 'function' && !silent) {
                                        Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
                                    }
                                } else {
                                    abp.message.error(scope.msSelectionLimitMessage);
                                }

                            } else {
                                abp.message.error(scope.msRequiredMessage);
                            }
                        },

                    });
                }
            };
        }
    ]);
})(angular, $);