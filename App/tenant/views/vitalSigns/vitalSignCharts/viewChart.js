(function () {
    appModule.controller('tenant.views.vitalSigns.vitalSignsChart.viewCharts', [
        //'$scope', '$filter', '$timeout', '$uibModal', '$uibModalInstance', 'personId', 'abp.services.app.vitalSign',
        //function ($scope, $filter, $timeout, $uibModal, $uibModalInstance, personId, vitalSignService) {
        '$scope', '$rootScope', '$filter', '$state', '$stateParams', '$timeout', 'abp.services.app.vitalSign', 'abp.services.app.person',
        function ($scope, $rootScope, $filter, $state, $stateParams, $timeout, vitalSignService, prrsonService) {
            var vm = this;
            vm.saving = false;
            vm.vitalSign = [];
            vm.person = {};
            vm.ready = false;
            vm.filterStr = '';
            var range = abp.setting.values;
            var tempRange = range['App.VitalSign.TemperatureRange'].split(",");
            var pulseRange = range['App.VitalSign.PulseRateRange'].split(",");
            var respRange = range['App.VitalSign.RespiratoryRateRange'].split(",");
            var spo2Range = range['App.VitalSign.SpO2PercentageRange'].split(",");
            var bgFastingRange = range['App.VitalSign.FastingRange'].split(",");
            var weightRange = range['App.VitalSign.TargetWeight'];

            vm.bloodPressureVals = {};
            vm.tempratureVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#36a2eb" };
            vm.pulseRateVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#00b300" };
            vm.respiratoryRateVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#ffff00" };
            vm.spo2RateVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#ffa500" };
            vm.bgFastingVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#842121" };
            vm.bgTwoHPPVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#3c933c" };
            vm.bgRandomVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#3c3c93" };
            vm.weightVals = { "labels": [], "data": [], "colors": [], "minArr": [], "maxArr": [], linecolor: "#800080" };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.closePage = function () {
                $rootScope.close();
            }

            function init() {
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.VitalSign.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.VitalSign.Edit'),
                };
                var personId = $stateParams.personId;
                prrsonService.getPerson(personId).then(function (result) {
                    vm.person = result.data;
                });
                var filter = $stateParams.filter ? angular.fromJson($stateParams.filter) : null;
                vm.filterStr = filter ? filter.filterString : null;
                var from = filter ? filter.from : null;
                var to = filter ? filter.to : null;
                vm.headingAppend = filter ? getHeadingAppend(filter.filterString, from, to) : "";
                if (filter && filter.filterString == 'dateRange') {
                    vm.startDate = from;
                    //vm.endDate = to;
                    vm.endDate = new Date(to);
                    vm.endDate.setDate(vm.endDate.getDate() - 1);
                };
                vitalSignService.getVitalSignReport({ "personId": personId, "fromDate": from, "toDate": to }).then(function (result) {
                    var vitalSigns = result.data;
                    vm.bloodPressureVals = setBloodPressureVals(vitalSigns);
                    if (vm.bloodPressureVals) {
                        $scope.$broadcast('bloodpressureValuesSet', vm.bloodPressureVals);
                        for (var i = 0; i < vitalSigns.length; i++) {
                            setTempratureVals(vitalSigns[i]);
                            setPulseRateVals(vitalSigns[i]);
                            setRespiratoryRateVals(vitalSigns[i]);
                            setSpo2Vals(vitalSigns[i]);
                            setBgFastingVals(vitalSigns[i]);
                            setWeightVals(vitalSigns[i]);
                        };
                    };
                }).finally(function () {
                    setChartVariables();
                });
            };

            vm.filterClick = function (filterString) {
                var filterDates = {};
                if (filterString == 'oneWeek') {
                    var toDate = new Date();
                    var fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - 7);
                    filterDates = { 'fromDate': fromDate.toISOString(), 'toDate': toDate.toISOString() }
                }
                if (filterString == 'twoWeek') {
                    var toDate = new Date();
                    var fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - 14);
                    filterDates = { 'fromDate': fromDate.toISOString(), 'toDate': toDate.toISOString() }
                }

                if (filterString == 'oneMonth') {
                    var toDate = new Date();
                    var fromDate = new Date();
                    fromDate.setMonth(fromDate.getMonth() - 1);
                    filterDates = { 'fromDate': fromDate.toISOString(), 'toDate': toDate.toISOString() }
                }
                if (filterString == 'twoMonth') {
                    var toDate = new Date();
                    var fromDate = new Date();
                    fromDate.setMonth(fromDate.getMonth() - 2);
                    filterDates = { 'fromDate': fromDate.toISOString(), 'toDate': toDate.toISOString() }
                }
                if (filterString == '') {
                    $state.go("tenant.vitalSignChart", { personId: vm.person.id });
                }
                $state.go("tenant.vitalSignChart", { personId: vm.person.id, filter: angular.toJson({ 'from': filterDates.fromDate, 'to': filterDates.toDate, 'filterString': filterString }) });
            };

            vm.dateRange = function (startDate, endDate) {

                var fromDate = new Date(startDate);
                var toDate = new Date(endDate);
                toDate.setDate(toDate.getDate() + 1);
                if (startDate && endDate) {
                    $state.go("tenant.vitalSignChart", { personId: vm.person.id, filter: angular.toJson({ 'from': fromDate, 'to': toDate, 'filterString': 'dateRange' }) });
                } else {
                    abp.message.error('You must provide both start date and end date to filter the charts', '');
                }

            };

            vm.print = function (domId) {
                window.print();
            };

            function setTempratureVals(vitalSignVals) {
                vm.tempratureVals.minArr.push(tempRange[0]);
                vm.tempratureVals.maxArr.push(tempRange[1]);
                if (vitalSignVals.temperature) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                    vm.tempratureVals.labels.push(takenon.split("_"));
                    vm.tempratureVals.data.push(vitalSignVals.temperature);
                    if (parseFloat(vitalSignVals.temperature) < tempRange[0] || parseFloat(vitalSignVals.temperature) > tempRange[1]) {
                        vm.tempratureVals.colors.push('#e60606');
                    } else {
                        vm.tempratureVals.colors.push(vm.tempratureVals.linecolor);
                    }
                }
            };

            function setPulseRateVals(vitalSignVals) {
                vm.pulseRateVals.minArr.push(pulseRange[0]);
                vm.pulseRateVals.maxArr.push(pulseRange[1]);
                if (vitalSignVals.pulseRate) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                    vm.pulseRateVals.labels.push(takenon.split("_"));
                    vm.pulseRateVals.data.push(vitalSignVals.pulseRate);
                    if (parseFloat(vitalSignVals.pulseRate) < pulseRange[0] || parseFloat(vitalSignVals.pulseRate) > pulseRange[1]) {
                        vm.pulseRateVals.colors.push('#e60606');
                    } else {
                        vm.pulseRateVals.colors.push(vm.pulseRateVals.linecolor);
                    }
                }
            };

            function setRespiratoryRateVals(vitalSignVals) {
                vm.respiratoryRateVals.minArr.push(respRange[0]);
                vm.respiratoryRateVals.maxArr.push(respRange[1]);
                if (vitalSignVals.respiratoryRate) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                    vm.respiratoryRateVals.labels.push(takenon.split("_"));
                    vm.respiratoryRateVals.data.push(vitalSignVals.respiratoryRate);
                    if (parseFloat(vitalSignVals.respiratoryRate) < respRange[0] || parseFloat(vitalSignVals.respiratoryRate) > respRange[1]) {
                        vm.respiratoryRateVals.colors.push('#e60606');
                    } else {
                        vm.respiratoryRateVals.colors.push(vm.respiratoryRateVals.linecolor);
                    }
                }
            };

            function setSpo2Vals(vitalSignVals) {
                vm.spo2RateVals.minArr.push(spo2Range[0]);
                vm.spo2RateVals.maxArr.push(spo2Range[1]);
                if (vitalSignVals.spO2Percentage) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                    vm.spo2RateVals.labels.push(takenon.split("_"));
                    vm.spo2RateVals.data.push(vitalSignVals.spO2Percentage);
                    if (parseFloat(vitalSignVals.spO2Percentage) < spo2Range[0] || parseFloat(vitalSignVals.spO2Percentage) > spo2Range[1]) {
                        vm.spo2RateVals.colors.push('#e60606');
                    } else {
                        vm.spo2RateVals.colors.push(vm.spo2RateVals.linecolor);
                    }
                }
            };

            function setBgFastingVals(vitalSignVals) {
                vm.bgFastingVals.minArr.push(bgFastingRange[0]);
                vm.bgFastingVals.maxArr.push(bgFastingRange[1]);

                vm.bgTwoHPPVals.minArr.push(bgFastingRange[0]);
                vm.bgTwoHPPVals.maxArr.push(bgFastingRange[1]);

                vm.bgRandomVals.minArr.push(bgFastingRange[0]);
                vm.bgRandomVals.maxArr.push(bgFastingRange[1]);
                if (vitalSignVals.bloodGlucose.fasting) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                    
                    vm.bgFastingVals.labels.push(takenon.split("_"));
                    vm.bgFastingVals.data.push(vitalSignVals.bloodGlucose.fasting);
                    if (parseFloat(vitalSignVals.bloodGlucose.fasting) < bgFastingRange[0] || parseFloat(vitalSignVals.bloodGlucose.fasting) > bgFastingRange[1]) {
                        vm.bgFastingVals.colors.push('#e60606');
                    } else {
                        vm.bgFastingVals.colors.push(vm.bgFastingVals.linecolor);
                    }
                }

                if (vitalSignVals.bloodGlucose.twoHPP) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                     
                    vm.bgTwoHPPVals.labels.push(takenon.split("_"));
                    vm.bgTwoHPPVals.data.push(vitalSignVals.bloodGlucose.twoHPP);
                    if (parseFloat(vitalSignVals.bloodGlucose.twoHPP) < bgFastingRange[0] || parseFloat(vitalSignVals.bloodGlucose.twoHPP) > bgFastingRange[1]) {
                        vm.bgTwoHPPVals.colors.push('#e60606');
                    } else {
                        vm.bgTwoHPPVals.colors.push(vm.bgTwoHPPVals.linecolor);
                    }
                }

                if (vitalSignVals.bloodGlucose.random) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                     
                    vm.bgRandomVals.labels.push(takenon.split("_"));
                    vm.bgRandomVals.data.push(vitalSignVals.bloodGlucose.random);
                    if (parseFloat(vitalSignVals.bloodGlucose.random) < bgFastingRange[0] || parseFloat(vitalSignVals.bloodGlucose.random) > bgFastingRange[1]) {
                        vm.bgRandomVals.colors.push('#e60606');
                    } else {
                        vm.bgRandomVals.colors.push(vm.bgRandomVals.linecolor);
                    }
                }
            };

            function setBloodPressureVals(vitalSignVals) {
                var labels = [];
                var standingData = [];
                var sittingData = [];
                var lyingData = [];
                for (var i = 0; i < vitalSignVals.length; i++) {
                    if (vitalSignVals[i].bloodPressure.standingSystolic || vitalSignVals[i].bloodPressure.sittingSystolic || vitalSignVals[i].bloodPressure.lyingSystolic) {
                        var takenon = $filter('date')(vitalSignVals[i].takenOn, "dd-MMM-yyyy_hh:mm a");
                        labels.push(takenon.split("_"));
                        if (vitalSignVals[i].bloodPressure.lyingSystolic && vitalSignVals[i].bloodPressure.lyingDiastolic) {
                            lyingData.push({ "min": vitalSignVals[i].bloodPressure.lyingDiastolic, "max": vitalSignVals[i].bloodPressure.lyingSystolic });
                        } else {
                            lyingData.push({ "min": "", "max": "" });
                        }
                        if (vitalSignVals[i].bloodPressure.sittingSystolic && vitalSignVals[i].bloodPressure.sittingDiastolic) {
                            sittingData.push({ "min": vitalSignVals[i].bloodPressure.sittingDiastolic, "max": vitalSignVals[i].bloodPressure.sittingSystolic });
                        } else {
                            sittingData.push({ "min": "", "max": "" });
                        }
                        if (vitalSignVals[i].bloodPressure.standingSystolic && vitalSignVals[i].bloodPressure.standingDiastolic) {
                            standingData.push({ "min": vitalSignVals[i].bloodPressure.standingDiastolic, "max": vitalSignVals[i].bloodPressure.standingSystolic });
                        } else {
                            standingData.push({ "min": "", "max": "" });
                        }
                    }
                }
                var fullArray = [];
                fullArray = fullArray.concat(standingData);
                fullArray = fullArray.concat(sittingData);
                fullArray = fullArray.concat(lyingData);
                var minmaxYaxis = getMinMaxValFromObj(fullArray);
                //var bloodPressureVals = { "labels": labels, "standing": standingData, "sitting": sittingData, "lying": lyingData, "standinglinecolor": "#3b78cc", "sittinglinecolor": "#cc3b78", "lyinglinecolor": "#78cc3b", "minmaxYaxis": minmaxYaxis };
                var bloodPressureVals = { "labels": labels, "lying": lyingData, "sitting": sittingData, "standing": standingData, "lyinglinecolor": "#78cc3b", "sittinglinecolor": "#cc3b78", "standinglinecolor": "#3b78cc", "minmaxYaxis": minmaxYaxis };
                return bloodPressureVals;
            };

            function setWeightVals(vitalSignVals) {
                vm.weightVals.maxArr.push(weightRange);
                if (vitalSignVals.bmi.weight) {
                    var takenon = $filter('date')(vitalSignVals.takenOn, "dd-MMM-yyyy_hh:mm a");
                    vm.weightVals.labels.push(takenon.split("_"));
                    vm.weightVals.data.push(vitalSignVals.bmi.weight);
                    vm.weightVals.colors.push(vm.weightVals.linecolor);
                }
            };

            function setChartVariables() {
                var tempYMax = getMaxYVal(vm.tempratureVals.data, vm.tempratureVals.maxArr);
                var pulseYMax = getMaxYVal(vm.pulseRateVals.data, vm.pulseRateVals.maxArr);
                var respYMax = getMaxYVal(vm.respiratoryRateVals.data, vm.respiratoryRateVals.maxArr);
                var spo2YMax = getMaxYVal(vm.spo2RateVals.data, vm.spo2RateVals.maxArr);
                var bgfastYMax = getMaxYVal(vm.bgFastingVals.data, vm.bgFastingVals.maxArr);

                var tempchartConfig = {
                    'labels': vm.tempratureVals.labels,
                    'data': vm.tempratureVals.data,
                    'colors': vm.tempratureVals.colors,
                    'mainTitle': "Temperature",
                    'xaxisTitle': "Taken On",
                    'yaxixTitle': "Temperature (℃)",
                    'pointStyle': 'circle',
                    'lineColor': vm.tempratureVals.linecolor,
                    'tooltipLabelPrefix': '℃',
                    'showMinMax': false,
                    'minArr': vm.tempratureVals.minArr,
                    'maxArr': vm.tempratureVals.maxArr,
                    'minMaxLabel': { 'min': 'Lower Bound', 'max': 'Upper Bound' },
                    'minMaxColor': { 'min': '#f27173', 'max': '#7173f2' },
                    'minMaxBorder': { 'min': 1, 'max': 1 },
                    'maxYVal': tempYMax,
                }
                var pulseRatechartConfig = {
                    'labels': vm.pulseRateVals.labels,
                    'data': vm.pulseRateVals.data,
                    'colors': vm.pulseRateVals.colors,
                    'mainTitle': "Pulse Rate",
                    'xaxisTitle': "Taken On",
                    'yaxixTitle': "Pulse Rate (/min)",
                    'pointStyle': 'triangle',
                    'lineColor': vm.pulseRateVals.linecolor,
                    'tooltipLabelPrefix': '/min',
                    'showMinMax': false,
                    'minArr': vm.pulseRateVals.minArr,
                    'maxArr': vm.pulseRateVals.maxArr,
                    'minMaxLabel': { 'min': 'Lower Bound', 'max': 'Upper Bound' },
                    'minMaxColor': { 'min': '#f27173', 'max': '#7173f2' },
                    'minMaxBorder': { 'min': 1, 'max': 1 },
                    'maxYVal': pulseYMax,
                }
                var respiratoryRatechartConfig = {
                    'labels': vm.respiratoryRateVals.labels,
                    'data': vm.respiratoryRateVals.data,
                    'colors': vm.respiratoryRateVals.colors,
                    'mainTitle': "Respiratory Rate",
                    'xaxisTitle': "Taken On",
                    'yaxixTitle': "Respiratory Rate (/min)",
                    'pointStyle': 'rectRot',
                    'lineColor': vm.respiratoryRateVals.linecolor,
                    'tooltipLabelPrefix': '/min',
                    'showMinMax': false,
                    'minArr': vm.respiratoryRateVals.minArr,
                    'maxArr': vm.respiratoryRateVals.maxArr,
                    'minMaxLabel': { 'min': 'Lower Bound', 'max': 'Upper Bound' },
                    'minMaxColor': { 'min': '#f27173', 'max': '#7173f2' },
                    'minMaxBorder': { 'min': 1, 'max': 1 },
                    'maxYVal': respYMax,
                }
                var sp02chartConfig = {
                    'labels': vm.spo2RateVals.labels,
                    'data': vm.spo2RateVals.data,
                    'colors': vm.spo2RateVals.colors,
                    'mainTitle': "SpO₂",
                    'xaxisTitle': "Taken On",
                    'yaxixTitle': "SpO₂ (%)",
                    'pointStyle': 'triangle',
                    'lineColor': vm.spo2RateVals.linecolor,
                    'tooltipLabelPrefix': '%',
                    'showMinMax': false,
                    'minArr': vm.spo2RateVals.minArr,
                    'maxArr': vm.spo2RateVals.maxArr,
                    'minMaxLabel': { 'min': 'Lower Bound', 'max': 'Upper Bound' },
                    'minMaxColor': { 'min': '#f27173', 'max': '#7173f2' },
                    'minMaxBorder': { 'min': 1, 'max': 1 },
                    'maxYVal': spo2YMax,
                }
                var bgchartConfig = {
                    'labels': vm.bgFastingVals.labels,
                    'data': [
                          {
                              label: "Fasting",
                              backgroundColor: vm.bgFastingVals.linecolor,
                              data: vm.bgFastingVals.data,
                              fill: false,
                              pointBackgroundColor: vm.bgFastingVals.colors,
                              borderColor: vm.bgFastingVals.linecolor,
                          },
                          {
                              label: "2HPP",
                              backgroundColor: vm.bgTwoHPPVals.linecolor,
                              data: vm.bgTwoHPPVals.data,
                              fill: false,
                              pointBackgroundColor: vm.bgTwoHPPVals.colors,
                              borderColor: vm.bgTwoHPPVals.linecolor,
                          },
                          {
                              label: "Random",
                              backgroundColor: vm.bgRandomVals.linecolor,
                              data: vm.bgRandomVals.data,
                              fill: false,
                              pointBackgroundColor: vm.bgRandomVals.colors,
                              borderColor: vm.bgRandomVals.linecolor,
                          },
                    ],
                    'xaxisTitle': "Taken On",
                    'yaxixTitle': "Blood Glucose(mmol/L)",
                    'pointStyle': 'circle',
                    'tooltipLabelPrefix': 'mmol/L',
                    'showMinMax': false,
                    'minArr': [],
                    'maxArr': [],
                    'minMaxLabel': { 'min': 'Lower Bound', 'max': 'Upper Bound' },
                    'minMaxColor': { 'min': '#f27173', 'max': '#7173f2' },
                    'minMaxBorder': { 'min': 1, 'max': 1 },
                    'maxYVal': '',
                }
                var weightConfig = {
                    'labels': vm.weightVals.labels,
                    'data': vm.weightVals.data,
                    'colors': vm.weightVals.colors,
                    'mainTitle': "Weight",
                    'xaxisTitle': "Taken On",
                    'yaxixTitle': "Weight (kg)",
                    'pointStyle': 'rect',
                    'lineColor': vm.weightVals.linecolor,
                    'tooltipLabelPrefix': '%',
                    'showMinMax': false,
                    'minArr': vm.weightVals.minArr,
                    'maxArr': vm.weightVals.maxArr,
                    'minMaxLabel': { 'min': '', 'max': 'Targeted Weight' },
                    'minMaxColor': { 'min': '', 'max': '#7173f2' },
                    'minMaxBorder': { 'min': 0, 'max': 3 },
                    'maxYVal': '',
                }

                vm.respiratoryRateChart = getLineChartValues(respiratoryRatechartConfig, "singleLine");
                vm.pulseRateChart = getLineChartValues(pulseRatechartConfig, "singleLine");
                vm.tempratureChart = getLineChartValues(tempchartConfig, "singleLine");
                vm.spo2Chart = getLineChartValues(sp02chartConfig, "singleLine");
                vm.bgChart = getLineChartValues(bgchartConfig, "multiLine");
                vm.weightChart = getLineChartValues(weightConfig, "singleLine");
            };

            function getMinMaxValFromObj(myArray) {
                var lowest = Number.POSITIVE_INFINITY;
                var highest = Number.NEGATIVE_INFINITY;
                var tmp1;
                var tmp2;
                for (var i = myArray.length - 1; i >= 0; i--) {
                    tmp1 = myArray[i].max;
                    if (tmp1 > highest) highest = tmp1;
                    tmp2 = myArray[i].min;
                    if (tmp2 < lowest && tmp2 != "") lowest = tmp2;
                }
                return { 'min': lowest, 'max': highest };
            }

            function getHeadingAppend(filterString, from, to) {
                var returnString = "";
                var dateRangeString = "(" + $filter('dateFormat')(from) + " to " + $filter('dateFormat')(to) + ")";
                var dateRangeWithoutBrace = dateRangeString.replace(/[{()}]/g, '');
                switch (filterString) {
                    case 'oneWeek':
                        returnString = " - 1 Week "
                        break;
                    case 'twoWeek':
                        returnString = " - 2 Weeks "
                        break;
                    case 'oneMonth':
                        returnString = " - 1 Month "
                        break;
                    case 'twoMonth':
                        returnString = " - 2 Months "
                        break;
                    case 'dateRange':
                        returnString = " - " + dateRangeString
                        break;
                    default:
                        returnString = "";
                }
                return returnString;
            };

            function getMaxYVal(arr1, arr2) {
                var fullArray = [];
                fullArray = fullArray.concat(arr1);
                fullArray.push(Number(arr2[0]))
                var maxyVal = Math.max.apply(null, fullArray) + 5;
                fullArray.fill(maxyVal);
                return fullArray;
            }

            //Create line chart
            function getLineChartValues(config, type) {
                if (type == "singleLine") {
                    var myData = {
                        labels: config.labels,
                        datasets: [
                          {
                              label: config.mainTitle,
                              backgroundColor: config.lineColor,
                              data: config.data,
                              fill: false,
                              pointBackgroundColor: config.colors,
                              borderColor: config.lineColor,
                          }
                        ]
                    };
                } else {
                    var myData = {
                        labels: config.labels,
                        datasets: config.data
                    };
                }

                var myOptions = {
                    responsive: true,
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    elements: {
                        line: {
                            tension: 0,
                            //borderColor: config.lineColor,
                        },
                        point: {
                            radius: config.pointStyle == 'circle' ? 5 : 10,
                            hoverRadius: config.pointStyle == 'circle' ? 8 : 13,
                            pointStyle: config.pointStyle,
                            borderWidth: 2,
                            borderColor: config.lineColor
                        }
                    },

                    scales: {
                        xAxes: [{
                            display: true,
                            scaleBeginAtZero: false,
                            scaleLabel: {
                                display: false,
                                labelString: config.xaxisTitle
                            },
                            ticks: {
                                //autoSkip: false
                                maxRotation: 1
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: config.yaxixTitle
                            },
                            ticks: {
                                //max: config.maxYVal[0],
                                callback: function (value, index, values) {
                                    return parseFloat(value).toFixed(2);
                                },
                                maxTicksLimit: 10,
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return tooltipItems.yLabel + ' ' + config.tooltipLabelPrefix;

                            }
                        }
                    },
                    annotation: {
                        annotations: [],
                    }
                };

                if (config.showMinMax) {
                    var min = {
                        label: config.minMaxLabel.min,
                        backgroundColor: config.minMaxColor.min,
                        data: config.minArr,
                        borderWidth: config.minMaxBorder.min,
                        pointRadius: 0,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        pointHoverRadius: 0,
                        borderColor: config.minMaxColor.min,
                    }
                    var max = {
                        label: config.minMaxLabel.max,
                        backgroundColor: config.minMaxColor.max,
                        data: config.maxArr,
                        borderWidth: config.minMaxBorder.max,
                        pointRadius: 0,
                        fill: false,
                        pointHoverRadius: 0,
                        borderColor: config.minMaxColor.max,
                        fillBetweenSet: 3,
                        fillBetweenColor: "rgba(113, 115, 242, 0.2)"
                    }
                    myData.datasets.push(min);
                    myData.datasets.push(max);
                }

                return { "data": myData, "options": myOptions }
            }

            init();

        }]);
})();
