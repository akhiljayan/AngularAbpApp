

/* 'app' MODULE DEFINITION */
var appModule = angular.module("app", [
    "ui.router",
    "ui.bootstrap",
    'ui.utils',
    "ui.jq",
    'ui.grid',
    'ui.grid.pinning',
    'ui.grid.pagination',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.grid.selection',
    'ui.select',
    "oc.lazyLoad",
    "ngSanitize",
    'angularFileUpload',
    'daterangepicker',
    'angularMoment',
    'frapontillo.bootstrap-switch',
    'abp',
    'ngMask',
    'monospaced.elastic',
    'sticky',
    'angularValidator',
    'signature',
    'ncy-angular-breadcrumb',
    'ui.knob',
    'ng.ckeditor',
    'tc.chartjs',
    'ct.ui.router.extras.previous',
    'angularDirtyformCheck',
    'pageslide-directive',
    //'ui.bootstrap.datetimepicker',
    //'ui.bootstrap.dateparser'
]);

/* LAZY LOAD CONFIG */

/* This application does not define any lazy-load yet but you can use $ocLazyLoad to define and lazy-load js/css files.
 * This code configures $ocLazyLoad plug-in for this application.
 * See it's documents for more information: https://github.com/ocombe/ocLazyLoad
 */
appModule.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before', // load the css files before a LINK element with this ID.
        debug: false,
        events: true,
        modules: []
    });
}]);

/* THEME SETTINGS */
App.setAssetsPath(abp.appPath + 'metronic/assets/');
appModule.factory('settings', ['$rootScope', function ($rootScope) {
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: App.getAssetsPath() + 'admin/layout4/img/',
        layoutCssPath: App.getAssetsPath() + 'admin/layout4/css/',
        assetsPath: abp.appPath + 'metronic/assets',
        globalPath: abp.appPath + 'metronic/assets/global',
        layoutPath: abp.appPath + 'metronic/assets/layouts/layout4'
    };

    $rootScope.settings = settings;
    $rootScope.EmptyGuid = '00000000-0000-0000-0000-000000000000';
    $rootScope.DefaultDateFormat = 'DD-MMM-YYYY';
    $rootScope.DefaultPageSize = 10;
    $rootScope.isEmptyGuid = function (value) {
        return value == $rootScope.EmptyGuid;
    }

    return settings;
}]);

/* ROUTE DEFINITIONS */

