(function () {
    appModule.filter('ageFilter', function () {
        function calculateAge(birthday) { // birthday is a date

            var ageDifMs = Date.now() - parseDate(birthday);
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        function parseDate(s) {

            var dob = new Date(s);
            if (!isNaN(dob))
                return dob;

            var months = {
                jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
            };
            var p = s.split('-');
            return new Date(p[2], months[p[1].toLowerCase()], p[0]);
        }
        return function (birthdate) {
            if (!birthdate) {
                return '-';
            }

            var age = calculateAge(birthdate);

            return age + " Yrs";
        };
    });
})();