using System.Web.Optimization;
using Pulsesync.IngoTPCC.Web.Bundling;

namespace Pulsesync.IngoTPCC.Web.App.Startup
{
    public static class AppBundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //LIBRARIES

            AddAppCssLibs(bundles, isRTL: false);
            AddAppCssLibs(bundles, isRTL: true);

            bundles.Add(
                new ScriptBundle("~/Bundles/App/libs/js")
                    .Include(
                        ScriptPaths.Json2,
                        ScriptPaths.JQuery,
                        ScriptPaths.JQuery_UI,
                        ScriptPaths.JQuery_Migrate,
                        ScriptPaths.JQuery_Validation,
                        ScriptPaths.JQuery_Methods,
                        ScriptPaths.JQuery_Validation_Unobtrusive,
                        ScriptPaths.JQuery_Validation_Unobtrusive_Chameleon,
                        ScriptPaths.JQuery_Validation_Unobtrusive_TwitterBootstrap,
                        ScriptPaths.Bootstrap,
                        ScriptPaths.Bootstrap_Hover_Dropdown,
                        ScriptPaths.JQuery_Slimscroll,
                        ScriptPaths.JQuery_BlockUi,
                        ScriptPaths.Js_Cookie,
                        ScriptPaths.JQuery_Uniform,
                        ScriptPaths.SignalR,
                        ScriptPaths.LocalForage,
                        ScriptPaths.Morris,
                        ScriptPaths.Morris_Raphael,
                        ScriptPaths.JQuery_Sparkline,
                        ScriptPaths.JQuery_Color,
                        ScriptPaths.JQuery_Jcrop,
                        ScriptPaths.JQuery_Timeago,
                        ScriptPaths.JsTree,
                        ScriptPaths.Bootstrap_Switch,
                        ScriptPaths.SpinJs,
                        ScriptPaths.SpinJs_JQuery,
                        ScriptPaths.CoreJS,
                        ScriptPaths.SweetAlert2,
                        ScriptPaths.PushJs,
                        ScriptPaths.Toastr,
                        ScriptPaths.MultiSelect,
                        ScriptPaths.MomentJs,
                        ScriptPaths.MomentTimezoneJs,
                        ScriptPaths.Bootstrap_DateRangePicker,
                        ScriptPaths.Bootstrap_DatePicker,
                        ScriptPaths.Bootstrap_Select,
                        ScriptPaths.Bootstrap_DateTimePicker,
                        ScriptPaths.Underscore,
                        ScriptPaths.Angular,
                        ScriptPaths.Angular_Ui_Select,
                        ScriptPaths.Angular_Animate,
                        ScriptPaths.Angular_Sanitize,
                        ScriptPaths.Angular_Touch,
                        ScriptPaths.Angular_Ui_Router,
                        ScriptPaths.Angular_Ui_Utils,
                        ScriptPaths.Angular_Ui_Bootstrap_Tpls,
                        ScriptPaths.Angular_Ui_Grid,
                        ScriptPaths.Angular_OcLazyLoad,
                        ScriptPaths.Angular_File_Upload,
                        ScriptPaths.Angular_DateRangePicker,
                        ScriptPaths.Angular_Moment,
                        ScriptPaths.Angular_Bootstrap_Switch,
                        ScriptPaths.NgMask,
                        ScriptPaths.Angular_Elastic,
                        ScriptPaths.Angular_Sticky,
                        ScriptPaths.Angular_Signature,
                        ScriptPaths.Signature_Pad,
                        ScriptPaths.Abp,
                        ScriptPaths.Abp_JQuery,
                        ScriptPaths.Abp_Toastr,
                        ScriptPaths.Abp_BlockUi,
                        ScriptPaths.Abp_SpinJs,
                        ScriptPaths.Abp_SweetAlert,
                        ScriptPaths.Abp_Moment,
                        ScriptPaths.Abp_Angular,
                        ScriptPaths.Bootstrap_TagsInput,
                        ScriptPaths.Bootstrap_TagsInput_Angular,
                        ScriptPaths.TypeHead,
                        ScriptPaths.TagsInput_Module,
                        ScriptPaths.Angular_Validator,
                        //ScriptPaths.Angular_Breadcrumb,
                        ScriptPaths.Listbox_MultiSelect,
                        ScriptPaths.JQuery_MultiSelect,
                        //ScriptPaths.Angular_CKEditor,
                        ScriptPaths.Angular_ngCKEditor,
                        ScriptPaths.NgKnob,
                        ScriptPaths.D3,
                        ScriptPaths.NvD3,
                        ScriptPaths.Angular_NvD3,
                        ScriptPaths.Chart,
                        ScriptPaths.Chart_RangeBar,
                        ScriptPaths.Chart_Annotation,
                        ScriptPaths.Angular_Chart,
                        ScriptPaths.SideSlider,
                        ScriptPaths.Hammer,
                        ScriptPaths.AngularCarousel,
                        ScriptPaths.Angular_ngPageSlide,
                        ScriptPaths.Angular_UiRouter_Extras_Core,
                        ScriptPaths.Angular_UiRouter_Extras_Transition,
                        ScriptPaths.Angular_UiRouter_Extras_Previous,
                        ScriptPaths.AngularFrom_DirtyCheck,
                        //ScriptPaths.ng_readmore,
                        ScriptPaths.Angular_Text_Truncate
                    ).ForceOrdered()
                );

