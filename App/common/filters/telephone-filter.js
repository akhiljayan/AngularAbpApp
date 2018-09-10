(function () {

    appModule.filter('tel', function () {
        return function (tel) {
            if (!tel) {
                return '-';
            }

            var value = tel.toString().trim().replace(/\+/, '');

            var country, number;

            switch (value.length) {
                case 8:
                    number = value.slice(0, 4) + ' ' + value.slice(4);
                    break;
                case 10:
                    country = value.slice(0, 2);
                    number = value.slice(2, 6) + ' ' + value.slice(6);
                    break;
                default:
                    number = value;
            }

            if (country) {
                number = '+' + country + ' ' + number;
            }

            return number;
        }
    });

})();