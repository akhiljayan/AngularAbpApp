(function () {
    appModule.filter('statusFilter', function () {

        return function (bool) {
            var status = 'Active';
            if (!bool)
                status = "Inactive";

            var localizedValue = abp.localization.localize(status);

            return localizedValue;
        };
    });
})();