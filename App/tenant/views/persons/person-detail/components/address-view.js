(function () {
    appModule.component('addressView', {
        bindings: {
            address: '<'
        },
        controller: [
            function () {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.formattedAddress = '-';
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.address) {
                        ctrl.formattedAddress = ctrl.formatAddress(angular.copy(ctrl.address));
                    }
                };

                ctrl.formatAddress = function (address) {
                    if (!address) {
                        return null;
                    }

                    var line1 = [
                        address.blockNo,
                        address.streetName
                    ].filter(Boolean).join(', ');
                    var line2 = [
                        address.unitNo,
                        address.bulidingName
                    ].filter(Boolean).join(' ');
                    var line3 = [
                        (address.country && address.country.description) || null,
                        address.postalCode
                    ].filter(Boolean).join(' ');

                    var formattedAddress = [
                        line1,
                        line2,
                        line3
                    ].filter(Boolean).join('<br />');

                    formattedAddress = formattedAddress || '-';

                    return formattedAddress;
                };
            }
        ],
        template: '<address class="margin-bottom-0" ng-bind-html="$ctrl.formattedAddress"></address>'
    });
})();