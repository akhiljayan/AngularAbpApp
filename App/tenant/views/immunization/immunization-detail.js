(function () {
    appModule.component('immunizationDetail', {
        bindings: {
            resolve: '<',
            modalInstance: '<'            
        },
        controllerAs: "vm",
        controller: [
            '$state', '$rootScope', '$location', 'abp.services.app.person', 'abp.services.app.immunization',
            function ($state, $rootScope, $location, personService, immunizationService) {
                var ctrl = this
                ctrl.editMode = false;
                ctrl.disableOtherVaccine = true;
                ctrl.disableOtherRoute = true;
                ctrl.disableOtherSite = true;
                ctrl.disableOtherEffectivePeriod = true;

                ctrl.cancel = function () {
                    ctrl.modalInstance.dismiss();                    
                };

                ctrl.$onInit = function () {
                    
                    /* Binding parameter from parent component. */
                    ctrl.disableSave = false;       
                    ctrl.personId = ctrl.resolve.personId;
                    ctrl.immunizationId = ctrl.resolve.id;
                    ctrl.permissions = ctrl.resolve.permissions;
                    ctrl.template = ctrl.resolve.template;
                    
                    if (ctrl.immunizationId != app.consts.EmptyGuid)
                        ctrl.editMode = true;
                    
                    immunizationService.getImmunization(ctrl.immunizationId).then(function (result) {
                        
                        ctrl.immunization = result.data;

                        if (!ctrl.editMode) {
                            /* Bug-1595
                         * System to auto populate today date as Effective Date.
                         * It's set on the front end because the date component doesn't fit in business logic if Clock.Now assigned in back-end.
                         */
                            var date = new Date();
                            ctrl.immunization.effectiveDate = moment(date).format("D-MMM-YYYY");
                        }                        

                        if (!ctrl.editMode)
                            ctrl.immunization.vaccineId = null;
                        else {
                            if (ctrl.immunization.otherVaccine != null)
                                ctrl.disableOtherVaccine = false;

                            if (ctrl.immunization.otherSite != null)
                                ctrl.disableOtherSite = false;

                            if (ctrl.immunization.otherRoute != null)
                                ctrl.disableOtherRoute = false;

                            if (ctrl.immunization.otherEffectivePeriod != null)
                                ctrl.disableOtherEffectivePeriod = false;
                        }
                    });

                    /* Getting Person Info. */
                    if (ctrl.personId != app.consts.EmptyGuid) {
                        getPerson(ctrl.personId);
                    }
                };         

                ctrl.save = function (immunization) {
                    ctrl.disableSave = true;

                    if (ctrl.personId && immunization.personId == app.consts.EmptyGuid)
                        immunization.personId = ctrl.personId;

                    if (ctrl.editMode && ctrl.immunizationId != app.consts.EmptyGuid) {
                        immunizationService.updateImmunization(immunization).then(function (result) {                            
                            ctrl.modalInstance.close();
                        });
                    } else {
                        immunizationService.createImmunization(immunization).then(function (result) {                            
                            ctrl.modalInstance.close();                            
                        }).finally(function () {
                            ctrl.disableSave = false;
                        });
                    }                       
                };

                // On Change Methods

                ctrl.onChangeVaccine = function (selected) {
                    ctrl.selectedVaccine = selected;
                    if (selected != null && selected.description == 'Others')
                        ctrl.disableOtherVaccine = false;
                    else {
                        ctrl.disableOtherVaccine = true;
                        ctrl.immunization.otherVaccine = null;
                    }
                };

                ctrl.onChangeRoute = function (selected) {  
                    ctrl.selectedRoute = selected;
                    if (selected != null && selected.description == 'Others')
                        ctrl.disableOtherRoute = false;
                    else {
                        ctrl.disableOtherRoute = true;
                        ctrl.immunization.otherRoute = null;
                    }
                };

                ctrl.onChangeSite = function (selected) {  
                    ctrl.selectedSite = selected;
                    if (selected != null && selected.description == 'Others')
                        ctrl.disableOtherSite = false;
                    else {
                        ctrl.disableOtherSite = true;
                        ctrl.immunization.otherSite = null;
                    }                    
                };

                ctrl.onChangeEffectivePeriod = function (selected) {
                    
                    ctrl.selectedEffePeriod = selected;
                    ctrl.effectivePeriod = 0;

                    if (selected != null && selected.description == 'Others') {
                        ctrl.disableOtherEffectivePeriod = false;

                    } else if (selected != null && selected.description != 'Others') {
                        ctrl.disableOtherEffectivePeriod = true;
                        ctrl.immunization.otherEffectivePeriod = null;

                        /* EffectiveDate logic binding based on selected EffectivePeriod. */
                        switch (selected.description) {
                            case '3 months':
                                ctrl.effectivePeriod = 3;
                                break;
                            case '6 months':
                                ctrl.effectivePeriod = 6;
                                break;
                            case '12 months':
                                ctrl.effectivePeriod = 12;
                                break;
                            case '24 months':
                                ctrl.effectivePeriod = 24;
                                break;
                            default:
                                ctrl.effectivePeriod = 0;
                                break;
                        };
                    } else {
                        ctrl.disableOtherEffectivePeriod = true;
                        ctrl.immunization.otherEffectivePeriod = null;                        
                    }

                    if (ctrl.effectivePeriod != undefined && ctrl.effectivePeriod != 0) {
                        var effectiveDate = moment(ctrl.immunization.effectiveDate);
                        ctrl.immunization.expiryDate = effectiveDate.add(ctrl.effectivePeriod, 'month');
                    } else {
                        ctrl.immunization.expiryDate = null;
                    }
                };

                ctrl.onChangeExpiryDate = function () {
                    
                    if (ctrl.effectivePeriod != undefined && ctrl.effectivePeriod != 0 && ctrl.immunization.expiryDate != null && ctrl.immunization.effectiveDate != null) {
                        var effectiveDate = moment(ctrl.immunization.effectiveDate);
                        var toDate = effectiveDate.add(ctrl.effectivePeriod, 'month');


                        var to_Date = Date.parse(toDate);
                        var from_Date = Date.parse(ctrl.immunization.effectiveDate);
                        var date = Date.parse(ctrl.immunization.expiryDate);

                        if (date > from_Date && date < to_Date) {
                            //
                        } else {
                            abp.message.info('Expiry Date cannot be earlier than Effective Date and must be within the Effective Date + Effective Period.');
                            ctrl.immunization.expiryDate = null;
                        }
                    }
                };

                ctrl.onChangeEffectiveDate = function () {
                    
                    if (ctrl.effectivePeriod != undefined && ctrl.effectivePeriod != 0 && ctrl.effectivePeriod != 0 && ctrl.immunization.effectiveDate != null) {
                        var effectiveDate = moment(ctrl.immunization.effectiveDate);
                        ctrl.immunization.expiryDate = effectiveDate.add(ctrl.effectivePeriod, 'month');
                    }
                }

                getPerson = function (personId) {
                    personService.getPerson(personId).then(function (result) {
                        ctrl.person = result.data;
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/immunization/immunization-detail.cshtml'
    });
})();