/*
utils.js 工具类

 */

"use strict";

function utils() {
    this._init();
    this.scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
}

utils.prototype._init = function () {
    // 定义Object.assign
    if (typeof Object.assign != "function") {
        Object.assign = function (target, varArgs) { // .length of function is 2
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
    if (typeof String.prototype.endsWith != "function") {
        String.prototype.endsWith = function (search, this_len) {
            if (this_len === undefined || this_len > this.length) {
                this_len = this.length;
            }
            return this.substring(this_len - search.length, this_len) === search;
        };
    }
    if (typeof String.prototype.startsWith != "function") {
        String.prototype.startsWith = function (search, this_len) {
            if (this_len === undefined || this_len > this.length) {
                this_len = this.length;
            }
            return this.substring(0, search.length) === search;
        }
    }

}

////// 将文字中的${和}（表达式）进行替换 //////
utils.prototype.replaceText = function (text, need, times) {
    return text.replace(/\${(.*?)}/g, function (word, value) {
        return core.calValue(value, null, need, times);
    });
}

utils.prototype.replaceValue = function (value) {
    if (typeof value == "string" && value.indexOf(":") >= 0) {
        if (value.indexOf('status:') >= 0)
            value = value.replace(/status:([a-zA-Z0-9_]+)/g, "core.getStatus('$1')");
        if (value.indexOf('item:') >= 0)
            value = value.replace(/item:([a-zA-Z0-9_]+)/g, "core.itemCount('$1')");
        if (value.indexOf('flag:') >= 0)
            value = value.replace(/flag:([a-zA-Z0-9_\u4E00-\u9FCC]+)/g, "core.getFlag('$1', 0)");
        //if (value.indexOf('switch:' >= 0))
        //    value = value.replace(/switch:([a-zA-Z0-9_]+)/g, "core.getFlag('" + (prefix || ":f@x@y") + "@$1', 0)");
        if (value.indexOf('global:') >= 0)
            value = value.replace(/global:([a-zA-Z0-9_\u4E00-\u9FCC]+)/g, "core.getGlobal('$1', 0)");
        if (value.indexOf('enemy:')>=0)
            value = value.replace(/enemy:([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g, "core.material.enemys['$1'].$2");
        if (value.indexOf('blockId:')>=0)
            value = value.replace(/blockId:(\d+),(\d+)/g, "core.getBlockId($1, $2)");
        if (value.indexOf('blockCls:')>=0)
            value = value.replace(/blockCls:(\d+),(\d+)/g, "core.getBlockCls($1, $2)");
        if (value.indexOf('equip:')>=0)
            value = value.replace(/equip:(\d)/g, "core.getEquip($1)");
    }
    return value;
}

////// 计算表达式的值 //////
utils.prototype.calValue = function (value, prefix, need, times) {
    if (!core.isset(value)) return null;
    if (typeof value === 'string') {
        if (value.indexOf(':') >= 0) {
            if (value.indexOf('switch:' >= 0))
                value = value.replace(/switch:([a-zA-Z0-9_]+)/g, "core.getFlag('" + (prefix || ":f@x@y") + "@$1', 0)");
            value = this.replaceValue(value);
        }
        return eval(value);
    }
    if (value instanceof Function) {
        return value();
    }
    return value;
}

////// 向某个数组前插入另一个数组或元素 //////
utils.prototype.unshift = function (a, b) {
    if (!(a instanceof Array) || b == null) return;
    if (b instanceof Array) {
        core.clone(b).reverse().forEach(function (e) {
            a.unshift(e);
        });
    }
    else a.unshift(b);
    return a;
}

////// 向某个数组后插入另一个数组或元素 //////
utils.prototype.push = function (a, b) {
    if (!(a instanceof Array) || b == null) return;
    if (b instanceof Array) {
        core.clone(b).forEach(function (e) {
            a.push(e);
        });
    }
    else a.push(b);
    return a;
}

utils.prototype.decompress = function (value) {
    try {
        var output = lzw_decode(value);
        if (output) return JSON.parse(output);
    }
    catch (e) {
    }
    try {
        var output = LZString.decompress(value);
        if (output) return JSON.parse(output);
    }
    catch (e) {
    }
    try {
        return JSON.parse(value);
    }
    catch (e) {
        main.log(e);
    }
    return null;
}

////// 设置本地存储 //////
utils.prototype.setLocalStorage = function (key, value) {
    try {
        if (value == null) {
            this.removeLocalStorage(key);
            return;
        }

        var str = JSON.stringify(value).replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
        var compressed = lzw_encode(str);

        // test if we can save to localStorage
        localStorage.setItem("__tmp__", compressed);
        if (lzw_decode(localStorage.getItem("__tmp__")) == str) {
            localStorage.setItem(core.firstData.name + "_" + key, compressed);
        }
        else {
            // We cannot compress the data
            localStorage.setItem(core.firstData.name + "_" + key, str);
        }
        localStorage.removeItem("__tmp__");

        if (key == 'autoSave') core.saves.ids[0] = true;
        else if (/^save\d+$/.test(key)) core.saves.ids[parseInt(key.substring(4))] = true;

        return true;
    }
    catch (e) {
        main.log(e);
        return false;
    }
}

////// 获得本地存储 //////
utils.prototype.getLocalStorage = function (key, defaultValue) {
    var res = this.decompress(localStorage.getItem(core.firstData.name + "_" + key));
    return res == null ? defaultValue : res;
}

////// 移除本地存储 //////
utils.prototype.removeLocalStorage = function (key) {
    localStorage.removeItem(core.firstData.name + "_" + key);
    if (key == 'autoSave') delete core.saves.ids[0];
    else if (/^save\d+$/.test(key)) delete core.saves.ids[parseInt(key.substring(4))];
}

utils.prototype.setLocalForage = function (key, value, successCallback, errorCallback) {

    if (!core.platform.useLocalForage) {
        if (this.setLocalStorage(key, value)) {
            if (successCallback) successCallback();
        }
        else {
            if (errorCallback) errorCallback();
        }
        return;
    }

    if (value == null) {
        this.removeLocalForage(key);
        return;
    }

    // Save to localforage
    var compressed = lzw_encode(JSON.stringify(value).replace(/[\u007F-\uFFFF]/g, function (chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
    }));
    localforage.setItem(core.firstData.name + "_" + key, compressed, function (err) {
        if (err) {
            if (errorCallback) errorCallback(err);
        }
        else {
            if (key == 'autoSave') core.saves.ids[0] = true;
            else if (/^save\d+$/.test(key)) core.saves.ids[parseInt(key.substring(4))] = true;
            if (successCallback) successCallback();
        }
    });
}

utils.prototype.getLocalForage = function (key, defaultValue, successCallback, errorCallback) {

    if (!core.platform.useLocalForage) {
        var value = this.getLocalStorage(key, defaultValue);
        if (successCallback) successCallback(value);
        return;
    }

    localforage.getItem(core.firstData.name + "_" + key, function (err, value) {
        if (err) {
            if (errorCallback) errorCallback(err);
        }
        else {
            if (!successCallback) return;
            if (value != null) {
                var res = core.utils.decompress(value);
                successCallback(res == null ? defaultValue : res);
                return;
            }
            successCallback(defaultValue);
        }
    })
}

utils.prototype.removeLocalForage = function (key, successCallback, errorCallback) {

    if (!core.platform.useLocalForage) {
        this.removeLocalStorage(key);
        if (successCallback) successCallback();
        return;
    }

    localforage.removeItem(core.firstData.name + "_" + key, function (err) {
        if (err) {
            if (errorCallback) errorCallback(err);
        }
        else {
            if (key == 'autoSave') delete core.saves.ids[0];
            else if (/^save\d+$/.test(key)) delete core.saves.ids[parseInt(key.substring(4))];
            if (successCallback) successCallback();
        }
    })
}

utils.prototype.setGlobal = function (key, value) {
    if (core.isReplaying()) return;
    core.setLocalStorage(key, value);
}

utils.prototype.getGlobal = function (key, defaultValue) {
    var value;
    if (core.isReplaying()) {
        // 不考虑key不一致的情况
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf("input2:") == 0) {
            value = JSON.parse(core.decodeBase64(action.substring(7)));
        }
        else {
            core.control._replay_error(action);
            return core.getLocalStorage(key, defaultValue);
        }
    }
    else {
        value = core.getLocalStorage(key, defaultValue);
    }
    core.status.route.push("input2:" + core.encodeBase64(JSON.stringify(value)));
    return value;
}

////// 深拷贝一个对象 //////
utils.prototype.clone = function (data, filter, recursion) {
    if (!core.isset(data)) return null;
    // date
    if (data instanceof Date) {
        var copy = new Date();
        copy.setTime(data.getTime());
        return copy;
    }
    // array
    if (data instanceof Array) {
        var copy = [];
        for (var i in data) {
            if (!filter || filter(i, data[i]))
                copy[i] = core.clone(data[i], recursion?filter:null, recursion);
        }
        return copy;
    }
    // 函数
    if (data instanceof Function) {
        return data;
    }
    // object
    if (data instanceof Object) {
        var copy = {};
        for (var i in data) {
            if (data.hasOwnProperty(i) && (!filter || filter(i, data[i])))
                copy[i] = core.clone(data[i], recursion?filter:null, recursion);
        }
        return copy;
    }
    return data;
}

////// 裁剪图片 //////
utils.prototype.splitImage = function (image, width, height) {
    if (typeof image == "string") {
        image = core.getMappedName(image);
        image = core.material.images.images[image];
    }
    if (!image) return [];
    width = width || 32;
    height = height || width;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var ans = [];
    for (var j = 0; j < image.height; j += height) {
        for (var i = 0; i < image.width; i += width) {
            var w = Math.min(width, image.width - i), h = Math.min(height, image.height - j);
            canvas.width = w; canvas.height = h;
            context.drawImage(image, i, j, w, h, 0, 0, w, h);
            var img = new Image();
            img.src = canvas.toDataURL("image/png");
            ans.push(img);
        }
    }
    return ans;
}

////// 格式化时间为字符串 //////
utils.prototype.formatDate = function (date) {
    if (!date) date = new Date();
    return "" + date.getFullYear() + "-" + core.setTwoDigits(date.getMonth() + 1) + "-" + core.setTwoDigits(date.getDate()) + " "
        + core.setTwoDigits(date.getHours()) + ":" + core.setTwoDigits(date.getMinutes()) + ":" + core.setTwoDigits(date.getSeconds());
}

////// 格式化时间为最简字符串 //////
utils.prototype.formatDate2 = function (date) {
    if (!date) date = new Date();
    return "" + date.getFullYear() + core.setTwoDigits(date.getMonth() + 1) + core.setTwoDigits(date.getDate())
        + core.setTwoDigits(date.getHours()) + core.setTwoDigits(date.getMinutes()) + core.setTwoDigits(date.getSeconds());
}

utils.prototype.formatTime = function (time) {
    return core.setTwoDigits(parseInt(time/3600000))
        +":"+core.setTwoDigits(parseInt(time/60000)%60)
        +":"+core.setTwoDigits(parseInt(time/1000)%60);
}

////// 两位数显示 //////
utils.prototype.setTwoDigits = function (x) {
    return parseInt(x) < 10 ? "0" + x : x;
}

utils.prototype.formatBigNumber = function (x, onMap) {
    x = Math.floor(parseFloat(x));
    if (!core.isset(x)) return '???';

    var c = x < 0 ? "-" : "";
    x = Math.abs(x);

    if (x <= 99999 || (!onMap && x <= 999999)) return c + x;

    var all = [
        {"val": 1e20, "c": "g"},
        {"val": 1e16, "c": "j"},
        {"val": 1e12, "c": "z"},
        {"val": 1e8, "c": "e"},
        {"val": 1e4, "c": "w"},
    ]

    for (var i = 0; i < all.length; i++) {
        var one = all[i];
        if (onMap) {
            if (x >= one.val) {
                var v = x / one.val;
                return c + v.toFixed(Math.max(0, Math.floor(3 - Math.log10(v + 1)))) + one.c;
            }
        }
        else {
            if (x >= 10 * one.val) {
                var v = x / one.val;
                return c + v.toFixed(Math.max(0, Math.floor(4 - Math.log10(v + 1)))) + one.c;
            }
        }
    }

    return c + x;
}

////// 数组转RGB //////
utils.prototype.arrayToRGB = function (color) {
    var nowR = this.clamp(parseInt(color[0]), 0, 255), nowG = this.clamp(parseInt(color[1]), 0, 255),
        nowB = this.clamp(parseInt(color[2]), 0, 255);
    return "#" + ((1 << 24) + (nowR << 16) + (nowG << 8) + nowB).toString(16).slice(1);
}

utils.prototype.arrayToRGBA = function (color) {
    if (color[3] == null) color[3] = 1;
    var nowR = this.clamp(parseInt(color[0]), 0, 255), nowG = this.clamp(parseInt(color[1]), 0, 255),
        nowB = this.clamp(parseInt(color[2]), 0, 255), nowA = this.clamp(parseFloat(color[3]), 0, 1);
    return "rgba(" + nowR + "," + nowG + "," + nowB + "," + nowA + ")";
}

////// 加密路线 //////
utils.prototype.encodeRoute = function (route) {
    var ans = "", lastMove = "", cnt = 0;

    route.forEach(function (t) {
        if (t == 'up' || t == 'down' || t == 'left' || t == 'right') {
            if (t != lastMove && cnt > 0) {
                ans += lastMove.substring(0, 1).toUpperCase();
                if (cnt > 1) ans += cnt;
                cnt = 0;
            }
            lastMove = t;
            cnt++;
        }
        else {
            if (cnt > 0) {
                ans += lastMove.substring(0, 1).toUpperCase();
                if (cnt > 1) ans += cnt;
                cnt = 0;
            }
            ans += core.utils._encodeRoute_encodeOne(t);
        }
    });
    if (cnt > 0) {
        ans += lastMove.substring(0, 1).toUpperCase();
        if (cnt > 1) ans += cnt;
    }
    return LZString.compressToBase64(ans);
}

utils.prototype._encodeRoute_id2number = function (id) {
    var number = core.maps.getNumberById(id);
    return number == 0 ? id : number;
}

utils.prototype._encodeRoute_encodeOne = function (t) {
    if (t.indexOf('item:') == 0)
        return "I" + this._encodeRoute_id2number(t.substring(5)) + ":";
    else if (t.indexOf('unEquip:') == 0)
        return "u" + t.substring(8);
    else if (t.indexOf('equip:') == 0)
        return "e" + this._encodeRoute_id2number(t.substring(6)) + ":";
    else if (t.indexOf('fly:') == 0)
        return "F" + t.substring(4) + ":";
    else if (t.indexOf('choices:') == 0)
        return "C" + t.substring(8);
    else if (t.indexOf('shop:') == 0)
        return "S" + t.substring(5);
    else if (t == 'turn')
        return 'T';
    else if (t.indexOf('turn:') == 0)
        return "t" + t.substring(5).substring(0, 1).toUpperCase() + ":";
    else if (t == 'getNext')
        return 'G';
    else if (t.indexOf('input:') == 0)
        return "P" + t.substring(6);
    else if (t.indexOf('input2:') == 0)
        return "Q" + t.substring(7) + ":";
    else if (t == 'no')
        return 'N';
    else if (t.indexOf('move:') == 0)
        return "M" + t.substring(5);
    else if (t.indexOf('key:') == 0)
        return 'K' + t.substring(4);
    else if (t.indexOf('random:') == 0)
        return 'X' + t.substring(7);
    return '('+t+')';
}

////// 解密路线 //////
utils.prototype.decodeRoute = function (route) {
    if (!route) return route;

    // 解压缩
    try {
        var v = LZString.decompressFromBase64(route);
        if (v != null && /^[-_a-zA-Z0-9+\/=:()]*$/.test(v)) {
            if (v != "" || route.length < 8)
                route = v;
        }
    } catch (e) {
    }

    var decodeObj = {route: route, index: 0, ans: []};
    while (decodeObj.index < decodeObj.route.length) {
        this._decodeRoute_decodeOne(decodeObj, decodeObj.route.charAt(decodeObj.index++));
    }
    return decodeObj.ans;
}

utils.prototype._decodeRoute_getNumber = function (decodeObj, noparse) {
    var num = "";
    while (decodeObj.index < decodeObj.route.length && !isNaN(decodeObj.route.charAt(decodeObj.index))) {
        num += decodeObj.route.charAt(decodeObj.index++);
    }
    if (num.length == 0) num = "1";
    return noparse ? num : parseInt(num);
}

utils.prototype._decodeRoute_getString = function (decodeObj) {
    var str = "";
    while (decodeObj.index < decodeObj.route.length && decodeObj.route.charAt(decodeObj.index) != ':') {
        str += decodeObj.route.charAt(decodeObj.index++);
    }
    decodeObj.index++;
    return str;
}

utils.prototype._decodeRoute_number2id = function (number) {
    if (/^\d+$/.test(number)) {
        var info = core.maps.blocksInfo[number];
        if (info) return info.id;
    }
    return number;
}

utils.prototype._decodeRoute_decodeOne = function (decodeObj, c) {
    // --- 特殊处理自定义项
    if (c == '(') {
        var idx = decodeObj.route.indexOf(')', decodeObj.index);
        if (idx >= 0) {
            decodeObj.ans.push(decodeObj.route.substring(decodeObj.index, idx));
            decodeObj.index = idx + 1;
            return;
        }
    }
    var nxt = (c == 'I' || c == 'e' || c == 'F' || c == 'S' || c == 'Q' || c == 't') ?
        this._decodeRoute_getString(decodeObj) : this._decodeRoute_getNumber(decodeObj);

    var mp = {"U": "up", "D": "down", "L": "left", "R": "right"};

    switch (c) {
        case "U":
        case "D":
        case "L":
        case "R":
            for (var i = 0; i < nxt; i++) decodeObj.ans.push(mp[c]);
            break;
        case "I":
            decodeObj.ans.push("item:" + this._decodeRoute_number2id(nxt));
            break;
        case "u":
            decodeObj.ans.push("unEquip:" + nxt);
            break;
        case "e":
            decodeObj.ans.push("equip:" + this._decodeRoute_number2id(nxt));
            break;
        case "F":
            decodeObj.ans.push("fly:" + nxt);
            break;
        case "C":
            decodeObj.ans.push("choices:" + nxt);
            break;
        case "S":
            decodeObj.ans.push("shop:" + nxt + ":" + this._decodeRoute_getNumber(decodeObj, true));
            break;
        case "T":
            decodeObj.ans.push("turn");
            break;
        case "t":
            decodeObj.ans.push("turn:" + mp[nxt]);
            break;
        case "G":
            decodeObj.ans.push("getNext");
            break;
        case "P":
            decodeObj.ans.push("input:" + nxt);
            break;
        case "Q":
            decodeObj.ans.push("input2:" + nxt);
            break;
        case "N":
            decodeObj.ans.push("no");
            break;
        case "M":
            ++decodeObj.index;
            decodeObj.ans.push("move:" + nxt + ":" + this._decodeRoute_getNumber(decodeObj));
            break;
        case "K":
            decodeObj.ans.push("key:" + nxt);
            break;
        case "X":
            decodeObj.ans.push("random:" + nxt);
            break;
    }
}

////// 判断某对象是否不为null也不为NaN //////
utils.prototype.isset = function (val) {
    return val != null && !(typeof val == 'number' && isNaN(val));
}

////// 获得子数组 //////
utils.prototype.subarray = function (a, b) {
    if (!(a instanceof Array) || !(b instanceof Array) || a.length < b.length)
        return null;
    var na = core.clone(a), nb = core.clone(b);
    while (nb.length > 0) {
        if (na.shift() != nb.shift()) return null;
    }
    return na;
}

utils.prototype.inArray = function (array, element) {
    return (array instanceof Array) && array.indexOf(element) >= 0;
}

utils.prototype.clamp = function (x, a, b) {
    var min = Math.min(a, b), max = Math.max(a, b);
    return Math.min(Math.max(x || 0, min), max);
}

utils.prototype.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

////// 设置statusBar的innerHTML，会自动斜体和放缩，也可以增加自定义css //////
utils.prototype.setStatusBarInnerHTML = function (name, value, css) {
    if (!core.statusBar[name]) return;
    var isNumber = false;
    if (typeof value == 'number') {
        value = this.formatBigNumber(value);
        isNumber = true;
    }
    // 判定是否斜体
    var italic = /^[-a-zA-Z0-9`~!@#$%^&*()_=+\[{\]}\\|;:'",<.>\/?]*$/.test(value);
    var style = 'font-style: ' + (italic ? 'italic' : 'normal') + '; ';
    style += 'text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0; ';
    // 判定是否需要缩放
    var length = this.strlen(value) || 1;
    style += 'font-size: ' + Math.min(1, 7 / length) + 'em; ';
    if (css) style += css;
    if (isNumber) {
        core.statusBar[name].innerHTML = "<span class='_status' style='" + style + "'>" + value + "</span>";
    } else {
        core.statusBar[name].innerHTML = "<span class='_status' style='" + style + "'></span>";
        core.statusBar[name].children[0].innerText = value;
    }
}

utils.prototype.strlen = function (str) {
    var count = 0;
    for (var i = 0, len = str.length; i < len; i++) {
        count += str.charCodeAt(i) < 256 ? 1 : 2;
    }
    return count;
};

utils.prototype.reverseDirection = function (direction) {
    direction = direction || core.getHeroLoc('direction');
    return {"left":"right","right":"left","down":"up","up":"down"}[direction] || direction;
}

utils.prototype.matchWildcard = function (pattern, string) {
    return new RegExp('^' + pattern.split(/\*+/).map(function (s) {
        return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }).join('.*') + '$').test(string);
}

////// Base64加密 //////
utils.prototype.encodeBase64 = function (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

////// Base64解密 //////
utils.prototype.decodeBase64 = function (str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

////// 任意进制转换 //////
utils.prototype.convertBase = function (str, fromBase, toBase) {
    var map = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()_-+={}[]\\|:;<>,.?/";
    if (fromBase == toBase) return str;
    var len = str.length, ans = "";
    var t = [];
    for (var i = 0; i < len; i++) t[i] = map.indexOf(str.charAt(i));
    t[len] = 0;
    while (len > 0) {
        for (var i = len; i >= 1; i--) {
            t[i - 1] += t[i] % toBase * fromBase;
            t[i] = parseInt(t[i] / toBase);
        }
        ans += map.charAt(t[0] % toBase);
        t[0] = parseInt(t[0] / toBase);
        while (len > 0 && t[len - 1] == 0) len--;
    }
    return ans;
}

utils.prototype.rand = function (num) {
    var rand = core.getFlag('__rand__');
    rand = this.__next_rand(rand);
    core.setFlag('__rand__', rand);
    var ans = rand / 2147483647;
    if (num && num > 0)
        return Math.floor(ans * num);
    return ans;
}

////// 生成随机数（录像方法） //////
utils.prototype.rand2 = function (num) {
    num = num || 2147483648;

    var value;
    if (core.isReplaying()) {
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf("random:") == 0) {
            value = parseInt(action.substring(7));
        }
        else {
            core.control._replay_error(action);
            return 0;
        }
    }
    else {
        value = Math.floor(Math.random() * num);
    }
    core.status.route.push("random:" + value);
    return value;
}

utils.prototype.__init_seed = function () {
    var rand = new Date().getTime() % 34834795 + 3534;
    rand = this.__next_rand(rand);
    rand = this.__next_rand(rand);
    rand = this.__next_rand(rand);
    core.setFlag('__seed__', rand);
    core.setFlag('__rand__', rand);
}

utils.prototype.__next_rand = function (_rand) {
    _rand = (_rand % 127773) * 16807 - ~~(_rand / 127773) * 2836;
    _rand += _rand < 0 ? 2147483647 : 0;
    return _rand;
}

////// 读取一个本地文件内容 //////
utils.prototype.readFile = function (success, error, accept, readType) {

    core.platform.successCallback = success;
    core.platform.errorCallback = error;

    if (window.jsinterface) {
        window.jsinterface.readFile();
        return;
    }

    // step 0: 不为http/https，直接不支持
    if (!core.platform.isOnline) {
        alert("离线状态下不支持文件读取！");
        if (error) error();
        return;
    }

    // Step 1: 如果不支持FileReader，直接不支持
    if (core.platform.fileReader == null) {
        alert("当前浏览器不支持FileReader！");
        if (error) error();
        return;
    }

    if (core.platform.fileInput == null) {
        core.platform.fileInput = document.createElement("input");
        core.platform.fileInput.style.opacity = 0;
        core.platform.fileInput.type = 'file';
        core.platform.fileInput.onchange = function () {
            var files = core.platform.fileInput.files;
            if (files.length == 0) {
                if (core.platform.errorCallback)
                    core.platform.errorCallback();
                return;
            }
            if (!readType) core.platform.fileReader.readAsText(core.platform.fileInput.files[0]);
            else core.platform.fileReader.readAsDataURL(core.platform.fileInput.files[0]);
            core.platform.fileInput.value = '';
        }
        if (accept) core.platform.fileInput.accept = accept;
    }

    core.platform.fileInput.click();
}

////// 读取文件完毕 //////
utils.prototype.readFileContent = function (content) {
    var obj = null;
    if (content.slice(0, 4) === 'data') {
        if (core.platform.successCallback)
            core.platform.successCallback(content);
        return;
    }
    try {
        obj = JSON.parse(content);
        if (obj) {
            if (core.platform.successCallback)
                core.platform.successCallback(obj);
            return;
        }
    }
    catch (e) {
        main.log(e);
        alert(e);
    }
    // alert("不是有效的JSON文件！");

    if (core.platform.errorCallback)
        core.platform.errorCallback();
}

////// 下载文件到本地 //////
utils.prototype.download = function (filename, content) {

    if (window.jsinterface) {
        window.jsinterface.download(filename, content);
        return;
    }

    // Step 0: 不为http/https，直接不支持
    if (!core.platform.isOnline) {
        alert("离线状态下不支持下载操作！");
        return;
    }

    // Step 1: 如果是iOS平台，直接不支持
    if (core.platform.isIOS) {
        if (core.copy(content)) {
            alert("iOS平台下不支持直接下载文件！\n所有应下载内容已经复制到您的剪切板，请自行创建空白文件并粘贴。");
        }
        else {
            alert("iOS平台下不支持下载操作！");
        }
        return;
    }

    // Step 2: 如果不是PC平台（Android），则只支持chrome
    if (!core.platform.isPC) {
        if (!core.platform.isChrome || core.platform.isQQ || core.platform.isWeChat) { // 检测chrome
            if (core.copy(content)) {
                alert("移动端只有Chrome浏览器支持直接下载文件！\n所有应下载内容已经复制到您的剪切板，请自行创建空白文件并粘贴。");
            }
            else {
                alert("该平台或浏览器暂不支持下载操作！");
            }
            return;
        }
    }

    // Step 3: 如果是Safari浏览器，则提示并打开新窗口
    if (core.platform.isSafari) {
        alert("你当前使用的是Safari浏览器，不支持直接下载文件。\n即将打开一个新窗口为应下载内容，请自行全选复制然后创建空白文件并粘贴。");
        var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        var href = window.URL.createObjectURL(blob);
        var opened = window.open(href, "_blank");
        window.URL.revokeObjectURL(href);
        return;
    }

    // Step 4: 下载
    var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var href = window.URL.createObjectURL(blob);
        var elem = window.document.createElement('a');
        elem.href = href;
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        window.URL.revokeObjectURL(href);
    }
}

////// 复制一段内容到剪切板 //////
utils.prototype.copy = function (data) {

    if (window.jsinterface) {
        window.jsinterface.copy(data);
        return true;
    }

    if (!core.platform.supportCopy) return false;

    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = data;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.setSelectionRange(0, textArea.value.length);
    var successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        successful = false;
    }

    document.body.removeChild(textArea);
    return successful;
}

////// 显示一段confirm //////
utils.prototype.myconfirm = function (hint, yesCallback, noCallback) {
    main.dom.inputDiv.style.display = 'block';
    main.dom.inputMessage.innerHTML = hint.replace(/\n/g, '<br/>');
    main.dom.inputBox.style.display = 'none';
    main.dom.inputYes.blur();
    main.dom.inputNo.blur();
    core.status.holdingKeys = [];

    core.platform.successCallback = yesCallback;
    core.platform.errorCallback = noCallback;
}

////// 让用户输入一段文字 //////
utils.prototype.myprompt = function (hint, value, callback) {
    main.dom.inputDiv.style.display = 'block';
    main.dom.inputMessage.innerHTML = hint.replace(/\n/g, '<br/>');
    main.dom.inputBox.style.display = 'block';
    main.dom.inputBox.value = value==null?"":value;
    main.dom.inputYes.blur();
    main.dom.inputNo.blur();
    setTimeout(function () {
        main.dom.inputBox.focus();
    });
    core.status.holdingKeys = [];

    core.platform.successCallback = core.platform.errorCallback = callback;
}

////// 动画显示某对象 //////
utils.prototype.showWithAnimate = function (obj, speed, callback) {
    obj.style.display = 'block';
    if (!speed || main.mode != 'play') {
        obj.style.opacity = 1;
        if (callback) callback();
        return;
    }
    obj.style.opacity = 0;
    var opacityVal = 0;
    var showAnimate = window.setInterval(function () {
        opacityVal += 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal > 1) {
            clearInterval(showAnimate);
            if (callback) callback();
        }
    }, speed);
}

////// 动画使某对象消失 //////
utils.prototype.hideWithAnimate = function (obj, speed, callback) {
    if (!speed || main.mode != 'play') {
        obj.style.display = 'none';
        if (callback) callback();
        return;
    }
    obj.style.opacity = 1;
    var opacityVal = 1;
    var hideAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal < 0) {
            obj.style.display = 'none';
            clearInterval(hideAnimate);
            if (callback) callback();
        }
    }, speed);
}

utils.prototype._encodeCanvas = function (ctx) {
    var list = [];
    var width = ctx.canvas.width, height = ctx.canvas.height;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var imgData = ctx.getImageData(0, 0, width, height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        list.push(Math.sign(imgData.data[i + 3]));
    }
    // compress 01 to array
    var prev = 0, cnt = 0, arr = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] != prev) {
            arr.push(cnt);
            prev = list[i];
            cnt = 0;
        }
        cnt++;
    }
    arr.push(cnt);
    return arr;
}

////// 解析arr数组，并绘制到tempCanvas上 //////
utils.prototype._decodeCanvas = function (arr, width, height) {
    // 清空tempCanvas
    var tempCanvas = core.bigmap.tempCanvas;
    tempCanvas.canvas.width = width;
    tempCanvas.canvas.height = height;
    tempCanvas.clearRect(0, 0, width, height);

    if (!arr) return null;
    // to byte array
    var curr = 0, list = [];
    arr.forEach(function (x) {
        for (var i = 0; i < x; i++) list.push(curr);
        curr = 1 - curr;
    })

    var imgData = tempCanvas.getImageData(0, 0, width, height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        var index = i / 4;
        if (list[index]) {
            imgData.data[i] = 255;
            imgData.data[i + 3] = 255;
        }
    }
    tempCanvas.putImageData(imgData, 0, 0);
}

utils.prototype.consoleOpened = function () {
    if (!core.flags.checkConsole) return false;
    if (window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized)
        return true;
    if (!core.platform.isPC) return false;
    var threshold = 160;
    var zoom = Math.min(window.outerWidth / window.innerWidth, window.outerHeight / window.innerHeight);
    return window.outerWidth - zoom * window.innerWidth > threshold
        || window.outerHeight - zoom * window.innerHeight > threshold;
}

utils.prototype.hashCode = function (obj) {
    if (typeof obj == 'string') {
        var hash = 0, i, chr;
        if (obj.length === 0) return hash;
        for (i = 0; i < obj.length; i++) {
            chr = obj.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }
    return this.hashCode(JSON.stringify(obj).split("").sort().join(""));
}

utils.prototype.same = function (a, b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (a === b) return true;
    if (a instanceof Array && b instanceof Array) {
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; i++) {
            if (!this.same(a[i], b[i])) return false;
        }
        return true;
    }
    if (a instanceof Object && b instanceof Object) {
        for (var i in a) {
            if (!this.same(a[i], b[i])) return false;
        }
        for (var i in b) {
            if (!this.same(a[i], b[i])) return false;
        }
        return true;
    }
    return false;
}

utils.prototype._export = function (floorIds) {
    if (!floorIds) floorIds = [core.status.floorId];
    else if (floorIds == 'all') floorIds = core.clone(core.floorIds);
    else if (typeof floorIds == 'string') floorIds = [floorIds];

    var monsterMap = {};

    // map
    var content = floorIds.length + "\n" + core.__SIZE__ + " " + core.__SIZE__ + "\n\n";
    floorIds.forEach(function (floorId) {
        var arr = core.maps._getMapArrayFromBlocks(core.status.maps[floorId].blocks, core.__SIZE__, core.__SIZE__);
        content += arr.map(function (x) {
            // check monster
            x.forEach(function (t) {
                var block = core.maps.getBlockByNumber(t);
                if (block.event.cls.indexOf("enemy") == 0) {
                    monsterMap[t] = block.event.id;
                }
            })
            return x.join("\t");
        }).join("\n") + "\n\n";
    })

    // values
    content += ["redJewel", "blueJewel", "greenJewel", "redPotion", "bluePotion",
        "yellowPotion", "greenPotion", "sword1", "shield1"].map(function (x) {
        return core.values[x] || 0;
    }).join(" ") + "\n\n";

    // monster
    content += Object.keys(monsterMap).length + "\n";
    for (var t in monsterMap) {
        var id = monsterMap[t], monster = core.material.enemys[id];
        content += t + " " + monster.hp + " " + monster.atk + " " +
            monster.def + " " + monster.money + " " + monster.special + "\n";
    }
    content += "\n0 0 0 0 0 0\n\n";
    content += core.status.hero.hp + " " + core.status.hero.atk + " "
        + core.status.hero.def + " " + core.status.hero.mdef + " " + core.status.hero.money + " "
        + core.itemCount('yellowKey') + " " + core.itemCount("blueKey") + " " + core.itemCount("redKey") + " 0 "
        + core.status.hero.loc.x + " " + core.status.hero.loc.y + "\n";

    console.log(content);
}

utils.prototype.unzip = function (blobOrUrl, success, error, convertToText, onprogress) {
    var _error = function (msg) {
        main.log(msg);
        if (error) error(msg);
    }

    if (!window.zip) {
        return _error("zip.js not exists!");
    }

    if (typeof blobOrUrl == 'string') {
        return core.http('GET', blobOrUrl, null, function (data) {
            core.unzip(data, success, error, convertToText);
        }, _error, null, 'blob', onprogress);
    }

    if (!(blobOrUrl instanceof Blob)) {
        return _error("Should use Blob or URL as input");
    }

    zip.createReader(new zip.BlobReader(blobOrUrl), function (reader) {
        reader.getEntries(function (entries) {
            core.utils._unzip_readEntries(entries, function (data) {
                reader.close(function () {
                    if (success) success(data);
                });
            }, convertToText);
        });
    }, _error);
}

utils.prototype._unzip_readEntries = function (entries, success, convertToText) {
    var results = {};
    if (entries == null) {
        return success(results);
    }
    var length = entries.length;
    entries.forEach(function (entry) {
        entry.getData(convertToText ? new zip.TextWriter('utf8') : new zip.BlobWriter(), function (data) {
            results[entry.filename] = data;
            length--;
            if (length == 0) {
                success(results);
            }
        });
    });
}

utils.prototype.http = function (type, url, formData, success, error, mimeType, responseType, onprogress) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    if (mimeType) xhr.overrideMimeType(mimeType);
    if (responseType) xhr.responseType = responseType;
    xhr.onload = function (e) {
        if (xhr.status == 200) {
            if (success) success(xhr.response);
        }
        else {
            if (error) error("HTTP " + xhr.status);
        }
    };
    xhr.onprogress = function (e) {
        if (e.lengthComputable) {
            if (onprogress) onprogress(e.loaded / e.total);
        }
    }
    xhr.onabort = function () {
        if (error) error("Abort");
    }
    xhr.ontimeout = function () {
        if (error) error("Timeout");
    }
    xhr.onerror = function () {
        if (error) error("Error on Connection");
    }
    if (formData)
        xhr.send(formData);
    else xhr.send();
}

utils.prototype.httpAndZip = function (url, success, error) {
    this.http('GET', url, null, function (data) {

    }, error, null, 'blob');
}

// LZW-compress
// https://gist.github.com/revolunet/843889
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
        currChar = data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i = 0; i < out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i = 1; i < data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}
