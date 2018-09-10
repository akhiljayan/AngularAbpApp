(function () {
    appModule.controller('tenant.views.person.socialView', [
        '$scope', '$stateParams', 'abp.services.app.person',
        function ($scope, $stateParams, personService) {
            var vm = this;
            vm.mode = $scope.vm.mode;
            vm.person = {};

            vm.edit = function () {
                vm.mode = 'edit';

                vm.person = _.pick($scope.vm.person, [
                    'aboutMe', 'goals', 'personality', 'likes', 'dislikes',
                    'whatMakesHimOrHerHappy', 'hobbies'
                ]);
            };

            vm.close = function () {
                vm.mode = 'view';
            };

            vm.save = function () {
                $scope.$emit('UpdatePerson', vm.person);
            };

            $scope.$on('PersonUpdated', function (event, data) {
                if (data.success) {
                    vm.close();
                }
            });

            vm.init = function () {
                $scope.vm.social = $scope.social;
                $scope.social.person = vm.person;
            }

            vm.init();
        }
    ]);
})();