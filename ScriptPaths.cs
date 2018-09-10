using System.IO;
using System.Threading;
using System.Web;
using Abp.Extensions;

namespace Pulsesync.IngoTPCC.Web.Bundling
{
    public static class ScriptPaths
    {
        public const string CoreJS = "~/bower_components/core.js/client/core.min.js";

        public const string Json2 = "~/libs/json2/json2.min.js";

        public const string JQuery = "~/libs/jquery/jquery.min.js";
        public const string JQuery_Migrate = "~/libs/jquery-validation/js/jquery-migrate.min.js";
        public const string JQuery_UI = "~/libs/jquery-ui/jquery-ui.min.js";

        public const string Js_Cookie = "~/libs/js-cookie/js.cookie.min.js";

        public const string JQuery_Slimscroll = "~/libs/jquery-slimscroll/jquery.slimscroll.min.js";
        public const string JQuery_BlockUi = "~/libs/jquery-blockui/jquery.blockui.min.js";
        public const string JQuery_Uniform = "~/libs/jquery-uniform/jquery.uniform.min.js";
        public const string JQuery_Ajax_Form = "~/libs/jquery-ajax-form/jquery.form.js";
        public const string JQuery_Sparkline = "~/libs/jquery-sparkline/jquery.sparkline.min.js";
        public const string JQuery_Validation = "~/libs/jquery-validation/js/jquery.validate.min.js";
        public const string JQuery_Validation_Unobtrusive = "~/Scripts/jquery.validate.unobtrusive.min.js";
        public const string JQuery_Validation_Unobtrusive_Chameleon = "~/Scripts/jquery.validate.unobtrusive.chameleon.js";
        public const string JQuery_Validation_Unobtrusive_TwitterBootstrap = "~/Scripts/jquery.validate.unobtrusive.twitterbootstrap.js";
        public const string JQuery_Methods = "~/libs/jquery-validation/js/additional-methods.min.js";
        public const string JQuery_jTable = "~/libs/jquery-jtable/jquery.jtable.min.js";
        public const string JQuery_jTable_RecordActions = "~/libs/jquery-jtable/extensions/jquery.jtable.record-actions.js";
        public const string JQuery_Bootstrap_Switch = "~/libs/bootstrap-switch/js/bootstrap-switch.min.js";
        public const string JQuery_Color = "~/libs/jcrop/js/jquery.color.js";
        public const string JQuery_Jcrop = "~/libs/jcrop/js/jquery.Jcrop.min.js";
        public const string JQuery_Timeago = "~/libs/jquery-timeago/jquery.timeago.js";

        public const string Bootstrap = "~/libs/bootstrap/js/bootstrap.min.js";
        public const string Bootstrap_Hover_Dropdown = "~/libs/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js";
        public const string Bootstrap_DateRangePicker = "~/libs/bootstrap-daterangepicker/daterangepicker.js";
        public const string Bootstrap_DatePicker = "~/libs/bootstrap-datepicker/js/bootstrap-datepicker.js";
        //public const string Bootstrap_DateTimePicker = "~/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js";
        public const string Bootstrap_DateTimePicker = "~/bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js";
        public const string Bootstrap_Select = "~/libs/bootstrap-select/bootstrap-select.min.js";
        public const string Bootstrap_Switch = "~/libs/bootstrap-switch/js/bootstrap-switch.min.js";
        //public const string Bootstrap_TagsInput = "~/libs/bootstrap-tagsinput/js/bootstrap-tagsinput.min.js";
        public const string Bootstrap_TagsInput = "~/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js";
        public const string Bootstrap_TagsInput_Angular = "~/libs/bootstrap-tagsinput/js/bootstrap-tagsinput-angular.min.js";
        public const string TypeHead = "~/libs/typehead/typeahead.bundle.min.js";
        public const string TagsInput_Module = "~/App/Common/Modules/TagInputComponent.js";

        public const string SignalR = "~/Scripts/jquery.signalR-2.2.1.min.js";
        public const string LocalForage = "~/Scripts/localforage/localforage.min.js";

