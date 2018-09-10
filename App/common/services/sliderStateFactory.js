(function () {

    appModule.factory('sliderState', ['$state', function ($state) {

        var personDetailPageId = 'tenant.personDetail';
        var sliderStateServiceFactory = {};

        sliderStateServiceFactory.getCardBasedModule = function () {

            var cardBasedModuleList = [];
            var menu = abp.nav.menus.MainMenu;

            for (var i = 0; i < menu.items.length; i++) {
                cardBasedModuleList = cardBasedModuleList.concat(sliderStateServiceFactory.unwrapCardBasedModuleItem(menu.items[i]));
            }

            return cardBasedModuleList;
        }

        sliderStateServiceFactory.unwrapCardBasedModuleItem = function (array) {

            var cardBasedModuleList = [];

            for (var a = 0; a < array.items.length; a++) {

                if (array.items[a].customData != undefined) {

                    if (array.items[a].customData.isCardBasedOnly != undefined &&
                        array.items[a].customData.isCardBasedOnly == true) {
                        cardBasedModuleList.push(array.items[a].url);
                    }
                }


                cardBasedModuleList = cardBasedModuleList.concat(sliderStateServiceFactory.unwrapCardBasedModuleItem(array.items[a]));
            }

            return cardBasedModuleList;
        };

        sliderStateServiceFactory.cardDetailKeyList = function () {

            var cardDetailKeyList = [];
            var menu = abp.nav.menus.MainMenu;

            for (var i = 0; i < menu.items.length; i++) {
                cardDetailKeyList = cardDetailKeyList.concat(sliderStateServiceFactory.unwrapCardMenuItem(menu.items[i]));
            }

            return cardDetailKeyList;
        };

        sliderStateServiceFactory.unwrapCardMenuItem = function (array) {

            var cardMenuItemList = [];

            for (var a = 0; a < array.items.length; a++) {

                if (array.items[a].customData != undefined) {

                    if (array.items[a].customData.cardNavigationHashKey != undefined &&
                        array.items[a].customData.cardNavigationHashKey.length > 0) {
                        cardMenuItemList.push([array.items[a].url, array.items[a].customData.cardNavigationHashKey]);
                    }
                }


                cardMenuItemList = cardMenuItemList.concat(sliderStateServiceFactory.unwrapCardMenuItem(array.items[a]));
            }

            return cardMenuItemList;
        };

        sliderStateServiceFactory.cardsStateNames = function () {

            var cardDetailKeyList = sliderStateServiceFactory.cardDetailKeyList();
            var cardsStateNamesList = [];

            for (var i = 0; i < cardDetailKeyList.length; i++) {
                cardsStateNamesList.push(cardDetailKeyList[i][0]);
            }

            return cardsStateNamesList;
        };

        //Start api call
        sliderStateServiceFactory.hookStateExecution = function (event, toState, toParams, elementToHideShow) {
            elementToHideShow.removeClass('hide');

            if ((sliderStateServiceFactory.isCurrentStateChangeIsFromSlider == undefined || !sliderStateServiceFactory.isCurrentStateChangeIsFromSlider)) {
                return;
            }

            //parse params from person url
            if (toState.name == personDetailPageId) {

                sliderStateServiceFactory.parseAndSetPersonId(toParams);

                if (this.CurrentSelctedStickyMenu && this.CurrentSelctedStickyMenu != null) {
                    if (typeof this.stickyMenuNavigationHappened == undefined || this.stickyMenuNavigationHappened == null) {
                        this.stickyMenuNavigationHappened = true;
                        var params = sliderStateServiceFactory.getParams(this.CurrentSelctedStickyMenu);
                        event.preventDefault();

                        if (params != null) {
                            $state.go(personDetailPageId, params, { reload: true });
                            elementToHideShow.addClass('hide');
                        }
                    }
                }
            } else {

                //Get sitck state if person navigation is being carried out
                if (sliderStateServiceFactory.isCardNavigation(toState.name)) {

                    if (this.PersonId != null) {

                        if (this.CurrentSelctedStickyMenu && this.CurrentSelctedStickyMenu != null) {
                            var params = sliderStateServiceFactory.getParams(this.CurrentSelctedStickyMenu);
                            event.preventDefault();

                            if (params != null) {
                                //Navigate to specific sticky menu
                                $state.go(personDetailPageId, params, { reload: true });
                                elementToHideShow.addClass('hide');
                            }
                        }
                    } else {

                        // Check if the current state name has Card-based module only but has no listing page
                        if (sliderStateServiceFactory.getCardBasedModule().indexOf(toState.name) > -1) {
                            // Prompt the user to select a person
                            event.preventDefault(); //prevent furthur execution
                            abp.message.info(app.localize('NoSelectedPerson'));
                            return;
                        } // Otherwise, redirect back to the module's listing page
                    }
                } else {

                }
            }
        }

        //Get current selected sticky menu
        sliderStateServiceFactory.getCurrentSelectedStickyMenu = function () {
            return this.CurrentSelctedStickyMenu;
        };

        //Set selected sticky menu
        sliderStateServiceFactory.setStickyMenu = function (stateName) {
            //Sticky menu tracking 
            if (_.contains(sliderStateServiceFactory.cardsStateNames(), stateName)) {
                this.CurrentSelctedStickyMenu = stateName;
            }
            else {
                this.CurrentSelctedStickyMenu = null;
            }
        }

        //Set selected person from my-care board
        sliderStateServiceFactory.setSelecteedPersonIdFromCareBoard = function (personId) {
            this.SelecteedPersonIdFromCareBoard = personId;
        }

        //Parses from Person url only
        sliderStateServiceFactory.parseAndSetPersonId = function (toParams) {
            var personId;
            if (toParams.id && !toParams.id.includes("#"))
                personId = toParams.id;
            else if (toParams.id && toParams.id.includes("#"))
                personId = toParams.id.split('#')[0];
            else
                personId = null;
            this.PersonId = personId;
        }

        sliderStateServiceFactory.setPerson = function (personId) {
            this.PersonId = personId;
        }

        sliderStateServiceFactory.getPerson = function () {
            return this.PersonId;
        }

        sliderStateServiceFactory.isCardNavigation = function (stateName) {
            if (_.contains(sliderStateServiceFactory.cardsStateNames(), stateName)) {
                return true;
            }
        }

        sliderStateServiceFactory.getParams = function (stateName) {

            var params = { id: this.PersonId };

            var cardNavigationHash = sliderStateServiceFactory.cardDetailKeyList().filter(function (a) { return a[0] == this }, stateName);

            if (cardNavigationHash != undefined &&
                cardNavigationHash.length > 0) {
                if (this.PersonId != null) {
                    _.extend(params, { "#": cardNavigationHash[0][1] });
                }
            }

            // Check if the current state name is Card-based only module which has no listing page
            if (sliderStateServiceFactory.getCardBasedModule().indexOf(stateName) > -1) {
                if (this.PersonId == undefined || this.PersonId == null) {
                    params = null;
                }
            }

            return params;
        }

        return sliderStateServiceFactory;

    }]);

})();