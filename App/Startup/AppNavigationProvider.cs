using Abp.Application.Navigation;
using Abp.Localization;
using Pulsesync.IngoTPCC.Authorization;
using Pulsesync.IngoTPCC.Web.Navigation;

namespace Pulsesync.IngoTPCC.Web.App.Startup
{
    /// <summary>
    /// This class defines menus for the application.
    /// It uses ABP's menu system.
    /// When you add menu items here, they are automatically appear in angular application.
    /// See .cshtml and .js files under App/Main/views/layout/header to know how to render menu.
    /// </summary>
    public class AppNavigationProvider : NavigationProvider
    {
        public override void SetNavigation(INavigationProviderContext context)
        {

            context.Manager.MainMenu

            #region SocialTab
            //Social Tab
            .AddItem(new MenuItemDefinition(
                PageNames.App.MenuTabs.Social,
                L("Social"),
                icon: "icon-globe"
                )
            // Social.General
            #region Social.General
            .AddItem(new MenuItemDefinition(
                    PageNames.App.MenuTabs.Administration,
                    L("General"),
                    icon: "glyphicon glyphicon-user"
                    ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.FamilyMembers,
                    L("FamilyMembersCaregiver"),
                    url: "tenant.familyMembers",
                    icon: "glyphicon glyphicon-user",
                    requiredPermissionName: AppPermissions.Pages_Tenant_FamilyMembers,
                    customData: new MenuCustomData() { CardNavigationHashKey = "tab_PersonDetails+key_FamilyMembersCaregiver" }
                    )
                ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.SocialReports,
                    L("SocialReport"),
                    url: "tenant.socialReports",
                    icon: "glyphicon glyphicon-list-alt",
                    requiredPermissionName: AppPermissions.Pages_Tenant_SocialReports,
                    customData: new MenuCustomData()
                    )
                ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.MeansTests,
                    L("MeansTest"),
                    url: "tenant.meansTests",
                    icon: "glyphicon glyphicon-list-alt",
                    requiredPermissionName: AppPermissions.Pages_Tenant_MeansTests,
                    customData: new MenuCustomData() { CardNavigationHashKey = "tab_PersonDetails+key_MeansTest" }
                    )
                ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.FinancialAssistances,
                    L("FinancialAssistance"),
                    url: "tenant.financialAssistances",
                    icon: "glyphicon glyphicon-list-alt",
                    requiredPermissionName: AppPermissions.Pages_Tenant_FinancialAssistances,
                    customData: new MenuCustomData() { CardNavigationHashKey = "tab_PersonDetails+key_FinancialAssistance" }
                    )
                )
            )
            #endregion

            // Social.Membership
            #region Social.Membership
            .AddItem(new MenuItemDefinition(
                    PageNames.App.MenuTabs.Administration,
                    L("Membership"),
                    icon: "glyphicon glyphicon-user"
                ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.Memberships,
                    L("Registration"),
                    url: "tenant.memberships",
                    icon: "glyphicon glyphicon-list-alt",
                    requiredPermissionName: AppPermissions.Pages_Tenant_Memberships,
                    customData: new MenuCustomData() { CardNavigationHashKey = "tab_PersonDetails+key_Membership" }
                    )
                ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.EventSetup,
                    L("EventBookingAttendance"),
                    url: "tenant.eventSetupList",
                    icon: "glyphicon glyphicon-list-alt",
                    requiredPermissionName: AppPermissions.Pages_Tenant_Events,
                    customData: new MenuCustomData()
                    )
                ).AddItem(new MenuItemDefinition(
                    PageNames.App.Tenant.ActivitiesAttendance,
                    L("ActivityAttendance"),
                    url: "tenant.activitiesAttendance",
                    icon: "glyphicon glyphicon-list-alt",
                    requiredPermissionName: AppPermissions.Pages_Tenant_MembershipBookings,
                    customData: new MenuCustomData()
                    )
                )
            )
            #endregion
            )
            #endregion SocialTab

            #region ClinicalTab
            //Clinical Tab
            .AddItem(new MenuItemDefinition(
                PageNames.App.MenuTabs.Clinical,
                L("Clinical"),
                icon: "icon-grid"
                )
            //Clinical.Administration
            #region Clinical.Administration
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Administration,
                         L("Administration"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.IRMSReferral,
                             L("IRMSReferral"),
                             url: "tenant.irms",
                             icon: "ps-icon-aic-sg",
                             requiredPermissionName: AppPermissions.Pages_Tenant_IRMSReferral_View,
                             customData: new MenuCustomData()
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Referral,
                             L("Referral"),
                             url: "tenant.referral",
                             icon: "glyphicon glyphicon-user",
                             requiredPermissionName: AppPermissions.Pages_Tenant_Referral,
                             customData: new MenuCustomData()
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Admission,
                             L("AdmissionNDischarge"),
                             url: "tenant.admission",
                             icon: "glyphicon glyphicon-user",
                             requiredPermissionName: AppPermissions.Pages_Tenant_AdmissionAndDischarge,
                             customData: new MenuCustomData()
                             )
                        )
                    )
            #endregion

            //Clinical.Encounter
            #region Clinical.Encounter
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.EncounterAndMovement,
                         L("EncounterAndMovement"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                              PageNames.App.Tenant.VisitLogs,
                             L("VisitLog"),
                             url: "tenant.visitLogs",
                             icon: "glyphicon glyphicon-list-alt",
                             requiredPermissionName: AppPermissions.Pages_Tenant_VisitLogs,
                             customData: new MenuCustomData() { CardNavigationHashKey = "tab_Encounter+key_VisitLog" }
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Hospitalization,
                             L("Hospitalization"),
                             url: "tenant.hospitalization",
                             icon: "glyphicon glyphicon-list-alt",
                             requiredPermissionName: AppPermissions.Pages_Tenant_Hospitalization,
                             customData: new MenuCustomData() { CardNavigationHashKey = "tab_Encounter+key_Hospitalization" }
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.MedicalAppointment,
                             L("MedicalAppointment"),
                             url: "tenant.medicalappointments",
                             icon: "glyphicon glyphicon-list-alt",
                             requiredPermissionName: AppPermissions.Pages_Tenant_MedicalAppointment,
                             customData: new MenuCustomData() { CardNavigationHashKey = "tab_Encounter+key_MedicalAppointment" }
                             )
                        )
                    )
            #endregion

            //Clinical.ILTC-Assessments
            #region Clinical.ILTC-Assessments
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Assessments,
                         L("Assessment"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.AssessmentsMenu,
                            L("Assessments"),
                            url: "tenant.assessmentNavigation",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Assessment,
                            customData: new MenuCustomData() { CardNavigationHashKey = "tab_Status+key_Assessments" }
                            )
                        )
                    )
            #endregion

            //Clinical.Clinical
            #region Clinical.Clinical
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Clinical,
                         L("Clinical"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.VitalSign,
                            L("VitalSign"),
                            url: "tenant.vitalSign",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_VitalSign,
                            customData: new MenuCustomData() { CardNavigationHashKey = "tab_Status+key_VitalSign" }
                            )
                        )
                    )
            #endregion

            // Transports
            #region Transports
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Transports,
                         L("Transports"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.TransportRequisitions,
                            L("TransportRequisitions"),
                            url: "tenant.transportrequisitions",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_VitalSign,
                            customData: new MenuCustomData() { }
                            )
                        )
                    )
            #endregion

            // Slider - Set as invisible so that this section should not be shown in top menu navigation
            #region Slider Region
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Slider,
                         L("Slider"),
                         icon: "glyphicon glyphicon-user",
                         isEnabled: false,
                         isVisible: false
                        )
                        // Slider - Favourite List Customization
                        // Below is the list which include those module that is card-based only, not to be added to top menu navigation
                        // Advisory Developer Notice: Please DO NOT comment the code block below. If need to comment code, please check with developer-in-charge for Slider - Favourite List Feature.
                        // For Bug #1724 : V1.4 - Issue - Slider's Customize Favourite List
                        // Slider - Favourite Item - Begin Section
                        .AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.PersonProfile,
                            L("PersonProfile"),
                            isVisible: false,
                            url: "tenant.personProfile",
                            icon: "glyphicon glyphicon-user",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Person,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_PersonDetails+key_BioData" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Allergies,
                            L("Allergies"),
                            isVisible: false,
                            url: "tenant.allergy",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Allergies,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Profile+key_Allergies" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.PrescriptionDrug,
                            L("Prescription"),
                            isVisible: false,
                            url: "tenant.prescription",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Prescriptions,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Status+key_Prescription" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.MedicalHistory,
                            L("MedicalHistory"),
                            isVisible: false,
                            url: "tenant.medicalHistory",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_MedicalHistory,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Profile+key_MedicalHistory" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.ProblemList,
                            L("ProblemList"),
                            isVisible: false,
                            url: "tenant.problemList",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_PersonProblems,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Care+key_Care" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.CarePlan,
                            L("CarePlan"),
                            isVisible: false,
                            url: "tenant.carePlan",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Care+key_Care" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.ProgressNotes,
                            L("ProgressNotes"),
                            isVisible: false,
                            url: "tenant.progressNotes",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_ProgressNotes,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Care+key_ProgressNotes" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.SpokenLanguageDialect,
                            L("SpokenLanguageDialect"),
                            isVisible: false,
                            url: "tenant.spokenLanguageDialect",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_LanguageDialects,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_PersonDetails+key_LanguageDialect" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.SignificantLifeEvents,
                            L("SignificantLifeEvents"),
                            isVisible: false,
                            url: "tenant.significantLifeEvents",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_LifeEvents,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_PersonDetails+key_LifeEvent" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.MedicationHistory,
                            L("MedicationHistory"),
                            isVisible: false,
                            url: "tenant.medicationHistory",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_MedicationHistory,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Profile+key_medicationhistories" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Diagnosis,
                            L("Diagnosis"),
                            isVisible: false,
                            url: "tenant.diagnosis",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Diagnosis,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Status+key_Diagnosis" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.MedicalAlert,
                            L("MedicalAlert"),
                            isVisible: false,
                            url: "tenant.medicalAlert",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_MedicalAlert,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Status+key_medicalalerts" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.SpecialCare,
                            L("SpecialCare"),
                            isVisible: false,
                            url: "tenant.specialCare",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_MedicalAlert,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Status+key_specialcares" }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Immunization,
                            L("Immunization"),
                            isVisible: false,
                            url: "tenant.immunization",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Immunization,
                            customData: new MenuCustomData() { isCardBasedOnly = true, CardNavigationHashKey = "tab_Status+key_Immunization" }
                            )
                        )
                    // Slider - Favourite Item - End Section
            #endregion
                )
            )
            #endregion ClinicalTab

            #region WorkPlaceTab
            //WorkPlace Tab
            .AddItem(new MenuItemDefinition(
                PageNames.App.MenuTabs.ClinicalAdministration,
                L("WorkPlace"),
                icon: "icon-grid"
                )
            //WorkPlace.MyWork
            #region WorkPlace.MyWork
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.ClinicalAdministration,
                         L("MyWork"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Dashboard,
                             L("WorkSpace"),
                             url: "tenant.dashboard.home",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Dashboard,
                             L("CareBoard"),
                             url: "tenant.dashboard.careboard",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard,
                             customData: new MenuCustomData() { }
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Dashboard,
                             L("Moments"),
                             url: "tenant.dashboard.moments",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.Bulletin,
                             L("Bulletin"),
                             isVisible: false,
                             url: "tenant.dashboard.home",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard,
                             customData: new MenuCustomData() { }
                             )
                        )
                    )
            #endregion

            //WorkPlace.ILTC
            #region WorkPlace.ILTC
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.ILTC,
                         L("ILTC"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.ILTCFileGenerator,
                             L("ILTCFileGenerator"),
                             url: "tenant.iltcFileGenerator",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_ILTC_FileGenerator
                             )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.MOHMasterCodeMapping,
                             L("MOHMasterCodeMapping"),
                             url: "tenant.mohMasterCodeMappings",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_ILTC_MOHMasterCodeMapping
                             )
                        )
                    )
            #endregion
            )
            #endregion WorkPlaceTab

            #region ReportsTab
            //Reports tab
            .AddItem(new MenuItemDefinition(
                PageNames.App.MenuTabs.Reports,
                L("Reports"),
                icon: "icon-grid"
                )
            //Reports.Reports
            #region Reports.Reports
                    .AddItem(new MenuItemDefinition(
                        PageNames.App.Tenant.Report,
                        L("Report"),
                        url: "tenant.report",
                        icon: "icon-home"
                        )
                    ).AddItem(new MenuItemDefinition(
                        PageNames.App.Tenant.ReportsPermission,
                        L("ReportsPermission"),
                            url: "tenant.reportsPermission",
                            icon: "icon-home",
                            requiredPermissionName: AppPermissions.Pages_Tenant_ReportsPermission
                        )
                    )
            #endregion
            )
            #endregion ReportsTab

            #region SettingsTab
            //Settings Tab
            .AddItem(new MenuItemDefinition(
                PageNames.App.MenuTabs.Settings,
                L("Settings"),
                icon: "icon-grid"
            )
            //Settings.Administration
            #region Settings.Administration
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Security,
                         L("Administration"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                            PageNames.App.Host.Tenants,
                            L("Tenants"),
                            url: "host.tenants",
                            icon: "icon-globe",
                            requiredPermissionName: AppPermissions.Pages_Tenants
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.AuditLogs,
                            L("AuditLogs"),
                            url: "tenant.auditLogs",
                            icon: "icon-lock",
                            requiredPermissionName: AppPermissions.Pages_Tenant_AuditLog
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Common.Users,
                            L("Users"),
                            url: "users",
                            icon: "icon-users",
                            requiredPermissionName: AppPermissions.Pages_Administration_Users
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Common.Roles,
                            L("Roles"),
                            url: "roles",
                            icon: "icon-briefcase",
                            requiredPermissionName: AppPermissions.Pages_Administration_Roles
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Host.Editions,
                            L("Editions"),
                            url: "host.editions",
                            icon: "icon-grid",
                            requiredPermissionName: AppPermissions.Pages_Editions
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Common.OrganizationUnits,
                            L("OrganizationUnits"),
                            url: "organizationUnits",
                            icon: "icon-layers",
                            requiredPermissionName: AppPermissions.Pages_Administration_OrganizationUnits
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Common.Teams,
                            L("Teams"),
                            url: "teams",
                            icon: "icon-layers",
                            requiredPermissionName: AppPermissions.Pages_Administration_Teams
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Common.AuditLogs,
                            L("SystemAuditLogs"),
                            url: "systemAuditLogs",
                            icon: "icon-lock",
                            requiredPermissionName: AppPermissions.Pages_Administration_AuditLogs
                            )
                        )
                    )
            #endregion
            //Settings.Configuration
            #region Settings.Configuration
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.Configuration,
                         L("Configuration"),
                         icon: "glyphicon glyphicon-user"
                         ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Holiday,
                            L("Holiday"),
                            url: "tenant.holiday",
                            icon: "icon-settings",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Holiday
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Settings,
                            L("Assessments"),
                            url: "tenant.assesmentsConfig",
                            icon: "icon-settings",
                            requiredPermissionName: AppPermissions.Pages_Administration_Tenant_Settings
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.UserFavouriteMenu,
                            L("UserFavouriteMenu"),
                            url: "tenant.userFavouriteMenuSettings",
                            icon: "icon-settings",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard
                            // Slider to use Tenant Dashboard permission since unable to get the logged user's TenantId information to toggle visbility
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Common.Languages,
                            L("Languages"),
                            url: "languages",
                            icon: "icon-flag",
                            requiredPermissionName: AppPermissions.Pages_Administration_Languages
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Host.Maintenance,
                            L("Maintenance"),
                            url: "host.maintenance",
                            icon: "icon-wrench",
                            requiredPermissionName: AppPermissions.Pages_Administration_Host_Maintenance
                            )
                        )
                    )
            #endregion
            //settings.Master setup
            #region Settings.MasterSetup
                    .AddItem(new MenuItemDefinition(
                         PageNames.App.MenuTabs.MasterSetup,
                         L("MasterSetup"),
                         icon: "glyphicon glyphicon-user",
                         customData: new { showName = "Master Data Setup", showSeperate = true }
                         ).AddItem(new MenuItemDefinition(
                            PageNames.App.Host.MasterData,
                            L("MasterData"),
                            url: "host.masterdata",
                            icon: "glyphicon glyphicon-list",
                            requiredPermissionName: AppPermissions.Pages_Administration_Host_MasterData,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.MasterDataLookup,
                            L("MasterLookup"),
                            url: "tenant.masterlookup",
                            icon: "glyphicon glyphicon-list",
                            requiredPermissionName: AppPermissions.Pages_Administration_Tenant_MasterDataLookup,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Centre,
                            L("Centre"),
                            url: "tenant.centre",
                            icon: "glyphicon glyphicon-bed",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Centre,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.ServiceType,
                            L("ServiceType"),
                            url: "tenant.serviceType",
                            icon: "glyphicon glyphicon-bed",
                            requiredPermissionName: AppPermissions.Pages_Tenant_ServiceType,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.CentreServiceType,
                            L("CentreServiceType"),
                            url: "tenant.centreServiceType",
                            icon: "glyphicon glyphicon-bed",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CentreServiceType,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.MutuallyExclusiveServiceType,
                            L("MutuallyExclusiveServceTypeMenu"),
                            url: "tenant.mutuallyExclusiveServiceType",
                            icon: "glyphicon glyphicon-bed",
                            requiredPermissionName: AppPermissions.Pages_Tenant_MutuallyExclusiveServceType,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.GenericDrug,
                            L("GenericDrugs"),
                            url: "tenant.drug",
                            icon: "glyphicon glyphicon-list",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Drug,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.PrescriptionDrug,
                            L("Drugs"),
                            url: "tenant.drugs",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Prescriptions,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.DrugFrequency,
                            L("DrugFrequencies"),
                            url: "tenant.drugFrequencies",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Prescriptions,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.DrugRoute,
                            L("DrugRoutes"),
                            url: "tenant.drugRoutes",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Prescriptions,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.DrugSource,
                            L("DrugSources"),
                            url: "tenant.drugSources",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Prescriptions,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.UnitOfMeasurement,
                            L("UnitOfMeasurements"),
                            url: "tenant.unitOfMeasurements",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Prescriptions,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.FinancialAssistanceTypes,
                            L("FinancialAssistanceTypes"),
                            url: "tenant.financialAssistanceTypes",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_FinancialAssistanceTypes,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.VisitTypes,
                            L("VisitTypes"),
                            url: "tenant.visitTypes",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_VisitLogs,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.VisitServices,
                            L("VisitServices"),
                            url: "tenant.visitServices",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_VisitLogs,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.CarePlanTypes,
                            L("CarePlanTypes"),
                            url: "tenant.carePlanTypes",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        )
                        .AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Problems,
                            L("Problems"),
                            url: "tenant.problems",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        )
                        .AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Goals,
                            L("Goals"),
                            url: "tenant.goals",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        )
                        .AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Interventions,
                            L("Interventions"),
                            url: "tenant.interventions",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.ProblemGoals,
                            L("ProblemGoals"),
                            url: "tenant.problemGoals",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.GoalInterventions,
                            L("GoalInterventions"),
                            url: "tenant.goalInterventions",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CarePlans,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.ProgressNoteTypes,
                            L("ProgressNoteTypes"),
                            url: "tenant.progressNoteTypes",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_ProgressNotes,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.ActivitiesEvents,
                            L("ActivityEvent"),
                            url: "tenant.activitiesEvents",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_ActivitiesEvents,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Activities,
                            L("ActivityMaster"),
                            url: "tenant.activities",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_Activities,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.CentrePersonGroups,
                            L("CentrePersonGroup"),
                            url: "tenant.centrePersonGroups",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_CentrePersonGroups,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.TransportSpecialArrangements,
                            L("TransportSpecialArrangements"),
                            url: "tenant.transportSpecialArrangements",
                            icon: "glyphicon glyphicon-list-alt",
                            requiredPermissionName: AppPermissions.Pages_Tenant_TransportSpecialArrangements,
                            customData: new { showInsideSeperateMenu = true }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.RunningNumber,
                            L("RunningNumber"),
                            url: "tenant.runningNumber",
                            icon: "glyphicon glyphicon-list",
                            requiredPermissionName: AppPermissions.Pages_Tenant_RunningNumber,
                            customData: new { showInsideSeperateMenu = false }
                            )
                        ).AddItem(new MenuItemDefinition(
                             PageNames.App.Tenant.ReportsConfiguration,
                             L("ReportsConfiguration"),
                             url: "tenant.reportsConfiguration",
                             icon: "icon-home",
                             requiredPermissionName: AppPermissions.Pages_Tenant_ReportsConfiguration,
                             customData: new { showInsideSeperateMenu = false }
                             )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Host.Settings,
                            L("SystemSettings"),
                            url: "host.settings",
                            icon: "icon-settings",
                            requiredPermissionName: AppPermissions.Pages_Administration_Host_Settings,
                             customData: new { showInsideSeperateMenu = false }
                            )
                        ).AddItem(new MenuItemDefinition(
                            PageNames.App.Tenant.Settings,
                            L("SystemSettings"),
                            url: "tenant.settings",
                            icon: "icon-settings",
                            requiredPermissionName: AppPermissions.Pages_Administration_Tenant_Settings,
                             customData: new { showInsideSeperateMenu = false }
                            )
                        )
                    )
            #endregion
            );
            #endregion SettingsTab

            /*====Unused====*/
            #region Unused MenuItems
            //---------------------------------------------------------//
            //------Not Used for now.. Will be used in laterPhase------//
            //---------------------------------------------------------//
            ////ClinicalAdministration Tab
            //.AddItem(new MenuItemDefinition(
            //    PageNames.App.MenuTabs.ClinicalAdministration,
            //    L("ClinicalAdministration"),
            //    icon: "icon-grid"
            //    )
            //    //ClinicalAdministration.ClinicalAdministration
            //    .AddItem(new MenuItemDefinition(
            //         PageNames.App.MenuTabs.ClinicalAdministration,
            //         L("ClinicalAdministration"),
            //         icon: "glyphicon glyphicon-user"
            //         ).AddItem(new MenuItemDefinition(
            //            PageNames.App.Tenant.VitalSign,
            //            L("VitalSign"),
            //            url: "tenant.vitalSign",
            //            icon: "glyphicon glyphicon-list-alt",
            //            requiredPermissionName: AppPermissions.Pages_Tenant_VitalSign
            //            )
            //        )
            //    )
            //)

            //ILTC Tab 
            //.AddItem(new MenuItemDefinition(
            //    PageNames.App.MenuTabs.ILTC,
            //    L("ILTC"),
            //    icon: "icon-grid"
            //    ).AddItem(new MenuItemDefinition(
            //         PageNames.App.Tenant.Dashboard,
            //         L("Dashboard"),
            //         isVisible: false,
            //         url: "tenant.dashboard.workspace",
            //         icon: "icon-home",
            //         requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard
            //         )
            //    )
            //)

            //Reports Tab
            //.AddItem(new MenuItemDefinition(
            //    PageNames.App.MenuTabs.Reports,
            //    L("Reports"),
            //    icon: "icon-grid"
            //    ).AddItem(new MenuItemDefinition(
            //         PageNames.App.Tenant.Dashboard,
            //         L("Dashboard"),
            //         isVisible: false,
            //         url: "tenant.dashboard.workspace",
            //         icon: "icon-home",
            //         requiredPermissionName: AppPermissions.Pages_Tenant_Dashboard
            //         )
            //    )
            //)
            //---------------------------------------------------------//
            #endregion
            /*====Unused====*/
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, IngoTPCCConsts.LocalizationSourceName);
        }
    }
}
