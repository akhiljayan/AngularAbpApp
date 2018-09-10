(function () {
    appModule.value("weatherServiceUrl", "https://api.data.gov.sg/v1/environment")

    /* Prototype Weather Service */
    appModule.factory("weatherService", [
        "$http", "$q", "weatherServiceUrl",
        function ($http, $q, weatherServiceUrl) {
            return {
                getAirTemperature: getCurrentAirTemperature,
                getPMTwoDotFive: getCurrentPMTwoDotFive,
                getTwoHoursWeatherForecast: getTwoHoursWeatherForecast,
                getTwentyFourHoursWeatherForecast: getTwentyFourHoursWeatherForecast,
                getNextFourDaysWeatherForecast: getNextFourDaysWeatherForecast,
                getPSI: getCurrentPollutionStandardsIndex,
                getRainfall: getCurrentRainfallReadings,
                getRelativeHumidity: getCurrentRelativeHumidity,
                getWindDirection: getCurrentWindDirection,
                getWindSpeed: getCurrentWindSpeed
            };

            function getCurrentAirTemperature() {
                var url = weatherServiceUrl + "/air-temperature";

                return handlePromise(url);
            }

            function getCurrentPMTwoDotFive() {
                var url = weatherServiceUrl + "/pm25";

                return handlePromise(url);
            }

            function getTwoHoursWeatherForecast() {
                var url = weatherServiceUrl + '/2-hour-weather-forecast';

                return handlePromise(url);
            }

            function getTwentyFourHoursWeatherForecast() {
                var url = weatherServiceUrl + '/24-hour-weather-forecast';

                return handlePromise(url);
            }

            function getNextFourDaysWeatherForecast() {
                var url = weatherServiceUrl + '/4-day-weather-forecast';

                return handlePromise(url);
            }

            function getCurrentPollutionStandardsIndex() {
                var url = weatherServiceUrl + "/psi";

                return handlePromise(url);
            }

            function getCurrentRainfallReadings() {
                var url = weatherServiceUrl + '/rainfall';

                return handlePromise(url);
            }

            function getCurrentRelativeHumidity() {
                var url = weatherServiceUrl + '/relative-humidity';

                return handlePromise(url);
            }

            function getCurrentWindDirection() {
                var url = weatherServiceUrl + '/wind-direction';

                return handlePromise(url);
            }

            function getCurrentWindSpeed() {
                var url = weatherServiceUrl + '/wind-speed';

                return handlePromise(url);
            }

            function handlePromise(url) {
                var defer = $q.defer();

                $http({
                    url: url,
                    method: "GET",
                    //headers: {
                    //    "Access-Control-Allow-Methods": "GET,OPTIONS",
                    //    "Access-Control-Allow-Origin": "*",
                    //    "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, api-key",
                    //}
                })
                    .then(function (response) {
                        defer.resolve(response);
                    }, function (err) {
                        defer.reject(err);
                    });

                return defer.promise;
            }
        }
    ]);

    appModule.component('weatherCard', {
        controller: [
            '$q', 'abp.services.app.weather', '$scope', '$http', 
            function ($q, weatherService, $scope, $http) {
                var ctrl = this;
                ctrl.rangeForPSI = [
                    {
                        min: 0,
                        max: 50,
                        color: "green-dark",
                        label: app.localize("PSIValueGood"),
                        class: "good",
                        status: app.localize("Good")
                    },
                    {
                        min: 51,
                        max: 100,
                        color: "blue",
                        label: app.localize("PSIValueModerate"),
                        class: "moderate",
                        status: app.localize("Moderate")
                    },
                    {
                        min: 101,
                        max: 200,
                        color: "yellow",
                        label: app.localize("PSIValueUnhealthy"),
                        class: "unhealthy",
                        status: app.localize("Unhealthy")
                    },
                    {
                        min: 201,
                        max: 300,
                        color: "orange",
                        label: app.localize("PSIValueVeryUnhealthy"),
                        class: "very-unhealthy",
                        status: app.localize("VeryUnhealthy")
                    },
                    {
                        min: 301,
                        max: 999999,
                        color: "red",
                        label: app.localize("PSIValueHazardous"),
                        class: "hazardous",
                        status: app.localize("Hazardous")
                    }
                ];

                ctrl.$onInit = function () {
                    ctrl.loading = false;
                    ctrl.currentTime = abp.clock.now();
                    ctrl.currentPSICategory = null;
                    ctrl.fiveDaysWeatherForecast = [];
                    ctrl.selectedWeatherForecast = {};
                    ctrl.currentLocation = null;
                    ctrl.currentRegion = null;
                    ctrl.success = false;
                    ctrl.isCollapsed = true;
                    ctrl.latitude = null;
                    ctrl.longitude = null;

                    ctrl.load();
                };

                ctrl.load = function () {
                    ctrl.loading = true;

                    if (navigator.geolocation) {
                        // Get latitude and longitude based on current user position
                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                ctrl.latitude = position.coords.latitude;
                                ctrl.longitude = position.coords.longitude;

                                $http({
                                    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + ctrl.latitude + ',' + ctrl.longitude,
                                    method: "GET",
                                }).then(function (response) {
                                    var results = response.data.results;

                                    for (var i = 0; i < results[0].address_components.length; i++) {
                                        var address_component = results[0].address_components[i];
                                        
                                        if (address_component.types.indexOf("country") >= 0) {
                                            if (address_component.short_name == "SG") {
                                                load();
                                            } else {
                                                failLoadingWeatherData(app.localize("WeatherServiceNotSupported"));
                                            }
                                            break;
                                        }
                                    }
                                });
                            },
                            function (error) {
                                switch (error.code) {
                                    case error.PERMISSION_DENIED:
                                        failLoadingWeatherData(app.localize("WeatherPleaseEnableGeolocation"));
                                        break;
                                    case error.POSITION_UNAVAILABLE:
                                        failLoadingWeatherData(app.localize("WeatherPleaseRefreshInMoment"));
                                        break;
                                    case error.TIMEOUT:
                                        failLoadingWeatherData(app.localize("WeatherPleaseRefreshInMoment"));
                                        break;
                                    case error.UNKNOWN_ERROR:
                                        failLoadingWeatherData(app.localize("WeatherPleaseRefreshInMoment"));
                                        break;
                                }

                                $scope.$apply();
                            }, { maximumAge: 600000, timeout: 5000 });
                    } else {
                        failLoadingWeatherData(app.localize("WeatherGeolocationNotSupported"));
                    }
                };

                function load() {
                    $q.all([
                        weatherService.getAirTemperature(),
                        weatherService.getTwoHoursWeatherForecast(),
                        weatherService.getTwentyFourHoursWeatherForecast(),
                        weatherService.getNextFourDaysWeatherForecast(),
                        weatherService.getPSI(),
                        weatherService.getRainfall(),
                        weatherService.getRelativeHumidity(),
                        weatherService.getWindDirection(),
                        weatherService.getWindSpeed()
                    ]).then(function (results) {
                        angular.forEach(results, function (value, key) {
                            try {
                                switch (parseInt(key)) {
                                    case 0:
                                        getAirTemperature(value);
                                        break;
                                    case 1:
                                        getTwoHoursWeatherForecast(value);
                                        break;
                                    case 2:
                                        getTwentyFourHoursWeatherForecast(value);
                                        break;
                                    case 3:
                                        getNextFourDaysWeatherForecast(value);
                                        break;
                                    case 4:
                                        getPSI(value);
                                        break;
                                    case 5:
                                        getRainfall(value);
                                        break;
                                    case 6:
                                        getRelativeHumidity(value);
                                        break;
                                    case 7:
                                        getWindDirection(value);
                                        break;
                                    case 8:
                                        getWindSpeed(value);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            catch (exception)
                            {
                                console.log(exception);
                            }
                        });

                        // Initialize PSI region based on current location
                        ctrl.selectRegionForPSI(ctrl.currentRegion);

                        var currentWeatherForecast = {
                            'date': ctrl.currentTime,
                            'forecast': {
                                'description': ctrl.twoHoursWeatherForecast,
                                'icon': generateWeatherIcon(ctrl.twoHoursWeatherForecast, ctrl.weatherTimestamp)
                            },
                            'rainfall': ctrl.rainfall,
                            'relative_humidity': {
                                'current': ctrl.relativeHumidity,
                                'high': ctrl.twentyFourHoursWeatherForecast['relative_humidity']['high'],
                                'low': ctrl.twentyFourHoursWeatherForecast['relative_humidity']['low']
                            },
                            'temperature': {
                                'current': ctrl.airTemperature,
                                'high': ctrl.twentyFourHoursWeatherForecast['temperature']['high'],
                                'low': ctrl.twentyFourHoursWeatherForecast['temperature']['low'],
                                'unit': "C",
                            },
                            'temperature_unit': "C",
                            'wind_speed': {
                                'current': ctrl.windSpeed,
                                'high': toKMPerHour(ctrl.twentyFourHoursWeatherForecast['wind']['speed']['high']),
                                'low': toKMPerHour(ctrl.twentyFourHoursWeatherForecast['wind']['speed']['low'])
                            },
                            'wind_direction': ctrl.windDirection
                        };

                        /*
                            Merge two hours weather forecast with four days weather forecast
                            For display five days weather forecast
                        */
                        ctrl.fiveDaysWeatherForecast.push(currentWeatherForecast);

                        for (var i = 0; i < ctrl.fourDaysWeatherForecast.length; i++) {
                            var value = ctrl.fourDaysWeatherForecast[i];

                            var weatherForecast = {
                                'date': value['timestamp'],
                                'forecast': {
                                    'description': value['forecast'].slice(-1) == "." ? value["forecast"].slice(0, -1) : value["forecast"],
                                    'icon': generateWeatherIcon(value['forecast'])
                                },
                                'rainfall': null,
                                'relative_humidity': value['relative_humidity'],
                                'temperature': {
                                    'high': value['temperature']['high'],
                                    'low': value['temperature']['low'],
                                    'unit': "C"
                                },
                                'wind_speed': {
                                    'high': toKMPerHour(value['wind']['speed']['high']),
                                    'low': toKMPerHour(value['wind']['speed']['low'])
                                },
                                'wind_direction': value['wind']['direction'],
                                'is_selected': false
                            };

                            ctrl.fiveDaysWeatherForecast.push(weatherForecast);
                        }

                        // Initialize system current date time as default selected date
                        ctrl.selectDate(0);

                        // Set success = true for display content
                        ctrl.success = true;
                    }, function (err) {
                    }).finally(function () {
                        if (!ctrl.success) {
                            failLoadingWeatherData(app.localize("WeatherPleaseRefreshInMoment"));
                        }

                        ctrl.loading = false;
                    });
                }

                ctrl.selectDate = function (selectedIndex) {
                    var daySelected = angular.copy(ctrl.fiveDaysWeatherForecast[selectedIndex]);

                    ctrl.selectedWeatherForecast =
                        {
                            'date': daySelected['date'],
                            'forecast': daySelected['forecast'],
                            'rainfall': daySelected['rainfall'],
                            'relative_humidity': daySelected['relative_humidity'],
                            'temperature': daySelected['temperature'],
                            'temperature_unit': "C",
                            'wind_speed': daySelected['wind_speed'],
                            'wind_direction': daySelected['wind_direction'],
                            'is_selected': true
                        };

                    ctrl.selectedIndex = selectedIndex;
                };

                ctrl.selectRegionForPSI = function (region) {
                    ctrl.selectedPSI = ctrl.psi[region];
                    ctrl.selectedPSIRegion = region;

                    // Categorize current PSI for customize number-circle style
                    ctrl.currentPSICategory = ctrl.categorizePSI(ctrl.selectedPSI);
                };

                ctrl.collapse = function () {
                    ctrl.isCollapsed = !ctrl.isCollapsed;

                    // When collapse, the default selected day will be current system time
                    if (ctrl.isCollapsed) {
                        ctrl.selectDate(0);
                    }
                }

                // Method for Celsius and Fahrenheit conversion
                ctrl.celsiusFahrenheitConversion = function () {
                    if (ctrl.selectedWeatherForecast['temperature']['unit'] != "C") {
                        ctrl.selectedWeatherForecast['temperature']['unit'] = "C";

                        ctrl.selectedWeatherForecast['temperature']['high'] = Math.round((ctrl.selectedWeatherForecast['temperature']['high'] - 32) * 10) / 10;
                        ctrl.selectedWeatherForecast['temperature']['low'] = Math.round((ctrl.selectedWeatherForecast['temperature']['low'] - 32) * 10) / 10;

                        if (ctrl.isNumber(ctrl.selectedWeatherForecast['temperature']['current'])) {
                            ctrl.selectedWeatherForecast['temperature']['current'] = Math.round((ctrl.selectedWeatherForecast['temperature']['current'] - 32) * 10) / 10;
                        }
                    } else {
                        ctrl.selectedWeatherForecast['temperature']['unit'] = "F";

                        ctrl.selectedWeatherForecast['temperature']['high'] = Math.round((ctrl.selectedWeatherForecast['temperature']['high'] + 32) * 10) / 10;
                        ctrl.selectedWeatherForecast['temperature']['low'] = Math.round((ctrl.selectedWeatherForecast['temperature']['low'] + 32) * 10) / 10;

                        if (ctrl.isNumber(ctrl.selectedWeatherForecast['temperature']['current'])) {
                            ctrl.selectedWeatherForecast['temperature']['current'] = Math.round((ctrl.selectedWeatherForecast['temperature']['current'] + 32) * 10) / 10;
                        }
                    }
                };

                ctrl.isNumber = function (number) {
                    return angular.isNumber(number) && !isNaN(number);
                }

                ctrl.toLowerCase = function (value) {
                    return angular.lowercase(value);
                };

                // Calculation for nearest latitude, longitude
                function calculateDistance(lat1, lon1, lat2, lon2) {
                    var R = 6371; // km
                    var dLat = toRadian(lat2 - lat1);
                    var dLon = toRadian(lon2 - lon1);
                    var lat1 = toRadian(lat1);
                    var lat2 = toRadian(lat2);

                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c;
                    return d;
                }

                // Converts numeric degrees to radians
                function toRadian(Value) {
                    return Value * Math.PI / 180;
                }

                /*
                    Convert Knot(s) to km/h for wind speed
                    [1 knot = 1.852 km/h]
                */
                function toKMPerHour(value) {
                    var knot = 1.852;

                    // Round off to 2d.p.
                    return Math.round((value * knot) * 100) / 100;
                }

                /*
                    Converts for wind direction in angle to text words
                    Source: https://stackoverflow.com/a/7490772
                */
                function convertWindDirectionAngle(value) {
                    var val = Math.floor((value / 22.5) + 0.5);
                    var directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

                    return directions[(val % 16)];
                }

                // Categorize PSI To group
                ctrl.categorizePSI = function (value) {
                    for (var i = 0; i < ctrl.rangeForPSI.length; i++) {
                        if (ctrl.rangeForPSI[i].min <= value && value <= ctrl.rangeForPSI[i].max) {
                            return i;
                        }
                    }
                }

                /*
                    Generate weather icon based on description
                    Source: - Local Weather Forecast Terminology: http://www.weather.gov.sg/forecasting-2/#forecast_3
                            - Weather icons: https://erikflowers.github.io/weather-icons/
                */
                function generateWeatherIcon(value, dateTime = null) {
                    var value = angular.lowercase(value);
                    var isNightTime = false;

                    // For get current hour and display weather icon in night mode
                    if (dateTime) {
                        var hours = (new Date(dateTime)).getHours();

                        // According to weather.gov.sg, Night is in range of 6 pm to 6 am
                        if (!(hours >= 6 && hours < 18)) {
                            isNightTime = true;
                        }
                    }

                    if (value.indexOf("thunder") != -1 && value.indexOf("shower") != -1) {
                        if (value.indexOf("night") != -1 || isNightTime) {
                            return "wi-night-alt-storm-showers";
                        } else {
                            return "wi-day-storm-showers";
                        }
                    } else if (value.indexOf("cloudy") != -1) {
                        if (value.indexOf("partly") == -1) {
                            if (value.indexOf("night") != -1 || isNightTime) {
                                return "wi-night-alt-cloudy";
                            } else {
                                return "wi-day-cloudy";
                            }
                        } else {
                            if (value.indexOf("night") != -1 || isNightTime) {
                                return "wi-night-alt-partly-cloudy";
                            } else {
                                return "wi-day-cloudy";
                            }
                        }
                    } else if (value.indexOf("overcast") != -1) {
                        if (value.indexOf("night") != -1 || isNightTime) {
                            return "wi-night-alt-cloudy";
                        } else {
                            return "wi-day-sunny-overcast";
                        }
                    } else if (value.indexOf("shower") != -1) {
                        if (value.indexOf("night") != -1 || isNightTime) {
                            return "wi-night-alt-showers";
                        } else {
                            return "wi-day-showers";
                        }
                    } else if (value.indexOf("rain") != -1) {
                        if (value.indexOf("night") != -1 || isNightTime) {
                            return "wi-night-alt-rain";
                        } else {
                            return "wi-day-rain";
                        }
                    } else if (value.indexOf("fair") != -1) {
                        if (value.indexOf("night") != -1 || isNightTime) {
                            return "wi-night-clear";
                        } else {
                            return "wi-day-sunny";
                        }
                    } else if (value.indexOf("hazy") != -1) {
                        if (value.indexOf("night") != -1 || isNightTime) {
                            return "wi-night-alt-cloudy-windy";
                        } else {
                            return "wi-day-haze";
                        }
                    }
                }

                /*
                    This method is used to assign ctrl.loading, ctrl.success & ctrl.errorMessage
                    with parsed error message for reduce redundant code
                */
                function failLoadingWeatherData(errorMessage) {
                    ctrl.loading = false;
                    ctrl.success = false;
                    ctrl.errorMessage = errorMessage;
                }

                // API service
                function getAirTemperature(result) {
                    var stations = result.data.metadata.stations;
                    var readings = result.data.items[0].readings;
                    var reading_unit = result.data.metadata.reading_unit;

                    var stationId = null;
                    var stationName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    // Get nearest station based on latitude & longitude
                    for (var i = 0; i < stations.length; i++) {
                        var stationLocation = stations[i].location;

                        if (i == 0) {
                            shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        } else {
                            tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        }

                        if (i == 0 || shortestDistance > tempDistance) {
                            shortestDistance = i == 0 ? shortestDistance : tempDistance;
                            stationId = stations[i].id;
                            stationName = stations[i].name;
                        }
                    }

                    // Get Air Temperature based on Station Id
                    var airTemperature = null;

                    for (var i = 0; i < readings.length; i++) {
                        if (readings[i].station_id == stationId) {
                            airTemperature = readings[i];
                            break;
                        }
                    }

                    if (airTemperature) {
                        ctrl.temperatureUnit = reading_unit == "deg C" ? "C" : "F";
                        ctrl.airTemperature = reading_unit == "deg C" ? airTemperature.value : airTemperature.value + 32;
                    }
                }

                function getTwoHoursWeatherForecast(result) {
                    var areas = result.data.area_metadata;
                    var timestamp = result.data.items[0].timestamp;
                    var forecasts = result.data.items[0].forecasts;
                    var areaName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    for (var area in areas) {
                        var areaLocation = areas[area].label_location;

                        if (area == 0) {
                            shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, areaLocation.latitude, areaLocation.longitude);
                        } else {
                            tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, areaLocation.latitude, areaLocation.longitude);
                        }

                        if (area == 0 || shortestDistance > tempDistance) {
                            shortestDistance = area == 0 ? shortestDistance : tempDistance;
                            areaName = areas[area].name;
                        }
                    }

                    // Get Forecast based on area name
                    var forecast = null;

                    for (var i = 0; i < forecasts.length; i++) {
                        if (forecasts[i].area == areaName) {
                            forecast = forecasts[i];
                            break;
                        }
                    }

                    if (forecast) {
                        ctrl.currentLocation = forecast.area;
                        ctrl.weatherTimestamp = timestamp;
                        ctrl.twoHoursWeatherForecast = forecast.forecast;
                    }
                }

                function getTwentyFourHoursWeatherForecast(result) {
                    ctrl.twentyFourHoursWeatherForecast = result.data.items[0].general;
                }

                function getNextFourDaysWeatherForecast(result) {
                    ctrl.fourDaysWeatherForecast = result.data.items[0].forecasts;
                }

                function getPSI(result) {
                    var regions = result.data.region_metadata;
                    var readings = result.data.items[0].readings.psi_twenty_four_hourly;
                    var timestamp = result.data.items[0].timestamp;
                    var regionName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    // Get nearest region based on latitude & longitude
                    for (var region in regions) {
                        var regionLocation = regions[region].label_location;

                        if (angular.lowercase(regions[region].name) != "national") {
                            if (region == 0) {
                                shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, regionLocation.latitude, regionLocation.longitude);
                            } else {
                                tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, regionLocation.latitude, regionLocation.longitude);
                            }

                            if (region == 0 || shortestDistance > tempDistance) {
                                shortestDistance = region == 0 ? shortestDistance : tempDistance;
                                regionName = regions[region].name;
                            }
                        }
                    }

                    ctrl.currentRegion = regionName;
                    ctrl.psi = readings;
                    ctrl.psiTimestamp = timestamp;
                }

                function getRainfall(result) {
                    var stations = result.data.metadata.stations;
                    var reading_unit = result.data.metadata.reading_unit;
                    var readings = result.data.items[0].readings;

                    var stationId = null;
                    var stationName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    for (var i = 0; i < stations.length; i++) {
                        var stationLocation = stations[i].location;

                        if (i == 0) {
                            shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        } else {
                            tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        }

                        if (i == 0 || shortestDistance > tempDistance) {
                            shortestDistance = i == 0 ? shortestDistance : tempDistance;
                            stationId = stations[i].id;
                            stationName = stations[i].name;
                        }
                    }

                    // Get Rainfall based on station id
                    var rainfall = null;

                    for (var i = 0; i < readings.length; i++) {
                        if (readings[i].station_id == stationId) {
                            rainfall = readings[i];
                            break;
                        }
                    }

                    ctrl.rainfall = rainfall;
                }

                function getRelativeHumidity(result) {
                    var stations = result.data.metadata.stations;
                    var readings = result.data.items[0].readings;

                    var stationId = null;
                    var stationName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    for (var i = 0; i < stations.length; i++) {
                        var stationLocation = stations[i].location;

                        if (i == 0) {
                            shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        } else {
                            tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        }

                        if (i == 0 || shortestDistance > tempDistance) {
                            shortestDistance = i == 0 ? shortestDistance : tempDistance;
                            stationId = stations[i].id;
                            stationName = stations[i].name;
                        }
                    }

                    // Get Relative Humidity based on station id
                    var relativeHumidity = null;

                    for (var i = 0; i < readings.length; i++) {
                        if (readings[i].station_id == stationId) {
                            relativeHumidity = readings[i];
                            break;
                        }
                    }

                    ctrl.relativeHumidity = relativeHumidity;
                }

                function getWindDirection(result) {
                    var stations = result.data.metadata.stations;
                    var readings = result.data.items[0].readings;

                    var stationId = null;
                    var stationName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    for (var i = 0; i < stations.length; i++) {
                        var stationLocation = stations[i].location;

                        if (i == 0) {
                            shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        } else {
                            tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        }

                        if (i == 0 || shortestDistance > tempDistance) {
                            shortestDistance = i == 0 ? shortestDistance : tempDistance;
                            stationId = stations[i].id;
                            stationName = stations[i].name;
                        }
                    }

                    // Get Wind Direction based on station id
                    var windDirection = null;

                    for (var i = 0; i < readings.length; i++) {
                        if (readings[i].station_id == stationId) {
                            windDirection = readings[i];
                            break;
                        }
                    }

                    ctrl.windDirection = convertWindDirectionAngle(windDirection);
                }

                function getWindSpeed(result) {
                    var stations = result.data.metadata.stations;
                    var readings = result.data.items[0].readings;

                    var stationId = null;
                    var stationName = null;
                    var tempDistance = 0;
                    var shortestDistance = 0;

                    for (var i = 0; i < stations.length; i++) {
                        var stationLocation = stations[i].location;

                        if (i == 0) {
                            shortestDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        } else {
                            tempDistance = calculateDistance(ctrl.latitude, ctrl.longitude, stationLocation.latitude, stationLocation.longitude);
                        }

                        if (i == 0 || shortestDistance > tempDistance) {
                            shortestDistance = i == 0 ? shortestDistance : tempDistance;
                            stationId = stations[i].id;
                            stationName = stations[i].name;
                        }
                    }

                    // Get Wind Speed based on station id
                    var windSpeed = null;

                    for (var i = 0; i < readings.length; i++) {
                        if (readings[i].station_id == stationId) {
                            windSpeed = readings[i];
                        }
                    }

                    // Conversion knots to km/h (1 knot = 1.852 km/ h)
                    ctrl.windSpeed = toKMPerHour(windSpeed);
                }
            }
        ],
        templateUrl: "~/App/tenant/views/dashboard/WorkSpace/weather/index.cshtml"
    });
})();