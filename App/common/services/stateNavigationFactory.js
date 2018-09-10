(function () {
    appModule.factory('stateNavigation', ['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        var navigationProps = {};
        var statePrevious = {};
        var statePreviousParams = {};
        var statePreviousTab = "";
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            statePrevious = fromState;
            statePreviousParams = fromParams;
        });

        var currentPersonId = "";
        var prersonDefault = app.consts.personTabs.tabs.care;

        var currentReferralId = "";
        var referralDefault = app.consts.referralTabs.tabs.referral;

        var personTabs = app.consts.personTabs;
        personTabs.care = true;

        var referralTabs = app.consts.referralTabs;
        referralTabs.referral = true;

        navigationProps.setPersonTabnavigation = function (tab) {
            setVariableToDefault('person');
            switch (tab) {
                case personTabs.tabs.personDetails:
                    personTabs.personDetails = true;
                    break;
                case personTabs.tabs.profile:
                    personTabs.profile = true;
                    break;
                case personTabs.tabs.care:
                    personTabs.care = true;
                    break;
                case personTabs.tabs.encounter:
                    personTabs.encounter = true;
                    break;
                case personTabs.tabs.attachment:
                    personTabs.attachment = true;
                    break;
                default:
                    personTabs.care = true;
                    break;
            };
        };

        navigationProps.setReferralTabnavigation = function (tab) {
            setVariableToDefault('referral');
            switch (tab) {
                case referralTabs.tabs.referral:
                    referralTabs.referral = true;
                    break;
                case referralTabs.tabs.social:
                    referralTabs.social = true;
                    break;
                case referralTabs.tabs.medical:
                    referralTabs.medical = true;
                    break;
                case referralTabs.tabs.financial:
                    referralTabs.financial = true;
                    break;
                case referralTabs.tabs.attachment:
                    referralTabs.attachment = true;
                    break;
                default:
                    referralTabs.referral = true;
                    break;
            };
        };

        function setVariableToDefault(str) {
            if (str == 'referral') {
                for (var key in referralTabs) {
                    if (referralTabs.hasOwnProperty(key) && key != 'tabs') {
                        referralTabs[key] = false;
                    }
                }
            } else if (str == 'person') {
                for (var key in personTabs) {
                    if (personTabs.hasOwnProperty(key) && key != 'tabs') {
                        personTabs[key] = false;
                    }
                }
            }
        };

        navigationProps.closeToPerson = function (tab, personId) {
            currentPersonId = personId;
            navigationProps.setPersonTabnavigation(tab);
            $state.go("tenant.personDetail", { id: personId });
        };

        navigationProps.closeToReferral = function (tab, referralId) {
            currentReferralId = referralId;
            navigationProps.setReferralTabnavigation(tab);
            $state.go("tenant.referralDetail", { id: referralId });
        };

        navigationProps.getTargetReferralTab = function () {
            if ($stateParams.id == currentReferralId) {
                currentReferralId = "";
                return referralTabs;
            } else {
                var referralTabsTemp = app.consts.referralTabs;
                for (var key in referralTabsTemp) {
                    if (referralTabsTemp.hasOwnProperty(key) && key != 'tabs') {
                        referralTabsTemp[key] = false;
                    }
                }
                referralTabsTemp.referral = true;
                return referralTabsTemp;
            }
        };

        navigationProps.getTargetPersonTab = function () {
            if ($stateParams.id == currentPersonId) {
                currentPersonId = "";
                return personTabs;
            } else {
                var personTabsTemp = app.consts.personTabs;
                for (var key in personTabsTemp) {
                    if (personTabsTemp.hasOwnProperty(key) && key != 'tabs') {
                        personTabsTemp[key] = false;
                    }
                }
                personTabsTemp.care = true;
                return personTabsTemp;
            }
        };


        navigationProps.setDefaultTab = function (tab) {
            if ($stateParams.id == currentPersonId) {
                currentPersonId = "";
                return personTabs;
            } else {
                var personTabsTemp = app.consts.personTabs;
                for (var key in personTabsTemp) {
                    if (personTabsTemp.hasOwnProperty(key) && key != 'tabs') {
                        personTabsTemp[key] = (key == tab) ? true : false;
                    }
                }
                return personTabsTemp;
            }
        };


        return navigationProps;

    }]);
})();