(function () {
    appModule.controller('tenant.views.lifeEvents.createOrEditLifeEvent', [
        'abp.services.app.masterData', '$uibModal', '$filter', '$uibModalInstance', 'lifeEventId', 'personId', 'permissions', 'significantLifeEventFlag', 'abp.services.app.lifeEvent',
        function (masterData, $uibModal, $filter, $uibModalInstance, lifeEventId, personId, permissions, significantLifeEventFlag, lifeEventService) {
            var vm = this;
            vm.saving = false;
            vm.isCreateMode = false;
            vm.isEditMode = false;

            vm.lifeEvent = {};
            vm.lifeEventCategoryMaster = [];
            vm.lifeEventTypeMaster = [];
            vm.permissions = permissions;
            vm.significantLifeEventFlag = significantLifeEventFlag;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                if (!vm.saving) {
                    vm.saving = true;
                    vm.lifeEvent.personId = personId;

                    if (vm.isCreateMode) {
                        //Save Life Event record
                        lifeEventService.createLifeEvent(vm.lifeEvent).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        //Update Life Event record
                        lifeEventService.updateLifeEvent(vm.lifeEvent).then(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }
            };

            vm.lifeEventTypeChanged = function (flag) {
                if (flag) {
                    var socialId = $filter('filter')(vm.lifeEventCategoryMaster, function (m) { return (m.code === 'Social' || m.description === 'Social'); })[0].id;
                    vm.lifeEvent.eventCategoryId = socialId;
                }
                
            };
            vm.disableSignificantEvent = false;
            vm.eventTypeChanged = function (eventType) {
                //allow only for non-significant lifeevent
                if (!significantLifeEventFlag) {
                    if (eventType.code == "TimelineEvent") {
                  
                            vm.lifeEvent.isSignificantEvent = false;
                            vm.disableSignificantEvent = true;
                   
                    }
                    else {
                        vm.disableSignificantEvent = false;
                    }
                }
            }

            vm.load = function () {
                vm.isCreateMode = !lifeEventId;
                vm.isEditMode = !vm.isCreateMode;

                if (vm.isCreateMode && vm.significantLifeEventFlag) {
                    vm.lifeEvent = {};
                    vm.lifeEvent.isSignificantEvent = true;
                }
                else if (vm.isEditMode) {
                    //Initialise From and To Date so will not trigger ng-mask before Data is formatted
                    vm.lifeEvent.from = "";
                    vm.lifeEvent.to = "";

                    //Retrieve existing Life Event selected
                    lifeEventService.getLifeEventForEdit(
                        { id: lifeEventId }
                    ).then(function (result) {
                        vm.lifeEvent = result.data;
                    });
                }
            };

            vm.init = function () {
                vm.permissions = permissions;

                masterData.getMasterDataTypeItems({
                    type: 'LifeEventCategory'
                }).then(function (result) {
                    vm.lifeEventCategoryMaster = result.data;
                    angular.forEach(vm.lifeEventCategoryMaster, function (value, key) {
                        if (value.description == "Social")
                            vm.lifeEvent.eventCategoryId = value.id;
                    });
                });

                masterData.getMasterDataTypeItems({
                    type: 'LifeEventType'
                }).then(function (result) {
                    vm.lifeEventTypeMaster = result.data;
                    angular.forEach(vm.lifeEventTypeMaster, function (value, key) {
                        if (value.description == "Life Event")
                            vm.lifeEvent.eventTypeId = value.id;
                    });
                });

                vm.load();
            };

            vm.init();
        }
    ]);
})();
