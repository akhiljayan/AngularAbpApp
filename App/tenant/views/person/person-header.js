(function () {
    appModule.component('personHeader', {
        bindings: {
            personModel: '<',
            personId: '<',
            referralId: '<',
            mode: '<'
        },
        controllerAs: 'vm',
        controller: [
            '$scope', '$state', '$uibModal', '$filter', '$timeout', 'abp.services.app.allergy', 'abp.services.app.referral', 'abp.services.app.person',
            function ($scope, $state, $uibModal, $filter, $timeout, allergyService, referralService, personService) {
                var ctrl = this;
                ctrl.appPath = abp.appPath;
                ctrl.age = 0;
                ctrl.nonDrugString = "";
                ctrl.serviceTypeStatus = app.consts.referralServiceTypeStatus;

                ctrl.adrString = "";
                ctrl.drugString = "";


                ctrl.$onInit = function () {
                    ctrl.permissions = {
                        create: abp.auth.hasPermission('Pages.Tenant.Person.Create'),
                        edit: abp.auth.hasPermission('Pages.Tenant.Person.Edit'),
                        view: abp.auth.hasPermission('Pages.Tenant.Person.View'),
                        delete: abp.auth.hasPermission('Pages.Tenant.Person.Delete'),
                        //activate: abp.auth.hasPermission('Pages.Tenant.Person.Activate'),
                        //deActivate: abp.auth.hasPermission('Pages.Tenant.Person.DeActivate')
                    };

                    // Previous code using 'edit' and 'view'
                    if (ctrl.mode != 'view') {
                        ctrl.mode = 'new';
                    }
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.personId) {
                        setHeaderValue({ personId: ctrl.personId });
                    }

                    if (changes.personModel) {
                        if (!!ctrl.personModel && ctrl.personModel.id) {
                            setHeaderValue({ personId: ctrl.personModel.id });
                        }
                    }

                    if (changes.referralId) {
                        if (!ctrl.personId) {
                            setHeaderValue({ referralId: ctrl.referralId });
                        }
                    }
                };

                function setHeaderValue(input) {
                    if (!input.personId && !input.referralId) {
                        ctrl.personModel = null;
                        return;
                    }

                    personService.getPersonHeader(input)
                        .then(function (result) {
                            ctrl.personModel = result.data;
                            ctrl.age = $filter("ageFilter")(ctrl.personModel.dateOfBirth);

                            mapToDisplayObjects(ctrl.personModel.allergies);

                            referralService.getAllReferralServiceTypesByPersonId(
                                ctrl.personModel.id
                            ).then(function (result) {
                                result.data.nricAddress.fullAddress = result.data.nricAddress.fullAddress.replace(/<[^>]+>/g, ', ');

                                ctrl.personServiceTypeList = result.data;
                            });
                        });
                }

                ctrl.changePersonProfileImage = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/person/changeProfilePicture.cshtml',
                        controller: 'tenant.views.person.changeProfilePicture as vm',
                        backdrop: 'static',
                        resolve: {
                            personId: function () {
                                return ctrl.personModel.id;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        ctrl.personModel.pictureId = result.data;
                    });
                };

                ctrl.navigateToPerson = function (personId) {
                    $state.go('tenant.personDetail', { id: personId });
                };

                function mapToDisplayObjects(allergies) {
                    ctrl.personModel.drugAllergies = $filter('filter')(allergies, function (m) { return m.category == 1 && !m.isADR; });
                    ctrl.personModel.adrAllergies = $filter('filter')(allergies, function (m) { return m.category == 1 && m.isADR; });
                    ctrl.personModel.nonDrugAllergies = $filter('filter')(allergies, function (m) { return m.category == 2 && !m.isADR; });
                }

                ctrl.getNonDrugAllergy = function () {
                    var drugs = formatDrugList(ctrl.personModel.drugAllergies);
                    ctrl.nonDrugString = "<b>Non-Drug Allergies: </b></br><span>" + drugs + "</span>";
                };

                ctrl.getAdrDrugAllergy = function () {
                    var drugs = formatDrugList(ctrl.personModel.drugAllergies);
                    ctrl.adrString = "<b>Others with ADR: </b></br><span>" + drugs + "</span>";
                };

                ctrl.getDrugAllergy = function () {
                    var drugs = formatDrugList(ctrl.personModel.drugAllergies);
                    ctrl.drugString = "<b>Drug Allergies: </b></br><span>" + drugs + "</span>";
                };

                function formatDrugList(drugs) {
                    var drugArr = _.pluck(drugs, 'name');
                    var formattedDrugs = drugArr.map(function (val, index) {
                        return index + 1 + ') ' + val + ',</br>';
                    }).join("");

                    return formattedDrugs;
                }

                // $scope.$watch('$viewContentLoaded', bindJqueryEvents);
                //function bindJqueryEvents() {
                //    $timeout(function () {
                //        $(document).ready(function () {
                //            var mywindow = $(window);
                //            var mypos = mywindow.scrollTop();
                //            var up = false;
                //            var newscroll;
                //            mywindow.scroll(function () {
                //                newscroll = mywindow.scrollTop();
                //                if (newscroll > mypos && !up) {
                //                    $('#main-header-with-tab').stop().slideToggle();
                //                    //$('#person-tabs')
                //                    up = !up;
                //                    console.log(up);
                //                } else if (newscroll < mypos && up) {
                //                    $('#main-header-with-tab').stop().slideToggle();
                //                    up = !up;
                //                }
                //                mypos = newscroll;
                //            });
                //        });
                //    }, 0);
                //}
            }
        ],
        templateUrl: '~/App/tenant/views/person/person-header.cshtml'
    });
})();