(function (abp) {
    appModule.component('documentCard', {
        bindings: {
            title: '<',
            mode: '<',
            template: '<',
            module: '<',
            recordId: '<',
            personId: '<',
            upload: '<',
            delete: '<'
        },
        controller: [
            '$rootScope', '$scope', '$interval', '$filter', '$state', '$timeout', '$uibModal', 'uiGridConstants', 'abp.services.app.document',
            function ($rootScope, $scope, $interval, $filter, $state, $timeout, $uibModal, uiGridConstants, documentService) {
                var ctrl = this;
                ctrl.diagnosisList = [];
                ctrl.selectedFilter = true;
                ctrl.isDisabled = true;

                // lifecycle hooks
                ctrl.$onInit = function () {
                    ctrl.data = [];

                    ctrl.checkPermission();
                    ctrl.checkMode();

                    if (ctrl.permissions.attach == true) {
                        ctrl.upload = (!ctrl.upload || ctrl.upload == 'true') ? true : false;
                    } else {
                        ctrl.upload = false;
                    }

                    if (ctrl.permissions.delete == true) {
                        ctrl.delete = (!ctrl.delete || ctrl.delete == 'true') ? true : false;
                    } else {
                        ctrl.delete = false;
                    }
                };

                $rootScope.$on('refresh-document-ui-grid', function (events) {
                    // With reference from https://github.com/angular-ui/ui-grid/issues/3151
                    // This help to resolve the issue of ui-grid not rendering layout properly everytime when toggle between section tabs

                    if ($scope.gridApi.core != undefined) {
                        // call resize every 500 ms for 5 s after modal finishes opening - usually only necessary on a bootstrap modal
                        $interval(function () {
                            $scope.gridApi.core.handleWindowResize();
                        }, 500, 10);
                    }
                });

                ctrl.$onChanges = function (changes) {

                    ctrl.checkPermission();
                    ctrl.checkMode();

                    if (ctrl.permissions.attach == true) {

                        if (changes.upload) {
                            ctrl.upload = (!ctrl.upload || ctrl.upload == 'true') ? true : false;
                        }

                    } else {
                        ctrl.upload = false;
                    }

                    if (ctrl.permissions.delete == true) {

                        if (changes.delete) {
                            ctrl.delete = (!ctrl.delete || ctrl.delete == 'true') ? true : false;
                        }

                    } else {
                        ctrl.delete = false;
                    }

                    $timeout(function () {
                        if (changes.recordId != undefined) {
                            var requestParams = { skipCount: 0 };
                            ctrl.load(requestParams);
                        }
                    }, 1000);

                };

                ctrl.checkPermission = function () {
                    ctrl.permissions = {
                        attach: abp.auth.hasPermission('Pages.Tenant.' + ctrl.module + '.AttachDocument'),
                        download: abp.auth.hasPermission('Pages.Tenant.' + ctrl.module + '.DownloadDocument'),
                        delete: abp.auth.hasPermission('Pages.Tenant.' + ctrl.module + '.DeleteDocument'),
                    };
                };

                ctrl.checkMode = function () {

                    if (ctrl.mode == 'new' ||
                        ctrl.mode == '' ||
                        ctrl.mode == undefined) {
                        ctrl.isDisabled = true;
                    } else {
                        ctrl.isDisabled = false;
                    }
                };

                ctrl.gridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useCustomPagination: true,
                    useExternalPagination: true,
                    useExternalSorting: false,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    appScopeProvider: ctrl,
                    rowTemplate: '<div ng-click="grid.appScope.rowDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-style="{\'border-right\':\'1px solid #cccccc\'}" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                    columnDefs: [
                        {
                            name: 'selection',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            enableSorting: false,
                            width: "30",
                            headerCellTemplate: '' +
                                '<div role="checkbox button" ng-click="grid.appScope.headerSelectionButtonClick($event)" ng-keydown="grid.appScope.headerSelectionButtonClick($event)" ng-model="grid.selection.selectAll">' +
                                '   <span class="ui-grid-selection-custom" ng-class="{\'ui-grid-selection-custom-selected\': grid.selection.selectAll}">&#10003;</span>' + 
                                '</div> ',
                            cellTemplate:
                                '<div>' +
                                '   <span class="ui-grid-selection-custom" ng-class="{\'ui-grid-selection-custom-selected\': row.isSelected}">&#10003;</span>' +
                                '</div>'
                        },
                        {
                            name: app.localize('FileName'),
                            field: 'originalFileName',
                            enableHiding: false,
                            minWidth: 200,
                            width: "25%", 
                            cellTemplate:
                                '<div class=\"ui-grid-cell-contents nowrap\">' +
                                '  <a class="fontStealGreen" ng-click="grid.appScope.downloadFile(row.entity.id, row.entity.fileType)">{{row.entity.originalFileName}}</a>' +
                                '</div>'
                        },
                        {
                            name: app.localize('FileType'),
                            field: 'fileType',
                            enableHiding: false,
                            minWidth: 150,
                            width: "15%"
                        },
                        {
                            name: app.localize('FileSize'),
                            field: 'fileSizeInfo',
                            enableHiding: false,
                            minWidth: 100,
                            width: "10%"
                        },
                        {
                            name: app.localize('UploadedBy'),
                            field: 'uploadedByUser.fullName',
                            enableHiding: false,
                            minWidth: 150,
                            width: "10%"
                        },
                        {
                            name: app.localize('UploadedOn'),
                            field: 'uploadedOn',
                            enableHiding: false,
                            enableCellEdit: false,
                            enableColumnMenu: false,
                            minWidth: 160,
                            width: "15%",
                            sort: {
                                direction: uiGridConstants.DESC
                            },
                            cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.uploadedOn | dateTimeFormat }}</div>'
                        },
                        {
                            name: app.localize('Tags'),
                            field: 'tags',
                            enableHiding: false,
                            enableCellEdit: true,
                            enableColumnMenu: false,
                            minWidth: 150,
                            width: "25%",
                            cellTemplate:
                                '<div class="ui-grid-cell-contents text-wrap">' +
                                '   <div ng-repeat="tag in row.entity.tags" class="taginput-div">' +
                                '       <span class="taginput-label">{{ tag.name }}</span>' +
                                '   </div> ' +
                                '   <a class="fontStealGreen bold" ng-click="grid.appScope.editTag(row)">' + app.localize('EditTag') + '</a>' +
                                '</div>'
                        }
                    ],
                    data: ctrl.data,
                    onRegisterApi: function (gridApi) {
                        //set gridApi on scope
                        $scope.gridApi = gridApi;

                        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {

                            if (event) {
                                // Check if the click event come from anchor link, need to prevent the selection state from being toggled
                                if (event.target.tagName == "A") {
                                    if (row.isSelected == true) {
                                        row.isSelected = false;
                                    } else {
                                        row.isSelected = true;
                                    }
                                }
                            }
                        });
                    },
                };
                // event handlers

                //Clear the list filtering
                ctrl.clearFilter = function () {
                    ctrl.filterText = "";
                    ctrl.refreshGrid();
                };

                ctrl.uploadFile = function () {
                    openModelForCreateAndEdit(ctrl.module, ctrl.recordId, ctrl.personId);
                };

                ctrl.deleteFile = function () {

                    if ($scope.gridApi.selection.getSelectedRows().length == 0) {
                        abp.message.info(app.localize('PromptSelectFile'));
                        return;
                    }

                    abp.message.confirm(
                        app.localize('DeleteFile'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                var deletelist = $scope.gridApi.selection.getSelectedRows();
                                if (deletelist.length > 1) {
                                    documentService.deleteAll(deletelist).then(function (response) {
                                        abp.message.info(response.data.message);
                                        ctrl.getDocument();
                                    });
                                }
                                else {
                                    documentService.delete(deletelist[0]).then(function (response) {
                                        abp.message.info(response.data.message);
                                        ctrl.getDocument();
                                    });
                                }
                            }
                        }
                    );
                };

                ctrl.refreshGrid = function () {

                    var prms = {
                        skipCount: 0,
                        filter: ctrl.filterText
                    };
                    ctrl.getDocument();

                };

                ctrl.headerSelectionButtonClick = function (event) {
                    if ($scope.gridApi.grid.selection.selectAll == true) {
                        $scope.gridApi.selection.clearSelectedRows();
                    } else {
                        $scope.gridApi.selection.selectAllRows();
                    }
                };

                ctrl.editTag = function (row) {

                    var resolve = {
                        id: function () {
                            return row.entity.id;
                        }
                    };

                    openModalPopup(resolve);
                }

                ctrl.downloadFile = function (documentFileId, fileType) {
                    var downloadFilePath = abp.appPath + 'Document/DownloadFile?id=' + documentFileId;

                    if (fileType.indexOf('image') != -1) {
                        downloadFilePath = abp.appPath + 'Document/GetImageFile?id=' + documentFileId;
                    }

                    window.open(downloadFilePath, '_blank', '');
                };

                // callbacks
                ctrl.load = function (requestParams) {
                    ctrl.getDocument();
                };

                ctrl.getDocument = function () {
                    ctrl.loading = true;

                    documentService.getDocumentFileList(
                        $.extend({
                            module: ctrl.module,
                            recordId: ctrl.recordId,
                            personId: ctrl.personId,
                            filter: ctrl.filterText
                        }, ctrl.requestParams)
                    ).then(function (result) {
                        ctrl.gridOptions.totalItems = result.data.totalCount;
                        ctrl.gridOptions.data = result.data.items;
                        ctrl.data = result.data;
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                }

                function openModalPopup(resolve) {
                    var modalInstance = $uibModal.open({
                        component: 'documentEditTag',
                        backdrop: 'static',
                        resolve: resolve,
                        size: 'lg'
                    });

                    modalInstance.result.then(function (input) {
                        ctrl.load();
                    });
                };

                //create edit
                function openModelForCreateAndEdit(module, recordId, personId) {

                    var templateurl = '~/App/tenant/views/document/upload-file.cshtml';
                    var controller = 'tenant.views.document.uploadFile as vm';

                    var modalInstance = $uibModal.open({
                        templateUrl: templateurl,
                        controller: controller,
                        backdrop: 'static',
                        size: 'lg',
                        scope: $scope,
                        resolve: {
                            module: function () {
                                return module;
                            },
                            recordId: function () {
                                return recordId;
                            },
                            personId: function () {
                                return personId;
                            },
                        }
                    });
                    modalInstance.result.then(function () {
                        var requestParams = { skipCount: 0 };
                        ctrl.load(requestParams);
                    });
                };
            }
        ],

        templateUrl: '~/App/tenant/views/document/document-card.cshtml'
    });
})(abp);