(function (_) {
    appModule.component('centrePersonGroupDetailPersonlist', {
        require: {
            parentCtrl: '^centrePersonGroupDetail'
        },
        bindings: {
            mode: '<',
            model: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$uibModal', '$state', 'abp.services.app.membershipBooking', 
            function ($uibModal, $state, membershipBookingService) {
                var ctrl = this;
                ctrl.personListLoading = false;

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        if (ctrl.model.persons && ctrl.model.persons.length > 0) {
                            ctrl.model.personModel = angular.copy(ctrl.model.persons);
                            ctrl.model.persons = [];
                        }
                    }
                };

                ctrl.addPersonToPersonGroup = function () {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        component: 'addParticipants',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            centrePersonGroupId: function () {
                                return ctrl.model.id;
                            },
                            attendanceDate: function () {
                                return new Date();
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        $state.reload();
                    });
                };

                ctrl.remove = function () {
                    abp.message.confirm(
                        app.localize('SelectedRecordDeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                membershipBookingService.removeCentrePersonGroupPersons({
                                    id: ctrl.model.id,
                                    Persons: ctrl.model.persons
                                }).then(function (result) {
                                    abp.notify.info(app.localize('SavedSuccessfully'));
                                    $state.reload();
                                });
                            }
                        }
                    );
                };
            }],
        templateUrl: '~/App/tenant/views/centrePersonGroups/centrepersongroup-detail/centrepersongroup-detail-personlist.cshtml'
    });
})(_);