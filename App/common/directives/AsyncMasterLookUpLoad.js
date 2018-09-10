appModule.directive('asyncMasterLookupLoad', ['$q', 'abp.services.app.masterLookUp', function ($q, masterLookUp) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var q = $q.defer();
            var masterType = attrs.asyncMasterLookupLoadMasterType;

            masterLookUp.getMasterTypeItems({
                type: masterType
            }).then(function (result) {
                scope.vm[attrs.asyncMasterLookupLoadMasterTypeModel] = result.data;

                if (attrs.asyncCallbackFunction) {
                    scope.$eval(attrs.asyncCallbackFunction.replace('arg', '{ data: ' + angular.toJson(result.data) + ' }'));
                }

                q.resolve();
            });

            return q.promise;
        }
    };
}]);