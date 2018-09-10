appModule.service('sampleDataService', [
    '$q',
    function ($q) {
        var data = seedData(123);

        // Prescription
        var prescriptions = [];
        var drugs = [];
        var frequencies = [];
        var routes = [];
        var orderStatus = [];

        seedPrescriptionMasters();
        seedPrescriptions(25);

        this.createPrescription = function (input) {
            var deferred = $q.defer();

            input.id = prescriptions.length + 1;

            prescriptions.push(input);

            setTimeout(function () {
                deferred.resolve(input);
            }, delay);

            return deferred.promise;
        };

        this.getOrderStatusCount = function () {

            var delay = 0;

            var deferred = $q.defer();
            var output = {
                unchecked: 2,
                provisional: 1,
                confirmed: 12,
                voided: 0,
                stopped: 1,
                completed: 0,
                referral: 0
            };

            var result = [];

            for (var key in output) {
                result.push({
                    key: key,
                    value: output[key],
                });
            }

            setTimeout(function () {
                deferred.resolve(result);
            }, delay);

            return deferred.promise;
        };

        this.getPrescriptions = function (input) {
            var view = input.view || 0;
            var filter = input.filter || null;
            var maxResultCount = input.maxResultCount || 10;
            var skipCount = input.skipCount || 0;
            var delay = input.delay || 250;
            var deferred = $q.defer();

            // View
            // Active: 0,
            // Inactive: 1,
            // Referral: 2,
            // Unchecked: 3,
            // Provisional: 4,
            // All: 5
            var filteredData = prescriptions.filter(function (item) {
                if (view == 0) {
                    return item.orderStatus == 'Unchecked' || item.orderStatus == 'Confirmed' || item.orderStatus == 'Provisional';
                } else if (view == 1) {
                    return item.orderStatus == 'Voided' || item.orderStatus == 'Stopped' || item.orderStatus == 'Completed';
                } else if (view == 2) {
                    return item.orderStatus == 'Referral';
                } else if (view == 3) {
                    return item.orderStatus == 'Unchecked';
                } else if (view == 4) {
                    return item.orderStatus == 'Provisional';
                }

                return true;
            });

            // Array paging
            var beginIndex = skipCount;
            var endIndex = beginIndex + maxResultCount;

            var response = {
                data: {
                    totalCount: filteredData.length,
                    items: filteredData.slice(beginIndex, endIndex)
                },
                orderStatusCount: _.countBy(filteredData, "orderStatus")
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        this.getFrequency = function (input) {
            input = input || {};
            var delay = input.delay || 250;
            var deferred = $q.defer();

            var response = {
                data: {
                    totalCount: frequencies.length,
                    items: frequencies
                }
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        this.updatePrescription = function (input) {
            var deferred = $q.defer();

            for (var i = 0; i < prescriptions.length; i++) {
                var target = prescription[i];

                if (input.id == target.id) {
                    target = input;
                }
            }

            setTimeout(function () {
                deferred.resolve(target);
            }, delay);

            return deferred.promise;
        };

        this.getDrugs = function (input) {
            input = input || {};
            var delay = input.delay || 250;
            var deferred = $q.defer();

            var response = {
                data: {
                    totalCount: drugs.length,
                    items: drugs
                }
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        this.getRoutes = function (input) {
            input = input || {};
            var delay = input.delay || 250;
            var deferred = $q.defer();

            var response = {
                data: {
                    totalCount: routes.length,
                    items: routes
                }
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        // Person
        this.getPersons = function (input) {
            var view = input.view || 0;
            var filter = input.filter || null;
            var maxResultCount = input.maxResultCount || 10;
            var skipCount = input.skipCount || 0;
            var delay = input.delay || 250;
            var deferred = $q.defer();

            // View
            // All: 0
            // Inactive: 2
            // Active: 1
            var filteredData = data.filter(function (item) {
                if (view == 1) {
                    return item.isActive;
                } else if (view == 2) {
                    return !item.isActive;
                }

                return true;
            });

            // Filter data
            var filteredData = filteredData.filter(function (item) {
                if (!filter) {
                    return true;
                }

                var regex = new RegExp(filter, 'gi');
                return item.fullName.match(regex) || item.registrationDocumentNo.match(regex);
            });

            // Array paging
            var beginIndex = skipCount;
            var endIndex = beginIndex + maxResultCount;

            // Prepare output
            var response = {
                data: {
                    totalCount: filteredData.length,
                    items: filteredData.slice(beginIndex, endIndex)
                }
            };

            // Simulate internet delay
            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        function seedData(count) {
            var data = [];

            for (var i = 1; i <= count; i++) {
                var pictureId = getRandomNumber(1, 10) + '';

                if (pictureId.length == 1) {
                    pictureId = '0' + pictureId;
                }

                var person = {
                    fullName: 'Person ' + i,
                    registrationDocumentNo: getRandomNric(),
                    email: 'person' + i + '@person.com',
                    home: getRandomNumber(10000000, 99999999),
                    mobile: getRandomNumber(10000000, 99999999),
                    address: '12 Kallang Avenue, #03/04-31, Aperia - The Annex, Singapore 339511, Singapore',
                    pictureId: pictureId,
                    familyMembers: [],
                    isActive: !!getRandomNumber(0, 1)
                };

                for (var j = 1; j <= getRandomNumber(1, 4); j++) {
                    var familyMember = {
                        fullName: 'Family Member ' + i + '.' + j,
                        home: getRandomNumber(10000000, 99999999),
                        mobile: getRandomNumber(10000000, 99999999)
                    };

                    person.familyMembers.push(familyMember);
                }

                data.push(person);
            }

            return data;
        }

        function getRandomNric() {
            var number = getRandomNumber(1000000, 9999999);
            var dummyCheckDigit = String.fromCharCode(65 - 1 + getRandomNumber(1, 24));

            return 'S' + number + dummyCheckDigit;
        }

        function getRandomNumber(min, max) {
            return parseInt(Math.random() * (max - min + 1) + min);
        }

        function seedPrescriptionMasters() {
            drugs = [];

            for (var i = 1; i <= 123; i++) {
                var drug = {
                    id: i,
                    drugName: 'Drug ' + i,
                    drugTypeDescription: 'S1',
                    drugCategoryDescription: 'Controlled'
                };

                drugs.push(drug);
            }

            frequencies = [{
                id: 1,
                code: 'TAD',
                description: 'TWICE A DAY'
            }, {
                id: 1,
                code: 'EM',
                description: 'EVERY MORNING'
            }];

            routes = [{
                id: 1,
                code: 'ORAL',
                description: 'ORAL'
            }, {
                id: 1,
                code: 'IMPLANT',
                description: 'IMPLANT'
            }];

            orderStatus = [
                'Unchecked',
                'Provisional',
                'Confirmed',
                'Voided',
                'Stopped',
                'Completed',
                'Referral'
            ];

            return data;
        }

        function seedPrescriptions(count) {
            for (var i = 1; i <= count; i++) {
                prescriptions.push({
                    id: i,
                    drugName: 'Drug ' + i,
                    orderStartDate: new Date(2017, getRandomNumber(1, 12), getRandomNumber(1, 28)),
                    orderStatus: orderStatus[getRandomNumber(0, orderStatus.length - 1)],
                    route: routes[getRandomNumber(0, routes.length - 1)],
                    frequency: frequencies[getRandomNumber(0, frequencies.length - 1)],
                    dose: getRandomNumber(1, 5),
                    specialInstructions: '[Drug ' + i + '] Once a week every tuesday. To give 30 mins before meals. Do not chew or crush. To take plenty of water.'
                });
            }
        }
    }
]);

appModule.service('mockCarePlanDataService', [
    '$q',
    function ($q) {
        var careplans = [];

        seedCarePlans();

        this.getCarePlans = function (input) {
            var view = input.view || 0;
            var filter = input.filter || null;
            var maxResultCount = input.maxResultCount || 10;
            var skipCount = input.skipCount || 0;
            var delay = input.delay || 250;
            var deferred = $q.defer();

            // View
            // Active: 1,
            // Inactive: 2
            // All: 0
            var filteredData = careplans.filter(function (item) {
                //if (view == 1) {
                //    return item.isActive == 1;
                //} else if (view == 2) {
                //    return item.isActive == 2;
                //}

                return true;
            });

            // Array paging
            var beginIndex = skipCount;
            var endIndex = beginIndex + maxResultCount;

            var response = {
                data: {
                    totalCount: filteredData.length,
                    items: filteredData.slice(beginIndex, endIndex)
                }
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        function seedCarePlans() {
            var problems = [{
                id: '7602de78-a02b-4784-aa3b-878d76f0bb4e',
                description: 'Oral Health',
                priority: "2",
                status: 'Open',
                // Nursing
                goals: [{
                    id: '057823ed-a108-4fba-8a2e-8c5c68695f9c',
                    description: 'Resident able to ingest food/fluids with increasing comfort',
                    status: 'Open',
                    interventions: [{
                        id: '544415a0-ce05-43c3-9bfa-3a45a33b9ba0',
                        description: 'Monitor oral intake',
                        status: 'Open'
                    }]
                },
                {
                    id: '05d49e8a-9c81-4564-9df1-f07ef617ef5d',
                    description: 'Resident has good dental health',
                    status: 'Open',
                    interventions: [{
                        id: '70847730-fada-4679-bd09-cc451fb36a0f',
                        description: 'Plan and record resident\'s progress in ability to perform oral care',
                        status: 'Open'
                    }]
                },
                {
                    id: '5343ad72-27fa-4385-8f67-34c2845b6468',
                    description: 'Resident will be able to participate in self oral care',
                    status: 'Open',
                    interventions: [{
                        id: '82f4a1e6-dba8-4996-a5a7-e6eff514cdef',
                        description: 'Identify substances that irritate oral mucosa',
                        status: 'Open'
                    }, {
                        id: 'c7421f93-58c3-433d-8501-3bd5ea32416b',
                        description: 'Clean or assist to clean dentures after each meal and especially before bedtime',
                        status: 'Open'
                    }]
                }]
            }, {
                id: '1526d401-9bb4-4cc6-b2d3-b239345512a6',
                description: 'Care Transfers',
                priority: "1",
                status: 'Open',
                // OT
                goals: [{
                    id: '5daf5661-fb40-46d8-a8c7-5705a9517a8d',
                    description: 'To be able to _____ with modified independence',
                    status: 'Open',
                    interventions: [{
                        id: '3b5c69cc-8aff-47c8-a321-ba790ddaf52c',
                        description: 'Equipment prescription',
                        status: 'Open'
                    }, {
                        id: '82d66619-8813-4ad8-a189-4ecd3c5d056d',
                        description: 'Toileting',
                        status: 'Suspended'
                    }]
                }]
            }, {
                id: 'fdf32d37-5dc1-4e03-a6dd-59decd48543c',
                description: 'Impaired sitting balance',
                priority: "0",
                status: 'Open',
                // PT
                goals: [{
                    id: '45cb054c-5b20-47e4-9d2e-489c35051a96',
                    description: 'To be able to sit quietly unsupported',
                    status: 'Closed',
                    interventions: [{
                        id: 'dc34b13c-6aea-4c4b-a9ab-5f8074624f54',
                        description: 'Weight shifts in sitting',
                        status: 'Closed'
                    }]
                }, {
                    id: '3314be5b-5d8b-477b-9ac5-d1e77c99b41d',
                    description: 'To be able to sit and reach in multiple directions',
                    status: 'Open',
                    interventions: [{
                        id: 'e1a2ffd9-803e-4bcc-816a-aa2bf21d5973',
                        description: 'Dynamic activity sin sitting',
                        status: 'Open'
                    }]
                }]
            }];

            $.extend(problems, { status: 'Open' });

            careplans.push({
                problem: $.extend(problems[0], {
                    problemDescription: 'This is ' + problems[0].description,
                    logs: [{
                        previousStatus: null,
                        currentStatus: 'Open',
                        actionDate: new Date(),
                        actionBy: 'Keng Leong'
                    }, {
                        previousStatus: 'Open',
                        currentStatus: 'Suspended',
                        actionDate: new Date(),
                        actionBy: 'Keng Leong'
                    }]
                }),
                types: [{
                    id: '2c549fcf-736c-49d6-80b1-856b576c20b4',
                    description: 'OT',
                    status: 'Open',
                    nextReviewDate: new Date(),
                    goals: problems[0].goals,
                    reviews: [{
                        date: new Date().toDateString(),
                        name: 'Keng Leong',
                        remarks: 'This is remarks.'
                    }, {
                        date: new Date().toDateString(),
                        name: 'Keng Leong',
                        remarks: 'This is remarks.'
                    }]
                }, {
                    id: '1aa67b4a-28f2-4940-a11a-52974f0ff307',
                    description: 'Nursing',
                    status: 'Open',
                    nextReviewDate: new Date(),
                    goals: problems[2].goals,
                    reviews: [{
                        date: new Date().toDateString(),
                        name: 'Keng Leong',
                        remarks: 'This is remarks.'
                    }, {
                        date: new Date().toDateString(),
                        name: 'Keng Leong',
                        remarks: 'This is remarks.'
                    }]
                }]
            });

            careplans.push({
                problem: $.extend(problems[1], {
                    problemDescription: 'This is ' + problems[1].description,
                    logs: [{
                        previousStatus: null,
                        currentStatus: 'Open',
                        actionDate: new Date(),
                        actionBy: 'Keng Leong'
                    }]
                }),
                types: [{
                    id: 'f4b05788-192c-483f-a224-fa1853c395ac',
                    description: 'OT',
                    status: 'Open',
                    nextReviewDate: new Date(),
                    goals: problems[1].goals,
                    reviews: [{
                        date: new Date().toDateString(),
                        name: 'Keng Leong',
                        remarks: 'This is remarks.'
                    }]
                }]
            });

            careplans.push({
                problem: $.extend(problems[2], {
                    problemDescription: 'This is ' + problems[2].description,
                    logs: [{
                        previousStatus: null,
                        currentStatus: 'Open',
                        actionDate: new Date(),
                        actionBy: 'Keng Leong'
                    }]
                }),
                types: [{
                    id: '0c3572da-6b8e-40f4-af34-59aefac26255',
                    description: 'PT',
                    status: 'Open',
                    nextReviewDate: new Date(),
                    goals: problems[2].goals,
                    reviews: [{
                        date: new Date().toDateString(),
                        name: 'Keng Leong',
                        remarks: 'This is remarks.'
                    }]
                }]
            });

            for (var i = 0; i < careplans.length; i++) {
                var careplan = careplans[i];

                var types = careplan.types.map(function (input) {
                    return input.description;
                });
                careplan.summary = types.join(', ');

                for (var j = 0; j < careplan.types.length; j++) {
                    careplan.types[j].summary = getGoalSummary(careplan.types[0].goals);
                }
            }
        }

        function getGoalSummary(goals) {
            for (var i = 0; i < goals.length; i++) {
                goals[i].summary = getInterventionSummary(goals[i].interventions);
            }

            return goals.length + ' Goal(s): ' + status(goals);
        }

        function getInterventionSummary(interventions) {
            return interventions.length + ' Intervention(s): ' + status(interventions);
        }

        function status(input) {
            var s = {};

            for (var i = 0; i < input.length; i++) {
                var obj = input[i];


                if (s.hasOwnProperty(obj.status)) {
                    s[obj.status]++;
                } else {
                    s[obj.status] = 1;
                }
            }

            var list = [];

            for (var key in s) {
                var val = s[key];
                list.push(val + ' ' + key);

            }

            return list.join(' ');
        }
    }
]);

appModule.service('mockProblemListDataService', [
    '$q',
    function ($q) {
        var problemLists = [];

        seedProblemLists();

        this.getProblemLists = function (input) {
            var view = input.view || 0;
            var filter = input.filter || null;
            var maxResultCount = input.maxResultCount || 10;
            var skipCount = input.skipCount || 0;
            var delay = input.delay || 250;
            var deferred = $q.defer();

            // View
            // Active: 1,
            // Inactive: 2
            // All: 0
            var filteredData = problemLists.filter(function (item) {
                if (view == 1) {
                    return item.isActive == 1;
                } else if (view == 2) {
                    return item.isActive == 2;
                }

                return true;
            });

            // Array paging
            var beginIndex = skipCount;
            var endIndex = beginIndex + maxResultCount;

            var response = {
                data: {
                    totalCount: filteredData.length,
                    items: filteredData.slice(beginIndex, endIndex)
                }
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        this.getProblemListForEdit = function (input) {
            var deferred = $q.defer();
            var delay = input.delay || 250;
            var problem = {};

            problem = problemLists[parseInt(input.id) - 1];

            var response = {
                data: problem
            };

            setTimeout(function () {
                deferred.resolve(response);
            }, delay);

            return deferred.promise;
        };

        this.createProblemList = function (input) {
            var deferred = $q.defer();
            var delay = input.delay || 250;

            input.id = problemLists.length + 1;

            problemLists.push(input);

            setTimeout(function () {
                deferred.resolve(input);
            }, delay);

            return deferred.promise;
        };

        this.updateProblemList = function (input) {
            var deferred = $q.defer();
            var delay = input.delay || 250;

            for (var i = 0; i < problemLists.length; i++) {
                var target = problemLists[i];

                if (input.id == target.id) {
                    target = input;
                }
            }

            setTimeout(function () {
                deferred.resolve(target);
            }, delay);

            return deferred.promise;
        };

        this.updateProblemListStatus = function (input) {
            var deferred = $q.defer();
            var delay = input.delay || 250;

            for (var i = 0; i < problemLists.length; i++) {
                var target = problemLists[i];

                if (input.id == target.id) {
                    target.remarks = input.remarks;
                    target.status = input.status;
                    target.statusDate = input.statusDate;
                    target.by = input.by;

                    problemLists[i] = target;
                }
            }

            setTimeout(function () {
                deferred.resolve(target);
            }, delay);

            return deferred.promise;
        };

        function seedProblemLists() {
            // Status: Open - 0, Suspended - 1, Resolved - 2, Closed - 3
            for (var i = 1; i <= 50; i++) {
                var longProblemName = '';

                for (var j = 0; j < 40; j++) {
                    longProblemName += 'Problem ' + i;
                }

                var problemList = {
                    id: i,
                    priorityType: getRandomNumber(0, 3),
                    problemId: i,
                    problemName: longProblemName,
                    problemDescription: 'This is Problem Description ' + i,
                    onsetDate: new Date(),
                    //reviewDate: (new Date()).setMonth((new Date()).getMonth() + getRandomNumber(1, 9)), 
                    tags: ['Tag ' + i, 'IngoTPCC', 'Health', 'Care', 'Problem List', 'Progress Note', 'KL', 'SG'],
                    isActive: getRandomNumber(1, 2),
                    status: getRandomNumber(0, 3)
                };

                problemLists.push(problemList);
            }
        }

        function getRandomNumber(min, max) {
            return parseInt(Math.random() * (max - min + 1) + min);
        }
    }
]);