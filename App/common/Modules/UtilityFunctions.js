(function ($) {    
    $.jqueryRemoteExtend = function (remoteOptions) {
        var remote = {
            url: "",
            type: "POST",
            async: false,
            dataType: "json",
            data: {},
            dataFilter: function (data) {
                var response = JSON.parse(data);
                if (response.result == "true")
                    return "true";
                else
                    return "false";
            }              

        }
        var settings = $.extend(remote, remoteOptions);
        return settings;
    }

    $.roundDecimal =  function (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    $.splitCamelCase = function(str) {
        return str
            // insert a space between lower & upper
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // space before last upper in a sequence followed by lower
            .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
            // uppercase the first character
            .replace(/^./, function (str) { return str.toUpperCase(); })
    }

}(jQuery));