        public const string Morris = "~/libs/morris/morris.min.js";
        public const string Morris_Raphael = "~/libs/morris/raphael-min.js";

        public const string JsTree = "~/libs/jstree/jstree.js";
        public const string SpinJs = "~/libs/spinjs/spin.js";
        public const string SpinJs_JQuery = "~/libs/spinjs/jquery.spin.js";

        public const string PushJs = "~/libs/push-js/push.min.js";
        public const string SweetAlert2 = "~/bower_components/sweetalert2/dist/sweetalert2.min.js";

        public const string Toastr = "~/libs/toastr/toastr.min.js";

        public const string MomentJs = "~/Scripts/moment-with-locales.min.js";
        public const string MomentTimezoneJs = "~/Scripts/moment-timezone-with-data.min.js";
        public const string Underscore = "~/Scripts/underscore.min.js";

        public const string MustacheJs = "~/libs/mustachejs/mustache.min.js";
        public const string Tether = "~/libs/tether/js/tether.min.js";

        public const string Angular = "~/Scripts/angular.min.js";//SPA!
        public const string Angular_Ui_Select = "~/bower_components/angular-ui-select/dist/select.js";
        public const string Angular_Animate = "~/Scripts/angular-animate.min.js";//SPA!
        public const string Angular_Sanitize = "~/Scripts/angular-sanitize.min.js";//SPA!
        public const string Angular_Touch = "~/Scripts/angular-touch.min.js";//SPA!
        public const string Angular_Ui_Router = "~/Scripts/angular-ui-router.min.js";//SPA!
        public const string Angular_Ui_Utils = "~/Scripts/angular-ui/ui-utils.min.js";//SPA!
        public const string Angular_Ui_Bootstrap_Tpls = "~/Scripts/angular-ui/ui-bootstrap-tpls.min.js";//SPA!
        public const string Angular_Ui_Grid = "~/libs/angular-ui-grid/ui-grid.min.js";//SPA!
        public const string Angular_OcLazyLoad = "~/libs/angular-ocLazyLoad/ocLazyLoad.min.js";//SPA!
        public const string Angular_File_Upload = "~/libs/angular-file-upload/angular-file-upload.min.js";//SPA!
        public const string Angular_DateRangePicker = "~/libs/angular-daterangepicker/angular-daterangepicker.min.js";//SPA!
        public const string Angular_Moment = "~/libs/angular-moment/angular-moment.min.js";//SPA!
        public const string Angular_Bootstrap_Switch = "~/libs/angular-bootstrap-switch/angular-bootstrap-switch.min.js";//SPA!
        public const string NgMask = "~/bower_components/ngMask/dist/ngMask.min.js";//SPA!
        public const string Angular_Elastic = "~/bower_components/angular-elastic/elastic.js";//SPA!
        public const string Angular_Sticky = "~/bower_components/ngSticky/dist/sticky.min.js";//SPA!
        public const string Angular_Validator = "~/libs/tg-angular-validator/dist/angular-validator.js";//SPA!
        public const string MultiSelect = "~/bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect.js";//SPA!
        public const string Angular_Signature = "~/bower_components/angular-signature/src/signature.js";//SPA!
        public const string Signature_Pad = "~/bower_components/signature_pad/signature_pad.js";//SPA!
        public const string Angular_Breadcrumb = "~/libs/angular-breadcrumb/angular-breadcrumb.js";//SPA!
        //public const string Angular_CKEditor = "~/bower_components/ckeditor/ckeditor.js";//SPA!
        public const string Angular_ngCKEditor = "~/bower_components/ng-ckeditor/dist/ng-ckeditor.min.js";//SPA!
        public const string Angular_ngPageSlide = "~/bower_components/angular-pageslide-directive/dist/angular-pageslide-directive.min.js";//SPA!
        public const string Listbox_MultiSelect = "~/libs/multiselect/jquery.multi-select.js";//SPA!
        public const string NgKnob = "~/bower_components/ng-knob/dist/ng-knob.js";
        public const string D3 = "~/bower_components/d3/d3.js";
        public const string AngularFrom_DirtyCheck = "~/libs/AngularFormDirtyCheck/AngularFormDirtyCheck.min.js";
        //Charts
        public const string NvD3 = "~/bower_components/nvd3/build/nv.d3.js";
        public const string Angular_NvD3 = "~/bower_components/angular-nvd3/dist/angular-nvd3.js";
        public const string Chart = "~/bower_components/chart.js/dist/Chart.js";
        public const string Chart_RangeBar = "~/libs/rangeBarChart/rangeBarChart.js";
        public const string Chart_Annotation = "~/bower_components/chartjs-plugin-annotation/chartjs-plugin-annotation.js";
        public const string Angular_Chart = "~/bower_components/tc-angular-chartjs/dist/tc-angular-chartjs.js";

