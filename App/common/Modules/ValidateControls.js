(function ($) {

    $.validator.addMethod("validateEmail", function (value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional(element) || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
    }, abp.localization.localize("InvalidEmailAddress"));
    

    $.validator.classRuleSettings.validateEmail = { validateEmail: true };


    $.fn.ValidateControls = function (options) {

        // This is the easiest way to have default options.

        
        var settings = $.extend({
            // These are the defaults.
            messages: {},
            rules: {}
        }, options);
        var form = this;
        var error = $('.alert-danger', form);
        var success = $('.alert-success', form);
        form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            messages: settings.messages,
            rules: settings.rules,
            invalidHandler: function (event, validator) { //display error alert on form submit              
                success.hide();
                error.show();
                App.scrollTo($('.has-error:first', form));
            },

            errorPlacement: function (error, element) {
                if (element.is(':checkbox')) {
                    error.insertAfter(element.closest(".md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline"));
                } else if (element.is(':radio')) {
                    error.insertAfter(element.closest(".md-radio-list, .md-radio-inline, .radio-list,.radio-inline"));
                } else {
                    error.insertAfter(element); // for other inputs, just perform default behavior
                }
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                success.show();
                error.hide();
            }
        });

        return form;
    };

}(jQuery));