            //METRONIC

            AddAppMetronicCss(bundles, isRTL: false);
            AddAppMetronicCss(bundles, isRTL: true);

            bundles.Add(
              new ScriptBundle("~/Bundles/App/metronic/js")
                  .Include(
                      "~/metronic/assets/global/scripts/app.js",
                      "~/metronic/assets/admin/layout4/scripts/layout.js",
                      "~/metronic/assets/layouts/global/scripts/quick-sidebar.js"
                  ).ForceOrdered()
              );

            //APPLICATION

            bundles.Add(
                new StyleBundle("~/Bundles/App/css")
                    .IncludeDirectory("~/App", "*.css", true)
                    .ForceOrdered()
                );

            bundles.Add(
                new ScriptBundle("~/Bundles/App/js")
                    .IncludeDirectory("~/App", "*.js", true)
                    .ForceOrdered()
                );
        }

      
        private static void AddAppCssLibs(BundleCollection bundles, bool isRTL)
        {
            bundles.Add(
                new StyleBundle("~/Bundles/App/libs/css" + (isRTL ? "RTL" : ""))
                    .Include(StylePaths.FontAwesome, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.Simple_Line_Icons, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.FamFamFamFlags, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(isRTL ? StylePaths.BootstrapRTL : StylePaths.Bootstrap, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.JQuery_Uniform, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.Morris)
                    .Include(StylePaths.JsTree, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.SweetAlert2)
                    .Include(StylePaths.Toastr)
                    .Include(StylePaths.Angular_Ui_Select)
                    .Include(StylePaths.Angular_Ui_Grid, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.Bootstrap_DateRangePicker)
                    .Include(StylePaths.Bootstrap_DatePicker)
                    .Include(StylePaths.Bootstrap_Select)
                    .Include(StylePaths.Bootstrap_Switch)
                    .Include(StylePaths.Bootstrap_TagsInput)
                    .Include(StylePaths.Bootstrap_DateTimePicker)
                    .Include(StylePaths.TypeAheadCss)
                    .Include(StylePaths.JQuery_Jcrop)
                    .Include(StylePaths.Selectize_Default)
                    .Include(StylePaths.MultiSelect)
                    .Include(StylePaths.Select2, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.ChameleonForms_TwitterBootstrap)
                    .Include(StylePaths.Ui_Grid_Custom_CSS, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.PS_MultiSelect)
                    .Include(StylePaths.NvD3)
                    .Include(StylePaths.IcomoonFont, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.Angular_Carousel)
                    .Include(StylePaths.Weather_Icons, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.Weather_Icons_Wind, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include(StylePaths.BirthdayCard, new CssRewriteUrlWithVirtualDirectoryTransform())
                    .ForceOrdered()
                );
        }

        private static void AddAppMetronicCss(BundleCollection bundles, bool isRTL)
        {
            bundles.Add(
                new StyleBundle("~/Bundles/App/metronic/css" + (isRTL ? "RTL" : ""))
                    .Include("~/metronic/assets/global/css/components-md" + (isRTL ? "-rtl" : "") + ".css", new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include("~/metronic/assets/global/css/plugins-md" + (isRTL ? "-rtl" : "") + ".css", new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include("~/metronic/assets/admin/layout4/css/layout" + (isRTL ? "-rtl" : "") + ".css", new CssRewriteUrlWithVirtualDirectoryTransform())
                    .Include("~/metronic/assets/admin/layout4/css/themes/light" + (isRTL ? "-rtl" : "") + ".css", new CssRewriteUrlWithVirtualDirectoryTransform())
                    .ForceOrdered()
                );
        }
    }
}
