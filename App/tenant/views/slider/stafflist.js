(function () {
    appModule.component('staffList', {
        controller: [
            '$state', '$stateParams', '$sce', 'abp.services.app.user',
            function ($state, $stateParams, $sce, userService) {
                var ctrl = this;
                ctrl.checked = false;
                ctrl.appPath = abp.appPath;

                ctrl.coWorkersCount = 0;
                ctrl.coWorkers = [];
                ctrl.pageNumberCW = 1;
                ctrl.pageSizeCW = 5;
                var requestParamsCW = {
                    skipCount: 0,
                    maxResultCount: ctrl.pageSizeCW
                };

                ctrl.ubStaffCount = 0;
                ctrl.ubStaff = [];
                ctrl.pageNumberUBStaff = 1;
                ctrl.pageSizeUBStaff = 5;
                var requestParamsUBStaff = {
                    skipCount: 0,
                    maxResultCount: ctrl.pageSizeUBStaff
                };

                ctrl.rbStaffCount = 0;
                ctrl.rbStaff = [];
                ctrl.pageNumberRBStaff = 1;
                ctrl.pageSizeRBStaff = 5;
                var requestParamsRBStaff = {
                    skipCount: 0,
                    maxResultCount: ctrl.pageSizeRBStaff
                };

                ctrl.$onInit = function () {
                    ctrl.load();
                };

                ctrl.load = function () {
                    ctrl.getUserUpcomingBirthday();
                    ctrl.getUserRecentBirthday();
                    ctrl.getCoWorkers();
                };

                ctrl.toggleSlider = function () {
                    ctrl.checked = !ctrl.checked;
                    if (!ctrl.checked) {
                        ctrl.zindex = 1000;
                    } else {
                        ctrl.zindex = 1005;
                    }
                };

                ctrl.getCoWorkers = function () {
                    userService.getCoWorkers(
                        $.extend({ filter: ctrl.filter }, requestParamsCW)
                    ).then(function (result) {
                        ctrl.coWorkersCount = result.data.totalCount;
                        for (var i = 0; i < result.data.items.length; i++) {
                            var coWorker = result.data.items[i];
                            ctrl.coWorkers.push(coWorker);
                        }
                    });
                };

                function incrementpageNumberCW() {
                    ctrl.pageNumberCW++;
                    requestParamsCW.skipCount = (ctrl.pageNumberCW - 1) * ctrl.pageSizeCW;
                }

                ctrl.loadMoreCoWorker = function () {
                    incrementpageNumberCW();
                    ctrl.getCoWorkers();
                };

                ctrl.clearFilter = function () {
                    requestParamsCW.skipCount = 0;
                    requestParamsCW.maxResultCount = 5;
                    ctrl.coWorkers = [];
                    ctrl.filter = "";
                    ctrl.getCoWorkers();
                };

                ctrl.filterCoWorker = function () {
                    requestParamsCW.skipCount = 0;
                    requestParamsCW.maxResultCount = 100;
                    ctrl.coWorkers = [];
                    ctrl.getCoWorkers();
                };

                ctrl.getUserUpcomingBirthday = function () {
                    userService.getUsersUpcomingBirthday(
                        $.extend({ filter: '' }, requestParamsUBStaff)
                    ).then(function (result) {
                        ctrl.ubStaffCount = result.data.totalCount;
                        for (var i = 0; i < result.data.items.length; i++) {
                            var staff = result.data.items[i];
                            staff.isTodayBirthday = isTodayBday(staff.birthday);
                            ctrl.ubStaff.push(staff);
                        }
                    }).finally(function () {
                        for (var i = 0; i < ctrl.ubStaff.length; i++) {
                            upcomingBirthdayPopoverContent(ctrl.ubStaff[i]);
                        }
                    });
                };

                function incrementpageNumberUBStaff() {
                    ctrl.pageNumberUBStaff++;
                    requestParamsUBStaff.skipCount = (ctrl.pageNumberUBStaff - 1) * ctrl.pageSizeUBStaff;
                }

                ctrl.loadMoreUBStaff = function () {
                    incrementpageNumberUBStaff();
                    ctrl.getUserUpcomingBirthday();
                };

                ctrl.showLessUBStaff = function () {
                    ctrl.ubStaffCount = 0;
                    ctrl.ubStaff = [];
                    ctrl.pageNumberUBStaff = 1;
                    ctrl.pageSizeUBStaff = 5;
                    requestParamsUBStaff = {
                        skipCount: 0,
                        maxResultCount: ctrl.pageSizeUBStaff
                    };

                    ctrl.getUserUpcomingBirthday();
                };

                function upcomingBirthdayPopoverContent(staff) {
                    var html = '<div>';
                    html += '<span>Status:</span><br/>';
                    html += '<span class="bold">' + (staff.status || '-') + '</span><br/><br/>';
                    html += '<span>Likes:</span><br/>';
                    html += '<span class="bold">' + (staff.likes || '-') + '</span><br/><br/>';
                    html += '<span>Favourite Food:</span><br/>';
                    html += '<span class="bold">' + (staff.favouriteFood || '-') + '</span><br/><br/>';
                    html += '<span>Phone Number:</span><br/>';
                    html += '<span class="bold">' + (staff.phoneNumber || '-') + '</span><br/><br/>';
                    html += '<span>About Me:</span><br/>';
                    html += '<span class="bold">' + (staff.aboutMe || '-') + '</span><br/><br/>';
                    html += '</div>'
                    staff.popoverContent = $sce.trustAsHtml(html);
                }

                function isTodayBday(input) {
                    var d = new Date();
                    d = d.setHours(0, 0, 0, 0);
                    var curYear = (new Date()).getFullYear();
                    var inputDate = new Date(input);
                    inputDate = inputDate.setHours(0, 0, 0, 0);
                    var bday = (new Date(inputDate)).setFullYear(curYear);

                    return bday === d;
                }

                ctrl.getUserRecentBirthday = function () {
                    userService.getUsersRecentBirthday(
                        $.extend({ filter: '' }, requestParamsRBStaff)
                    ).then(function (result) {
                        ctrl.rbStaffCount = result.data.totalCount;
                        for (var i = 0; i < result.data.items.length; i++) {
                            var staff = result.data.items[i];
                            ctrl.rbStaff.push(staff);
                        }
                    }).finally(function () {
                        for (var i = 0; i < ctrl.rbStaff.length; i++) {
                            recentBirthdayPopoverContent(ctrl.rbStaff[i]);
                        }
                    });
                };

                function incrementpageNumberRBStaff() {
                    ctrl.pageNumberRBStaff++;
                    requestParamsRBStaff.skipCount = (ctrl.pageNumberRBStaff - 1) * ctrl.pageSizeRBStaff;
                }

                ctrl.loadMoreRBStaff = function () {
                    incrementpageNumberRBStaff();
                    ctrl.getUserRecentBirthday();
                };

                ctrl.showLessRBStaff = function () {
                    ctrl.rbStaffCount = 0;
                    ctrl.rbStaff = [];
                    ctrl.pageNumberRBStaff = 1;
                    ctrl.pageSizeRBStaff = 5;
                    requestParamsRBStaff = {
                        skipCount: 0,
                        maxResultCount: ctrl.pageSizeRBStaff
                    };

                    ctrl.getUserRecentBirthday();
                };

                function recentBirthdayPopoverContent(rbStaff) {
                    var html = '<div>';
                    html += '<span>Status:</span><br/>';
                    html += '<span class="bold">' + (rbStaff.status || '-') + '</span><br/><br/>';
                    html += '<span>Likes:</span><br/>';
                    html += '<span class="bold">' + (rbStaff.likes || '-') + '</span><br/><br/>';
                    html += '<span>Favourite Food:</span><br/>';
                    html += '<span class="bold">' + (rbStaff.favouriteFood || '-') + '</span><br/><br/>';
                    html += '<span>Phone Number:</span><br/>';
                    html += '<span class="bold">' + (rbStaff.phoneNumber || '-') + '</span><br/><br/>';
                    html += '<span>About Me:</span><br/>';
                    html += '<span class="bold">' + (rbStaff.aboutMe || '-') + '</span><br/><br/>';
                    html += '</div>';
                    rbStaff.popoverContent = $sce.trustAsHtml(html);
                }
            }
        ],
        templateUrl: '~/App/tenant/views/slider/staffList.cshtml'
    });
})();