editor_util_wrapper = function (editor) {

    editor_util = function () {

    }

    editor_util.prototype.guid = function () {
        return 'id_' + 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    editor_util.prototype.HTMLescape = function (str_) {
        return String(str_).split('').map(function (v) {
            return '&#' + v.charCodeAt(0) + ';'
        }).join('');
    }

    editor_util.prototype.getPixel = function (imgData, x, y) {
        var offset = (x + y * imgData.width) * 4;
        var r = imgData.data[offset + 0];
        var g = imgData.data[offset + 1];
        var b = imgData.data[offset + 2];
        var a = imgData.data[offset + 3];
        return [r, g, b, a];
    }

    editor_util.prototype.setPixel = function (imgData, x, y, rgba) {
        var offset = (x + y * imgData.width) * 4;
        imgData.data[offset + 0] = rgba[0];
        imgData.data[offset + 1] = rgba[1];
        imgData.data[offset + 2] = rgba[2];
        imgData.data[offset + 3] = rgba[3];
    }

    // rgbToHsl hue2rgb hslToRgb from https://github.com/carloscabo/colz.git
    //--------------------------------------------
    // The MIT License (MIT)
    //
    // Copyright (c) 2014 Carlos Cabo
    //
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included in all
    // copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.
    //--------------------------------------------
    // https://github.com/carloscabo/colz/blob/master/public/js/colz.class.js
    var round = Math.round;
    var rgbToHsl = function (rgba) {
        var arg, r, g, b, h, s, l, d, max, min;

        arg = rgba;

        if (typeof arg[0] === 'number') {
            r = arg[0];
            g = arg[1];
            b = arg[2];
        } else {
            r = arg[0][0];
            g = arg[0][1];
            b = arg[0][2];
        }

        r /= 255;
        g /= 255;
        b /= 255;

        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        //CARLOS
        h = round(h * 360);
        s = round(s * 100);
        l = round(l * 100);

        return [h, s, l];
    }
    //
    var hue2rgb = function (p, q, t) {
        if (t < 0) { t += 1; }
        if (t > 1) { t -= 1; }
        if (t < 1 / 6) { return p + (q - p) * 6 * t; }
        if (t < 1 / 2) { return q; }
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
        return p;
    }
    var hslToRgb = function (hsl) {
        var arg, r, g, b, h, s, l, q, p;

        arg = hsl;

        if (typeof arg[0] === 'number') {
            h = arg[0] / 360;
            s = arg[1] / 100;
            l = arg[2] / 100;
        } else {
            h = arg[0][0] / 360;
            s = arg[0][1] / 100;
            l = arg[0][2] / 100;
        }

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {

            q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [round(r * 255), round(g * 255), round(b * 255)];
    }
    editor_util.prototype.rgbToHsl = rgbToHsl
    editor_util.prototype.hue2rgb = hue2rgb
    editor_util.prototype.hslToRgb = hslToRgb

    editor_util.prototype.encode64 = function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    }

    editor_util.prototype.decode64 = function (str) {
        return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }

    editor_util.prototype.isset = function (val) {
        return val != null && !(typeof val == 'number' && isNaN(val));
    }

    editor_util.prototype.checkCallback = function (callback) {
        if (!editor.util.isset(callback)) {
            editor.printe('未设置callback');
            throw ('未设置callback')
        }
    }

    editor.constructor.prototype.util = new editor_util();
}
//editor_util_wrapper(editor);