appModule.config([
    '$stateProvider', '$urlRouterProvider', '$qProvider',
    function ($stateProvider, $urlRouterProvider, $qProvider) {

        // Default route (overrided below if user has permission)
        $urlRouterProvider.otherwise("/welcome");

        //Welcome page
        $stateProvider.state('welcome', {
            url: '/welcome',
            templateUrl: '~/App/common/views/welcome/index.cshtml'
        });

        //COMMON routes
        if (abp.auth.hasPermission('Pages.Administration.Roles')) {
            $stateProvider.state('roles', {
                url: '/roles',
                templateUrl: '~/App/common/views/roles/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Roles',
                    label: 'Administration \uA789 Roles',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Users')) {
            $stateProvider.state('users', {
                url: '/users?filterText',
                templateUrl: '~/App/common/views/users/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Users',
                    label: 'Administration \uA789 Users',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Languages')) {
            $stateProvider.state('languages', {
                url: '/languages',
                templateUrl: '~/App/common/views/languages/index.cshtml',
                ncyBreadcrumb: {
                    state: 'languages',
                    label: 'Administration \uA789 Languages',
                    parent: 'tenant.dashboard.home',
                }
            });

            if (abp.auth.hasPermission('Pages.Administration.Languages.ChangeTexts')) {
                $stateProvider.state('languageTexts', {
                    url: '/languages/texts/:languageName?sourceName&baseLanguageName&targetValueFilter&filterText',
                    templateUrl: '~/App/common/views/languages/texts.cshtml'
                });
            }
        }

        // System Audit Logs
        if (abp.auth.hasPermission('Pages.Administration.AuditLogs')) {
            $stateProvider.state('systemAuditLogs', {
                url: '/systemAuditLogs',
                templateUrl: '~/App/common/views/auditLogs/index.cshtml',
                ncyBreadcrumb: {
                    state: 'SystemAuditLogs',
                    label: 'Administration \uA789 System Audit Logs',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.OrganizationUnits')) {
            $stateProvider.state('organizationUnits', {
                url: '/organizationUnits',
                templateUrl: '~/App/common/views/organizationUnits/index.cshtml',
                ncyBreadcrumb: {
                    state: 'organizationUnits',
                    label: 'Administration \uA789 Organization Units',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        $stateProvider.state('notifications', {
            url: '/notifications',
            templateUrl: '~/App/common/views/notifications/index.cshtml'
        });

        //HOST routes
        $stateProvider.state('host', {
            'abstract': true,
            url: '/host',
            template: '<div ui-view class="fade-in-up"></div>'
        });

        if (abp.auth.hasPermission('Pages.Tenants')) {
            $urlRouterProvider.otherwise("/host/tenants"); //Entrance page for the host
            $stateProvider.state('host.tenants', {
                url: '/tenants?filterText',
                templateUrl: '~/App/host/views/tenants/index.cshtml'
            });
        }

        if (abp.auth.hasPermission('Pages.Editions')) {
            $stateProvider.state('host.editions', {
                url: '/editions',
                templateUrl: '~/App/host/views/editions/index.cshtml'
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Host.Maintenance')) {
            $stateProvider.state('host.maintenance', {
                url: '/maintenance',
                templateUrl: '~/App/host/views/maintenance/index.cshtml'
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Host.Settings')) {
            $stateProvider.state('host.settings', {
                url: '/settings',
                templateUrl: '~/App/host/views/settings/index.cshtml'
            });
        }

        //TENANT routes
        $stateProvider.state('tenant', {
            'abstract': true,
            url: '/tenant',
            template: '<div ui-view class="fade-in-up"></div>',
        });

        if (abp.auth.hasPermission('Pages.Tenant.Dashboard')) {
            $urlRouterProvider.otherwise("/tenant/dashboard/workspace"); //Entrance page for a tenant
            $stateProvider.state('tenant.dashboard', {
                url: '/dashboard',
                templateUrl: '~/App/tenant/views/dashboard/index.cshtml',
                deepStateRedirect: { default: { state: 'tenant.dashboard.careboard' } },
                ncyBreadcrumb: {
                    label: 'Home',
                    skip: true
                }
            });

            $stateProvider.state('tenant.parent.dashboard', {
                url: '/workspace',
                templateUrl: '~/App/tenant/views/dashboard/WorkSpace.cshtml',
                ncyBreadcrumb: {
                    label: 'Home',
                    parent: 'tenant.dashboard'
                }
            });

            $stateProvider.state('tenant.dashboard.home', {
                url: '/workspace',
                templateUrl: '~/App/tenant/views/dashboard/WorkSpace/WorkSpace.cshtml',
                ncyBreadcrumb: {
                    label: 'Home',
                    parent: 'tenant.dashboard'
                }
            });

            $stateProvider.state('tenant.dashboard.careboard', {
                url: '/careboard',
                templateUrl: '~/App/tenant/views/dashboard/CareBoard/CareBoard.cshtml',
                ncyBreadcrumb: {
                    label: 'Careboard',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.dashboard.moments', {
                url: '/moments',
                templateUrl: '~/App/tenant/views/dashboard/Moments/Moments.cshtml',
                ncyBreadcrumb: {
                    label: 'Moments',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.Person')) {
            $stateProvider.state('tenant.personNew', {
                url: '/persons/',
                template: '<person-new></person-new>',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: 'New Person',
                    parent: 'tenant.dashboard.careboard'
                }
            });

            $stateProvider.state('tenant.personEdit', {
                url: '/persons/:id',
                template: '<person-edit></person-edit>',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.person', {
                url: '/person',
                templateUrl: '~/App/tenant/views/person/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: 'Social \uA789 Person',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.personDetailNew', {
                url: '/person/',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: 'New Person',
                    //parent: 'tenant.person',
                    parent: 'tenant.dashboard.careboard'
                }
            });

            $stateProvider.state('tenant.personDetail', {
                url: '/person/:id',
                params: { isNotPatient: "" },
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.personDetailFromSocialRpt', {
                url: '/person/socialReport/:id',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "", "alt": "Person-Record" },
                    parent: 'tenant.socialReports',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.personProfile', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "BioData", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.prescription', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "Prescription", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.medicalHistory', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "MedicalHistory", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.allergy', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "Allergy", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.spokenLanguageDialect', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "LanguageDialects", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            // Own Notes
            $stateProvider.state('tenant.ownNotes', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "OwnNotes", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            // Shared Notes
            $stateProvider.state('tenant.sharedNotes', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "SharedNotes", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            // Progress Notes
            $stateProvider.state('tenant.progressNotes', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "ProgressNotes", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            // Person Significant Life Event
            $stateProvider.state('tenant.significantLifeEvents', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "LifeEvent", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.medicationHistory', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "MedicationHistory", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.diagnosis', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "Diagnosis", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.medicalAlert', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "MedicalAlert", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.specialCare', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "SpecialCare", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.immunization', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "Immunization", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.IRMSReferral.View')) {
            $stateProvider.state('tenant.irms', {
                url: '/irms',
                templateUrl: '~/App/tenant/views/irms/index.cshtml',
                ncyBreadcrumb: {
                    state: 'IRMS',
                    label: 'IRMS - Active Referral',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.irmsReferralDetail', {
                url: '/irms/referral/:id/:serviceType',
                templateUrl: '~/App/tenant/views/irms/referral/referralView.cshtml',
                ncyBreadcrumb: {
                    state: 'IRMS',
                    label: 'IRMS Referral Detail',
                    parent: 'tenant.irms'
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.Referral')) {
            $stateProvider.state('tenant.referral', {
                url: '/referral',
                templateUrl: '~/App/tenant/views/referral/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Referral',
                    label: 'Clinical \uA789 Referral',
                    parent: 'tenant.dashboard.home'
                }
            });

            //$stateProvider.state('tenant.referralNew', {
            //    url: '/referral/',
            //    template: '<referral-new></referral-new>',
            //    ncyBreadcrumb: {
            //        state: 'Referral',
            //        label: 'New Referral',
            //        parent: 'tenant.referral'
            //    }
            //});

            //$stateProvider.state('tenant.referralEdit', {
            //    url: '/referral/:id',
            //    template: '<referral-edit></referral-edit>',
            //    ncyBreadcrumb: {
            //        state: 'Referral',
            //        label: { "servive": "getReferralCode", "param": "id", "prefix": "", "alt": "Referral-Record" },
            //        parent: 'tenant.referral',
            //        callFromService: true
            //    }
            //});

            $stateProvider.state('tenant.referralDetailNew', {
                url: '/referral/',
                templateUrl: '~/App/tenant/views/referral/referralView.cshtml',
                ncyBreadcrumb: {
                    state: 'Referral',
                    label: 'New Referral',
                    parent: 'tenant.referral'
                }
            });

            $stateProvider.state('tenant.referralDetail', {
                url: '/referral/:id',
                templateUrl: '~/App/tenant/views/referral/referralView.cshtml',
                ncyBreadcrumb: {
                    state: 'Referral',
                    label: { "servive": "getReferralCode", "param": "id", "prefix": "", "alt": "Referral-Record" },
                    parent: 'tenant.referral',
                    callFromService: true
                },
            });
        };

        if (abp.auth.hasPermission('Pages.Tenant.Admission')) {
            $stateProvider.state('tenant.admission', {
                url: '/admission',
                templateUrl: '~/App/tenant/views/admissions/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Admission',
                    label: 'Clinical \uA789 Admissions',
                    parent: 'tenant.dashboard.home'
                }
            });

            //$stateProvider.state('tenant.admissionDetailNew', {
            //    url: '/admission/new/:action/:referralId/:id',
            //    templateUrl: '~/App/tenant/views/admission/admissionView.cshtml',
            //    ncyBreadcrumb: {
            //        state: 'Admission',
            //        label: 'New Admission',
            //        parent: function ($scope, $stateParams, $breadcrumbService) {
            //            return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
            //        }
            //    }
            //});

            //$stateProvider.state('tenant.admissionDetail', {
            //    url: '/admission/:action/:referralId/:id',
            //    params: { close: "" },
            //    templateUrl: '~/App/tenant/views/admission/admissionView.cshtml',
            //    ncyBreadcrumb: {
            //        state: 'Admission',
            //        label: function ($scope, $stateParams, $breadcrumbService) {
            //            return ($stateParams.action == 'admitted') ? 'Admitted Record' : 'Discharged Record';
            //        },
            //        parent: 'tenant.admission'
            //    }
            //});
            //$stateProvider.state('tenant.admissionDetail', {
            //    url: '/admission/:action/:referralId/:id',
            //    params: { close: "" },
            //    template: '<admission-view></admission-view>',
            //    ncyBreadcrumb: {
            //        state: 'Admission',
            //        label: function ($scope, $stateParams, $breadcrumbService) {
            //            return ($stateParams.action == 'admitted') ? 'Admitted Record' : 'Discharged Record';
            //        },
            //        parent: 'tenant.admission'
            //    }
            //});


            $stateProvider.state('tenant.admissionNew', {
                url: '/admission/new/:action/:referralId/:id',
                template: '<admission-new></admission-new>',
                params: { close: "" },
                ncyBreadcrumb: {
                    state: 'Admission',
                    label: 'New Admission',
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        //return 'tenant.referralEdit({id: "' + $stateParams.referralId + '"})';
                        return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                    }
                }
            });

            $stateProvider.state('tenant.admissionEdit', {
                url: '/admission/admission-detail/:action/:id?referralId',
                template: '<admission-edit></admission-edit>',
                params: { close: "" },
                ncyBreadcrumb: {
                    state: 'Admission',
                    label: 'Admitted Record',
                    parent: 'tenant.admission'
                }
            });

            $stateProvider.state('tenant.dischargeEdit', {
                url: '/admission/discharge-detail/:action/:id',
                template: '<admission-edit></admission-edit>',
                params: { close: "" },
                ncyBreadcrumb: {
                    state: 'Admission',
                    label: 'Discharged Record',
                    parent: 'tenant.admission'
                }
            });

        }

        if (abp.auth.hasPermission('Pages.Tenant.RunningNumber')) {
            $stateProvider.state('tenant.runningNumber', {
                url: '/runningnumber',
                templateUrl: '~/App/tenant/views/settings/runningnumber.cshtml',
                ncyBreadcrumb: {
                    state: 'Runningnumber',
                    label: 'Settings \uA789 Running Number',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.Holiday')) {
            $stateProvider.state('tenant.holiday', {
                url: '/holiday',
                templateUrl: '~/App/tenant/views/holidays/holiday.cshtml',
                ncyBreadcrumb: {
                    state: 'Holiday',
                    label: 'Holiday',
                    parent: 'tenant.dashboard.home'
                }
            });
        }




        if (abp.auth.hasPermission('Pages.Tenant.Drug')) {
            $stateProvider.state('tenant.drug', {
                url: '/drug',
                templateUrl: '~/App/tenant/views/drug/drug.cshtml',
                ncyBreadcrumb: {
                    state: 'Generic Drug',
                    label: 'Master Data \uA789 Generic Drug',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        //familyMembers
        if (abp.auth.hasPermission('Pages.Tenant.FamilyMembers')) {
            $stateProvider.state('tenant.familyMembers', {
                url: '/familyMembers',
                templateUrl: '~/App/tenant/views/familyMembers/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Family Member',
                    label: 'Social \uA789 Family Members',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.familyMembersDetail', {
                url: '/personfamilyMembers/:familyId?personId&referralId&membershipId',
                templateUrl: '~/App/tenant/views/familyMembers/familyMembersView.cshtml',
                ncyBreadcrumb: {
                    state: 'Family Member',
                    label: { "servive": "getFamilyMemberNameFromId", "param": "familyId", "prefix": "Family Member", "alt": "Family-Member-Record" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.personId != 'undefined' && typeof $stateParams.referralId == 'undefined' && typeof $stateParams.membershipId == 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                        } else if (typeof $stateParams.referralId != 'undefined' && typeof $stateParams.personId != 'undefined' && typeof $stateParams.membershipId == 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                        } else if (typeof $stateParams.membershipId != 'undefined' && typeof $stateParams.personId != 'undefined' && typeof $stateParams.referralId == 'undefined') {
                            return 'tenant.membershipsEdit({membershipId: "' + $stateParams.membershipId + '"})';
                        } else {
                            return 'tenant.familyMembers';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.familyMembersDetailPersonNew', {
                url: '/familyMembers/?personId&referralId&membershipId',
                templateUrl: '~/App/tenant/views/familyMembers/familyMembersView.cshtml',
                ncyBreadcrumb: {
                    state: 'Family Member',
                    label: { "default": "New Family-Member" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.personId != 'undefined' && typeof $stateParams.referralId == 'undefined' && $stateParams.membershipId == 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                        } else if (typeof $stateParams.referralId != 'undefined' && typeof $stateParams.personId != 'undefined' && typeof $stateParams.membershipId == 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})'
                        } else if (typeof $stateParams.membershipId != 'undefined' && typeof $stateParams.personId != 'undefined' && typeof $stateParams.referralId == 'undefined') {
                            return 'tenant.membershipsEdit({membershipId: "' + $stateParams.membershipId + '"})';
                        } else {
                            return 'tenant.familyMembers';
                        }
                    },
                    callFromService: true
                }
            });



            $stateProvider.state('tenant.familyMember', {
                url: '/familyMembers/:familyId',
                templateUrl: '~/App/tenant/views/familyMembers/familyMembersView.cshtml',
                ncyBreadcrumb: {
                    state: 'Family Member',
                    label: { "servive": "getFamilyMemberNameFromId", "param": "familyId", "prefix": "Family Member", "alt": "Family-Member-Record" },
                    parent: 'tenant.familyMembers',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.familyMemberNew', {
                url: '/familyMembers/',
                templateUrl: '~/App/tenant/views/familyMembers/familyMembersView.cshtml',
                ncyBreadcrumb: {
                    state: 'Family Member',
                    label: "New Family-Member",
                    parent: 'tenant.familyMembers',
                }
            });

            $stateProvider.state('tenant.familyMemberPersonDetail', {
                url: '/familyMembersPerson/:id',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Family Member',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "Person", "alt": "Person-Record" },
                    parent: 'tenant.familyMembers',
                    callFromService: true
                }
            });
        }

        //Membership
        if (abp.auth.hasPermission('Pages.Tenant.Memberships')) {
            /* Main listing for Membership from Social tab */
            $stateProvider.state('tenant.memberships', {
                url: '/memberships',
                templateUrl: '~/App/tenant/views/memberships/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Registration',
                    label: 'Social \uA789 Registration',
                    parent: 'tenant.dashboard.home'
                }
            });

            /* New form for Membership */
            $stateProvider.state('tenant.membershipsNew', {
                url: '/memberships/',
                template: '<membership-new></membership-new>',
                ncyBreadcrumb: {
                    state: 'Registration',
                    label: { "default": "New Registration" },
                    parent: 'tenant.memberships',
                    callFromService: true
                }
            });

            /* Existing record for Membership */
            $stateProvider.state('tenant.membershipsEdit', {
                url: '/memberships/:membershipId',
                template: '<membership-edit></membership-edit>',
                ncyBreadcrumb: {
                    state: 'Membership',
                    //label: { "default": "Membership" },
                    label: { "servive": "getMembershipApplicationNo", "param": "membershipId", "prefix": "", "alt": "Membership-Record" },
                    parent: 'tenant.memberships',
                    callFromService: true
                }
            });
        }

        //Assessments
        if (abp.auth.hasPermission('Pages.Tenant.Assessment')) {

            /* Main Listing for all post-admission assessments based on module */
            $stateProvider.state('tenant.assessment', {
                url: '/assessment/:description/:assessment',
                templateUrl: '~/App/tenant/views/assessment/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Assessment',
                    label: 'Assessment',
                    parent: 'tenant.dashboard.home'
                }
            });

            /* CreateOrUpdate the General Assessment via Main Listing*/
            $stateProvider.state('tenant.assessmentDetail', {
                url: '/assessment/:template/:description/:assessment/:id',
                templateUrl: '~/App/tenant/views/assessment/assessment-detail-view.cshtml',
                ncyBreadcrumb: {
                    state: 'Assessment',
                    label: function ($scope, $state, $breadcrumbService) {
                        return { "default": $state.description };
                    },
                    parent: function ($scope, $state, $breadcrumbService) {
                        if ($state.assessment) {
                            return 'tenant.assessment({assessment: "' + $state.assessment + '"' + ', description: "' + $state.description + '"})';
                        } else {
                            return 'tenant.dashboard.careboard';
                        }
                    },
                    callFromService: true
                }
            });

            /* CreateOrUpdate the General Assessment via Person Mode or Referral Mode */
            $stateProvider.state('tenant.assessmentDetailPersonMode', {
                url: '/assessment/:template/:description/:assessment/:id/:referralId/:personId',
                templateUrl: '~/App/tenant/views/assessment/assessment-detail-view.cshtml',
                ncyBreadcrumb: {
                    state: 'Assessment',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        return { "default": $stateParams.description };
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if ($stateParams.assessment && $stateParams.template == 'person') {
                            return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                        } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                        } else {
                            return 'tenant.dashboard.careboard';
                        }
                    },
                    callFromService: true
                }
            });

            // Assessments Configuration
            $stateProvider.state('tenant.assesmentsConfig', {
                url: '/assesmentsConfig',
                templateUrl: '~/App/tenant/views/assessment/settings/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Assesments',
                    label: 'Assesments',
                    parent: 'tenant.dashboard.home'
                }
            });

            // Assessments Menu
            $stateProvider.state('tenant.assessmentNavigation', {
                url: '/assessmentNavigation',
                templateUrl: '~/App/tenant/views/assessment/assessmentNavigation.cshtml',
                ncyBreadcrumb: {
                    state: 'Assessments',
                    label: 'Assessments',
                    parent: 'tenant.dashboard.home'
                }
            });

            //ZaritBurdenInterview Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.ZBI')) {

                /* CreateOrUpdate ZaritBurdenInterview [ZBI] Assessment via Main Listing */
                $stateProvider.state('tenant.zbiDetail', {
                    url: '/zbiAssessment/:template/:description/:assessment/:id',
                    template: '<zbi-detail-view></zbi-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Zarit Burden Interview (ZBI-4)',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Zarit Burden Interview (ZBI-4)" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            debugger;
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate ZaritBurdenInterview [ZBI] Assessment via Person */
                $stateProvider.state('tenant.zbiDetailPersonMode', {
                    url: '/zbiAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<zbi-detail-view></zbi-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Zarit Burden Interview (ZBI-4)',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Zarit Burden Interview (ZBI-4)" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //ResidentAssessmentForm Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.RAF')) {

                /* CreateOrUpdate ResidentAssessmentForm [RAF] Assessment via Main Listing */
                $stateProvider.state('tenant.rafDetail', {
                    url: '/rafAssessment/:template/:description/:assessment/:id',
                    template: '<raf-detail-view></raf-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Resident Assessment Form - RAF',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Resident Assessment Form - RAF" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate ResidentAssessmentForm [RAF] Assessment via Person or Referral Mode */
                $stateProvider.state('tenant.rafDetailPersonMode', {
                    url: '/rafAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<raf-detail-view></raf-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Resident Assessment Form - RAF',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Resident Assessment Form - RAF" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },

                        callFromService: true
                    }
                });
            }

            //StateOfHealth Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.SOH')) {
                /* CreateOrUpdate StateOfHealth [SOH] Assessment via Main Listing */
                $stateProvider.state('tenant.sohDetail', {
                    url: '/sohAssessment/:template/:description/:assessment/:id',
                    template: '<soh-detail-view></soh-detail-view>',
                    ncyBreadcrumb: {
                        state: 'State of Health (EQ - 5D)',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "State of Health (EQ - 5D)" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate StateOfHealth [SOH] Assessment via Person */
                $stateProvider.state('tenant.sohDetailPersonMode', {
                    url: '/sohAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<soh-detail-view></soh-detail-view>',
                    ncyBreadcrumb: {
                        state: 'State of Health (EQ - 5D)',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "State of Health (EQ - 5D)" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },

                        callFromService: true
                    }
                });
            }

            //AbbreviatedMentalTest Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.AMT')) {
                /* CreateOrUpdate AbbreviatedMentalTest [AMT] Assessment via Main Listing */
                $stateProvider.state('tenant.amtDetail', {
                    url: '/amtAssessment/:template/:description/:assessment/:id',
                    template: '<amt-detail-view></amt-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Abbreviated Mental Test - AMT',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Abbreviated Mental Test - AMT" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate AbbreviatedMentalTest [AMT] Assessment via Person */
                $stateProvider.state('tenant.amtDetailPersonMode', {
                    url: '/amtAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<amt-detail-view></amt-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Abbreviated Mental Test - AMT',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Abbreviated Mental Test - AMT" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },

                        callFromService: true
                    }
                });
            }

            //Functional Markers Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.FMA')) {
                /* CreateOrUpdate Functional Markers Assessment [FMA] via Main Listing */
                $stateProvider.state('tenant.fmaDetail', {
                    url: '/famAssessment/:template/:description/:assessment/:id',
                    template: '<fma-detail-view></fma-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Functional Markers Assessment [E.g., TUG]',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Functional Markers Assessment [E.g., TUG]" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Functional Markers Assessment [FMA] Assessment via Person */
                $stateProvider.state('tenant.fmaDetailPersonMode', {
                    url: '/fmaAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<fma-detail-view></fma-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Functional Markers Assessment [E.g., TUG]',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Functional Markers Assessment [E.g., TUG]" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Fall Risk Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.FRA')) {

                /* CreateOrUpdate Fall Risk Assessment via Main Listing */
                $stateProvider.state('tenant.fraDetail', {
                    url: '/fraAssessment/:template/:description/:assessment/:id',
                    template: '<fra-detail-view></fra-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Falls [Risk] Assessment',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Falls [Risk] Assessment" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Fall Risk Assessment via Person or Referral Mode*/
                $stateProvider.state('tenant.fraDetailPersonMode', {
                    url: '/fraAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<fra-detail-view></fra-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Falls [Risk] Assessment',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Falls [Risk] Assessment" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Functional Assessment Staging Tool
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.FAST')) {

                /* CreateOrUpdate Functional Assessment Staging Tool [FAST] Assessment via Main Listing */
                $stateProvider.state('tenant.fastDetail', {
                    url: '/fastAssessment/:template/:description/:assessment/:id',
                    template: '<fast-detail-view></fast-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Functional Assessment Staging Tool - FAST',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Functional Assessment Staging Tool - FAST" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Functional Assessment Staging Tool [FAST] Assessment via Person */
                $stateProvider.state('tenant.fastDetailPersonMode', {
                    url: '/fastAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<fast-detail-view></fast-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Functional Assessment Staging Tool - FAST',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Functional Assessment Staging Tool - FAST" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Geriatric Depression Scale
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.GDS')) {

                /* CreateOrUpdate Geriatric Depression Scale [GDS] Assessment via Main Listing */
                $stateProvider.state('tenant.gdsDetail', {
                    url: '/gdsAssessment/:template/:description/:assessment/:id',
                    template: '<gds-detail-view></gds-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Geriatric Depression Scale - GDS',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Geriatric Depression Scale - GDS" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Geriatric Depression Scale [GDS] Assessment via Person */
                $stateProvider.state('tenant.gdsDetailPersonMode', {
                    url: '/gdsAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<gds-detail-view></gds-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Geriatric Depression Scale - GDS',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Geriatric Depression Scale - GDS" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Mini Mental State Examination
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.MMSE')) {

                /* CreateOrUpdate Mini Mental State Examination [MMSE] Assessment via Main Listing */
                $stateProvider.state('tenant.mmseDetail', {
                    url: '/mmseAssessment/:template/:description/:assessment/:id',
                    template: '<mmse-detail-view></mmse-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Mini Mental State Examination - MMSE',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Mini Mental State Examination - MMSE" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Mini Mental State Examination - MMSE Assessment via Person */
                $stateProvider.state('tenant.mmseDetailPersonMode', {
                    url: '/mmseAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<mmse-detail-view></mmse-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Mini Mental State Examination - MMSE',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Mini Mental State Examination - MMSE" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Geriatric Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.GA')) {

                /* CreateOrUpdate Geriatric Assessment via Main Listing */
                $stateProvider.state('tenant.gaDetail', {
                    url: '/gaAssessment/:template/:description/:assessment/:id',
                    template: '<ga-detail-view></ga-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Geriatric Assessment - GA',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Geriatric Assessment - GA" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Geriatric Assessment - GA via Person */
                $stateProvider.state('tenant.gaDetailPersonMode', {
                    url: '/gaAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<ga-detail-view></ga-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Geriatric Assessment - GA',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Geriatric Assessment - GA" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Pain Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.PS')) {

                /* CreateOrUpdate Pain Assessment via Main Listing */
                $stateProvider.state('tenant.psDetail', {
                    url: '/psAssessment/:template/:description/:assessment/:id',
                    template: '<ps-detail-view></ps-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Pain Assessment - PS',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Pain Assessment - PS" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Pain Assessment via Person */
                $stateProvider.state('tenant.psDetailPersonMode', {
                    url: '/psAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<ps-detail-view></ps-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Pain Assessment - PS',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Pain Assessment - PS" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Montreal Congnitive Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.MOCA')) {

                /* CreateOrUpdate Montreal Cognitive Assessment - MOCA via Main Listing */
                $stateProvider.state('tenant.mocaDetail', {
                    url: '/mocaAssessment/:template/:description/:assessment/:id',
                    template: '<moca-detail-view></moca-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Montreal Cognitive Assessment - MOCA',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Montreal Cognitive Assessment - MOCA" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Montreal Cognitive Assessment - MOCA via Person */
                $stateProvider.state('tenant.mocaDetailPersonMode', {
                    url: '/mocaAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<moca-detail-view></moca-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Montreal Cognitive Assessment - MOCA',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Montreal Cognitive Assessment - MOCA" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }

            //Global Deterioration Scale Assessment
            if (abp.auth.hasPermission('Pages.Tenant.Assessment.GLDS')) {

                /* CreateOrUpdate Global Deterioration Scale - GDS via Main Listing */
                $stateProvider.state('tenant.gldsDetail', {
                    url: '/gldsAssessment/:template/:description/:assessment/:id',
                    template: '<glds-detail-view></glds-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Global Deterioration Scale - GDS',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Global Deterioration Scale - GDS" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment) {
                                return 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });

                /* CreateOrUpdate Global Deterioration Scale - GDS via Person */
                $stateProvider.state('tenant.gldsDetailPersonMode', {
                    url: '/gldsAssessment/:template/:description/:assessment/:id/:referralId/:personId',
                    template: '<glds-detail-view></glds-detail-view>',
                    ncyBreadcrumb: {
                        state: 'Global Deterioration Scale - GDS',
                        label: function ($scope, $stateParams, $breadcrumbService) {
                            return { "default": "Global Deterioration Scale - GDS" };
                        },
                        parent: function ($scope, $stateParams, $breadcrumbService) {
                            if ($stateParams.assessment && $stateParams.template == 'person') {
                                return $stateParams.personId ? 'tenant.personDetail({id: "' + $stateParams.personId + '"})' : 'tenant.assessment({assessment: "' + $stateParams.assessment + '"' + ', description: "' + $stateParams.description + '"})';
                            } else if ($stateParams.assessment && $stateParams.template == 'referral') {
                                return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                            } else {
                                return 'tenant.dashboard.careboard';
                            }
                        },
                        callFromService: true
                    }
                });
            }
        }

        //Hospitalization
        if (abp.auth.hasPermission('Pages.Tenant.Hospitalization')) {
            $stateProvider.state('tenant.hospitalization', {
                url: '/hospitalization',
                templateUrl: '~/App/tenant/views/hospitalization/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: 'Clinical \uA789 Hospitalization',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.hospitalizationNew', {
                url: '/hospitalization/',
                templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: "New Hospitalization",
                    parent: 'tenant.hospitalization',
                }
            });

            $stateProvider.state('tenant.hospitalizationPersonDetail', {
                url: '/hospitalization/:id/:personId',
                templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: { "servive": "getPersonNameFromHospitalizationId", "param": "id", "prefix": "", "alt": "Hospitalization-Record" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.hospitalizationPersonDetailPersonNew', {
                url: '/hospitalization//:personId',
                templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: { "default": "New Hospitalization" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.hospitalizationPersonDetailNew', {
                url: '/hospitalization//:personId',
                templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: "New Hospitalization",
                    parent: 'tenant.hospitalization',
                    callFromService: true
                }
            });

            //$stateProvider.state('tenant.hospitalizationDetail', {
            //    url: '/hospitalization/:id',
            //    templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
            //    ncyBreadcrumb: {
            //        state: 'Hospitalization',
            //        label: { "servive": "getPersonNameFromHospitalizationId", "param": "id", "prefix": "", "alt": "Hospitalization-Record" },
            //        parent: 'tenant.hospitalization',
            //        callFromService: true
            //    }
            //});

            $stateProvider.state('tenant.hospitalizationDetail', {
                url: '/hospitalization/:id?personId',
                templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: { "servive": "getPersonNameFromHospitalizationId", "param": "id", "prefix": "", "alt": "Hospitalization-Record" },

                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        debugger;
                        if (typeof $stateParams.personId != 'undefined' && typeof $stateParams.referralId == 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                        } else if (typeof $stateParams.referralId != 'undefined' && typeof $stateParams.personId != 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                        } else {
                            return 'tenant.hospitalization';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.hospitalizationDetailNew', {
                url: '/hospitalization/',
                templateUrl: '~/App/tenant/views/hospitalization/hospitalizationView.cshtml',
                ncyBreadcrumb: {
                    state: 'Hospitalization',
                    label: "Add Hospitalization",
                    parent: 'tenant.hospitalization',
                }
            });
        }



        // Social Reports
        if (abp.auth.hasPermission('Pages.Tenant.SocialReports')) {
            $stateProvider.state('tenant.socialReports', {
                url: '/socialReports',
                templateUrl: '~/App/tenant/views/socialReports/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Social Reports',
                    label: 'Social Reports',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.socialReportNew', {
                url: '/socialReport?personId&referralId',
                templateUrl: '~/App/tenant/views/socialReports/socialReportsView.cshtml',
                ncyBreadcrumb: {
                    state: 'Social Report',
                    label: { "default": "New Social Report" },
                    parent: 'tenant.socialReports',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.socialReportReferral', {
                url: '/socialReport/:socialId/:referralId',
                templateUrl: '~/App/tenant/views/socialReports/socialReportsView.cshtml',
                ncyBreadcrumb: {
                    state: 'Social Report',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.socialId != 'undefined') {
                            return { "servive": "getPersonNameFromSocialReportId", "param": "socialId", "prefix": "Social Report", "alt": "Social Reports" };
                        } else {
                            return { "default": "New Social Report" };
                        }
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.socialReportPersonReferral', {
                url: '/socialReport/:socialId?personId&referralId',
                templateUrl: '~/App/tenant/views/socialReports/socialReportsView.cshtml',
                ncyBreadcrumb: {
                    state: 'Social Report',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.socialId != 'undefined') {
                            return { "servive": "getPersonNameFromSocialReportId", "param": "socialId", "prefix": "Social Report", "alt": "Social Reports" };
                        } else {
                            return { "default": "New Social Report" };
                        }
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if ($stateParams.referralId) {
                            return 'tenant.referralDetail({id: "' + $stateParams.referralId + '"})';
                        } else if ($stateParams.personId) {
                            return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                        } else {
                            return 'tenant.socialReports';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.socialReport', {
                url: '/socialReport/:socialId',
                templateUrl: '~/App/tenant/views/socialReports/socialReportsView.cshtml',
                ncyBreadcrumb: {
                    state: 'Social Report',
                    label: { "servive": "getPersonNameFromSocialReportId", "param": "socialId", "prefix": "", "alt": "Social Reports" },
                    parent: 'tenant.socialReports',
                    callFromService: true
                }
            });
        }

        //VitalSigns
        if (abp.auth.hasPermission('Pages.Tenant.VitalSign')) {
            $stateProvider.state('tenant.vitalSign', {
                url: '/vitalsign',
                templateUrl: '~/App/tenant/views/vitalSigns/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Vital Sign',
                    label: 'Vital Signs',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.vitalSignChart', {
                url: '/vitalsign-Chart/:personId/:filter',
                templateUrl: '~/App/tenant/views/vitalSigns/vitalSignCharts/viewChart.cshtml',
                ncyBreadcrumb: {
                    state: 'Vital Sign Chart',
                    label: "Vital Sign Chart",
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                    },
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.Centre')) {
            $stateProvider.state('tenant.centre', {
                url: '/centre',
                templateUrl: '~/App/tenant/views/centreServiceType/centre.cshtml',
                ncyBreadcrumb: {
                    state: 'Centre',
                    label: 'Master Data \uA789 Centres',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.ServiceType')) {
            $stateProvider.state('tenant.serviceType', {
                url: '/servicetype',
                templateUrl: '~/App/tenant/views/centreServiceType/serviceType.cshtml',
                ncyBreadcrumb: {
                    state: 'Service Type',
                    label: 'Master Data \uA789 Service Type',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.CentreServiceType')) {
            $stateProvider.state('tenant.centreServiceType', {
                url: '/centreservicetype',
                templateUrl: '~/App/tenant/views/centreServiceType/centreServiceType.cshtml',
                ncyBreadcrumb: {
                    state: 'CentreServiceType',
                    label: 'Master Data \uA789 Centre Service Type',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.MutuallyExclusiveServceType')) {
            $stateProvider.state('tenant.mutuallyExclusiveServiceType', {
                url: '/mutuallyexclusiveservicetype',
                templateUrl: '~/App/tenant/views/centreServiceType/mutuallyExclusiveServiceType.cshtml',
                ncyBreadcrumb: {
                    state: 'MutuallyExclusiveServceType',
                    label: 'Master Data \uA789 Mutually Exclusive Servce Type',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Tenant.MasterDataLookup')) {
            $stateProvider.state('tenant.masterlookup', {
                url: '/masterlookup',
                templateUrl: '~/App/tenant/views/masterdatalookup/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Masterlookup',
                    label: 'Master Data \uA789 Masterlookup',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Host.MasterData')) {
            $stateProvider.state('host.masterdata', {
                url: '/masterdata',
                templateUrl: '~/App/host/views/masterdata/index.cshtml',
                ncyBreadcrumb: {
                    state: 'MasterData',
                    label: 'Master Data',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Tenant.Settings')) {
            $stateProvider.state('tenant.settings', {
                url: '/settings',
                templateUrl: '~/App/tenant/views/settings/index.cshtml',
                ncyBreadcrumb: {
                    state: 'settings',
                    label: 'Settings',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Administration.Teams')) {
            $stateProvider.state('teams', {
                url: '/teams',
                templateUrl: '~/App/common/views/teams/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Teams',
                    label: 'Teams',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        $stateProvider.state('sample', {
            url: '/sample',
            templateUrl: '~/App/host/views/example/angularsample.cshtml'
        });

        if (abp.auth.hasPermission('Pages.Tenant.MeansTests')) {
            $stateProvider.state('tenant.meansTests', {
                url: '/meanstests',
                templateUrl: '~/App/tenant/views/meanstests/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Means Test',
                    label: 'Social \uA789 Means Test',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.meansTestsNew', {
                url: '/meanstests/?person&referral&referralservicetype&admission',
                template: '<meanstest-new></meanstest-new>',
                ncyBreadcrumb: {
                    state: 'Means Test',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        return { "default": "New Means Test" };
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        debugger;
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else if (typeof $stateParams.referral != 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referral + '"})';
                        } else {
                            return 'tenant.meansTests';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.meansTestsEdit', {
                url: '/meanstests/:id?referral&admission&person',
                template: '<meanstest-edit></meanstest-edit>',
                ncyBreadcrumb: {
                    state: 'Means Test',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined' && typeof $stateParams.referral == 'undefined') {
                            return { "default": "Means Test" };
                        } else if (typeof $stateParams.referral != 'undefined' && typeof $stateParams.person == 'undefined') {
                            return { "servive": "getPersonFromReferralId", "param": "referral", "prefix": "", "alt": "Means Test" };
                        } else {
                            return { "servive": "getPersonFromMeansTestId", "param": "id", "prefix": "", "alt": "Means Test" };
                        }
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else if (typeof $stateParams.referral != 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referral + '"})';
                        } else {
                            return 'tenant.meansTests';
                        }
                    },
                    callFromService: true
                }
            });
        }

        // Financial Assistances
        if (abp.auth.hasPermission('Pages.Tenant.FinancialAssistances')) {
            $stateProvider.state('tenant.financialAssistances', {
                url: '/financialassistances',
                templateUrl: '~/App/tenant/views/financialAssistances/index.cshtml',
                ncyBreadcrumb: {
                    state: 'FinancialAssistances',
                    label: 'Social \uA789 Financial Assistances',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.financialAssistancesNew', {
                url: '/financialassistances/?person&referral',
                template: '<financialassistance-new></financialassistance-new>',
                ncyBreadcrumb: {
                    state: 'Financial Assistance',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        return { "default": "New Financial Assistance" };
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else if (typeof $stateParams.referral != 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referral + '"})';
                        } else if (typeof $stateParams.referralservicetype != 'undefined') {
                            return 'tenant.financialAssistances';
                        } else {
                            return 'tenant.financialAssistances';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.financialAssistancesViewPerson', {
                url: '/financialassistances/viewperson/:id',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'FinancialAssistance',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "", "alt": "Person-Record" },
                    parent: 'tenant.financialAssistances',
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.financialAssistancesEdit', {
                url: '/financialassistances/:id?referral&person',
                template: '<financialassistance-edit></financialassistance-edit>',
                ncyBreadcrumb: {
                    state: 'Financial Assistance',
                    label: { "default": "Financial Assistance" },
                    //label: function ($scope, $stateParams, $breadcrumbService) {
                    //    if (typeof $stateParams.person != 'undefined' && typeof $stateParams.referral == 'undefined') {
                    //        return { "servive": "getFinancialDetailsFromPerson", "param": "id", "prefix": "", "alt": "Financial Assistance" };
                    //    } else if (typeof $stateParams.referral != 'undefined' && typeof $stateParams.person == 'undefined') {
                    //        return { "servive": "getFinancialDetailsFromReferral", "param": "id", "prefix": "", "alt": "Financial Assistance" };
                    //    } else if (typeof $stateParams.person == 'undefined' && typeof $stateParams.referral == 'undefined') {
                    //        return { "servive": "getFinancialDetailsFromId", "param": "id", "prefix": "", "alt": "Financial Assistance" };
                    //    }
                    //},
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined' && typeof $stateParams.referral == 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else if (typeof $stateParams.referral != 'undefined' && typeof $stateParams.person == 'undefined') {
                            return 'tenant.referralDetail({id: "' + $stateParams.referral + '"})';
                        } else {
                            return 'tenant.financialAssistances';
                        }
                    },
                    callFromService: true
                }
            });
        }

        // Financial Assistance Types
        if (abp.auth.hasPermission('Pages.Tenant.FinancialAssistanceTypes')) {
            $stateProvider.state('tenant.financialAssistanceTypes', {
                url: '/financialAssistanceTypes',
                templateUrl: '~/App/tenant/views/financialAssistanceTypes/index.cshtml',
                ncyBreadcrumb: {
                    state: 'FinancialTypes',
                    label: 'Master Data \uA789 Financial Types',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.VisitLogs')) {
            $stateProvider.state('tenant.visitLogs', {
                url: '/contactlogs',
                template: '<visitlogs></visitlogs>',
                ncyBreadcrumb: {
                    state: 'Contact Log',
                    label: 'Clinical \uA789 Contact Logs',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.visitLogsNew', {
                url: '/contactlogs/?person',
                template: '<visitlog-new></visitlog-new>',
                ncyBreadcrumb: {
                    state: 'Contact Log',
                    label: { "default": "New Contact Log" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else {
                            return 'tenant.visitLogs';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.visitLogsEdit', {
                url: '/contactlogs/:id?person',
                template: '<visitlog-edit></visitlog-edit>',
                ncyBreadcrumb: {
                    state: 'Contact Log',
                    label: { "default": "Contact Log" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else {
                            return 'tenant.visitLogs';
                        }
                    },
                    callFromService: true
                }
            });

            // Visit Types
            $stateProvider.state('tenant.visitTypes', {
                url: '/visittypes',
                templateUrl: '~/App/tenant/views/visitTypes/index.cshtml',
                ncyBreadcrumb: {
                    state: 'visitTypes',
                    label: 'Master Data \uA789 Visit Types',
                    parent: 'tenant.dashboard.home',
                }
            });

            // Visit Services
            $stateProvider.state('tenant.visitServices', {
                url: '/visitservice',
                templateUrl: '~/App/tenant/views/visitServices/index.cshtml',
                ncyBreadcrumb: {
                    state: 'VisitServices',
                    label: 'Master Data \uA789 Visit Services',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        //Prescriptions
        $stateProvider.state('tenant.prescriptionNew', {
            url: '/prescriptions/?person',
            template: '<prescription-detail></prescription-detail>'
        });

        // Audit Log
        if (abp.auth.hasPermission('Pages.Tenant.AuditLog')) {
            $stateProvider.state('tenant.auditLogs', {
                url: '/auditLogs',
                templateUrl: '~/App/tenant/views/auditlog/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Audit Logs',
                    label: 'Audit Logs',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        //Drug Sources
        if (abp.auth.hasPermission('Pages.Tenant.Prescriptions')) {
            $stateProvider.state('tenant.drugSources', {
                url: '/drugSources',
                templateUrl: '~/App/tenant/views/drugSources/index.cshtml',
                ncyBreadcrumb: {
                    state: 'drugSources',
                    label: 'Master Data \uA789 Drug Sources',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        //Drug Routes
        if (abp.auth.hasPermission('Pages.Tenant.Prescriptions')) {
            $stateProvider.state('tenant.drugRoutes', {
                url: '/drugRoutes',
                templateUrl: '~/App/tenant/views/drugRoutes/index.cshtml',
                ncyBreadcrumb: {
                    state: 'drugRoutes',
                    label: 'Master Data \uA789 Drug Routes',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        //Drug Frequencies
        if (abp.auth.hasPermission('Pages.Tenant.Prescriptions')) {
            $stateProvider.state('tenant.drugFrequencies', {
                url: '/drugFrequencies',
                templateUrl: '~/App/tenant/views/drugFrequencies/index.cshtml',
                ncyBreadcrumb: {
                    state: 'drugFrequencies',
                    label: 'Master Data \uA789 Drug Frequencies',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        //Drugs
        if (abp.auth.hasPermission('Pages.Tenant.Prescriptions')) {
            $stateProvider.state('tenant.drugs', {
                url: '/drugs',
                templateUrl: '~/App/tenant/views/drugs/index.cshtml',
                ncyBreadcrumb: {
                    state: 'drugs',
                    label: 'Master Data \uA789 Drugs',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        //Unit of Measurement
        if (abp.auth.hasPermission('Pages.Tenant.Prescriptions')) {
            $stateProvider.state('tenant.unitOfMeasurements', {
                url: '/unitOfMeasurements',
                templateUrl: '~/App/tenant/views/unitOfMeasurements/index.cshtml',
                ncyBreadcrumb: {
                    state: 'unitOfMeasurements',
                    label: 'Master Data \uA789 Unit Of Measurements',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Person Problems
        if (abp.auth.hasPermission('Pages.Tenant.PersonProblems')) {
            $stateProvider.state('tenant.personProblemsEdit', {
                url: '/personProblems/:id?person',
                template: '<problemlist-detail></problemlist-detail>'
            });

            $stateProvider.state('tenant.problemList', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "ProblemList", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });
        }

        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.carePlan', {
                url: '/id:*',
                templateUrl: '~/App/tenant/views/person/personView.cshtml',
                ncyBreadcrumb: {
                    state: 'Person',
                    label: { "servive": "getPersonName", "param": "id", "prefix": "CarePlan", "alt": "Person-Record" },
                    parent: 'tenant.dashboard.careboard',
                    callFromService: true
                }
            });
        }

        //Care Plan Types
        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.carePlanTypes', {
                url: '/carePlanTypes',
                templateUrl: '~/App/tenant/views/carePlanTypes/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Care Plan Types',
                    label: 'Master Data \uA789 Care Plan Types',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        //Problems
        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.problems', {
                url: '/problems',
                templateUrl: '~/App/tenant/views/problems/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Problems',
                    label: 'Master Data \uA789 Problems',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Goals
        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.goals', {
                url: '/goals',
                templateUrl: '~/App/tenant/views/goals/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Goals',
                    label: 'Master Data \uA789 Goals',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Interventions
        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.interventions', {
                url: '/interventions',
                templateUrl: '~/App/tenant/views/interventions/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Interventions',
                    label: 'Master Data \uA789 Interventions',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Problem Goals
        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.problemGoals', {
                url: '/problemGoals',
                templateUrl: '~/App/tenant/views/problemGoals/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Problem Goals',
                    label: 'Master Data \uA789 Problem Goals',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Goal Interventions
        if (abp.auth.hasPermission('Pages.Tenant.CarePlans')) {
            $stateProvider.state('tenant.goalInterventions', {
                url: '/goalInterventions',
                templateUrl: '~/App/tenant/views/goalInterventions/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Goal Interventions',
                    label: 'Master Data \uA789 Goal Interventions',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Progress Note Types
        if (abp.auth.hasPermission('Pages.Tenant.ProgressNotes')) {
            $stateProvider.state('tenant.progressNoteTypes', {
                url: '/progressNoteTypes',
                templateUrl: '~/App/tenant/views/progressNoteTypes/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Progress Note Types',
                    label: 'Master Data \uA789 Progress Note Types',
                    parent: 'tenant.dashboard.home',
                }
            });
        };

        // Activities & Events Booking and Attendance 
        if (abp.auth.hasPermission('Pages.Tenant.MembershipBookings')) {
            $stateProvider.state('tenant.activitiesAttendance', {
                url: '/activities/attendance',
                template: '<activities-attendance></activities-attendance>',
                ncyBreadcrumb: {
                    state: 'Activity Attendance',
                    label: 'Social \uA789 Activity Attendance',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        // Activity & Event Category
        if (abp.auth.hasPermission('Pages.Tenant.ActivitiesEvents')) {
            $stateProvider.state('tenant.activitiesEvents', {
                url: '/activitiesEvents',
                templateUrl: '~/App/tenant/views/activitiesEvents/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Activity & Event Category',
                    label: 'Master Data \uA789 Activity & Event Category',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        // Activities
        if (abp.auth.hasPermission('Pages.Tenant.Activities')) {
            $stateProvider.state('tenant.activities', {
                url: '/activities',
                templateUrl: '~/App/tenant/views/activities/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Activity Master',
                    label: 'Master Data \uA789 Activity Master',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        // Person Groups
        if (abp.auth.hasPermission('Pages.Tenant.CentrePersonGroups')) {
            $stateProvider.state('tenant.centrePersonGroups', {
                url: '/centrepersongroups',
                template: '<centre-person-groups></centre-person-groups>',
                ncyBreadcrumb: {
                    state: 'Person Group',
                    label: 'Master Data \uA789 Person Group',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.centrePersonGroupsNew', {
                url: '/centrepersongroup/',
                template: '<centre-person-groups-new></centre-person-groups-new>',
                ncyBreadcrumb: {
                    state: 'Person Group',
                    label: 'New Person Group',
                    parent: 'tenant.centrePersonGroups'
                }
            });

            $stateProvider.state('tenant.centrePersonGroupsEdit', {
                url: '/centrepersongroup/:id',
                template: '<centre-person-groups-edit></centre-person-groups-edit>',
                ncyBreadcrumb: {
                    state: 'Person Group',
                    label: 'Person Group',
                    parent: 'tenant.centrePersonGroups'
                }
            });
        };

        //Medical Appointment
        if (abp.auth.hasPermission('Pages.Tenant.MedicalAppointment')) {
            $stateProvider.state('tenant.medicalAppointment', {
                url: '/medicalAppointment',
                params: { close: "" },
                templateUrl: '~/App/tenant/views/medicalappointment/index.cshtml',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: 'Medical Appointment',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.medicalAppointmentPersonDetail', {
                url: '/medicalAppointment/:id/:personId',
                params: { close: "" },
                templateUrl: '~/App/tenant/views/medicalappointment/medicalAppointmentView.cshtml',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    //label: { "servive": "getPersonNameFromHospitalizationId", "param": "id", "prefix": "", "alt": "Hospitalization-Record" },
                    label: { "servive": "getPersonNameFromMedicalAppointment", "param": "id", "prefix": "", "alt": "MedicalAppointment-Record" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                    },
                    callFromService: true
                }
            });

            // Add Medical Appointment via Person [Create]
            $stateProvider.state('tenant.medicalAppointmentPersonDetailPersonNew', {
                url: '/medicalAppointment//:personId',
                params: { close: "" },
                templateUrl: '~/App/tenant/views/medicalappointment/medicalAppointmentView.cshtml',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: { "default": "New Medical Appointment" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        return 'tenant.personDetail({id: "' + $stateParams.personId + '"})';
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.medicalAppointmentPersonDetailNew', {
                url: '/medicalAppointment//:personId',
                params: { close: "" },
                templateUrl: '~/App/tenant/views/medicalappointment/medicalAppointmentView.cshtml',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: "New Medical Appointment",
                    parent: 'tenant.medicalAppointment',
                    callFromService: true
                }
            });
            // Add Medical Appointment via Clinical Menu Listing [Create]
            $stateProvider.state('tenant.medicalAppointmentDetailNew', {
                url: '/medicalAppointment/',
                params: { close: "" },
                templateUrl: '~/App/tenant/views/medicalappointment/medicalAppointmentView.cshtml',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: "Add Medical Appointment",
                    parent: 'tenant.medicalAppointment',
                }
            });
            // View Medical Appointment via Clinical Menu Listing [View]
            $stateProvider.state('tenant.medicalAppointmentDetail', {
                url: '/medicalAppointment/:id',
                params: { close: "" },
                templateUrl: '~/App/tenant/views/medicalappointment/medicalAppointmentView.cshtml',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: { "servive": "getPersonNameFromMedicalAppointment", "param": "id", "prefix": "", "alt": "MedicalAppointment-Record" },
                    //label: { "param": "id", "prefix": "", "alt": "MedicalAppointment-Record" },
                    parent: 'tenant.medicalAppointment',
                    callFromService: true
                }
            });
        }

        // Medical Appointment Refactored Component
        if (abp.auth.hasPermission('Pages.Tenant.MedicalAppointment')) {
            $stateProvider.state('tenant.medicalappointments', {
                url: '/medicalappointments',
                template: '<medicalappointments></medicalappointments>',
                ncyBreadcrumb: {
                    state: 'Medical Appointments',
                    label: 'Medical Appointments',
                    parent: 'tenant.dashboard.home'
                }
            });

            $stateProvider.state('tenant.medicalAppointmentNew', {
                url: '/medicalappointments/?personId',
                template: '<medicalappointment-new></medicalappointment-new>',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: { "default": "New Medical Appointment" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else {
                            return 'tenant.medicalappointments';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.medicalAppointmentEdit', {
                url: '/medicalappointments/:id?personId',
                template: '<medicalappointment-edit></medicalappointment-edit>',
                ncyBreadcrumb: {
                    state: 'Medical Appointment',
                    label: { "default": "Medical Appointment" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if (typeof $stateParams.person != 'undefined') {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else {
                            return 'tenant.medicalappointments';
                        }
                    },
                    callFromService: true
                }
            });
        }
        // Report Listing
        $stateProvider.state('tenant.report', {
            url: '/report',
            templateUrl: '~/App/tenant/views/report/index.cshtml',
            ncyBreadcrumb: {
                state: 'Report',
                label: 'Report',
                parent: 'tenant.dashboard.home'
            }
        });

        // ReportsConfiguration
        if (abp.auth.hasPermission('Pages.Tenant.ReportsConfiguration')) {
            $stateProvider.state('tenant.reportsConfiguration', {
                url: '/reportsConfiguration',
                templateUrl: '~/App/tenant/views/reportsConfiguration/index.cshtml',
                ncyBreadcrumb: {
                    state: 'ReportsConfiguration',
                    label: 'Reports Configuration',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        // ReportsPermission
        if (abp.auth.hasPermission('Pages.Tenant.ReportsPermission')) {
            $stateProvider.state('tenant.reportsPermission', {
                url: '/reportsPermission',
                templateUrl: '~/App/tenant/views/reportsPermission/index.cshtml',
                ncyBreadcrumb: {
                    state: 'ReportsPermission',
                    label: 'Reports Permission',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        // Slider
        if (abp.session.tenantId) {
            $stateProvider.state('tenant.userFavouriteMenuSettings', {
                url: '/settings/userFavouriteMenu',
                templateUrl: '~/App/tenant/views/settings/slider/userFavouriteMenu.cshtml',
                ncyBreadcrumb: {
                    state: 'Customize Favourite List',
                    label: "Customize Favourite List",
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        // Investigation
        if (abp.auth.hasPermission('Pages.Tenant.Investigations')) {
            $stateProvider.state('tenant.investigationsNew', {
                url: '/investigations/?person&referral',
                template: '<investigation-new></investigation-new>',
                ncyBreadcrumb: {
                    state: 'Investigation',
                    label: function ($scope, $stateParams, $breadcrumbService) {
                        return { "default": "New Investigation" };
                    },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if ($stateParams.person) {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else if ($stateParams.referral) {
                            return 'tenant.referralDetail({id: "' + $stateParams.referral + '"})';
                        }
                    },
                    callFromService: true
                }
            });

            $stateProvider.state('tenant.investigationsEdit', {
                url: '/investigations/:id?person&referral',
                template: '<investigation-edit></investigation-edit>',
                ncyBreadcrumb: {
                    state: 'Investigation',
                    label: { "default": "Investigation" },
                    parent: function ($scope, $stateParams, $breadcrumbService) {
                        if ($stateParams.person) {
                            return 'tenant.personDetail({id: "' + $stateParams.person + '"})';
                        } else if ($stateParams.referral) {
                            return 'tenant.referralDetail({id: "' + $stateParams.referral + '"})';
                        }
                    },
                    callFromService: true
                }
            });
        }

        // ILTC File Generator
        if (abp.auth.hasPermission('Pages.Tenant.ILTC.FileGenerator')) {
            $stateProvider.state('tenant.iltcFileGenerator', {
                url: '/iltcFileGenerator',
                template: '<iltc-file-generator></iltc-file-generator>',
                ncyBreadcrumb: {
                    state: 'ILTCFileGenerator',
                    label: 'ILTC File Generator',
                    parent: 'tenant.dashboard.home'
                }
            });
        }




        // ILTC MOH Master Code Mappings
        if (abp.auth.hasPermission('Pages.Tenant.ILTC.MOHMasterCodeMapping')) {
            $stateProvider.state('tenant.mohMasterCodeMappings', {
                url: '/mohMasterCodeMapping',
                templateUrl: '~/App/tenant/views/mohMasterCodeMappings/index.cshtml',
                ncyBreadcrumb: {
                    state: 'MOHMasterCodeMappings',
                    label: 'MOH Master Code Mapping',
                    parent: 'tenant.dashboard.home'
                }
            });
        }
        //Event Setup
        if (abp.auth.hasPermission('Pages.Tenant.Events')) {
            $stateProvider.state('tenant.eventSetupList', {
                url: '/events',
                template: '<event-registration-index></event-registration-index>',
                ncyBreadcrumb: {
                    state: 'EventSetup',
                    label: "Event Booking & Attendance",
                    parent: 'tenant.dashboard.home',
                }
            });

            $stateProvider.state('tenant.newCentreEvent', {
                url: '/EventRegistration/',
                template: '<centre-event-new></centre-event-new>',
                ncyBreadcrumb: {
                    state: 'Centre Event',
                    label: 'New Event Booking & Attendance',
                    parent: 'tenant.eventSetupList'
                }
            });


            $stateProvider.state('tenant.editCentreEvent', {
                url: '/EventRegistration/:id',
                template: '<centre-event-edit></centre-event-edit>',
                ncyBreadcrumb: {
                    state: 'Centre Event',
                    label: 'Event Booking & Attendance',
                    parent: 'tenant.eventSetupList'
                }
            });
        }

        // Special Arrangements
        if (abp.auth.hasPermission('Pages.Tenant.TransportSpecialArrangements')) {
            $stateProvider.state('tenant.transportSpecialArrangements', {
                url: '/transportspecialarrangements',
                templateUrl: '~/App/tenant/views/transports/specialArrangements/index.cshtml',
                ncyBreadcrumb: {
                    state: 'TransportSpecialArrangements',
                    label: 'Master Data \uA789 Special Arrangements',
                    parent: 'tenant.dashboard.home',
                }
            });
        }

        // Transport Requisition
        if (abp.auth.hasPermission('Pages.Tenant.TransportRequisitions')) {
            $stateProvider.state('tenant.transportrequisitionsNew', {
                url: '/transportrequisitions/',
                template: '<transportrequisition-new></transportrequisition-new>',
                ncyBreadcrumb: {
                    state: 'TransportRequisition',
                    label: "New Transport Requisition",
                    parent: 'tenant.transportrequisitions'
                }
            });

            $stateProvider.state('tenant.transportrequisitionsEdit', {
                url: '/transportrequisitions/:id',
                template: '<transportrequisition-edit></transportrequisition-edit>',
                ncyBreadcrumb: {
                    state: 'TransportRequisition',
                    label: "Transport Requisition",
                    parent: 'tenant.transportrequisitions'
                }
            });

            $stateProvider.state('tenant.transportrequisitions', {
                url: '/transportrequisitions',
                template: '<transportrequisitions></transportrequisitions>',
                ncyBreadcrumb: {
                    state: 'TransportRequisition',
                    label: 'Transports \uA789 Transport Requisitions',
                    parent: 'tenant.dashboard.home'
                }
            });
        }

        //$qProvider settings
        $qProvider.errorOnUnhandledRejections(false);
    }
]);

appModule.run(["$rootScope", "settings", "$state", 'i18nService', '$uibModalStack', '$previousState', function ($rootScope, settings, $state, i18nService, $uibModalStack, $previousState) {
    $rootScope.$state = $state;
    $rootScope.$settings = settings;

    $rootScope.$on('$stateChangeSuccess', function () {
        $uibModalStack.dismissAll();
    });

    //Set Ui-Grid language
    if (i18nService.get(abp.localization.currentCulture.name)) {
        i18nService.setCurrentLang(abp.localization.currentCulture.name);
    } else {
        i18nService.setCurrentLang("en");
    }

    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.close = function () {
        if ($previousState.get() != null && $state.current.name != $previousState.get().state.name) {
            $previousState.go()
        }
        else {
            //TODO:
            //If nothing go to home
            $state.go("tenant.dashboard.home");
            //or else we can put "/"
        }
    }
}]);

