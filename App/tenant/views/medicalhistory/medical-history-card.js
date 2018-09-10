(function (abp) {
    appModule.component('medicalHistoryCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            personId: '<',
            referralId: '<',
            isPatient: '<',
            isReferral: '<'
        },
        controller: [
            '$scope', '$filter', '$state', '$uibModal', 'abp.services.app.medicalHistory',
            function ($scope, $filter, $state, $uibModal, medicalHistoryService) {
                
                var ctrl = this;
                ctrl.onSwap = false;                
                ctrl.printMedicalHistory = [];
                ctrl.checkedAll = false;
                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.medicalhistories = [];
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.Edit'),
                        activate: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.View'),
                        deactivate: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.Delete'),
                        print: abp.auth.hasPermission('Pages.Tenant.MedicalHistory.Print'),
                    };
                };              
             
                var templateurl = '~/App/tenant/views/medicalhistory/createOrEditMedicalHistories.cshtml';
                var controller = 'tenant.views.medicalhistory.createOrEditMedicalHistories as vm';

                ctrl.$onChanges = function (changes) {
                    if (changes.personId || changes.referralId) {
                        load();
                    }
                };

                // event handlers
                ctrl.create = function () {
                    openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, app.consts.EmptyGuid, ctrl.template, templateurl, controller);
                };
                ctrl.swap = function () {
                    ctrl.onSwap = true;
                };
                ctrl.save = function () {
                    ctrl.onSwap = false;
                    medicalHistoryService.updateOrderList(ctrl.medicalhistories).then(function () {
                        getpersonMedicalHistory(ctrl.personId);
                    });
                };
                ctrl.cancel = function () {
                   
                    abp.message.confirm(
                        app.localize('MedicalHistoryCancelOrder'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                getpersonMedicalHistory(ctrl.personId);
                                ctrl.onSwap = false;
                            } 
                        }
                    );

                };

                ctrl.selectAll = function () {
                    for (var i = 0; i < ctrl.medicalhistories.length; i++) {
                        var item = ctrl.medicalhistories[i];
                        ctrl.printMedicalHistory[item.id] = true;
                    }
                    ctrl.checkedAll = true;
                };

                ctrl.unSelectAll = function () {
                    for (var i = 0; i < ctrl.medicalhistories.length; i++) {
                        var item = ctrl.medicalhistories[i];
                        ctrl.printMedicalHistory[item.id] = false;
                    }
                    ctrl.checkedAll = false;
                };

                ctrl.moveup = function ( id, orderId) {
                    if (orderId == 1)
                        return;
                    var currentKey = findMedicalHistory(orderId);
                    var previousKey = findMedicalHistory(orderId - 1);
                    currentKey.orderId = orderId - 1;
                    previousKey.orderId = orderId;

                };
                ctrl.movedown = function ( id,orderId) {
                    if (orderId == ctrl.medicalhistories.length)
                        return;
                    var currentKey = findMedicalHistory(orderId);
                    var nextKey = findMedicalHistory(orderId + 1);
                    currentKey.orderId = orderId + 1;
                    nextKey.orderId = orderId;

                };

                function findMedicalHistory(orderId) {
                    for (var key in ctrl.medicalhistories) {
                        if (ctrl.medicalhistories.hasOwnProperty(key)) {
                            if (ctrl.medicalhistories[key].orderId == orderId) {
                                return ctrl.medicalhistories[key];
                            }
                        }
                    }
                };

                ctrl.editMedicalhistory = function (medicalhistory) {
                    if (ctrl.permissions.edit || ctrl.permissions.activate || (ctrl.isPatient || ctrl.isReferral)) {
                        openModelForCreateAndEdit(ctrl.personId, ctrl.referralId, medicalhistory.id, ctrl.template, templateurl, controller);
                    }
                };
                
                ctrl.print = function () {

                    ctrl.printIdList = '';                    

                    if (ctrl.permissions.print) {
                        for (var obj in ctrl.printMedicalHistory) {
                            if (ctrl.printMedicalHistory[obj]) {
                                ctrl.printIdList += obj + ',';
                            }
                        }                        
                        var data = ctrl.printIdList.slice(0, -1);    
                        if (data != '') {
                            var reportWindow = window.open();
                            medicalHistoryService.printMedicalHistory(ctrl.personId, data).then(function (result) {                                
                                ctrl.url = result.data;

                                var location = window.location.origin + abp.appPath + ctrl.url;
                                reportWindow.location = location;
                                reportWindow.target = '_blank';
                                reportWindow.locationbar.visible = false;
                                reportWindow.focus();
                            });
                        } else {
                            abp.message.info("Please select Medical History to print!");
                        }                 
                    }
                };               

                ctrl.deleteMedicalHistory = function (medicalHistoryId) {
                    abp.message.confirm(
                        app.localize('RecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                medicalHistoryService.delete(medicalHistoryId).then(function (result) {
                                }).finally(function () {
                                    abp.notify.info(app.localize('MedicalHistoryDeletedSuccessfully'));
                                    load();
                                });
                            }
                        }
                    );
                };

                // callbacks
                function load() {
                    ctrl.loading = true;
                   if (ctrl.referralId && ctrl.template == 'referral') {
                        getReferralMedicalHistory(ctrl.referralId);
                    }else if (ctrl.personId && ctrl.template == 'person') {
                        getpersonMedicalHistory(ctrl.personId);
                    }  
                };

                function getReferralMedicalHistory(referralId) {
                    medicalHistoryService.getReferralMedicalHistories(referralId).then(function (result) {
                        ctrl.medicalhistories = result.data;
                        ctrl.loading = false;
                    });
                };

                function getpersonMedicalHistory(personId) {
                    medicalHistoryService.getPersonMedicalHistories(personId).then(function (result) {
                        var medicalHistoryList = result.data;
                        var i = 1;
                        for (var key in medicalHistoryList) {
                            if (medicalHistoryList.hasOwnProperty(key)) {
                                medicalHistoryList[key].orderId = i;
                                i++;
                            }
                        }
                        ctrl.medicalhistories = medicalHistoryList;
                        ctrl.loading = false;
                    });
                };

                load();

                $scope.$on('Created-Updated-Medicalhistory', function () {
                    load();
                });

                //create edit
                function openModelForCreateAndEdit(prsnId, refId, medicalhistoryId, temp, temptemplateurl, controller) {
                    var modalInstance = $uibModal.open({
                        templateUrl: temptemplateurl,
                        controller: controller,
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            personId: function () {
                                return prsnId;
                            },
                            medicalhistoryId: function () {
                                return medicalhistoryId;
                            },
                            referralId: function () {
                                return refId;
                            },
                            template: function () {
                                return temp;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        load();
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/medicalhistory/medical-history-card.cshtml'
    });
})(abp);