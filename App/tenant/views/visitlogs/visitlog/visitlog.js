(function () {
    appModule.component('visitlog', {
        bindings: {
            model: '<',
            showDetails: '='
        },
        controller: [
            '$filter',
            function ($filter) {
                var ctrl = this;

                ctrl.countSubItems = function (index) {
                    var renderedServiceObj = ctrl.model.categories[index] || {};
                    var checkedObj = !!renderedServiceObj.visitServices && $filter('filter')(renderedServiceObj.visitServices, { isChecked: true });

                    return (checkedObj.length > 0);
                };

                ctrl.hideRenderedServicesSection = function () {
                    var bShow = false;

                    for (var i = 0; i < ctrl.model.categories.length; i++) {
                        bShow = ctrl.countSubItems(i);

                        if (bShow)
                            return bShow;
                    }

                    return bShow;
                };

                ctrl.isSameDate = function (firstDate, secondDate) {
                    var date1 = new Date(firstDate);
                    var date2 = new Date(secondDate);

                    date1.setHours(0, 0, 0, 0);
                    date2.setHours(0, 0, 0, 0);

                    return date1.getTime() == date2.getTime();
                };
            }
        ],
        templateUrl: '~/App/tenant/views/visitlogs/visitlog/visitlog.cshtml'
    });
})();
