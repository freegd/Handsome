var _handsomeCustomizerSettings = {
    "defaults": {
        "header-fixed": LocalConst.THEME_HEADER_FIX,
        "aside-fixed": LocalConst.THEME_ASIDE_FIX,
        "aside-folded": LocalConst.THEME_ASIDE_FOLDED,
        "aside-dock": LocalConst.THEME_ASIDE_DOCK,
        "layout-boxed": LocalConst.THEME_CONTAINER_BOX,
        "color": LocalConst.THEME_COLOR
    },
    "sections": {
        "settings": {
            "header-fixed": LocalConst.HEADER_FIX,
            "aside-fixed": LocalConst.ASIDE_FIX,
            "aside-folded": LocalConst.ASIDE_FOLDED,
            "aside-dock": LocalConst.ASIDE_DOCK,
            "layout-boxed": LocalConst.CONTAINER_BOX
        },
        "colors": [{
            "navbarHeader": "bg-black",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-black"
        }, {
            "navbarHeader": "bg-dark",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-dark"
        }, {
            "navbarHeader": "bg-white-only",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-black"
        }, {
            "navbarHeader": "bg-primary",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-dark"
        }, {
            "navbarHeader": "bg-info",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-black"
        }, {
            "navbarHeader": "bg-success",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-dark"
        }, {
            "navbarHeader": "bg-danger",
            "navbarCollapse": "bg-white-only",
            "aside": "bg-dark"
        }, {
            "navbarHeader": "bg-black",
            "navbarCollapse": "bg-black",
            "aside": "bg-white b-r"
        }, {
            "navbarHeader": "bg-dark",
            "navbarCollapse": "bg-dark",
            "aside": "bg-light"
        }, {
            "navbarHeader": "bg-info dker",
            "navbarCollapse": "bg-info dker",
            "aside": "bg-light dker b-r"
        }, {
            "navbarHeader": "bg-primary",
            "navbarCollapse": "bg-primary",
            "aside": "bg-dark"
        }, {
            "navbarHeader": "bg-info dker",
            "navbarCollapse": "bg-info dk",
            "aside": "bg-black"
        }, {
            "navbarHeader": "bg-success",
            "navbarCollapse": "bg-success",
            "aside": "bg-dark"
        }, {
            "navbarHeader": "bg-danger dker bg-gd",
            "navbarCollapse": "bg-danger dker bg-gd",
            "aside": "bg-dark"
        }]
    },
    "localStorageKey": "handsome_customizer_settings"
};
/* global _wpUtilSettings */
window.wp = window.wp || {};

(function ($) {
    wp.template = _.memoize(function ( id ) {
        var compiled,
            options = {
                evaluate:    /<#([\s\S]+?)#>/g,
                interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
                escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
                variable:    'data'
            };

        return function ( data ) {
            compiled = compiled || _.template( $( '#tmpl-' + id ).html(),  options );
            return compiled( data );
        };
    });

}(jQuery));

