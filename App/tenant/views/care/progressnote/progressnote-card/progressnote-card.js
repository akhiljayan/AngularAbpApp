(function () {
    appModule.component('progressnoteCard', {
        require: {
            parentCtrl: '?^careTabContent'
        },
        bindings: {
            mode: '<',
            personId: '<',
            visitLogId: '<',
            showDetails: '<',
            selectedPersonProblems: '<',
            loadProgressNote: '<'
        },
        controller: [
            'abp.services.app.progressNote', '$uibModal', '$timeout', 'abp.services.app.progressNoteType', 'abp.services.app.person', 'abp.services.app.visitLog',
            function (progressNoteService, $uibModal, $timeout, progressNoteTypeService, personService, visitLogService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    if (ctrl.mode === 'new') {
                        return;
                    }

                    ctrl.progressNoteTypes = [];
                    ctrl.permissions = {
                        createAndConfirmProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.CreateAndConfirm'),
                        createDraftProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.CreateAsDraft'),
                        createConfidentialProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.CreateAsConfidential'),
                        editProgressNote: abp.auth.hasPermission('Pages.Tenant.ProgressNotes.Edit')
                    };
                    ctrl.periodsFilter = [];
                    ctrl.progressNoteTypesFilter = [];
                    ctrl.showFilterDropdown = false;
                    // Default to true as visitLogId is not provided 
                    ctrl.shouldCreateProgressNoteForVisitLog = true;

                    loadProgressNoteTypes();
                };
                
                ctrl.$onChanges = function (changes) {
                    if (ctrl.parentCtrl) {
                        if (changes.selectedPersonProblems) {
                            ctrl.load();
                        }

                        if (changes.personId && changes.personId.currentValue) {
                            ctrl.load();
                        }

                        if (changes.loadProgressNote && changes.loadProgressNote.currentValue) {
                            ctrl.parentCtrl.selectedPersonProblems = [];
                        }
                    } else {
                        if (changes.visitLogId && changes.visitLogId.currentValue) {
                            ctrl.load();
                        }
                    }
                };

                ctrl.create = function () {
                    var resolve = {
                        personId: function () {
                            return ctrl.personId;
                        },
                        selectedPersonProblems: function () {
                            return ctrl.selectedPersonProblems;
                        },
                        visitLogId: function () {
                            return ctrl.visitLogId;
                        },
                        visitDateTimeIn: function () {
                            return ctrl.visitDateTimeIn;
                        },
                        visitDateTimeOut: function () {
                            return ctrl.visitDateTimeOut;
                        }
                    };

                    openModalPopup('progressnoteNew', resolve);
                };

                ctrl.edit = function (progressNote) {
                    var resolve = {
                        personId: function () {
                            return ctrl.personId;
                        },
                        progressNoteId: function () {
                            return progressNote.id;
                        }
                    };

                    openModalPopup('progressnoteEdit', resolve);
                };

                ctrl.editTag = function (progressNote) {
                    var resolve = {
                        progressNoteId: function () {
                            return progressNote.id;
                        }
                    };

                    openModalPopup('progressnoteEditTag', resolve);
                };

                ctrl.pin = function (model) {
                    ctrl.loading = true;

                    progressNoteService.pinProgressNote({
                        id: model.id
                    }).then(function () {
                        ctrl.load();
                    });
                };

                ctrl.selectPeriod = function (period) {
                    ctrl.periodsFilter = [period];
                    ctrl.showFilterDropdown = !ctrl.showFilterDropdown;

                    ctrl.load();
                };

                ctrl.selectProgressNoteType = function (type) {
                    $timeout(function () {
                        type.isChecked = !type.isChecked;

                        if (type.isChecked) {
                            var index = ctrl.progressNoteTypesFilter.indexOf(type.id);
                            if (index < 0) {
                                ctrl.progressNoteTypesFilter.push(type.id);
                            }
                        } else {
                            var index = ctrl.progressNoteTypesFilter.indexOf(type.id);
                            if (index >= 0) {
                                ctrl.progressNoteTypesFilter.splice(index, 1);
                            }
                        }

                        ctrl.load();
                    });

                    event.preventDefault();
                    event.stopPropagation();
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = null;
                };

                ctrl.load = function (requestParams) {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;

                    personService.getPerson(
                        ctrl.personId
                    ).then(function (result) {
                        ctrl.isPatient = result.data.isPatient;
                    });

                    if (!ctrl.visitLogId) {
                        progressNoteService.getProgressNotesByPersonId(
                            $.extend({
                                personId: ctrl.personId,
                                filter: ctrl.filter,
                                personProblemId: ctrl.selectedPersonProblems,
                                periods: ctrl.periodsFilter,
                                progressNoteTypes: ctrl.progressNoteTypesFilter
                            }, requestParams)
                        ).then(function (result) {
                            ctrl.data = result.data;
                        }).finally(function () {
                            ctrl.loading = false;
                    });
                    } else {
                        /*
                            Get Visit Log for isConfirmed and isCancelled validation
                            If either isConfirmed or isCancelled, progress note card should disable the create button
                        */
                        visitLogService.getVisitLogForEdit({
                            id: ctrl.visitLogId
                        }).then(function (result) {
                            ctrl.shouldCreateProgressNoteForVisitLog = !(result.data.isConfirmed || result.data.isCancelled);
                            ctrl.visitDateTimeIn = result.data.visitDateTimeIn;
                            ctrl.visitDateTimeOut = result.data.visitDateTimeOut;
                        });
                        progressNoteService.getProgressNotesByVisitLogId(
                            $.extend({
                                visitLogId: ctrl.visitLogId,
                                filter: ctrl.filter,
                                periods: ctrl.periodsFilter,
                                progressNoteTypes: ctrl.progressNoteTypesFilter
                            }, requestParams)
                        ).then(function (result) {
                            ctrl.data = result.data;
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    }
                };

                ctrl.clearFilter = function () {
                    ctrl.filter = '';
                    ctrl.load();
                };

                function openModalPopup(component, resolve) {
                    var modalInstance = $uibModal.open({
                        component: component,
                        backdrop: 'static',
                        resolve: resolve,
                        size: 'lg'
                    });

                    modalInstance.result.then(function (input) {
                        ctrl.load();
                    });
                };

                function loadProgressNoteTypes() {
                    progressNoteTypeService.getAllProgressNoteTypes({
                    }).then(function (result) {
                        ctrl.progressNoteTypes = result.data.items;
                    })
                }
            }
        ],
        templateUrl: "~/App/tenant/views/care/progressnote/progressnote-card/progressnote-card.cshtml"
    });
})();