// ------ ColorPicker ------ //

(function (window) {
    window.jsColorPicker = function(selectors, config) {
        var renderCallback = function(colors, mode) {
                var options = this,
                    input = options.input,
                    patch = options.patch,
                    RGB = colors.RND.rgb,
                    HSL = colors.RND.hsl,
                    AHEX = options.isIE8 ? (colors.alpha < 0.16 ? '0' : '') +
                        (Math.round(colors.alpha * 100)).toString(16).toUpperCase() + colors.HEX : '',
                    RGBInnerText = RGB.r + ',' + RGB.g + ',' + RGB.b,
                    RGBAText = RGBInnerText + ',' + colors.alpha,
                    isAlpha = colors.alpha !== 1 && !options.isIE8,
                    colorMode = input.getAttribute('data-colorMode');

                patch.style.cssText =
                    'color:' + (colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd') + ';' + // Black...???
                    'background-color: rgba(' + RGBAText + ');' +
                    'filter:' + (options.isIE8 ? 'progid:DXImageTransform.Microsoft.gradient(' + // IE<9
                        'startColorstr=#' + AHEX + ',' + 'endColorstr=#' + AHEX + ')' : '');

                input.value = RGBAText;

                if (options.displayCallback) {
                    options.displayCallback(colors, mode, options);
                }
            },
            extractValue = function(elm) {
                var val = elm.value || elm.getAttribute('value') || elm.style.backgroundColor || "0,0,0,1";
                if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+,[0-9. ]+$/.test(val)) return "rgba("+val+")";
                if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+$/.test(val)) return "rgba("+val+",1)";
                return null;
            },
            actionCallback = function(event, action) {
                var options = this,
                    colorPicker = colorPickers.current;

                if (action === 'toMemory') {
                    var memos = colorPicker.nodes.memos,
                        backgroundColor = '',
                        opacity = 0,
                        cookieTXT = [];

                    for (var n = 0, m = memos.length; n < m; n++) {
                        backgroundColor = memos[n].style.backgroundColor;
                        opacity = memos[n].style.opacity;
                        opacity = Math.round((opacity === '' ? 1 : opacity) * 100) / 100;
                        cookieTXT.push(backgroundColor.
                            replace(/, /g, ',').
                            replace('rgb(', 'rgba(').
                            replace(')', ',' + opacity + ')')
                        );
                    }
                    cookieTXT = '\'' + cookieTXT.join('\',\'') + '\'';
                    ColorPicker.docCookies('colorPickerMemos' + (options.noAlpha ? 'NoAlpha' : ''), cookieTXT);
                } else if (action === 'resizeApp') {
                    ColorPicker.docCookies('colorPickerSize', colorPicker.color.options.currentSize);
                } else if (action === 'modeChange') {
                    var mode = colorPicker.color.options.mode;

                    ColorPicker.docCookies('colorPickerMode', mode.type + '-' + mode.z);
                }
            },
            createInstance = function(elm, config) {
                var initConfig = {
                        klass: window.ColorPicker,
                        input: elm,
                        patch: elm,
                        isIE8: !!document.all && !document.addEventListener, // Opera???
                        // *** animationSpeed: 200,
                        // *** draggable: true,
                        margin: {left: -1, top: 2},
                        customBG: '#FFFFFF',
                        // displayCallback: displayCallback,
                        /* --- regular colorPicker options from this point --- */
                        color: extractValue(elm),
                        initStyle: 'display: none',
                        mode: ColorPicker.docCookies('colorPickerMode') || 'hsv-h',
                        // memoryColors: (function(colors, config) {
                        //     return config.noAlpha ?
                        //         colors.replace(/\,\d*\.*\d*\)/g, ',1)') : colors;
                        // })($.docCookies('colorPickerMemos'), config || {}),
                        memoryColors: ColorPicker.docCookies('colorPickerMemos' +
                            ((config || {}).noAlpha ? 'NoAlpha' : '')),
                        size: ColorPicker.docCookies('colorPickerSize') || 1,
                        renderCallback: renderCallback,
                        actionCallback: actionCallback
                    };

                for (var n in config) {
                    initConfig[n] = config[n]; 
                }
                return new initConfig.klass(initConfig);
            },
            doEventListeners = function(elm, multiple, off) {
                var onOff = off ? 'removeEventListener' : 'addEventListener',
                    inputListener = function(e) {
                        var index = multiple ? Array.prototype.indexOf.call(elms, this) : 0,
                            colorPicker = colorPickers[index] ||
                                (colorPickers[index] = createInstance(this, config)),
                            options = colorPicker.color.options;

                        options.color = extractValue(elm); // brings color to default on reset
                        //检查颜色合法性
                        if (options.color != null && options.color == options.color.match(/rgba\([0-9 ]+,[0-9 ]+,[0-9 ]+,[0-9. ]+\)/)[0]) {
                            var chec = options.color.match(/[0-9.]+/g);
                            if (chec.length != 4)
                                return;
                            for (var i = 0; i < 3; i++) {
                                if (chec[i] != chec[i].match(/\d+/)[0] || +chec[i] < 0 || +chec[i] > 255)
                                    return;
                            }
                            if (chec[3] != chec[3].match(/\d+(\.\d+)?/)[0] || parseFloat(chec[3]) > 1 || parseFloat(chec[3] < 0))
                                return;
                            if (!multiple) {
                                colorPicker.setColor(extractValue(elm), undefined, undefined, true);
                                colorPicker.saveAsBackground();
                            }
                            colorPickers.current = colorPickers[index];
                        }
                    },
                    createListener = function() {
                        elm = document.getElementById("colorPicker");
                        var input = elm,
                            position = window.ColorPicker.getOrigin(input),
                            index = multiple ? Array.prototype.indexOf.call(elms, elm) : 0,
                            colorPicker = colorPickers[index] ||
                                (colorPickers[index] = createInstance(elm, config)),
                            options = colorPicker.color.options,
                            colorPickerUI = colorPicker.nodes.colorPicker,
                            appendTo = (options.appendTo || document.body),
                            isStatic = /static/.test(window.getComputedStyle(appendTo).position),
                            atrect = isStatic ? {left: 0, top: 0} : appendTo.getBoundingClientRect(),
                            waitTimer = 0;
                        
                        options.color = extractValue(elm); // brings color to default on reset
                        colorPickerUI.style.cssText = 
                            'position: absolute;' + (!colorPickers[index].cssIsReady ? 'display: none;' : '') +
                            'left:' + (position.left + options.margin.left - atrect.left) + 'px;' +
                            'top:' + (position.top + +input.offsetHeight + options.margin.top - atrect.top) + 'px;';

                        if (!multiple) {
                            options.input = elm;
                            options.patch = elm; // check again???
                            colorPicker.setColor(extractValue(elm), undefined, undefined, true);
                            colorPicker.saveAsBackground();
                        }
                        colorPickers.current = colorPickers[index];
                        appendTo.appendChild(colorPickerUI);
                        waitTimer = setInterval(function() { // compensating late style on onload in colorPicker
                            if (colorPickers.current.cssIsReady) {
                                waitTimer = clearInterval(waitTimer);
                                colorPickerUI.style.display = 'block';
                            }
                        }, 10);
                    },
                    hideListener = function(e) {
                        var colorPicker = colorPickers.current,
                            colorPickerUI = (colorPicker ? colorPicker.nodes.colorPicker : undefined),
                            animationSpeed = colorPicker ? colorPicker.color.options.animationSpeed : 0,
                            isColorPicker = colorPicker && (function(elm) {
                                while (elm) {
                                    if ((elm.className || '').indexOf('cpPanel') !== -1) return elm;
                                    elm = elm.parentNode;
                                }
                                return false;
                            })(e.target),
                            inputIndex = Array.prototype.indexOf.call(elms, e.target);

                        if (isColorPicker && Array.prototype.indexOf.call(colorPickers, isColorPicker)) {
                            if (e.target === colorPicker.nodes.exit) {
                                colorPickerUI.parentNode.style.display = 'none';
                                document.activeElement.blur();
                            } else {
                                // ...
                            }
                        } else if (inputIndex !== -1) {
                            // ...
                        } else if (colorPickerUI) {
                            colorPickerUI.parentNode.style.display = 'none';
                        }
                    };
                elm[onOff]('input', inputListener);
                window.jsColorPicker.create = createListener;
            },
            // this is a way to prevent data binding on HTMLElements
            colorPickers = window.jsColorPicker.colorPickers || [],
            elms = document.querySelectorAll(selectors),
            testColors = new window.Colors({customBG: config.customBG, allMixDetails: true});

        window.jsColorPicker.colorPickers = colorPickers;

        for (var n = 0, m = elms.length; n < m; n++) {
            var elm = elms[n];

            if (config === 'destroy') {
                doEventListeners(elm, (config && config.multipleInstances), true);
                if (colorPickers[n]) {
                    colorPickers[n].destroyAll();
                }
            } else {
                var color = extractValue(elm);
                var value = color.split('(');

                testColors.setColor(color);
                if (config && config.init) {
                    config.init(elm, testColors.colors);
                }
                elm.setAttribute('data-colorMode', value[1] ? value[0].substr(0, 3) : 'HEX');
                doEventListeners(elm, (config && config.multipleInstances), false);
                if (config && config.readOnly) {
                    elm.readOnly = true;
                }
            }
        };

        return window.jsColorPicker.colorPickers;
    };

    window.ColorPicker.docCookies = function(key, val, options) {
        var encode = encodeURIComponent, decode = decodeURIComponent,
            cookies, n, tmp, cache = {},
            days;

        if (val === undefined) { // all about reading cookies
            cookies = document.cookie.split(/;\s*/) || [];
            for (n = cookies.length; n--; ) {
                tmp = cookies[n].split('=');
                if (tmp[0]) cache[decode(tmp.shift())] = decode(tmp.join('=')); // there might be '='s in the value...
            }

            if (!key) return cache; // return Json for easy access to all cookies
            else return cache[key]; // easy access to cookies from here
        } else { // write/delete cookie
            options = options || {};

            if (val === '' || options.expires < 0) { // prepare deleteing the cookie
                options.expires = -1;
                // options.path = options.domain = options.secure = undefined; // to make shure the cookie gets deleted...
            }

            if (options.expires !== undefined) { // prepare date if any
                days = new Date();
                days.setDate(days.getDate() + options.expires);
            }

            document.cookie = encode(key) + '=' + encode(val) +
                (days            ? '; expires=' + days.toUTCString() : '') +
                (options.path    ? '; path='    + options.path       : '') +
                (options.domain  ? '; domain='  + options.domain     : '') +
                (options.secure  ? '; secure'                        : '');
        }
    };
})(this);

