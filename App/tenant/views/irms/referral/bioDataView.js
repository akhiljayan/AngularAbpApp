(function () {
    appModule.controller('tenant.views.irms.bioDataView', [
        '$scope', '$timeout', '$stateParams', '$element',
        function ($scope, $timeout, $stateParams, $element) {
            var vm = this;
            var parent = $scope.$parent;
            vm.loading = true;

            vm.bioDataInfoList = {};
            vm.bioDataCareGiverList = [];
            vm.bioDataLanguageList = [];
            vm.bioDataDialectsList = [];

            parent.vm.setBioDataNavigation = function () {
                parent.vm.navigationalMenu = [
                    { key: 'ReferralInformation', displayName: app.localize('ReferralInformation'), permission: true },
                    { key: 'BioData', displayName: app.localize('BioData'), permission: true },
                    { key: 'OtherInformation', displayName: app.localize('OtherInformation'), permission: true },
                    { key: 'CurrentAccommodation', displayName: app.localize('CurrentAccommodation'), permission: true },
                    { key: 'DischargeDestination', displayName: app.localize('DischargeDestination'), permission: true },
                    { key: 'ContactPersonCareGiverInformation', displayName: app.localize('ContactPersonCareGiverInformation'), permission: true },
                    { key: 'CompletedBy', displayName: app.localize('CompletedBy'), permission: true }
                ];
            }

            $scope.$on('irmsReferralReadyState', function (events, data) {
                vm.referral = data;

                if (vm.referral.bioDataInfoList &&
                    vm.referral.bioDataInfoList.length > 0) {
                    vm.bioDataInfoList = vm.referral.bioDataInfoList[0];

                    vm.bioDataInfoList.address = vm.constructAddress(
                        vm.bioDataInfoList.pA_Block,
                        vm.bioDataInfoList.pA_Level,
                        vm.bioDataInfoList.pA_Unit,
                        vm.bioDataInfoList.pA_Street1,
                        vm.bioDataInfoList.pA_Street2,
                        vm.bioDataInfoList.pA_PostalCode);

                    vm.bioDataInfoList.dischargeAddress = vm.constructAddress(
                        vm.bioDataInfoList.dD_Block,
                        vm.bioDataInfoList.dD_Level,
                        vm.bioDataInfoList.dD_Unit,
                        vm.bioDataInfoList.dD_Street,
                        "",
                        vm.bioDataInfoList.dD_PostalCode);
                }

                vm.bioDataCareGiverList = vm.referral.bioDataCareGiverList;
                vm.bioDataLanguageList = vm.referral.bioDataLanguageList;
                vm.bioDataDialectsList = vm.referral.bioDataDialectsList;

                vm.loading = false;
            });

            vm.constructAddress = function (block, level, unit, street1, street2, postalCode) {

                var address = "";

                if (block) {
                    address = "BLK " + block;
                }

                if (street1) {

                    if (address) {
                        address = address + " " + street1;
                    } else {
                        address = street1;
                    }
                }

                if (street2) {

                    if (address) {
                        address = address + ", " + street2;
                    } else {
                        address = street2;
                    }
                }

                if (level) {
                    address = address + " #" + level;
                }

                if (unit) {
                    address = address + "-" + unit;
                }


                if (postalCode) {

                    if (address) {
                        address = address + ", Singapore " + postalCode;
                    } else {
                        address = "Singapore " + postalCode;
                    }
                }

                return address;
            }

            vm.init = function () {
                parent.vm.setBioDataNavigation();
            };

            vm.init();
        }
    ]);
})();