(function($, window, document, settings, undefined) {
    'use strict';
    function customizer() {
        var loaded = false,
            localStorage = window.localStorage,
            customizer;
        function load() {
            if (loaded) return;
            loaded = true;
            customizer = generateCustomizer().appendTo('body');
            loadStyle();
        }

        function generateCustomizer() {
            var templateSettings = {
                    sections: settings.sections,
                    defaults: $.extend({},
                        settings.defaults, saveSettings())
                },
                template = wp.template('customizer'),
                customizer = template(templateSettings),
                customizer = $(customizer);
            customizer.find(':input').change(formChange);
            customizer.find('[name=reset]').click(formResetDefaults);
            return customizer;
        }

        function formChange() {
            var name = $(this).attr('name'),
                value = formItem(name);
            setStyle(name, value);
            saveSettings(name, value);
            if (getCurrentSettings('aside-fixed') && getCurrentSettings('aside-dock') && !getCurrentSettings('header-fixed')) {
                formItem('header-fixed', true);
                setStyle('header-fixed', true);
                saveSettings('header-fixed', true);
            }
        }
        function formResetDefaults() {
            $.each(settings.defaults,
                function(name, value) {
                    formItem(name, value);
                    setStyle(name, value);
                });
            saveSettings(null, null);
        }
        function loadStyle() {
            $.each(getCurrentSettings(), setStyle);
        }
        function setStyle(name, value) {
            switch (name) {
                case 'header-fixed':
                case 'aside-fixed':
                case 'aside-folded':
                case 'aside-dock':
                case 'layout-boxed':
                    var method = (value ? 'add': 'remove') + 'Class',
                        $app = $('.app');
                    if (name === 'layout-boxed') {
                        $app[method]('container');
                        $('html')[method]('bg');
                    } else {
                        $app[method]('app-' + name);
                    }
                    break;
                case 'color':
                    setAllColor(value);
            }
        }
        function setAllColor(colorIndex) {
            setPartColor('#header > .navbar-header', 'navbarHeader', colorIndex);
            setPartColor('#header > .collapse', 'navbarCollapse', colorIndex);
            setPartColor('#aside', 'aside', colorIndex);
        }
        function setPartColor(selector, key, colorIndex) {
            var colors = settings.sections.colors,
                color = colors[colorIndex],
                $element = $(selector);
            for (var i = 0; i < colors.length; ++i) $element.removeClass(colors[i][key]);
            $element.addClass(color[key]);
        }
        function formItem(name, value) {
            var result;
            customizer.find(':input').each(function() {
                var $this = $(this),
                    thisType;
                if ($this.attr('name') !== name) return;
                thisType = $this.attr('type');
                if (value === undefined) {
                    switch (thisType) {
                        case 'checkbox':
                            result = $this.prop('checked');
                            break;
                        case 'radio':
                            if ($this.prop('checked')) result = $this.val();
                            else return;
                            break;
                        default:
                            result = $this.val();
                    }
                } else {
                    switch (thisType) {
                        case 'checkbox':
                            $this.prop('checked', value);
                            break;
                        case 'radio':
                            if ($this.val() == value) $this.prop('checked', true);
                            else return;
                            break;
                        default:
                            $this.val(value);
                    }
                }
                return false;
            });
            if (result !== undefined) result = sanitizeSetting(name, result);
            return result;
        }
        function sanitizeSetting(name, value) {
            switch (name) {
                case 'color':
                    if (!$.isNumeric(value) || value <= 0) value = 0;
                    else if (value > (settings.sections.colors.length - 1)) value = settings.sections.colors.length - 1;
                    else value = parseInt(value);
                    break;
                default:
                    value = !!value;
            }
            return value;
        }
        function getCurrentSettings(name) {
            var allSettings = $.extend({},
                settings.defaults);
            $.each(allSettings,
                function(key) {
                    var formValue = formItem(key);
                    if (formValue !== undefined) allSettings[key] = formValue;
                });
            if (name === undefined) return allSettings;
            else return allSettings[name];
        }
        function saveSettings(name, value) {
            var localStorageKey = settings.localStorageKey,
                localStorageValue = localStorage.getItem(localStorageKey),
                allSettings;
            if (localStorageValue) allSettings = JSON.parse(localStorageValue);
            else allSettings = {};
            if (!name) {
                if (name === null && value === null) return localStorage.removeItem(localStorageKey);
                else return allSettings;
            }
            if (value === undefined) return allSettings[name];
            if (value === null) delete allSettings[name];
            else allSettings[name] = value;
            if ($.isEmptyObject(allSettings)) return localStorage.removeItem(localStorageKey);
            else return localStorage.setItem(localStorageKey, JSON.stringify(allSettings));
        }
        if (localStorage) $(load);
        return {
            load: load,
            generateCustomizer: generateCustomizer,
            formChange: formChange,
            formResetDefaults: formResetDefaults,
            loadStyle: loadStyle,
            setStyle: setStyle,
            setAllColor: setAllColor,
            setPartColor: setPartColor,
            formItem: formItem,
            sanitizeSetting: sanitizeSetting,
            getCurrentSettings: getCurrentSettings,
            saveSettings: saveSettings
        };
    }
    window.handsome = window.handsome || {};
    window.handsome.customizer = new customizer();
})(jQuery, window, document, _handsomeCustomizerSettings);