// Added
jsColorPicker('input.color', {
    customBG: '#222',
    readOnly: false,
    // patch: false,
    init: function(elm, colors) { // colors is a different instance (not connected to colorPicker)
        elm.style.backgroundColor = elm.value;
        elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd';
    },
    appendTo: document.getElementById("colorPanel"),
    size: 1,
});

function openColorPicker(px, py, callback) {
    window.jsColorPicker.confirm = callback;
    var colorPanel = document.getElementById('colorPanel');
    if (colorPanel.style.display=='none' && px != null && py != null) {
        colorPanel.style.display = "inline-block";
        colorPanel.style.left = px + 'px';
        colorPanel.style.top = py + 'px';
        window.jsColorPicker.create();
    }
    else {
        colorPanel.style.display = 'none';
        delete window.jsColorPicker.confirm;
    }
}

function confirmColor() {
    var colorPicker = document.getElementById("colorPicker");
    if (window.jsColorPicker.confirm) { /* 存在块 */
        // 检测需要是合法数值
        var val = colorPicker.value;
        if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+,[0-9. ]+$/.test(val)) val = "rgba("+val+")";
        else if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+$/.test(val)) val = "rgba("+val+",1)";
        else val = null;
        if (val) window.jsColorPicker.confirm(val);
    }
    else {
        colorPicker.select();
        document.execCommand("Copy");
    }
    colorPanel.style.display = 'none';
    delete window.jsColorPicker.confirm;
}

// ------ AutoCompletion ------

