(function ($) {

    $.fn.MakeAsTagsInputWithAutoComplete = function (options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            remoteUrl: "",
            itemText: "name",
            itemValue: "value"
        }, options);

        var states = [];

        var collection = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: abp.appPath + settings.remoteUrl,
                filter: function (response) {
                    states = response.result.items;
                    return response.result.items;
                },
                prepare: function (query, settings) {
                    settings.type = "POST";
                    settings.contentType = "application/json; charset=UTF-8";
                    settings.data = JSON.stringify({ Filter: query });
                    return settings;
                }
            }
        });

        collection.initialize();

        return this.tagsinput({
            hint: true,
            highlight: true,
            minLength: 1,
            itemText: settings.itemText,
            itemValue: settings.itemValue,
            typeaheadjs: {
                name: 'collection',
                displayKey: settings.itemText,
                source: collection.ttAdapter()
            }
        });
    };

}(jQuery));