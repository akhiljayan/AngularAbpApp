(function () {
    appModule.component('problemlistItem', {
        bindings: {
            model: '<',
            permissions: '<',
            showDetails: '=',
            onEdit: '&',
            onSelect: '&',
            onChangeStatus: '&'
        },
        controller: [
            '$uibModal', '$timeout', 'abp.services.app.personProblem',
            function ($uibModal, $timeout, personProblemService) {
                var ctrl = this;

                ctrl.$onInit = function () {
                    ctrl.seeMore = false;
                    // For display popover and hide popover
                    // ctrl.viewDescription = false;
                    // ctrl.mouseOver = false;
                };

                ctrl.$onChanges = function (changes) {
                    if (changes.model) {
                        ctrl.model.isChecked = false;
                        ctrl.assignStatusOptions(ctrl.model.status);
                        // ctrl.preparePopoverHtml(ctrl.model);
                    }
                };

                ctrl.load = function () {
                    personProblemService.getProblemListForEdit({
                        id: ctrl.model.id
                    }).then(function (result) {
                        ctrl.model = result.data;
                        // Call method as status changed
                        ctrl.assignStatusOptions(ctrl.model.status);
                    });
                };

                ctrl.assignStatusOptions = function (status) {
                    // This method is to hide the options based on current status
                    // Open
                    if (status == 0) {
                        ctrl.statusOptions = { 'Open': false, 'Suspended': true, 'Closed': true, 'Resolved': true };
                    }
                    // Suspended
                    else if (status == 1) {
                        ctrl.statusOptions = { 'Open': true, 'Suspended': false, 'Closed': true, 'Resolved': true };
                    }
                    // Resolved
                    else if (status == 2) {
                        ctrl.statusOptions = { 'Open': true, 'Suspended': false, 'Closed': true, 'Resolved': false };
                    }
                    // Closed
                    else if (status == 3) {
                        ctrl.statusOptions = { 'Open': true, 'Suspended': false, 'Closed': false, 'Resolved': false };
                    }
                    else {
                        ctrl.statusOptions = { 'Open': false, 'Suspended': false, 'Closed': false, 'Resolved': false };
                    }
                };

                //ctrl.preparePopoverHtml = function (model) {
                //    var tagsHtml = '';
                //    ctrl.popoverHtml = '';

                //    if (ctrl.model.tags) {
                //        for (var i = 0; i < ctrl.model.tags.length; i++) {
                //            tagsHtml += "<span class='tag label label-info tag-spacing'>" + ctrl.model.tags[i].name + "</span>";
                //        }

                //        ctrl.popoverHtml = 
                //            "<div class='row'>" +
                //                "<div class='col-md-12 form-group margin-bottom-20'>" +
                //                    "<div class='bootstrap-tagsinput'>" +
                //                        tagsHtml +
                //                    "</div>" +
                //                "</div>" +
                //            "</div>";
                //    }
                    
                //    ctrl.popoverHtml += 
                //        "<div class='row'>" +
                //            "<div class='col-md-12 form-group margin-bottom-20'>" +
                //                "<div class='form-control remove-border auto-height'>" +
                //                    (ctrl.model.problemDescription || 'N/A') +
                //                "</div>" +
                //            "</div>" +
                //        "</div>";
                //};

                ctrl.changeStatus = function (problemListId, status) {
                    ctrl.onChangeStatus({
                        event: {
                            problemListId: problemListId,
                            status: status
                        }
                    });
                };

                ctrl.edit = function ($event) {
                    if (ctrl.permissions.editPersonProblem) {
                        ctrl.onEdit({
                            event: {
                                id: ctrl.model.id
                            }
                        });
                    }
                };

                ctrl.select = function ($event) {
                    event.preventDefault();

                    $timeout(function () {
                        ctrl.model.isSelected = !ctrl.model.isSelected;

                        ctrl.onSelect({
                            event: {
                                id: ctrl.model.id,
                                isSelected: ctrl.model.isSelected
                            }
                        });
                    });
                };
            }
        ],
        templateUrl: '~/App/tenant/views/care/problemlist/problemlist-item/problemlist-item.cshtml'
    });
})();