        public const string SideSlider = "~/libs/slidereveal/jquery.slidereveal.js";
        //Ui router extras
        public const string Hammer = "~/bower_components/hammerjs/hammer.min.js";
        public const string AngularCarousel = "~/bower_components/lifely-angular-carousel/angular-carousel.js";
        public const string Angular_UiRouter_Extras_Core = "~/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.core.js";
        public const string Angular_UiRouter_Extras_Transition = "~/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.transition.js";
        public const string Angular_UiRouter_Extras_Previous = "~/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.previous.js";

        //jQuery multiselect plugin with two sides
        public const string JQuery_MultiSelect = "~/libs/jquery-multiselect/js/multiselect.min.js";//SPA!

        // Truncate Long HTML
        //public const string ng_readmore = "~/libs/ngReadMore/readmore.js";
        // Truncate Long Text
        public const string Angular_Text_Truncate = "~/bower_components/ng-text-truncate/ng-text-truncate.js";

        public const string Abp = "~/Abp/Framework/scripts/abp.js";
        public const string Abp_JQuery = "~/Abp/Framework/scripts/libs/abp.jquery.js";
        public const string Abp_Toastr = "~/Abp/Framework/scripts/libs/abp.toastr.js";
        public const string Abp_BlockUi = "~/Abp/Framework/scripts/libs/abp.blockUI.js";
        public const string Abp_SpinJs = "~/Abp/Framework/scripts/libs/abp.spin.js";
        public const string Abp_SweetAlert = "~/Abp/Framework/scripts/libs/abp.sweet-alert.js";
        public const string Abp_Moment = "~/Abp/Framework/scripts/libs/abp.moment.js";
        public const string Abp_Angular = "~/Abp/Framework/scripts/libs/angularjs/abp.ng.js";//SPA!
        public const string Abp_jTable = "~/Abp/Framework/scripts/libs/abp.jtable.js";


        public static string Angular_Localization
        {
            get
            {
                return GetLocalizationFileForjAngularOrNull(Thread.CurrentThread.CurrentUICulture.Name.ToLower())
                       ?? GetLocalizationFileForjAngularOrNull(Thread.CurrentThread.CurrentUICulture.Name.Left(2).ToLower())
                       ?? "~/Scripts/i18n/angular-locale_en-us.js";
            }
        }

        private static string GetLocalizationFileForjAngularOrNull(string cultureCode)
        {
            try
            {
                var relativeFilePath = "~/Scripts/i18n/angular-locale_" + cultureCode + ".js";
                var physicalFilePath = HttpContext.Current.Server.MapPath(relativeFilePath);
                if (File.Exists(physicalFilePath))
                {
                    return relativeFilePath;
                }
            }
            catch { }

            return null;
        }


        public static string JQuery_Validation_Localization
        {
            get
            {
                return GetLocalizationFileForjQueryValidationOrNull(Thread.CurrentThread.CurrentUICulture.Name.ToLower().Replace("-", "_"))
                       ?? GetLocalizationFileForjQueryValidationOrNull(Thread.CurrentThread.CurrentUICulture.Name.Left(2).ToLower())
                       ?? "~/libs/jquery-validation/js/localization/_messages_empty.js";
            }
        }

