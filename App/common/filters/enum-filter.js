// need load the moment.js to use these filters. 

(function () {  

    appModule.filter('enumText', function () {
        return function (currentvalue, enumConstantName) {
            var enumConstantObject = {};
            for (var item in app.consts)
            {
                if (item == enumConstantName) {
                    enumConstantObject = _.extend(enumConstantObject, app.consts[item]);
                }
            }
            var text;
            var valueObj = _.where(enumConstantObject.values, { value: currentvalue });
            var localizedKeyName;
            var localizedText;

            if (valueObj.length > 0) {
                if (valueObj) {
                    localizedKeyName = valueObj[0].localizedName;
                    localizedText = abp.localization.localize(localizedKeyName);
                }

                if (localizedText)
                    text = localizedText;
                else
                    text = valueObj[0].name;
            }

            return text;
        };
    });

})();