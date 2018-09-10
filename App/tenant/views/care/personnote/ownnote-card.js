(function () {
    appModule.component('ownnoteCard', {
        bindings: {
            mode: '<',
            personId: '<'
        },
        controller: [
            'abp.services.app.personNote',
            function (personNoteService) {
                var ctrl = this;
                ctrl.isPrivate = true;

                ctrl.$onChanges = function (changes) {
                    if (changes.personId && changes.personId.currentValue) {
                        ctrl.load();
                    }
                };

                ctrl.load = function () {
                    if (!ctrl.personId) {
                        return;
                    }

                    ctrl.loading = true;

                    personNoteService.getPersonNoteByPersonId({
                        personId: ctrl.personId,
                        isPrivate: ctrl.isPrivate
                    }).then(function (result) {
                        ctrl.model = result.data;

                        if (!ctrl.model) {
                            ctrl.model = {};
                            ctrl.model.personId = ctrl.personId;
                            ctrl.model.isPrivate = ctrl.isPrivate;
                        }
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                };

                ctrl.edit = function () {
                    ctrl.mode = 'edit';

                    ctrl.workingModel = _.pick(ctrl.model, [
                        'personId', 'isPrivate', 'description'
                    ]);
                };

                ctrl.cancel = function () {
                    ctrl.mode = 'view';
                };

                ctrl.save = function (form) {
                    if (form.$valid) {
                        ctrl.loading = true;

                        personNoteService.createPersonNote(
                            ctrl.workingModel
                        ).then(function (result) {
                            ctrl.mode = 'view';
                            ctrl.load();
                        }).finally(function () {
                            ctrl.loading = false;
                        });
                    }
                };
            }
        ],
        templateUrl: '~/App/tenant/views/care/personnote/ownnote-card.cshtml'
    });
})();
