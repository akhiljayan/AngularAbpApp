(function () {
    appModule.component('psLineGraph', {
        bindings: {
            config: '<',
            type: '<'
        },
        controller: [
            '$scope', '$filter',
            function ($scope, $filter) {            
            var ctrl = this;            
            
            ctrl.$onInit = function () {
                ctrl.type = "singleLine";
            };

            ctrl.$onChanges = function (changes) {

                if (changes.config.currentValue != undefined && changes.config.previousConfig != changes.config.currentValue) {                 

                    ctrl.chart = getLineChartValues(changes.config.currentValue, ctrl.type);
                }
            };

            function getLineChartValues(config, type) {                
                type = "singleLine";
                if (config == undefined)
                    return null;

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
                        xAxes: [
                            {
                                display: true,
                                scaleBeginAtZero: true,
                                scaleLabel: {
                                    display: false,
                                    labelString: config.xaxisTitle
                                },
                                ticks: {
                                    autoSkip: false,
                                    callback: function (value, index, values) {
                                        return $filter('date')(value, "MMM-yyyy");
                                    },
                                    maxRotation: 45,
                                    minRotation: 45
                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: config.yaxixTitle
                                },
                                ticks: {
                                    //max: config.maxYVal[0],
                                    callback: function (value, index, values) {
                                        return value; //parseFloat(value).toFixed(2);
                                    },
                                    maxTicksLimit: 5,
                                }
                            }
                        ]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return tooltipItems.yLabel + ' ' + config.tooltipLabelPrefix;
                            },
                            title: function (tooltipItems, data) {
                                return vm.getCategoryDescription(tooltipItems[0].yLabel);
                            }
                        }
                    },
                    annotation: {
                        annotations: [],
                    },
                    animation: {
                        onComplete: function () {
                            var chartInstance = this.chart;
                            this.data.datasets.forEach(function (dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                var ctx = chartInstance.ctx;
                                meta.data.forEach(function (bar, index) {
                                    var data = dataset.data[index];
                                    ctx.fillStyle = "#000000";
                                    ctx.fillText(data, bar._model.x - 8, bar._model.y - 10);
                                });
                            });
                        }
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
            };

        }],
        templateUrl: '~/App/common/directives/psLineGraph.cshtml'
    });
})();