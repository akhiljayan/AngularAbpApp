(function () {

    appModule.factory('commonFormFunction', ['$state', function ($state) {

        var commonFormFunctionFactory = {};
        var elementFormList = [];

        // Set the single form with Submitted State to true
        commonFormFunctionFactory.setFormSubmitted = function (form) {

            elementFormList = [];

            if (form != undefined) {
                form.submitted = true;
                elementFormList.push(form);
            }
        };

        // Need to set all card module form with Submitted State to true before proceeding to perform form validation
        commonFormFunctionFactory.setMultipleFormSubmitted = function (forms) {

            elementFormList = [];

            for (var i = 0; i < forms.length; i++) {
                forms[i].submitted = true;
                elementFormList.push(forms[i]);
            }
        };

        // After form validation has been performed, then this function should be called before the next code execution goes to Save() method
        // With this, the saving process will not interfere with angular-dirty-form workflow
        commonFormFunctionFactory.setPristine = function () {

            for (var i = 0; i < elementFormList.length; i++) {
                elementFormList[i].$setPristine();
            }
        };

        return commonFormFunctionFactory;
    }]);

})();