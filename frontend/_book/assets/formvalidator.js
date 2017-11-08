﻿(function (global) {
    var __slice = [].slice,
        __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        __indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
    var extend = function () {
        var key, out, source, sources, val, _i, _len;
        out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = sources.length; _i < _len; _i++) {
            source = sources[_i];
            if (source) {
                for (key in source) {
                    if (!__hasProp.call(source, key)) continue;
                    val = source[key];
                    if ((out[key] != null) && typeof out[key] === 'object' && (val != null) && typeof val === 'object') {
                        extend(out[key], val);
                    } else {
                        out[key] = val;
                    }
                }
            }
        }
        return out;
    };

    function assertString(input) {
        var isString = typeof input === 'string' || input instanceof String;

        if (!isString) {
            throw new TypeError('This library (validator.js) validates strings only');
        }
    }

    function toDate(date) {
        assertString(date);
        date = Date.parse(date);
        return !isNaN(date) ? new Date(date) : null;
    }

    function toFloat(str) {
        assertString(str);
        return parseFloat(str);
    }

    function toInt(str, radix) {
        assertString(str);
        return parseInt(str, radix || 10);
    }

    function toBoolean(str, strict) {
        assertString(str);
        if (strict) {
            return str === '1' || str === 'true';
        }
        return str !== '0' && str !== 'false' && str !== '';
    }

    function equals(str, comparison) {
        assertString(str);
        return str === comparison;
    }

    function equalto(str, domid) {
        assertString(str);
        var c = document.getElementById(domid);
        if (c) {
            return str === c.value;
        }
        return false;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function toString(input) {
        if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input !== null) {
            if (typeof input.toString === 'function') {
                input = input.toString();
            } else {
                input = '[object Object]';
            }
        } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
            input = '';
        }
        return String(input);
    }

    function contains(str, elem) {
        assertString(str);
        return str.indexOf(toString(elem)) >= 0;
    }

    function matches(str, pattern, modifiers) {
        assertString(str);
        if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
            pattern = new RegExp(pattern, modifiers);
        }
        return pattern.test(str);
    }

    function merge() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var defaults = arguments[1];

        for (var key in defaults) {
            if (typeof obj[key] === 'undefined') {
                obj[key] = defaults[key];
            }
        }
        return obj;
    }

    /* eslint-disable prefer-rest-params */
    function isByteLength(str, options) {
        assertString(str);
        var min = void 0;
        var max = void 0;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            min = options.min || 0;
            max = options.max;
        } else {
            // backwards compatibility: isByteLength(str, min [, max])
            min = arguments[1];
            max = arguments[2];
        }
        var len = encodeURI(str).split(/%..|./).length - 1;
        return len >= min && (typeof max === 'undefined' || len <= max);
    }

    var default_fqdn_options = {
        require_tld: true,
        allow_underscores: false,
        allow_trailing_dot: false
    };

    function isFDQN(str, options) {
        assertString(str);
        options = merge(options, default_fqdn_options);

        /* Remove the optional trailing dot before checking validity */
        if (options.allow_trailing_dot && str[str.length - 1] === '.') {
            str = str.substring(0, str.length - 1);
        }
        var parts = str.split('.');
        if (options.require_tld) {
            var tld = parts.pop();
            if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
                return false;
            }
            // disallow spaces
            if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
                return false;
            }
        }
        for (var part, i = 0; i < parts.length; i++) {
            part = parts[i];
            if (options.allow_underscores) {
                part = part.replace(/_/g, '');
            }
            if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
                return false;
            }
            // disallow full-width chars
            if (/[\uff01-\uff5e]/.test(part)) {
                return false;
            }
            if (part[0] === '-' || part[part.length - 1] === '-') {
                return false;
            }
        }
        return true;
    }

    var default_email_options = {
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    };

    /* eslint-disable max-len */
    /* eslint-disable no-control-regex */
    var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
    var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
    var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
    var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
    var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
    /* eslint-enable max-len */
    /* eslint-enable no-control-regex */

    function isEmail(str, options) {
        assertString(str);
        options = merge(options, default_email_options);

        if (options.require_display_name || options.allow_display_name) {
            var display_email = str.match(displayName);
            if (display_email) {
                str = display_email[1];
            } else if (options.require_display_name) {
                return false;
            }
        }

        var parts = str.split('@');
        var domain = parts.pop();
        var user = parts.join('@');

        var lower_domain = domain.toLowerCase();
        if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
            user = user.replace(/\./g, '').toLowerCase();
        }

        if (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 254 })) {
            return false;
        }

        if (!isFDQN(domain, { require_tld: options.require_tld })) {
            return false;
        }

        if (user[0] === '"') {
            user = user.slice(1, user.length - 1);
            return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
        }

        var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

        var user_parts = user.split('.');
        for (var i = 0; i < user_parts.length; i++) {
            if (!pattern.test(user_parts[i])) {
                return false;
            }
        }

        return true;
    }

    var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var ipv6Block = /^[0-9A-F]{1,4}$/i;

    function isIP(str) {
        var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        assertString(str);
        version = String(version);
        if (!version) {
            return isIP(str, 4) || isIP(str, 6);
        } else if (version === '4') {
            if (!ipv4Maybe.test(str)) {
                return false;
            }
            var parts = str.split('.').sort(function (a, b) {
                return a - b;
            });
            return parts[3] <= 255;
        } else if (version === '6') {
            var blocks = str.split(':');
            var foundOmissionBlock = false; // marker to indicate ::

            // At least some OS accept the last 32 bits of an IPv6 address
            // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
            // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
            // and '::a.b.c.d' is deprecated, but also valid.
            var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
            var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

            if (blocks.length > expectedNumberOfBlocks) {
                return false;
            }
            // initial or final ::
            if (str === '::') {
                return true;
            } else if (str.substr(0, 2) === '::') {
                blocks.shift();
                blocks.shift();
                foundOmissionBlock = true;
            } else if (str.substr(str.length - 2) === '::') {
                blocks.pop();
                blocks.pop();
                foundOmissionBlock = true;
            }

            for (var i = 0; i < blocks.length; ++i) {
                // test for a :: which can not be at the string start/end
                // since those cases have been handled above
                if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
                    if (foundOmissionBlock) {
                        return false; // multiple :: in address
                    }
                    foundOmissionBlock = true;
                } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
                    // it has been checked before that the last
                    // block is a valid IPv4 address
                } else if (!ipv6Block.test(blocks[i])) {
                    return false;
                }
            }
            if (foundOmissionBlock) {
                return blocks.length >= 1;
            }
            return blocks.length === expectedNumberOfBlocks;
        }
        return false;
    }

    var default_url_options = {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
    };

    var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

    function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    }

    function checkHost(host, matches) {
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            if (host === match || isRegExp(match) && match.test(host)) {
                return true;
            }
        }
        return false;
    }

    function isURL(url, options) {
        assertString(url);
        if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
            return false;
        }
        if (url.indexOf('mailto:') === 0) {
            return false;
        }
        options = merge(options, default_url_options);
        var protocol = void 0,
            auth = void 0,
            host = void 0,
            hostname = void 0,
            port = void 0,
            port_str = void 0,
            split = void 0,
            ipv6 = void 0;

        split = url.split('#');
        url = split.shift();

        split = url.split('?');
        url = split.shift();

        split = url.split('://');
        if (split.length > 1) {
            protocol = split.shift();
            if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
                return false;
            }
        } else if (options.require_protocol) {
            return false;
        } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
            split[0] = url.substr(2);
        }
        url = split.join('://');

        if (url === '') {
            return false;
        }

        split = url.split('/');
        url = split.shift();

        if (url === '' && !options.require_host) {
            return true;
        }

        split = url.split('@');
        if (split.length > 1) {
            auth = split.shift();
            if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
                return false;
            }
        }
        hostname = split.join('@');

        port_str = null;
        ipv6 = null;
        var ipv6_match = hostname.match(wrapped_ipv6);
        if (ipv6_match) {
            host = '';
            ipv6 = ipv6_match[1];
            port_str = ipv6_match[2] || null;
        } else {
            split = hostname.split(':');
            host = split.shift();
            if (split.length) {
                port_str = split.join(':');
            }
        }

        if (port_str !== null) {
            port = parseInt(port_str, 10);
            if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
                return false;
            }
        }

        if (!isIP(host) && !isFDQN(host, options) && (!ipv6 || !isIP(ipv6, 6))) {
            return false;
        }

        host = host || ipv6;

        if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
            return false;
        }
        if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
            return false;
        }

        return true;
    }

    var macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

    function isMACAddress(str) {
        assertString(str);
        return macAddress.test(str);
    }

    function isBoolean(str) {
        assertString(str);
        return ['true', 'false', '1', '0'].indexOf(str) >= 0;
    }

    var alpha = {
        'en-US': /^[A-Z]+$/i,
        'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
        'da-DK': /^[A-ZÆØÅ]+$/i,
        'de-DE': /^[A-ZÄÖÜß]+$/i,
        'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
        'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
        'it-IT': /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
        'nb-NO': /^[A-ZÆØÅ]+$/i,
        'nl-NL': /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
        'nn-NO': /^[A-ZÆØÅ]+$/i,
        'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
        'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
        'pt-PT': /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
        'ru-RU': /^[А-ЯЁ]+$/i,
        'sr-RS@latin': /^[A-ZČĆŽŠĐ]+$/i,
        'sr-RS': /^[А-ЯЂЈЉЊЋЏ]+$/i,
        'sv-SE': /^[A-ZÅÄÖ]+$/i,
        'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
        'uk-UA': /^[А-ЩЬЮЯЄIЇҐі]+$/i,
        ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
    };

    var alphanumeric = {
        'en-US': /^[0-9A-Z]+$/i,
        'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
        'da-DK': /^[0-9A-ZÆØÅ]+$/i,
        'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
        'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
        'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
        'it-IT': /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
        'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
        'nb-NO': /^[0-9A-ZÆØÅ]+$/i,
        'nl-NL': /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
        'nn-NO': /^[0-9A-ZÆØÅ]+$/i,
        'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
        'pt-PT': /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
        'ru-RU': /^[0-9А-ЯЁ]+$/i,
        'sr-RS@latin': /^[0-9A-ZČĆŽŠĐ]+$/i,
        'sr-RS': /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
        'sv-SE': /^[0-9A-ZÅÄÖ]+$/i,
        'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
        'uk-UA': /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
        ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
    };

    var decimal = {
        'en-US': '.',
        ar: '٫'
    };

    var englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];

    for (var locale, i = 0; i < englishLocales.length; i++) {
        locale = 'en-' + englishLocales[i];
        alpha[locale] = alpha['en-US'];
        alphanumeric[locale] = alphanumeric['en-US'];
        decimal[locale] = decimal['en-US'];
    }

    // Source: http://www.localeplanet.com/java/
    var arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];

    for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
        _locale = 'ar-' + arabicLocales[_i];
        alpha[_locale] = alpha.ar;
        alphanumeric[_locale] = alphanumeric.ar;
        decimal[_locale] = decimal.ar;
    }

    // Source: https://en.wikipedia.org/wiki/Decimal_mark
    var dotDecimal = [];
    var commaDecimal = ['cs-CZ', 'da-DK', 'de-DE', 'es-ES', 'fr-FR', 'it-IT', 'hu-HU', 'nb-NO', 'nn-NO', 'nl-NL', 'pl-Pl', 'pt-PT', 'ru-RU', 'sr-RS@latin', 'sr-RS', 'sv-SE', 'tr-TR', 'uk-UA'];

    for (var _i2 = 0; _i2 < dotDecimal.length; _i2++) {
        decimal[dotDecimal[_i2]] = decimal['en-US'];
    }

    for (var _i3 = 0; _i3 < commaDecimal.length; _i3++) {
        decimal[commaDecimal[_i3]] = ',';
    }

    alpha['pt-BR'] = alpha['pt-PT'];
    alphanumeric['pt-BR'] = alphanumeric['pt-PT'];
    decimal['pt-BR'] = decimal['pt-PT'];

    function isAlpha(str) {
        var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';

        assertString(str);
        if (locale in alpha) {
            return alpha[locale].test(str);
        }
        throw new Error('Invalid locale \'' + locale + '\'');
    }

    function isAlphanumeric(str) {
        var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';

        assertString(str);
        if (locale in alphanumeric) {
            return alphanumeric[locale].test(str);
        }
        throw new Error('Invalid locale \'' + locale + '\'');
    }

    var numeric = /^[-+]?[0-9]+$/;

    function isNumeric(str) {
        assertString(str);
        return numeric.test(str);
    }

    var intrex = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
    var intLeadingZeroes = /^[-+]?[0-9]+$/;

    function isInt(str, options) {
        assertString(str);
        options = options || {};

        // Get the regex to use for testing, based on whether
        // leading zeroes are allowed or not.
        var regex = options.hasOwnProperty('allow_leading_zeroes') && !options.allow_leading_zeroes ? intrex : intLeadingZeroes;

        // Check min/max/lt/gt
        var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
        var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;
        var ltCheckPassed = !options.hasOwnProperty('lt') || str < options.lt;
        var gtCheckPassed = !options.hasOwnProperty('gt') || str > options.gt;

        return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
    }

    function isPort(str) {
        return isInt(str, { min: 0, max: 65535 });
    }

    function isLowercase(str) {
        assertString(str);
        return str === str.toLowerCase();
    }

    function isUppercase(str) {
        assertString(str);
        return str === str.toUpperCase();
    }

    /* eslint-disable no-control-regex */
    var ascii = /^[\x00-\x7F]+$/;
    /* eslint-enable no-control-regex */

    function isAscii(str) {
        assertString(str);
        return ascii.test(str);
    }

    var fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

    function isFullWidth(str) {
        assertString(str);
        return fullWidth.test(str);
    }

    var halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

    function isHalfWidth(str) {
        assertString(str);
        return halfWidth.test(str);
    }

    function isVariableWidth(str) {
        assertString(str);
        return fullWidth.test(str) && halfWidth.test(str);
    }

    /* eslint-disable no-control-regex */
    var multibyte = /[^\x00-\x7F]/;
    /* eslint-enable no-control-regex */

    function isMultibyte(str) {
        assertString(str);
        return multibyte.test(str);
    }

    var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

    function isSurrogatePair(str) {
        assertString(str);
        return surrogatePair.test(str);
    }

    function isFloat(str, options) {
        assertString(str);
        options = options || {};
        var floatrex = new RegExp('^(?:[-+])?(?:[0-9]+)?(?:\\' + (options.locale ? decimal[options.locale] : '.') + '[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$');
        if (str === '' || str === '.') {
            return false;
        }
        return floatrex.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max) && (!options.hasOwnProperty('lt') || str < options.lt) && (!options.hasOwnProperty('gt') || str > options.gt);
    }

    function decimalRegExp(options) {
        var regExp = new RegExp('^[-+]?([0-9]+)?(\\' + decimal[options.locale] + '[0-9]{' + options.decimal_digits + '})' + (options.force_decimal ? '' : '?') + '$');
        return regExp;
    }

    var default_decimal_options = {
        force_decimal: false,
        decimal_digits: '1,',
        locale: 'en-US'
    };

    var blacklist = ['', '-', '+'];

    function isDecimal(str, options) {
        assertString(str);
        options = merge(options, default_decimal_options);
        if (options.locale in decimal) {
            return !blacklist.includes(str.replace(/ /g, '')) && decimalRegExp(options).test(str);
        }
        throw new Error('Invalid locale \'' + options.locale + '\'');
    }

    var hexadecimal = /^[0-9A-F]+$/i;

    function isHexadecimal(str) {
        assertString(str);
        return hexadecimal.test(str);
    }

    function isDivisibleBy(str, num) {
        assertString(str);
        return toFloat(str) % parseInt(num, 10) === 0;
    }

    var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

    function isHexColor(str) {
        assertString(str);
        return hexcolor.test(str);
    }

    // see http://isrc.ifpi.org/en/isrc-standard/code-syntax
    var isrc = /^[A-Z]{2}[0-9A-Z]{3}\d{2}\d{5}$/;

    function isISRC(str) {
        assertString(str);
        return isrc.test(str);
    }

    var md5 = /^[a-f0-9]{32}$/;

    function isMD5(str) {
        assertString(str);
        return md5.test(str);
    }

    var lengths = {
        md5: 32,
        md4: 32,
        sha1: 40,
        sha256: 64,
        sha384: 96,
        sha512: 128,
        ripemd128: 32,
        ripemd160: 40,
        tiger128: 32,
        tiger160: 40,
        tiger192: 48,
        crc32: 8,
        crc32b: 8
    };

    function isHash(str, algorithm) {
        assertString(str);
        var hash = new RegExp('^[a-f0-9]{' + lengths[algorithm] + '}$');
        return hash.test(str);
    }

    function isJSON(str) {
        assertString(str);
        try {
            var obj = JSON.parse(str);
            return !!obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
        } catch (e) {/* ignore */ }
        return false;
    }

    function isEmpty(str) {
        assertString(str);
        return str.length === 0;
    }
    function notEmpty(str) {
        return !isEmpty(str);
    }
    /* eslint-disable prefer-rest-params */
    function isLength(str, options) {
        assertString(str);
        var min = void 0;
        var max = void 0;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            min = options.min || 0;
            max = options.max;
        } else {
            // backwards compatibility: isLength(str, min [, max])
            min = arguments[1];
            max = arguments[2];
        }
        var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
        var len = str.length - surrogatePairs.length;
        return len >= min && (typeof max === 'undefined' || len <= max);
    }

    var uuid = {
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    };

    function isUUID(str) {
        var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';

        assertString(str);
        var pattern = uuid[version];
        return pattern && pattern.test(str);
    }

    function isMongoId(str) {
        assertString(str);
        return isHexadecimal(str) && str.length === 24;
    }

    function isAfter(str) {
        var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());

        assertString(str);
        var comparison = toDate(date);
        var original = toDate(str);
        return !!(original && comparison && original > comparison);
    }

    function isBefore(str) {
        var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());

        assertString(str);
        var comparison = toDate(date);
        var original = toDate(str);
        return !!(original && comparison && original < comparison);
    }

    function isIn(str, options) {
        assertString(str);
        var i = void 0;
        if (Object.prototype.toString.call(options) === '[object Array]') {
            var array = [];
            for (i in options) {
                if ({}.hasOwnProperty.call(options, i)) {
                    array[i] = toString(options[i]);
                }
            }
            return array.indexOf(str) >= 0;
        } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            return options.hasOwnProperty(str);
        } else if (options && typeof options.indexOf === 'function') {
            return options.indexOf(str) >= 0;
        }
        return false;
    }

    /* eslint-disable max-len */
    var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;
    /* eslint-enable max-len */

    function isCreditCard(str) {
        assertString(str);
        var sanitized = str.replace(/[- ]+/g, '');
        if (!creditCard.test(sanitized)) {
            return false;
        }
        var sum = 0;
        var digit = void 0;
        var tmpNum = void 0;
        var shouldDouble = void 0;
        for (var i = sanitized.length - 1; i >= 0; i--) {
            digit = sanitized.substring(i, i + 1);
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += tmpNum % 10 + 1;
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }
        return !!(sum % 10 === 0 ? sanitized : false);
    }
    function isIdCard(str) {
        assertString(str);
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
        var pass = true;
        if (!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
            pass = false;
        }
        else if (!city[code.substr(0, 2)]) {
            pass = false;
        }
        else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    pass = false;
                }
            }
        }
        return pass;
    }
    var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

    function isISIN(str) {
        assertString(str);
        if (!isin.test(str)) {
            return false;
        }

        var checksumStr = str.replace(/[A-Z]/g, function (character) {
            return parseInt(character, 36);
        });

        var sum = 0;
        var digit = void 0;
        var tmpNum = void 0;
        var shouldDouble = true;
        for (var i = checksumStr.length - 2; i >= 0; i--) {
            digit = checksumStr.substring(i, i + 1);
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += tmpNum + 1;
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }

        return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
    }

    var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
    var isbn13Maybe = /^(?:[0-9]{13})$/;
    var factor = [1, 3];

    function isISBN(str) {
        var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        assertString(str);
        version = String(version);
        if (!version) {
            return isISBN(str, 10) || isISBN(str, 13);
        }
        var sanitized = str.replace(/[\s-]+/g, '');
        var checksum = 0;
        var i = void 0;
        if (version === '10') {
            if (!isbn10Maybe.test(sanitized)) {
                return false;
            }
            for (i = 0; i < 9; i++) {
                checksum += (i + 1) * sanitized.charAt(i);
            }
            if (sanitized.charAt(9) === 'X') {
                checksum += 10 * 10;
            } else {
                checksum += 10 * sanitized.charAt(9);
            }
            if (checksum % 11 === 0) {
                return !!sanitized;
            }
        } else if (version === '13') {
            if (!isbn13Maybe.test(sanitized)) {
                return false;
            }
            for (i = 0; i < 12; i++) {
                checksum += factor[i % 2] * sanitized.charAt(i);
            }
            if (sanitized.charAt(12) - (10 - checksum % 10) % 10 === 0) {
                return !!sanitized;
            }
        }
        return false;
    }

    var issn = '^\\d{4}-?\\d{3}[\\dX]$';

    function isISSN(str) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        assertString(str);
        var testIssn = issn;
        testIssn = options.require_hyphen ? testIssn.replace('?', '') : testIssn;
        testIssn = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, 'i');
        if (!testIssn.test(str)) {
            return false;
        }
        var issnDigits = str.replace('-', '');
        var position = 8;
        var checksum = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = issnDigits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var digit = _step.value;

                var digitValue = digit.toUpperCase() === 'X' ? 10 : +digit;
                checksum += digitValue * position;
                --position;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return checksum % 11 === 0;
    }

    /* eslint-disable max-len */
    var phones = {
        'ar-AE': /^((\+?971)|0)?5[024568]\d{7}$/,
        'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
        'ar-EG': /^((\+?20)|0)?1[012]\d{8}$/,
        'ar-JO': /^(\+?962|0)?7[789]\d{7}$/,
        'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
        'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
        'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
        'da-DK': /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
        'de-DE': /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
        'el-GR': /^(\+?30)?(69\d{8})$/,
        'en-AU': /^(\+?61|0)4\d{8}$/,
        'en-GB': /^(\+?44|0)7\d{9}$/,
        'en-HK': /^(\+?852\-?)?[456789]\d{3}\-?\d{4}$/,
        'en-IN': /^(\+?91|0)?[789]\d{9}$/,
        'en-KE': /^(\+?254|0)?[7]\d{8}$/,
        'en-NG': /^(\+?234|0)?[789]\d{9}$/,
        'en-NZ': /^(\+?64|0)2\d{7,9}$/,
        'en-PK': /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
        'en-RW': /^(\+?250|0)?[7]\d{8}$/,
        'en-TZ': /^(\+?255|0)?[67]\d{8}$/,
        'en-UG': /^(\+?256|0)?[7]\d{8}$/,
        'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
        'en-ZA': /^(\+?27|0)\d{9}$/,
        'en-ZM': /^(\+?26)?09[567]\d{7}$/,
        'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
        'et-EE': /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
        'fa-IR': /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
        'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5|6)?|50)\s?(\d\s?){4,8}\d$/,
        'fo-FO': /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
        'fr-FR': /^(\+?33|0)[67]\d{8}$/,
        'he-IL': /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}/,
        'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
        'id-ID': /^(\+?62|0[1-9])[\s|\d]+$/,
        'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
        'ja-JP': /^(\+?81|0)[789]0[ \-]?[1-9]\d{2}[ \-]?\d{5}$/,
        'kl-GL': /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
        'ko-KR': /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
        'lt-LT': /^(\+370|8)\d{8}$/,
        'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
        'nb-NO': /^(\+?47)?[49]\d{7}$/,
        'nl-BE': /^(\+?32|0)4?\d{8}$/,
        'nn-NO': /^(\+?47)?[49]\d{7}$/,
        'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
        'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
        'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
        'ro-RO': /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/,
        'ru-RU': /^(\+?7|8)?9\d{9}$/,
        'sk-SK': /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
        'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
        'tr-TR': /^(\+?90|0)?5\d{9}$/,
        'uk-UA': /^(\+?38|8)?0\d{9}$/,
        'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
        'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
        'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
    };
    /* eslint-enable max-len */

    // aliases
    phones['en-CA'] = phones['en-US'];
    phones['fr-BE'] = phones['nl-BE'];
    phones['zh-HK'] = phones['en-HK'];

    function isMobilePhone(str, locale) {
        assertString(str);
        if (locale in phones) {
            return phones[locale].test(str);
        } else if (locale === 'any') {
            for (var key in phones) {
                if (phones.hasOwnProperty(key)) {
                    var phone = phones[key];
                    if (phone.test(str)) {
                        return true;
                    }
                }
            }
            return false;
        }
        throw new Error('Invalid locale \'' + locale + '\'');
    }

    function currencyRegex(options) {
        var decimal_digits = '\\d{' + options.digits_after_decimal[0] + '}';
        options.digits_after_decimal.forEach(function (digit, index) {
            if (index !== 0) decimal_digits = decimal_digits + '|\\d{' + digit + '}';
        });
        var symbol = '(\\' + options.symbol.replace(/\./g, '\\.') + ')' + (options.require_symbol ? '' : '?'),
            negative = '-?',
            whole_dollar_amount_without_sep = '[1-9]\\d*',
            whole_dollar_amount_with_sep = '[1-9]\\d{0,2}(\\' + options.thousands_separator + '\\d{3})*',
            valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
            whole_dollar_amount = '(' + valid_whole_dollar_amounts.join('|') + ')?',
            decimal_amount = '(\\' + options.decimal_separator + '(' + decimal_digits + '))' + (options.require_decimal ? '' : '?');
        var pattern = whole_dollar_amount + (options.allow_decimal || options.require_decimal ? decimal_amount : '');

        // default is negative sign before symbol, but there are two other options (besides parens)
        if (options.allow_negatives && !options.parens_for_negatives) {
            if (options.negative_sign_after_digits) {
                pattern += negative;
            } else if (options.negative_sign_before_digits) {
                pattern = negative + pattern;
            }
        }

        // South African Rand, for example, uses R 123 (space) and R-123 (no space)
        if (options.allow_negative_sign_placeholder) {
            pattern = '( (?!\\-))?' + pattern;
        } else if (options.allow_space_after_symbol) {
            pattern = ' ?' + pattern;
        } else if (options.allow_space_after_digits) {
            pattern += '( (?!$))?';
        }

        if (options.symbol_after_digits) {
            pattern += symbol;
        } else {
            pattern = symbol + pattern;
        }

        if (options.allow_negatives) {
            if (options.parens_for_negatives) {
                pattern = '(\\(' + pattern + '\\)|' + pattern + ')';
            } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
                pattern = negative + pattern;
            }
        }

        // ensure there's a dollar and/or decimal amount, and that
        // it doesn't start with a space or a negative sign followed by a space
        return new RegExp('^(?!-? )(?=.*\\d)' + pattern + '$');
    }

    var default_currency_options = {
        symbol: '$',
        require_symbol: false,
        allow_space_after_symbol: false,
        symbol_after_digits: false,
        allow_negatives: true,
        parens_for_negatives: false,
        negative_sign_before_digits: false,
        negative_sign_after_digits: false,
        allow_negative_sign_placeholder: false,
        thousands_separator: ',',
        decimal_separator: '.',
        allow_decimal: true,
        require_decimal: false,
        digits_after_decimal: [2],
        allow_space_after_digits: false
    };

    function isCurrency(str, options) {
        assertString(str);
        options = merge(options, default_currency_options);
        return currencyRegex(options).test(str);
    }

    /* eslint-disable max-len */
    // from http://goo.gl/0ejHHW
    var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    /* eslint-enable max-len */

    function isISO8601(str) {
        assertString(str);
        return iso8601.test(str);
    }

    // from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    var validISO31661Alpha2CountriesCodes = ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'];

    function isISO31661Alpha2(str) {
        assertString(str);
        return validISO31661Alpha2CountriesCodes.includes(str.toUpperCase());
    }

    var notBase64 = /[^A-Z0-9+\/=]/i;

    function isBase64(str) {
        assertString(str);
        var len = str.length;
        if (!len || len % 4 !== 0 || notBase64.test(str)) {
            return false;
        }
        var firstPaddingChar = str.indexOf('=');
        return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
    }

    var dataURI = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9!\$&',\(\)\*\+,;=\-\._~:@\/\?%\s]*\s*$/i; // eslint-disable-line max-len

    function isDataURI(str) {
        assertString(str);
        return dataURI.test(str);
    }

    var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
    var long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;

    var isLatLong = function (str) {
        assertString(str);
        if (!str.includes(',')) return false;
        var pair = str.split(',');
        return lat.test(pair[0]) && long.test(pair[1]);
    };

    // common patterns
    var threeDigit = /^\d{3}$/;
    var fourDigit = /^\d{4}$/;
    var fiveDigit = /^\d{5}$/;
    var sixDigit = /^\d{6}$/;

    var patterns = {
        AT: fourDigit,
        AU: fourDigit,
        BE: fourDigit,
        CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
        CH: fourDigit,
        CZ: /^\d{3}\s?\d{2}$/,
        DE: fiveDigit,
        DK: fourDigit,
        DZ: fiveDigit,
        ES: fiveDigit,
        FI: fiveDigit,
        FR: /^\d{2}\s?\d{3}$/,
        GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
        GR: /^\d{3}\s?\d{2}$/,
        IL: fiveDigit,
        IN: sixDigit,
        IS: threeDigit,
        IT: fiveDigit,
        JP: /^\d{3}\-\d{4}$/,
        KE: fiveDigit,
        LI: /^(948[5-9]|949[0-7])$/,
        MX: fiveDigit,
        NL: /^\d{4}\s?[a-z]{2}$/i,
        NO: fourDigit,
        PL: /^\d{2}\-\d{3}$/,
        PT: /^\d{4}(\-\d{3})?$/,
        RO: sixDigit,
        RU: sixDigit,
        SA: fiveDigit,
        SE: /^\d{3}\s?\d{2}$/,
        TW: /^\d{3}(\d{2})?$/,
        US: /^\d{5}(-\d{4})?$/,
        ZA: fourDigit,
        ZM: fiveDigit
    };



    var isPostalCode = function (str, locale) {
        assertString(str);
        if (locale in patterns) {
            return patterns[locale].test(str);
        } else if (locale === 'any') {
            for (var key in patterns) {
                if (patterns.hasOwnProperty(key)) {
                    var pattern = patterns[key];
                    if (pattern.test(str)) {
                        return true;
                    }
                }
            }
            return false;
        }
        throw new Error('Invalid locale \'' + locale + '\'');
    };

    function ltrim(str, chars) {
        assertString(str);
        var pattern = chars ? new RegExp('^[' + chars + ']+', 'g') : /^\s+/g;
        return str.replace(pattern, '');
    }

    function rtrim(str, chars) {
        assertString(str);
        var pattern = chars ? new RegExp('[' + chars + ']') : /\s/;

        var idx = str.length - 1;
        while (idx >= 0 && pattern.test(str[idx])) {
            idx--;
        }

        return idx < str.length ? str.substr(0, idx + 1) : str;
    }

    function trim(str, chars) {
        return rtrim(ltrim(str, chars), chars);
    }

    function escape(str) {
        assertString(str);
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\\/g, '&#x5C;').replace(/`/g, '&#96;');
    }

    function unescape(str) {
        assertString(str);
        return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#x5C;/g, '\\').replace(/&#96;/g, '`');
    }

    function blacklist$1(str, chars) {
        assertString(str);
        return str.replace(new RegExp('[' + chars + ']+', 'g'), '');
    }

    function stripLow(str, keep_new_lines) {
        assertString(str);
        var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
        return blacklist$1(str, chars);
    }

    function whitelist(str, chars) {
        assertString(str);
        return str.replace(new RegExp('[^' + chars + ']+', 'g'), '');
    }

    function isWhitelisted(str, chars) {
        assertString(str);
        for (var i = str.length - 1; i >= 0; i--) {
            if (chars.indexOf(str[i]) === -1) {
                return false;
            }
        }
        return true;
    }

    var default_normalize_email_options = {
        // The following options apply to all email addresses
        // Lowercases the local part of the email address.
        // Please note this may violate RFC 5321 as per http://stackoverflow.com/a/9808332/192024).
        // The domain is always lowercased, as per RFC 1035
        all_lowercase: true,

        // The following conversions are specific to GMail
        // Lowercases the local part of the GMail address (known to be case-insensitive)
        gmail_lowercase: true,
        // Removes dots from the local part of the email address, as that's ignored by GMail
        gmail_remove_dots: true,
        // Removes the subaddress (e.g. "+foo") from the email address
        gmail_remove_subaddress: true,
        // Conversts the googlemail.com domain to gmail.com
        gmail_convert_googlemaildotcom: true,

        // The following conversions are specific to Outlook.com / Windows Live / Hotmail
        // Lowercases the local part of the Outlook.com address (known to be case-insensitive)
        outlookdotcom_lowercase: true,
        // Removes the subaddress (e.g. "+foo") from the email address
        outlookdotcom_remove_subaddress: true,

        // The following conversions are specific to Yahoo
        // Lowercases the local part of the Yahoo address (known to be case-insensitive)
        yahoo_lowercase: true,
        // Removes the subaddress (e.g. "-foo") from the email address
        yahoo_remove_subaddress: true,

        // The following conversions are specific to iCloud
        // Lowercases the local part of the iCloud address (known to be case-insensitive)
        icloud_lowercase: true,
        // Removes the subaddress (e.g. "+foo") from the email address
        icloud_remove_subaddress: true
    };

    // List of domains used by iCloud
    var icloud_domains = ['icloud.com', 'me.com'];

    // List of domains used by Outlook.com and its predecessors
    // This list is likely incomplete.
    // Partial reference:
    // https://blogs.office.com/2013/04/17/outlook-com-gets-two-step-verification-sign-in-by-alias-and-new-international-domains/
    var outlookdotcom_domains = ['hotmail.at', 'hotmail.be', 'hotmail.ca', 'hotmail.cl', 'hotmail.co.il', 'hotmail.co.nz', 'hotmail.co.th', 'hotmail.co.uk', 'hotmail.com', 'hotmail.com.ar', 'hotmail.com.au', 'hotmail.com.br', 'hotmail.com.gr', 'hotmail.com.mx', 'hotmail.com.pe', 'hotmail.com.tr', 'hotmail.com.vn', 'hotmail.cz', 'hotmail.de', 'hotmail.dk', 'hotmail.es', 'hotmail.fr', 'hotmail.hu', 'hotmail.id', 'hotmail.ie', 'hotmail.in', 'hotmail.it', 'hotmail.jp', 'hotmail.kr', 'hotmail.lv', 'hotmail.my', 'hotmail.ph', 'hotmail.pt', 'hotmail.sa', 'hotmail.sg', 'hotmail.sk', 'live.be', 'live.co.uk', 'live.com', 'live.com.ar', 'live.com.mx', 'live.de', 'live.es', 'live.eu', 'live.fr', 'live.it', 'live.nl', 'msn.com', 'outlook.at', 'outlook.be', 'outlook.cl', 'outlook.co.il', 'outlook.co.nz', 'outlook.co.th', 'outlook.com', 'outlook.com.ar', 'outlook.com.au', 'outlook.com.br', 'outlook.com.gr', 'outlook.com.pe', 'outlook.com.tr', 'outlook.com.vn', 'outlook.cz', 'outlook.de', 'outlook.dk', 'outlook.es', 'outlook.fr', 'outlook.hu', 'outlook.id', 'outlook.ie', 'outlook.in', 'outlook.it', 'outlook.jp', 'outlook.kr', 'outlook.lv', 'outlook.my', 'outlook.ph', 'outlook.pt', 'outlook.sa', 'outlook.sg', 'outlook.sk', 'passport.com'];

    // List of domains used by Yahoo Mail
    // This list is likely incomplete
    var yahoo_domains = ['rocketmail.com', 'yahoo.ca', 'yahoo.co.uk', 'yahoo.com', 'yahoo.de', 'yahoo.fr', 'yahoo.in', 'yahoo.it', 'ymail.com'];

    function normalizeEmail(email, options) {
        options = merge(options, default_normalize_email_options);

        var raw_parts = email.split('@');
        var domain = raw_parts.pop();
        var user = raw_parts.join('@');
        var parts = [user, domain];

        // The domain is always lowercased, as it's case-insensitive per RFC 1035
        parts[1] = parts[1].toLowerCase();

        if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
            // Address is GMail
            if (options.gmail_remove_subaddress) {
                parts[0] = parts[0].split('+')[0];
            }
            if (options.gmail_remove_dots) {
                parts[0] = parts[0].replace(/\./g, '');
            }
            if (!parts[0].length) {
                return false;
            }
            if (options.all_lowercase || options.gmail_lowercase) {
                parts[0] = parts[0].toLowerCase();
            }
            parts[1] = options.gmail_convert_googlemaildotcom ? 'gmail.com' : parts[1];
        } else if (~icloud_domains.indexOf(parts[1])) {
            // Address is iCloud
            if (options.icloud_remove_subaddress) {
                parts[0] = parts[0].split('+')[0];
            }
            if (!parts[0].length) {
                return false;
            }
            if (options.all_lowercase || options.icloud_lowercase) {
                parts[0] = parts[0].toLowerCase();
            }
        } else if (~outlookdotcom_domains.indexOf(parts[1])) {
            // Address is Outlook.com
            if (options.outlookdotcom_remove_subaddress) {
                parts[0] = parts[0].split('+')[0];
            }
            if (!parts[0].length) {
                return false;
            }
            if (options.all_lowercase || options.outlookdotcom_lowercase) {
                parts[0] = parts[0].toLowerCase();
            }
        } else if (~yahoo_domains.indexOf(parts[1])) {
            // Address is Yahoo
            if (options.yahoo_remove_subaddress) {
                var components = parts[0].split('-');
                parts[0] = components.length > 1 ? components.slice(0, -1).join('-') : components[0];
            }
            if (!parts[0].length) {
                return false;
            }
            if (options.all_lowercase || options.yahoo_lowercase) {
                parts[0] = parts[0].toLowerCase();
            }
        } else if (options.all_lowercase) {
            // Any other address
            parts[0] = parts[0].toLowerCase();
        }
        return parts.join('@');
    }


    var validator = {
        toDate: toDate,
        toFloat: toFloat,
        toInt: toInt,
        toBoolean: toBoolean,
        equals: equals,
        equalto: equalto,
        contains: contains,
        matches: matches,
        isEmail: isEmail,
        isURL: isURL,
        isMACAddress: isMACAddress,
        isIP: isIP,
        isFQDN: isFDQN,
        isBoolean: isBoolean,
        isAlpha: isAlpha,
        isAlphanumeric: isAlphanumeric,
        isNumeric: isNumeric,
        isPort: isPort,
        isLowercase: isLowercase,
        isUppercase: isUppercase,
        isAscii: isAscii,
        isFullWidth: isFullWidth,
        isHalfWidth: isHalfWidth,
        isVariableWidth: isVariableWidth,
        isMultibyte: isMultibyte,
        isSurrogatePair: isSurrogatePair,
        isInt: isInt,
        isFloat: isFloat,
        isDecimal: isDecimal,
        isHexadecimal: isHexadecimal,
        isDivisibleBy: isDivisibleBy,
        isHexColor: isHexColor,
        isISRC: isISRC,
        isMD5: isMD5,
        isHash: isHash,
        isJSON: isJSON,
        isEmpty: isEmpty,
        notEmpty: notEmpty,
        isLength: isLength,
        isByteLength: isByteLength,
        isUUID: isUUID,
        isMongoId: isMongoId,
        isAfter: isAfter,
        isBefore: isBefore,
        isIn: isIn,
        isCreditCard: isCreditCard,
        isIdCard: isIdCard,
        isISIN: isISIN,
        isISBN: isISBN,
        isISSN: isISSN,
        isMobilePhone: isMobilePhone,
        isPostalCode: isPostalCode,
        isCurrency: isCurrency,
        isISO8601: isISO8601,
        isISO31661Alpha2: isISO31661Alpha2,
        isBase64: isBase64,
        isDataURI: isDataURI,
        isLatLong: isLatLong,
        ltrim: ltrim,
        rtrim: rtrim,
        trim: trim,
        escape: escape,
        unescape: unescape,
        stripLow: stripLow,
        whitelist: whitelist,
        blacklist: blacklist$1,
        isWhitelisted: isWhitelisted,
        normalizeEmail: normalizeEmail,
        toString: toString,
        validform: validform,
        automaticStartUp: automaticStartUp,
        manualStartUp: manualStartUp
    };
    var globalValidaOption = {
        elements: [],
        options: []
    }
    //获得焦点将显示气泡提示效果
    var defaultBalloonOption = {
        width: "300",
        color: "#777f84"
    };
    //气泡提示
    function balloontip(event, options) {
        event.onfocus = function () {
            if (options.tiptext && options.tiptext.length > 0) {
                var balloon = document.createElement("div");
                this.parentNode.insertBefore(balloon, this.nextSibling);
                balloon.className = "balloon animated zoomIn";
                balloon.style = "animation-duration: 0.3s;width: " + options.width + "px;left: " + (this.offsetLeft + this.clientWidth + 20) + "px; top: " + this.offsetTop + "px; position: absolute;z-index: 1;box-shadow: 0 0 5px 0 rgba(0,0,0,.15);padding: 16px;color: #373d41;border-color: transparent;background-color: #fff;";
                var ballondiv = document.createElement("div");
                balloon.appendChild(ballondiv);
                options.tiptext.forEach(function (item, index) {
                    var t_tip = document.createElement("div");
                    t_tip.className = "t-tip";
                    t_tip.style = " font-size: 12px;color: " + options.color + ";letter-spacing: 0;line-height: 20px;position: relative;";
                    ballondiv.appendChild(t_tip);
                    var t_tip_icon = document.createElement("span");
                    t_tip.appendChild(t_tip_icon);
                    t_tip_icon.className = "t-tip-icon";
                    t_tip_icon.style = " position: relative;margin-right: 5px;top: -3px;left: 0;";
                    var t_tip_text = document.createElement("span");
                    t_tip.appendChild(t_tip_text);
                    t_tip_text.className = "t-tip-text";
                    t_tip_text.style = "width: " + (options.width - 45) + "px;vertical-align: top;display: inline-block;";
                    t_tip_icon.innerText = ".";
                    t_tip_text.innerText = item.text;
                });
            }

        }
        event.onblur = function () {
            var balloons = this.parentNode.getElementsByClassName("balloon");
            var currentels = this;
            for (var i = balloons.length - 1; i >= 0; i--) {
                currentels.parentNode.removeChild(balloons[i]);
            }
        }
    }
    var defaultValidatorOption = {
        autotip: false
    };
    //表单验证失败自动构建错误提示
    function appendValidErrorTip(tag, errormsg) {
        removeValidErrorTip(tag);
        var validerrortip = document.createElement("span");
        tag.parentNode.insertBefore(validerrortip, this.nextSibling);
        validerrortip.className = "valid-error-tip animated zoomIn";
        validerrortip.innerText = errormsg;
        validerrortip.style = "animation-duration: 0.3s;font-size: 14px;color: #f15533;line-height: 14px;position: absolute;left: " + (tag.offsetLeft + tag.clientWidth + 20) + "px;top: " + (tag.offsetTop + tag.clientHeight / 2 - 7) + "px;text-align: left;";
        tag.style.borderColor = "#f15533";
    }
    //移除验证失败自动构建的错误提示
    function removeValidErrorTip(tag) {
        var validerrortips = tag.parentNode.getElementsByClassName("valid-error-tip");
        var currentels = tag;
        for (var i = validerrortips.length - 1; i >= 0; i--) {
            tag.parentNode.removeChild(validerrortips[i]);
        }
        tag.style.borderColor = "";
    }

    //验证全部表单控件,通常表单在提交前调用
    //参数一：验证成功回调，
    //参数二：验证失败回调,回调函数带一个数组对象。对象包含：tag：验证失败的元素，errormsg、验证失败的错误信息
    function validform(onsuccess, onerror) {
        var elements = globalValidaOption.elements;
        var options = globalValidaOption.options;
        var errors = [];
        if (elements.length <= 0)
            throw "there is no form element to verify,please call (manualStartUp or automaticStartUp) action initialization form validation listeners.";
        Array.prototype.forEach.call(elements, function (item, index, arr) {
            if (options[index].validator) {
                var validatorOption = extend({}, defaultValidatorOption);
                extend(validatorOption, options[index].validator);
                if (options[index].validator.group && options[index].validator.group.length > 0) {
                    validwatch(item, validatorOption);
                    var errormsg = valid(item, validatorOption);
                    if (errormsg) {
                        errors.push({ tag: item, errormsg: errormsg });
                    }
                }
            }
        });
        if (errors.length > 0) {
            if (typeof onerror == "function") {
                onerror(errors);
            }
        }
        else {
            if (typeof onsuccess == "function") {
                onsuccess();
            }
        }
    }
    //验证监听器
    function validwatch(tag, option) {
        //此事件会在value属性值发生改变时触发，通过js改变value属性值不会触发此事件。
        //只有IE8以上或者谷歌火狐等标准浏览器支持。
        tag.oninput = function () {
            var value = this.value;
            if (validator.isEmpty(value)) {
                removeValidErrorTip(this);
            }
            else {
                valid(this, option);
            }
        }
    }
    //验证单个表单元素
    function valid(tag, option) {
        var value = tag.value;
        for (var i = 0; i < option.group.length; i++) {
            var item = option.group[i];
            if (!validator[item.type](value, item.extra_arg1, item.extra_arg2, item.extra_arg3)) {
                //验证不通过
                if (option.autotip) {
                    appendValidErrorTip(tag, item.errormsg);
                }
                if (typeof item.onerror == "function") {
                    item.onerror(tag);
                }
                return item.errormsg;
            }
            else {
                if (option.autotip) {
                    removeValidErrorTip(tag);
                }
                if (typeof item.onsuccess == "function") {
                    item.onsuccess(tag);
                }
            }
        }
    }
    //自动启动验证监听器
    function automaticStartUp() {
        globalValidaOption = {
            elements: [],
            options: []
        }
        var els = document.getElementsByClassName("form-validator-watch");
        Array.prototype.forEach.call(els, function (item, index, arr) {
            var _option = item.getAttribute("form-validator-watch-option");
            var option = "{}";
            if (_option != undefined && _option != null && _option.trim().length > 0) {
                option = _option;
            }
            globalValidaOption.elements.push(item);
            globalValidaOption.options.push(eval('(' + option + ')'));
            startUp(item, eval('(' + option + ')'));
        });
    }
    //手动启动验证监听器
    function manualStartUp(elements, _options) {
        globalValidaOption = {
            elements: [],
            options: []
        }
        Array.prototype.forEach.call(elements, function (item, index, arr) {
            globalValidaOption.elements.push(item);
            globalValidaOption.options.push(_options[index]);
            startUp(item, _options[index]);
        });
    }
    //启动验证监听器
    function startUp(event, _option) {
        if (_option) {
            if (_option.balloon) {
                //气泡提示
                var balloonOption = extend({}, defaultBalloonOption);
                extend(balloonOption, _option.balloon);
                balloontip(event, balloonOption);
            }
            if (_option.validator) {
                var validatorOption = extend({}, defaultValidatorOption);
                extend(validatorOption, _option.validator);
                // console.log(validatorOption);
            }
        }
    }

    window.formvalidator = validator;
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return validator;
        });
    } else if (typeof exports === 'object') {
        module.exports = validator;
    } else {
    }
})(this);



