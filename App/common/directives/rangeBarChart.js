appModule.directive('rangeBarChart', [
        function () {
            return {
                restrict: "A",
                scope: {
                    rangedata: '@',
                },
                link: function (scope, elem, attrs, input) {
                    var vitalSigns = scope.rangeData;
                    Chart.defaults.rangebar = Chart.defaults.bar;
                    Chart.controllers.rangebar = Chart.controllers.bar.extend({
                        calculateBarValuePixels: function (datasetIndex, index) {
                            var me = this;
                            var chart = me.chart;
                            var meta = me.getMeta();
                            var scale = me.getValueScale();
                            var datasets = chart.data.datasets;
                            var value = Number(datasets[datasetIndex].data[index].max) - Number(datasets[datasetIndex].data[index].min);
                            var stacked = scale.options.stacked;
                            var stack = meta.stack;
                            var start = Number(datasets[datasetIndex].data[index].min);
                            var i, imeta, ivalue, base, head, size;
                            if (stacked || (stacked === undefined && stack !== undefined)) {
                                for (i = 0; i < datasetIndex; ++i) {
                                    imeta = chart.getDatasetMeta(i);
                                    if (imeta.bar &&
                                      imeta.stack === stack &&
                                      imeta.controller.getValueScaleId() === scale.id &&
                                      chart.isDatasetVisible(i)) {
                                        ivalue = Number(datasets[i].data[index].max);
                                        if ((value < 0 && ivalue < 0) || (value >= 0 && ivalue > 0)) {
                                            start += ivalue;
                                        }
                                    }
                                }
                            }
                            base = scale.getPixelForValue(start);
                            head = scale.getPixelForValue(start + value);
                            size = (head - base) / 2;
                            return { size: size, base: base, head: head, center: head + size / 2 };
                        },
                        draw: function () {
                            var me = this;
                            var chart = me.chart;
                            var elements = me.getMeta().data;
                            var dataset = me.getDataset();
                            var ilen = elements.length;
                            var i = 0;
                            var d;
                            Chart.helpers.canvas.clipArea(chart.ctx, chart.chartArea);

                            for (; i < ilen; ++i) {
                                d = dataset.data[i];
                                if (d !== null && d !== undefined && !isNaN(d.min) && !isNaN(d.max)) {
                                    elements[i].draw();
                                }
                            }
                            Chart.helpers.canvas.unclipArea(chart.ctx);
                        }
                    });
                    Chart.plugins.register({
                        beforeDraw: function (chartInstance) {
                            if (chartInstance.config.options.showDatapoints) {
                                var helpers = Chart.helpers;
                                var chart = chartInstance.chart;
                                var fontColor = helpers.getValueOrDefault(chartInstance.config.options.showDatapoints.fontColor, chartInstance.config.options.defaultFontColor);
                                var yaxis = chart.scales['y-axis-0'];

                                chartInstance.data.datasets.forEach(function (dataset) {
                                    var systRange = abp.setting.values['App.VitalSign.BloodPressureSittingSystolicRange'].split(",");;
                                    var diastRange = abp.setting.values['App.VitalSign.BloodPressureSittingDiastolicRange'].split(",");;

                                    for (var i = 0; i < dataset.data.length; i++) {
                                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                                        var scaleMax = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;

                                        var yPos = (scaleMax - model.y) / scaleMax >= 0.93 ? model.y + 20 : model.y - 5;

                                        var dataMax = dataset.data[i].max;
                                        var dataMin = dataset.data[i].min;
                                        var setObj = dataset.data[i];
                                        Object.keys(setObj).forEach(function (key) {
                                            if (key == 'min') {
                                                var ctx = chartInstance.chart.ctx;
                                                //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                                                ctx.font = "10px Arial";
                                                ctx.textAlign = 'center';
                                                ctx.textBaseline = 'bottom';
                                                if (setObj[key] < diastRange[0] || setObj[key] > diastRange[1]) {
                                                    ctx.fillStyle = '#e60606';
                                                } else {
                                                    ctx.fillStyle = '#000000';
                                                }
                                                var yPosMin = yaxis.getPixelForValue(dataMin);
                                                ctx.fillText(dataMin, model.x, yPosMin + 20);
                                            }
                                            if (key == 'max') {
                                                var ctx = chartInstance.chart.ctx;
                                                //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                                                ctx.font = "10px Arial";
                                                ctx.textAlign = 'center';
                                                ctx.textBaseline = 'bottom';
                                                if (setObj[key] < systRange[0] || setObj[key] > systRange[1]) {
                                                    ctx.fillStyle = '#e60606';
                                                } else {
                                                    ctx.fillStyle = '#000000';
                                                }
                                                var yPosMax = yaxis.getPixelForValue(dataMax);
                                                ctx.fillText(dataMax, model.x, yPosMax - 5);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });

                    scope.$on('bloodpressureValuesSet', function (event, data) {
                        var dataman = {
                            labels: data.labels,
                            datasets: [{
                                label: 'Lying (Systolic/Diastolic)',
                                backgroundColor: data.lyinglinecolor,
                                data: data.lying
                            },
                            {
                                label: 'Sitting (Systolic/Diastolic)',
                                backgroundColor: data.sittinglinecolor,
                                data: data.sitting
                            },
                            {
                                label: 'Standing (Systolic/Diastolic)',
                                backgroundColor: data.standinglinecolor,
                                data: data.standing
                            }]
                        };
                        var optionsman = {
                            showDatapoints: true,
                            scaleBeginAtZero: false,
                            tooltips: {
                                //backgroundColor:'#000000',
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        let labelSyst = 'Systolic';
                                        let labelDiast = 'Diastolic';
                                        let valueSyst = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].max.toString();
                                        let valuediast = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].min.toString();
                                        return [labelSyst + ' : ' + valueSyst, labelDiast + ' : ' + valuediast];
                                    },
                                    //labelColor: function (tooltipItem, chartInstance) {
                                    //    return ['#a1736a', '#000000'];
                                    //},
                                },
                            },
                            annotation: {
                                annotations: [],
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        //min: 30,
                                        min: Number(data.minmaxYaxis.min) - 10,
                                        //max: 170,
                                        max: Number(data.minmaxYaxis.max) + 10,
                                        beginAtZero: false,
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Blood Pressure (Systolic/Diastolic) (mmHg)'
                                    },
                                }],
                                xAxes: [{
                                    //barThickness: 6,
                                    barThickness: 20,
                                    scaleLabel: {
                                        display: false,
                                        labelString: 'Taken On'
                                    },
                                }]
                            }
                        };

                        ctx = elem[0].getContext('2d');
                        var sleepToday = new Chart(ctx, {
                            type: 'rangebar',
                            data: dataman,
                            options: optionsman
                        });
                    });


                }
            };
        }
]);