        private static string GetLocalizationFileForjQueryValidationOrNull(string cultureCode)
        {
            try
            {
                var relativeFilePath = "~/libs/jquery-validation/js/localization/messages_" + cultureCode + ".min.js";
                var physicalFilePath = HttpContext.Current.Server.MapPath(relativeFilePath);
                if (File.Exists(physicalFilePath))
                {
                    return relativeFilePath;
                }
            }
            catch { }

            return null;
        }

        public static string JQuery_JTable_Localization
        {
            get
            {
                return GetLocalizationFileForJTableOrNull(Thread.CurrentThread.CurrentUICulture.Name.ToLower())
                       ?? GetLocalizationFileForJTableOrNull(Thread.CurrentThread.CurrentUICulture.Name.Left(2).ToLower())
                       ?? "~/libs/jquery-jtable/localization/_jquery.jtable.empty.js";
            }
        }
        public static string CKEditor
        {
            get
            {
                //return "~/bower_components/ckeditor/ckeditor.js";//SPA!
                return "~/libs/ckeditor/ckeditor.js";//SPA!
            }
        }

        private static string GetLocalizationFileForJTableOrNull(string cultureCode)
        {
            try
            {
                var relativeFilePath = "~/libs/jquery-jtable/localization/jquery.jtable." + cultureCode + ".js";
                var physicalFilePath = HttpContext.Current.Server.MapPath(relativeFilePath);
                if (File.Exists(physicalFilePath))
                {
                    return relativeFilePath;
                }
            }
            catch { }

            return null;
        }

        public static string Bootstrap_Select_Localization
        {
            get
            {
                return GetLocalizationFileForBootstrapSelect(Thread.CurrentThread.CurrentUICulture.Name.ToLower())
                       ?? GetLocalizationFileForBootstrapSelect(Thread.CurrentThread.CurrentUICulture.Name.Left(2).ToLower())
                       ?? "~/libs/bootstrap-select/i18n/defaults-en_US.js";
            }
        }

        private static string GetLocalizationFileForBootstrapSelect(string cultureCode)
        {
            var localizationFileList = new[]
            {
                "ar_AR",
                "bg_BG",
                "cs_CZ",
                "da_DK",
                "de_DE",
                "en_US",
                "es_CL",
                "eu",
                "fa_IR",
                "fi_FI",
                "fr_FR",
                "hu_HU",
                "id_ID",
                "it_IT",
                "ko_KR",
                "nb_NO",
                "nl_NL",
                "pl_PL",
                "pt_BR",
                "pt_PT",
                "ro_RO",
                "ru_RU",
                "sk_SK",
                "sl_SL",
                "sv_SE",
                "tr_TR",
                "ua_UA",
                "zh_CN",
                "zh_TW"
            };

            try
            {
                cultureCode = cultureCode.Replace("-", "_");

                foreach (var localizationFile in localizationFileList)
                {
                    if (localizationFile.StartsWith(cultureCode))
                    {
                        return "~/libs/bootstrap-select/i18n/defaults-" + localizationFile + ".js";
                    }
                }
            }
            catch { }

            return null;
        }

        public static string JQuery_Timeago_Localization
        {
            get
            {
                return GetLocalizationFileForjQueryTimeagoOrNull(Thread.CurrentThread.CurrentUICulture.Name.ToLower().Replace("-", "_"))
                       ?? GetLocalizationFileForjQueryTimeagoOrNull(Thread.CurrentThread.CurrentUICulture.Name.Left(2).ToLower())
                       ?? "~/libs/jquery-timeago/locales/jquery.timeago.en.js";
            }
        }

        private static string GetLocalizationFileForjQueryTimeagoOrNull(string cultureCode)
        {
            try
            {
                var relativeFilePath = "~/libs/jquery-timeago/locales/jquery.timeago." + cultureCode + ".js";
                var physicalFilePath = HttpContext.Current.Server.MapPath(relativeFilePath);
                if (File.Exists(physicalFilePath))
                {
                    return relativeFilePath;
                }
            }
            catch { }

            return null;
        }
    }
}