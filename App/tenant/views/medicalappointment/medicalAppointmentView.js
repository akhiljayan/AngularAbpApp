(function () {
    appModule.controller('tenant.views.medicalappointment.medicalAppointmentView', [
        '$scope', '$state', '$uibModal', '$timeout', 'commonFormFunction', 'abp.services.app.masterData', 'abp.services.app.masterLookUp', '$stateParams', 'abp.services.app.medicalAppointment', '$anchorScroll', '$location', 'abp.services.app.user', '$uibModal', '$filter', 'abp.services.app.commonLookup', '$rootScope', 'abp.services.app.person', 'stateNavigation',
        function ($scope, $state, $uibModal, $timeout, commonFormFunction, masterData, masterLookup, $stateParams, medicalAppointmentService, $anchorScroll, $location, userService, $uibModal, $filter, commonLookupService, $rootScope, personService, stateNavigation) {
            var vm = this;
            $anchorScroll.yOffset = 100;
            vm.personHeaderisPinned = true;
            vm.appPath = abp.appPath;
            vm.isCreateMode = !$stateParams.id;
            vm.mode = 'view';
            vm.isNew = 0;
            vm.bioData = {};
            vm.person = {};
            vm.users = [];
            vm.medicalAppointment = {};
            vm.result = $scope.DefaultPageSize;

            // To prevent simultaneous saving of records which would result in duplicated records
            vm.isSavingDisabled = false;
            vm.personDisabled = false;
            vm.isAppointmentTypeSOC = false;

            vm.navigationalMenu = [
                { key: 'General', displayName: 'General', permission: true },
                { key: 'OtherInformation', displayName: 'Other Information', permission: true }
            ];

            //Close
            vm.close = function () {

                if (typeof $stateParams.personId != 'undefined') {
                    stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.personId);
                } else if ($stateParams.close == 'Careboard') {
                    $state.go('tenant.dashboard.careboard');
                } else {
                    $state.go('tenant.medicalAppointment');
                }
            }

            //Navigation to cards
            vm.gotoAnchor = function (key) {
                var offset = 0;
                if (vm.isNew == 0) {
                    offset = 265;
                } else {
                    offset = 175;
                }
                $location.hash(key);
                $anchorScroll.yOffset = offset;
                $anchorScroll();
            };

            //Prepare save
            vm.prepareSave = function (backToListing) {

                if (vm.isSavingDisabled == false) {

                    $scope.$broadcast('check-select-ui-required');

                    var cardModuleForm = [
                        $scope.vm.gvm.medicalAppointmentGeneralForm,
                        $scope.vm.ovm.otherInfoForm
                    ];

                    commonFormFunction.setMultipleFormSubmitted(cardModuleForm);

                    var isValid = $scope.vm.gvm.medicalAppointmentGeneralForm.$valid &&
                        $scope.vm.ovm.otherInfoForm.$valid;

                    if (isValid) {

                        commonFormFunction.setPristine();

                        vm.loading = true;
                        vm.isSavingDisabled = true;
                        vm.save(backToListing);
                    };
                }
            };

            //Final save
            vm.save = function (backToListing, childscope) {

                if ($stateParams.id) {
                    medicalAppointmentService.edit(vm.medicalAppointment).then(function (result) {
                        if (result) {
                            childscope.mode = "view";
                            vm.init();
                        }

                    }).finally(function () {
                        vm.loading = false;
                        vm.isSavingDisabled = false;
                    });

                } else {
                    //Create
                    medicalAppointmentService.create(vm.medicalAppointment).then(function (result) {                        
                        $scope.$broadcast('MedicalAppointmentUpdated', { event: $scope.lastEvent, success: true });
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        if (backToListing) {
                            if (typeof $stateParams.personId != 'undefined') {
                                stateNavigation.closeToPerson(app.consts.personTabs.tabs.encounter, $stateParams.personId);
                            } else {
                                $state.go('tenant.medicalAppointment');
                            }
                        } else {
                            if (typeof $stateParams.personId != 'undefined') {
                                $state.go('tenant.medicalAppointmentPersonDetail', { id: result.data.id, personId: $stateParams.personId });
                            } else {
                                $state.go('tenant.medicalAppointmentDetail', { id: result.data.id });
                            }                            
                        }

                    }).finally(function () {
                        vm.loading = false;
                        vm.isSavingDisabled = false;
                    });
                }
            };

            //Confirm
            vm.confirm = function () {
                abp.message.confirm(
                    'Please click Ok to continue',
                    'You are about to Confirm the Medical Appointment',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            medicalAppointmentService.confirm(vm.medicalAppointment.id).then(function (result) {
                                vm.init();
                            });
                        };
                    });
            };

            vm.cancel = function () {
                abp.message.confirm(
                    'Please click Ok to continue',
                    'You are about to Cancel the Medical Appointment',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openValidationPopUp("cancel");
                        };
                    });
            }

            //load after confirm and cancel
            $scope.$on('Created-Updated-MedicalAppointment', function () {
                vm.init();
            });


            //Load page and data
            vm.load = function () {
                vm.loading = true;
                if ($stateParams.personId) {
                    vm.personDisabled = true;
                }
                if ($stateParams.id) {
                    getMedialAppointmentObject($stateParams.id);
                } else {
                    vm.isNew = 1;
                    vm.mode = 'edit';
                    getEmptyMedialAppointmentObject();
                }
            };

            //Init method
            vm.init = function () {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.View'),
                    delete: abp.auth.hasPermission('Pages.Tenant.MedicalAppointment.Delete'),
                    person: abp.auth.hasPermission('Pages.Tenant.Person')
                };
                vm.load();
            };

            $scope.$on('UpdateMedicalAppointment', function (event, data) {
                if (data.medicalAppointment) {
                    $scope.lastEvent = event;
                    for (var prop in data.medicalAppointment) {
                        vm.medicalAppointment[prop] = data.medicalAppointment[prop];
                    }
                    vm.save(null, data.scope);
                }
            })

            vm.init();
            $scope.$watch('$viewContentLoaded', bindJqueryEvents);

            //Change person header
            vm.personSelected = function (personId) {
            }



            //Get MedialAppointment Object
            function getMedialAppointmentObject(guid) {

                medicalAppointmentService.get(guid).then(function (result) {
                    vm.medicalAppointment = result.data;
                    vm.personSelected(vm.medicalAppointment.personId);

                    vm.loading = false;
                });
            };

            //Get empty MedialAppointment Object
            function getEmptyMedialAppointmentObject() {

                medicalAppointmentService.get($scope.EmptyGuid).then(function (result) {
                    vm.medicalAppointment = result.data;
                    vm.medicalAppointment.personId = null;
                    if (typeof $stateParams.personId != 'undefined' && $stateParams.personId != null) {
                        vm.medicalAppointment.personId = $stateParams.personId;
                        vm.personSelected($stateParams.personId);
                    }
                    vm.loading = false;
                });
            };


            //Validation Popup
            function openValidationPopUp(reason) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/medicalappointment/medicalAppointmentRequiredFields.cshtml',
                    controller: 'tenant.views.medicalappointment.medicalAppointmentRequiredFields as vm',
                    backdrop: 'static',
                    scope: $scope,
                    resolve: {
                        data: function () {
                            return vm.medicalAppointment;
                        },
                        action: function () {
                            return reason;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    load();
                });
            };

            //Jquery functions
            function bindJqueryEvents() {
                $timeout(function () {
                    $(document).ready(function () {
                    });
                }, 0);
            }
        }
    ]);
})();