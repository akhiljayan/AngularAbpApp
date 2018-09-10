(function () {
    appModule.filter('yesnoFilter', function () {

        return function (bool) {
            var status = 'Yes';
            if (!bool)
                status = "No";

            var localizedValue = abp.localization.localize(status);

            return localizedValue;
        };
    });
})();