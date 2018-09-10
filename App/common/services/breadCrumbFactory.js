(function () {

    appModule.factory('breadCrumbFact', ['$state','$stateParams', '$timeout', '$q', 'abp.services.app.breadcrumb', function ($state,$stateParams, $timeout, $q, $breadcrumbService) {

        var getDisplayName = function (data) {
            var deferred = $q.defer();
            var returnLabel = '';

            $breadcrumbService[data.servive]($stateParams[data.param]).then(function (result) {
                if (data.prefix) {
                    returnLabel = result.data+ "-" +  data.prefix;
                } else {
                    returnLabel = result.data;
                }
                deferred.resolve({ name: returnLabel, route: data.route });
            })

            return deferred.promise;
        };

        return {
            getDisplayName: getDisplayName
        };

    }]);

})();