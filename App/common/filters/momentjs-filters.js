// need load the moment.js to use these filters. 

(function () {

    appModule.filter('momentFormat', function () {
        return function (date, formatStr) {
            if (!date) {
                return '-';
            }

            return moment(date).format(formatStr);
        };
    })
        .filter('timeFormat', function () {
            return function (date) {
                if (!date) {
                    return '-';
                }

                return moment(date).format('HH:mm');
            };
        })
        .filter('dateTimeFormat', function () {
            return function (date) {
                if (!date) {
                    return '-';
                }

                return moment(date).format('DD-MMM-YYYY hh:mm A');
            };
        })
        .filter('monthYearFormat', function () {
            return function (date) {
                if (!date) {
                    return '-';
                }

                return moment(date).format('MMM-YYYY');
            };
        })
        .filter('dateFormat', function () {
            return function (date) {
                if (!date) {
                    return '-';
                }
                return moment(date).format('DD-MMM-YYYY');
            };
        }).filter('fromNow', function () {
            return function (date) {
                return moment(date).fromNow();
            };
        }).filter('irmsDateFormat', function () {
            return function (date) {

                if (!date) {
                    return '-';
                }

                if (moment(date, "DD/MM/YYYY").isValid()) {

                    var oDateTime = moment(date, "DD/MM/YYYY");
                    if (moment(oDateTime).year() > 1900) {
                        return moment(oDateTime).format('DD-MMM-YYYY');
                    } else {
                        return '-';
                    }
                } else {

                    if (moment(date).year() > 1900) {
                        return moment(date).format('DD-MMM-YYYY');
                    } else {
                        return '-';
                    }
                }
            };
        });

})();