appModule.directive('asyncMasterDataLoad', ['$q', 'abp.services.app.masterData', function ($q, masterData) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var q = $q.defer();
            var masterType = attrs.asyncMasterDataLoadMasterType;

            masterData.getMasterDataTypeItems({
                type: masterType
            }).then(function (result) {
                scope.vm[attrs.asyncMasterDataLoadMasterTypeModel] = result.data;

                if (attrs.asyncCallbackFunction) {
                    scope.$eval(attrs.asyncCallbackFunction.replace('arg', '{ data: ' + angular.toJson(result.data) + ' }'));
                }

                q.resolve();
            });
            return q.promise;
        }
    };
}]);
