
/*
utils.js 工具类

 */

"use strict";

function utils () {
    this._init();
    this.scan = {
        'up': { 'x': 0, 'y': -1 },
        'left': { 'x': -1, 'y': 0 },
        'down': { 'x': 0, 'y': 1 },
        'right': { 'x': 1, 'y': 0 }
    };
    this.scan2 = {
        'up': { 'x': 0, 'y': -1 },
        'left': { 'x': -1, 'y': 0 },
        'down': { 'x': 0, 'y': 1 },
        'right': { 'x': 1, 'y': 0 },
        'leftup': { 'x': -1, 'y': -1 },
        'leftdown': { 'x': -1, 'y': 1 },
        'rightup': { 'x': 1, 'y': -1 },
        'rightdown': { 'x': 1, 'y': 1 }
    };
}

utils.prototype._init = function () {
    //
}

////// 将文字中的${和}（表达式）进行替换 //////
/**
 * 将一段文字中的${}（表达式）进行替换。
 * @param {string} text 模板字符串，可以使用${}计算js表达式，支持“状态、物品、变量、独立开关、全局存储、图块id、图块类型、敌人数据、装备id”等量参与运算
 * @param {string} prefix
 */
utils.prototype.replaceText = function (text, prefix) {
    if (typeof text != 'string') return text;
    var index = text.indexOf("${");
    if (index < 0) return text;
    var cnt = 0, curr = index;
    while (++curr < text.length) {
        if (text.charAt(curr) == '{') cnt++;
        if (text.charAt(curr) == '}') cnt--;
        if (cnt == 0) break;
    }
    if (cnt != 0) return text;
    var value = core.calValue(text.substring(index + 2, curr), prefix);
    if (value == null) value = "";
    return text.substring(0, index) + value + core.replaceText(text.substring(curr + 1), prefix);
}

/**
 * 对一个表达式中的特殊规则进行替换，如status:xxx等。
 * @param {string} value 模板字符串，注意独立开关不会被替换
 */
utils.prototype.replaceValue = function (value) {
    if (typeof value == "string" && (value.indexOf(":") >= 0 || value.indexOf("flag：") >= 0 || value.indexOf('global：') >= 0)) {
        if (value.indexOf('status:') >= 0)
            value = value.replace(/status:([a-zA-Z0-9_]+)/g, "core.getStatus('$1')");
        if (value.indexOf('buff:') >= 0)
            value = value.replace(/buff:([a-zA-Z0-9_]+)/g, "core.getBuff('$1')");
        if (value.indexOf('item:') >= 0)
            value = value.replace(/item:([a-zA-Z0-9_]+)/g, "core.itemCount('$1')");
        if (value.indexOf('flag:') >= 0 || value.indexOf('flag：') >= 0)
            value = value.replace(/flag[:：]([a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]+)/g, "core.getFlag('$1', 0)");
        //if (value.indexOf('switch:' >= 0))
        //    value = value.replace(/switch:([a-zA-Z0-9_]+)/g, "core.getFlag('" + (prefix || ":f@x@y") + "@$1', 0)");
        if (value.indexOf('global:') >= 0 || value.indexOf('global：') >= 0)
            value = value.replace(/global[:：]([a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]+)/g, "core.getGlobal('$1', 0)");
        if (value.indexOf('enemy:') >= 0)
            value = value.replace(/enemy:([a-zA-Z0-9_]+)[\.:]([a-zA-Z0-9_]+)/g, "core.material.enemys['$1'].$2");
        if (value.indexOf('blockId:') >= 0)
            value = value.replace(/blockId:(\d+),(\d+)/g, "core.getBlockId($1, $2)");
        if (value.indexOf('blockNumber:') >= 0)
            value = value.replace(/blockNumber:(\d+),(\d+)/g, "core.getBlockNumber($1, $2)");
        if (value.indexOf('blockCls:') >= 0)
            value = value.replace(/blockCls:(\d+),(\d+)/g, "core.getBlockCls($1, $2)");
        if (value.indexOf('equip:') >= 0)
            value = value.replace(/equip:(\d)/g, "core.getEquip($1)");
        if (value.indexOf('temp:') >= 0)
            value = value.replace(/temp:([a-zA-Z0-9_]+)/g, "core.getFlag('@temp@$1', 0)");
    }
    return value;
}

////// 计算表达式的值 //////
/**
 * 计算一个表达式的值，支持status:xxx等的计算。
 * @param {string} value 待求值的表达式
 * @param {string} prefix 独立开关前缀，一般可省略
 */
utils.prototype.calValue = function (value, prefix) {
    if (!core.isset(value)) return null;
    if (typeof value === 'string') {
        if (value.indexOf(':') >= 0 || value.indexOf("flag：") >= 0 || value.indexOf('global：') >= 0) {
            if (value.indexOf('switch:') >= 0)
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
/**
 * 将b（可以是另一个数组）插入数组a的开头，此函数用于弥补a.unshift(b)中b只能是单项的不足。
 * @param {any[]} a 原数组
 * @param {any} b 待插入的新首项或前缀数组
 */
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
/**
 * 将b（可以是另一个数组）插入数组a的末尾，此函数用于弥补a.push(b)中b只能是单项的不足。
 * @param {any[]} a 原数组
 * @param {any} b 待插入的新末项或后缀数组
 */
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

/**
 * 解压缩一个数据
 * @param {any} value
 */
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
        console.error(e);
    }
    return null;
}

////// 设置本地存储 //////
/**
 * 设置本地存储
 * @param {string} key
 * @param {any} value
 */
utils.prototype.setLocalStorage = function (key, value) {
    try {
        if (value == null) {
            this.removeLocalStorage(key);
            return;
        }

        var str = JSON.stringify(value).replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
        localStorage.setItem(core.firstData.name + "_" + key, str);

        if (key == 'autoSave') core.saves.ids[0] = true;
        else if (/^save\d+$/.test(key)) core.saves.ids[parseInt(key.substring(4))] = true;

        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

////// 获得本地存储 //////
/**
 * 获得本地存储
 * @param {string} key
 * @param {any} defaultValue
 */
utils.prototype.getLocalStorage = function (key, defaultValue) {
    try {
        var value = JSON.parse(localStorage.getItem(core.firstData.name + "_" + key));
        if (value == null) return defaultValue;
        return value;
    } catch (e) {
        return defaultValue;
    }
}

////// 移除本地存储 //////
/**
 * 移除本地存储
 * @param {string} key
 */
utils.prototype.removeLocalStorage = function (key) {
    localStorage.removeItem(core.firstData.name + "_" + key);
    if (key == 'autoSave') delete core.saves.ids[0];
    else if (/^save\d+$/.test(key)) delete core.saves.ids[parseInt(key.substring(4))];
}

/**
 * 往数据库写入一段数据
 * @param {string} key
 * @param {any} value
 * @param {() => void} successCallback
 * @param {() => void} errorCallback
 */
utils.prototype.setLocalForage = function (key, value, successCallback, errorCallback) {
    if (value == null) {
        this.removeLocalForage(key);
        return;
    }

    var name = core.firstData.name + "_" + key;
    var str = JSON.stringify(value).replace(/[\u007F-\uFFFF]/g, function (chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
    });
    var callback = function (err) {
        if (err) {
            if (errorCallback) errorCallback(err);
        }
        else {
            if (key == 'autoSave') core.saves.ids[0] = true;
            else if (/^save\d+$/.test(key)) core.saves.ids[parseInt(key.substring(4))] = true;
            if (successCallback) successCallback();
        }
    }
    this._setLocalForage_set(name, str, callback);
}

utils.prototype._setLocalForage_set = function (name, str, callback) {
    if (window.jsinterface && window.jsinterface.setLocalForage) {
        var id = setTimeout(null);
        core['__callback' + id] = callback;
        core.saves.cache[name] = str;
        window.jsinterface.setLocalForage(id, name, str);
    } else {
        var compressed = str.length > 100000 ? LZString.compress(str) : lzw_encode(str);
        core.saves.cache[name] = compressed;
        localforage.setItem(name, compressed, callback);
    }
}

/**
 * 从数据库读出一段数据
 * @param {string} key
 * @param {any} defaultValue
 * @param {(data: any) => void} successCallback
 * @param {() => void} errorCallback
 */
utils.prototype.getLocalForage = function (key, defaultValue, successCallback, errorCallback) {
    var name = core.firstData.name + "_" + key;
    var callback = function (err, value) {
        if (err) {
            if (errorCallback) errorCallback(err);
        }
        else {
            core.saves.cache[name] = value;
            if (!successCallback) return;
            if (value != null) {
                var res = core.utils.decompress(value);
                successCallback(res == null ? defaultValue : res);
                return;
            }
            successCallback(defaultValue);
        }
    };
    if (core.saves.cache[name] != null) {
        return callback(null, core.saves.cache[name]);
    }
    this._getLocalForage_get(name, callback);
}

utils.prototype._getLocalForage_get = function (name, callback) {
    if (window.jsinterface && window.jsinterface.getLocalForage) {
        var id = setTimeout(null);
        core['__callback' + id] = callback;
        window.jsinterface.getLocalForage(id, name);
    } else {
        localforage.getItem(name, callback);
    }
}

/**
 * 移除数据库的数据
 * @param {string} key
 * @param {() => void} successCallback
 * @param {() => void} errorCallback
 */
utils.prototype.removeLocalForage = function (key, successCallback, errorCallback) {
    var name = core.firstData.name + "_" + key;
    var callback = function (err) {
        if (err) {
            if (errorCallback) errorCallback(err);
        }
        else {
            if (key == 'autoSave') delete core.saves.ids[0];
            else if (/^save\d+$/.test(key)) delete core.saves.ids[parseInt(key.substring(4))];
            if (successCallback) successCallback();
        }
    }
    delete core.saves.cache[name];
    this._removeLocalForage_remove(name, callback);
}

utils.prototype._removeLocalForage_remove = function (name, callback) {
    if (window.jsinterface && window.jsinterface.removeLocalForage) {
        var id = setTimeout(null);
        core['__callback' + id] = callback;
        window.jsinterface.removeLocalForage(id, name);
    } else {
        localforage.removeItem(name, callback);
    }
}

utils.prototype.clearLocalForage = function (callback) {
    core.saves.cache = {};
    if (window.jsinterface && window.jsinterface.clearLocalForage) {
        var id = setTimeout(null);
        core['__callback' + id] = callback;
        window.jsinterface.clearLocalForage(id);
    } else {
        localforage.clear(callback);
    }
}

utils.prototype.iterateLocalForage = function (iter, callback) {
    if (window.jsinterface && window.jsinterface.iterateLocalForage) {
        var id = setTimeout(null);
        core['__iter' + id] = iter;
        core['__callback' + id] = callback;
        window.jsinterface.iterateLocalForage(id);
    } else {
        localforage.iterate(iter, callback);
    }
}

utils.prototype.keysLocalForage = function (callback) {
    if (window.jsinterface && window.jsinterface.keysLocalForage) {
        var id = setTimeout(null);
        core['__callback' + id] = callback;
        window.jsinterface.keysLocalForage(id);
    } else {
        localforage.keys(callback);
    }
}

utils.prototype.lengthLocalForage = function (callback) {
    if (window.jsinterface && window.jsinterface.lengthLocalForage) {
        var id = setTimeout(null);
        core['__callback' + id] = callback;
        window.jsinterface.lengthLocalForage(id);
    } else {
        localforage.length(callback);
    }
}

/**
 * 设置一个全局存储，适用于global:xxx，录像播放时将忽略此函数。
 * @param {string} key 全局变量名称，支持中文
 * @param {any} value 全局变量的新值，不填或null表示清除此全局存储
 */
utils.prototype.setGlobal = function (key, value) {
    if (core.isReplaying()) return;
    core.setLocalStorage(key, value);
}

/**
 * 读取一个全局存储，适用于global:xxx，支持录像。
 * @param {string} key 全局变量名称，支持中文
 * @param {any} defaultValue 可选，当此全局变量不存在或值为null、undefined时，用此值代替
 */
utils.prototype.getGlobal = function (key, defaultValue) {
    var value;
    if (core.isReplaying()) {
        // 不考虑key不一致的情况
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf("input2:") == 0) {
            value = JSON.parse(core.decodeBase64(action.substring(7)));
            core.setFlag('__global__' + key, value);
            core.status.route.push("input2:" + core.encodeBase64(JSON.stringify(value)));
        }
        else {
            // 录像兼容性：尝试从flag和localStorage获得
            // 注意这里不再二次记录 input2: 到录像
            core.status.replay.toReplay.unshift(action);
            value = core.getFlag('__global__' + key, core.getLocalStorage(key, defaultValue));
        }
    }
    else {
        value = core.getLocalStorage(key, defaultValue);
        core.setFlag('__global__' + key, value);
        core.status.route.push("input2:" + core.encodeBase64(JSON.stringify(value)));
    }
    return value;
}

////// 深拷贝一个对象 //////
/**
 * 深拷贝一个对象(函数将原样返回)
 * @param {T} data 待拷贝对象
 * @param {(name: string, value: any) => boolean} filter 过滤器，可选，表示data为数组或对象时拷贝哪些项或属性，true表示拷贝
 * @param {boolean} recursion 过滤器是否递归，可选。true表示过滤器也被递归
 */
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
                copy[i] = core.clone(data[i], recursion ? filter : null, recursion);
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
                copy[i] = core.clone(data[i], recursion ? filter : null, recursion);
        }
        return copy;
    }
    return data;
}

////// 深拷贝1D/2D数组优化 //////
/**
 * 深拷贝一个1D或2D的数组
 * @param {Array<number> | Array<Array<number>>} data
 */
utils.prototype.cloneArray = function (data) {
    if (!(data instanceof Array)) return this.clone(data);
    if (data[0] instanceof Array) {
        return data.map(function (one) { return one.slice(); });
    } else {
        return data.slice();
    }
}

////// 裁剪图片 //////
/**
 * 等比例切分一张图片
 * @param {string | HTMLImageElement} image 图片名（支持映射前的中文名）或图片对象（参见上面的例子），获取不到时返回[]
 * @param {number} width 子图的宽度，单位为像素。原图总宽度必须是其倍数，不填视为32
 * @param {number} height 子图的高度，单位为像素。原图总高度必须是其倍数，不填视为正方形
 */
utils.prototype.splitImage = function (image, width, height) {
    if (typeof image == "string") {
        image = core.getMappedName(image);
        image = core.material.images.images[image];
    }
    if (!image) return [];
    width = width || 32;
    height = height || width;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var ans = [];
    for (var j = 0; j < image.height; j += height) {
        for (var i = 0; i < image.width; i += width) {
            var w = Math.min(width, image.width - i), h = Math.min(height, image.height - j);
            canvas.width = w; canvas.height = h;
            core.drawImage(ctx, image, i, j, w, h, 0, 0, w, h);
            var img = new Image();
            img.src = canvas.toDataURL("image/png");
            ans.push(img);
        }
    }
    return ans;
}

////// 格式化时间为字符串 //////
/**
 * 格式化日期为字符串
 * @param {Date} date
 */
utils.prototype.formatDate = function (date) {
    if (!date) date = new Date();
    return "" + date.getFullYear() + "-" + core.setTwoDigits(date.getMonth() + 1) + "-" + core.setTwoDigits(date.getDate()) + " "
        + core.setTwoDigits(date.getHours()) + ":" + core.setTwoDigits(date.getMinutes()) + ":" + core.setTwoDigits(date.getSeconds());
}

////// 格式化时间为最简字符串 //////
/**
 * 格式化日期为最简字符串
 * @param {Date} date
 */
utils.prototype.formatDate2 = function (date) {
    if (!date) date = new Date();
    return "" + date.getFullYear() + core.setTwoDigits(date.getMonth() + 1) + core.setTwoDigits(date.getDate())
        + core.setTwoDigits(date.getHours()) + core.setTwoDigits(date.getMinutes()) + core.setTwoDigits(date.getSeconds());
}

/**
 * 格式化时间
 * @param {number} time
 */
utils.prototype.formatTime = function (time) {
    return core.setTwoDigits(parseInt(time / 3600000))
        + ":" + core.setTwoDigits(parseInt(time / 60000) % 60)
        + ":" + core.setTwoDigits(parseInt(time / 1000) % 60);
}

////// 两位数显示 //////
/**
 * 两位数显示
 * @param {number} x
 */
utils.prototype.setTwoDigits = function (x) {
    return (parseInt(x) < 10 && parseInt(x) >= 0) ? "0" + x : x;
}

/**
 * 格式化文件大小
 * @param {number} size
 */
utils.prototype.formatSize = function (size) {
    if (size < 1024) return size + 'B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + "KB";
    else return (size / 1024 / 1024).toFixed(2) + "MB";
}

/**
 * 大数字格式化，单位为10000的倍数（w,e,z,j,g），末尾四舍五入
 * @param {number} x 原数字
 * @param {boolean} onMap 可选，true表示用于地图显伤，结果总字符数最多为5，否则最多为6
 */
utils.prototype.formatBigNumber = function (x, digits) {
    if (digits === true) digits = 5; // 兼容旧版onMap参数
    if (!digits || digits < 5) digits = 6; // 连同负号、小数点和后缀字母在内的总位数，至少需为5，默认为6
    x = Math.trunc(parseFloat(x)); // 尝试识别为小数，然后向0取整
    if (x == null || !Number.isFinite(x)) return '???'; // 无法识别的数或正负无穷大，显示'???'
    var units = [ // 单位及其后缀字母，可自定义，如改成千进制下的K、M、G、T、P
        { "val": 1e4, "suffix": "w" },
        { "val": 1e8, "suffix": "e" },
        { "val": 1e12, "suffix": "z" },
        { "val": 1e16, "suffix": "j" },
        { "val": 1e20, "suffix": "g" },
    ];
    if (Math.abs(x) > 1e20 * Math.pow(10, digits - 2))
        return x.toExponential(0); // 绝对值过大以致于失去精度的数，直接使用科学记数法，系数只保留整数
    var sign = x < 0 ? '-' : '';
    if (sign) --digits; // 符号位单独处理，负号要占一位
    x = Math.abs(x);

    if (x < Math.pow(10, digits)) return sign + x;

    for (var i = 0; i < units.length; ++i) {
        var each = units[i];
        var u = (x / each.val).toFixed(digits).substring(0, digits);
        if (u.indexOf('.') < 0) continue;
        u = u.substring(0, u[u.length - 2] == '.' ? u.length - 2 : u.length - 1);
        return sign + u + each.suffix;
    }
    return sign + x.toExponential(0);
}

////// 变速移动 //////
/**
 * 变速移动
 * @param {string} mode
 */
utils.prototype.applyEasing = function (name) {
    var list = {
        "easeIn": function (t) {
            return Math.pow(t, 3);
        },
        "easeOut": function (t) {
            return 1 - Math.pow(1 - t, 3);
        },
        "easeInOut": function (t) {
            // easeInOut试了一下感觉二次方效果明显点
            if (t < 0.5) return Math.pow(t, 2) * 2;
            else return 1 - Math.pow(1 - t, 2) * 2;
        },
        "linear": function (t) {
            return t
        }
    }
    if (name == 'random') {
        var keys = Object.keys(list);
        name = keys[Math.floor(Math.random() * keys.length)];
    }
    return list[name] || list.linear;
}

////// 数组转RGB //////
/**
 * 颜色数组转十六进制
 * @param {[number, number, number]} color 一行三列的数组，各元素必须为不大于255的自然数
 */
utils.prototype.arrayToRGB = function (color) {
    if (!(color instanceof Array)) return color;
    var nowR = this.clamp(parseInt(color[0]), 0, 255), nowG = this.clamp(parseInt(color[1]), 0, 255),
        nowB = this.clamp(parseInt(color[2]), 0, 255);
    return "#" + ((1 << 24) + (nowR << 16) + (nowG << 8) + nowB).toString(16).slice(1);
}

/**
 * 颜色数组转字符串
 * @param {[number, number, number, number]} color 一行三列或一行四列的数组，前三个元素必须为不大于255的自然数。第四个元素（如果有）必须为0或不大于1的数字，第四个元素不填视为1
 */
utils.prototype.arrayToRGBA = function (color) {
    if (!(color instanceof Array)) return color;
    if (color[3] == null) color[3] = 1;
    var nowR = this.clamp(parseInt(color[0]), 0, 255), nowG = this.clamp(parseInt(color[1]), 0, 255),
        nowB = this.clamp(parseInt(color[2]), 0, 255), nowA = this.clamp(parseFloat(color[3]), 0, 1);
    return "rgba(" + nowR + "," + nowG + "," + nowB + "," + nowA + ")";
}

////// 加密路线 //////
/**
 * 录像一压，其结果会被再次base64压缩
 * @param {string[]} route 原始录像，自定义内容（不予压缩，原样写入）必须由0-9A-Za-z和下划线、冒号组成，所以中文和数组需要用JSON.stringify预处理再base64压缩才能交由一压
 */
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
    else if (t.indexOf('saveEquip:') == 0)
        return "s" + t.substring(10);
    else if (t.indexOf('loadEquip:') == 0)
        return "l" + t.substring(10);
    else if (t.indexOf('fly:') == 0)
        return "F" + t.substring(4) + ":";
    else if (t == 'choices:none')
        return "c";
    else if (t.indexOf('choices:') == 0)
        return "C" + t.substring(8);
    else if (t.indexOf('shop:') == 0)
        return "S" + t.substring(5) + ":";
    else if (t == 'turn')
        return 'T';
    else if (t.indexOf('turn:') == 0)
        return "t" + t.substring(5).substring(0, 1).toUpperCase() + ":";
    else if (t == 'getNext')
        return 'G';
    else if (t == 'input:none')
        return 'p';
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
    else if (t.indexOf('click:') == 0)
        return 'k' + t.substring(6);
    else if (t.indexOf('random:') == 0)
        return 'X' + t.substring(7);
    return '(' + t + ')';
}

////// 解密路线 //////
/**
 * 录像解压的最后一步，即一压的逆过程
 * @param {string} route 录像解压倒数第二步的结果，即一压的结果
 */
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

    var decodeObj = { route: route, index: 0, ans: [] };
    while (decodeObj.index < decodeObj.route.length) {
        this._decodeRoute_decodeOne(decodeObj, decodeObj.route.charAt(decodeObj.index++));
    }
    return decodeObj.ans;
}

utils.prototype._decodeRoute_getNumber = function (decodeObj, noparse) {
    var num = "";
    var first = true;
    while (true) {
        var ch = decodeObj.route.charAt(decodeObj.index);
        if (ch >= '0' && ch <= '9') num += ch;
        else if (ch == '-' && first) num += ch;
        else break;
        first = false;
        decodeObj.index++;
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

    var mp = { "U": "up", "D": "down", "L": "left", "R": "right" };

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
        case "s":
            decodeObj.ans.push("saveEquip:" + nxt);
            break;
        case "l":
            decodeObj.ans.push("loadEquip:" + nxt);
            break;
        case "F":
            decodeObj.ans.push("fly:" + nxt);
            break;
        case 'c':
            decodeObj.ans.push('choices:none');
            break;
        case "C":
            decodeObj.ans.push("choices:" + nxt);
            break;
        case "S":
            decodeObj.ans.push("shop:" + nxt);
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
        case "p":
            decodeObj.ans.push("input:none");
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
        case "k":
            ++decodeObj.index;
            var px = this._decodeRoute_getNumber(decodeObj);
            ++decodeObj.index;
            var py = this._decodeRoute_getNumber(decodeObj);
            decodeObj.ans.push("click:" + nxt + ":" + px + ":" + py);
            break;
        case "X":
            decodeObj.ans.push("random:" + nxt);
            break;
    }
}

////// 判断某对象是否不为null也不为NaN //////
/**
 * 判断一个值是否不为null，undefined和NaN
 * @param {any} v 待测值，可选
 */
utils.prototype.isset = function (val) {
    return val != null && !(typeof val == 'number' && isNaN(val));
}

////// 获得子数组 //////
/**
 * 判定一个数组是否为另一个数组的前缀，用于录像接续播放。请注意函数名没有大写字母
 * @param {any[]} a 可能的母数组，不填或比b短将返回null
 * @param {any[]} b 可能的前缀，不填或比a长将返回null
 */
utils.prototype.subarray = function (a, b) {
    if (!(a instanceof Array) || !(b instanceof Array) || a.length < b.length)
        return null;
    for (var i = 0; i < b.length; ++i) {
        if (a[i] != b[i]) return null;
    }
    return a.slice(b.length);
}

/**
 * 判定array是不是一个数组，以及element是否在该数组中。
 * @param {any} array 可能的数组，不为数组或不填将导致返回值为false
 * @param {any} element 待查找的元素
 */
utils.prototype.inArray = function (array, element) {
    return (array instanceof Array) && array.indexOf(element) >= 0;
}

/**
 * 将x限定在[a,b]区间内，注意a和b可交换
 * @param {number} x 原始值，!x为true时x一律视为0
 * @param {number} a 下限值，大于b将导致与b交换
 * @param {number} b 上限值，小于a将导致与a交换
 */
utils.prototype.clamp = function (x, a, b) {
    var min = Math.min(a, b), max = Math.max(a, b);
    return Math.min(Math.max(x || 0, min), max);
}

/**
 * 访问浏览器cookie
 * @param {string} name
 */
utils.prototype.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

////// 设置statusBar的innerHTML，会自动斜体和放缩，也可以增加自定义css //////
/**
 * 填写非自绘状态栏
 * @param {string} name 状态栏项的名称，如'hp', 'atk', 'def'等。必须是core.statusBar中的一个合法项
 * @param {any} value 要填写的内容，大数字会被格式化为至多6个字符，无中文的内容会被自动设为斜体
 * @param {string} css 额外的css样式，可选。如更改颜色等
 */
utils.prototype.setStatusBarInnerHTML = function (name, value, css) {
    if (!core.statusBar[name]) return;
    if (typeof value == 'number') value = this.formatBigNumber(value);
    var italic = /^[-a-zA-Z0-9`~!@#$%^&*()_=+\[{\]}\\|;:'",<.>\/?]*$/.test(value);
    var style = 'font-style: ' + (italic ? 'italic' : 'normal') + '; ';
    style += 'text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0; ';
    // 判定是否需要缩放
    var length = this.strlen(value) || 1;
    style += 'font-size: ' + Math.min(1, 7 / length) + 'em; ';
    if (css) style += css;
    var _style = core.statusBar[name].getAttribute('_style');
    var _value = core.statusBar[name].getAttribute('_value');
    if (_style == style) {
        if (value == _value) return;
        core.statusBar[name].children[0].innerText = value;
    } else {
        core.statusBar[name].innerHTML = "<span class='_status' style='" + style + "'></span>";
        core.statusBar[name].children[0].innerText = value;
        core.statusBar[name].setAttribute('_style', style);
    }
    core.statusBar[name].setAttribute('_value', value);;
}

/**
 * 求字符串的国标码字节数，也可用于等宽字体下文本的宽度测算。请注意样板的默认字体Verdana不是等宽字体
 * @param {string} str 待测字符串
 */
utils.prototype.strlen = function (str) {
    var count = 0;
    for (var i = 0, len = str.length; i < len; i++) {
        count += str.charCodeAt(i) < 256 ? 1 : 2;
    }
    return count;
};

/**
 * 计算应当转向某个方向
 * @param {'up' | 'down' | 'left' | 'right' | ':left' | ':right' | ':back'} turn 转向的方向
 * @param {string} direction 当前方向
 */
utils.prototype.turnDirection = function (turn, direction) {
    direction = direction || core.getHeroLoc('direction');
    var directionList = ["left", "leftup", "up", "rightup", "right", "rightdown", "down", "leftdown"];
    if (directionList.indexOf(turn) >= 0) return turn;
    if (turn == ':hero') return core.getHeroLoc('direction');
    if (turn == ':backhero') return this.turnDirection(':back', core.getHeroLoc('direction'));
    if (typeof turn === 'number' && turn % 45 == 0) turn /= 45;
    else {
        switch (turn) {
            case ':left': turn = 6; break; // turn left
            case ':right': turn = 2; break; // turn right
            case ':back': turn = 4; break; // turn back
            default: turn = 0; break;
        }
    }
    var index = directionList.indexOf(direction);
    if (index < 0) return direction;
    return directionList[(index + (turn || 0)) % directionList.length];
}

/**
 * 通配符匹配，用于搜索图块等批量处理。
 * @param {string} pattern 模式串，每个星号表示任意多个（0个起）字符
 * @param {string} string 待测串
 */
utils.prototype.matchWildcard = function (pattern, string) {
    try {
        return new RegExp('^' + pattern.split(/\*+/).map(function (s) {
            return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        }).join('.*') + '$').test(string);
    } catch (e) {
        return false;
    }
}

/**
 * 是否满足正则表达式
 * @param {string} pattern
 * @param {string} string
 */
utils.prototype.matchRegex = function (pattern, string) {
    try {
        if (pattern.startsWith("^")) pattern = pattern.substring(1);
        if (pattern.endsWith("$")) pattern = pattern.substring(0, pattern.length - 1);
        return new RegExp("^" + pattern + "$").test(string);
    } catch (e) {
        return false;
    }
}

////// Base64加密 //////
/**
 * base64加密
 * @param {string} str 明文
 */
utils.prototype.encodeBase64 = function (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

////// Base64解密 //////
/**
 * base64解密
 * @param {string} str 密文
 */
utils.prototype.decodeBase64 = function (str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * 不支持SL的随机数
 * @param {number} num 填正数表示生成小于num的随机自然数，否则生成小于1的随机正数
 */
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
/**
 * 支持SL的随机数，并计入录像
 * @param {number} num 正整数，0或不填会被视为2147483648
 */
utils.prototype.rand2 = function (num) {
    num = num || 2147483648;
    num = Math.abs(num);

    var value;
    if (core.isReplaying()) {
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf("random:") == 0) {
            value = parseInt(action.substring(7));
            if (isNaN(value) || value >= num || value < 0) {
                console.warn('错误！当前random:项超过范围。将重新随机生成！');
                value = Math.floor(Math.random() * num);
            }
        }
        else {
            console.warn('错误！当前需要一个random:项。将重新随机生成！');
            value = Math.floor(Math.random() * num);
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
/**
 * 尝试请求读取一个本地文件内容 [异步]
 * @param success 成功后的回调
 * @param error 失败后的回调
 * @param readType 不设置则以文本读取，否则以DataUrl形式读取
 */
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
    }
    core.platform.fileInput.value = '';
    if (accept) core.platform.fileInput.accept = accept;

    core.platform.fileInput.click();
}

////// 读取文件完毕 //////
/**
 * 文件读取完毕后的内容处理 [异步]
 * @param content
 */
utils.prototype.readFileContent = function (content) {
    var obj = null;
    if (content.slice(0, 4) === 'data') {
        if (core.platform.successCallback)
            core.platform.successCallback(content);
        return;
    }
    // 检查base64
    try {
        obj = JSON.parse(LZString.decompressFromBase64(content));
    } catch (e) { }
    if (!obj) {
        try {
            obj = JSON.parse(content);
        } catch (e) {
            console.error(e)
        }
    }

    if (obj) {
        if (core.platform.successCallback)
            core.platform.successCallback(obj);
        return;
    }

    if (core.platform.errorCallback)
        core.platform.errorCallback();
}

////// 下载文件到本地 //////
/**
 * 弹窗请求下载一个文本文件
 * @param {string} filename 文件名
 * @param {string | String[]} content 文件内容
 */
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
        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        var href = window.URL.createObjectURL(blob);
        var opened = window.open(href, "_blank");
        window.URL.revokeObjectURL(href);
        return;
    }

    // Step 4: 下载
    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
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
/**
 * 尝试复制一段文本到剪切板。
 * @param {string} data
 */
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
/**
 * 显示确认框，类似core.drawConfirmBox()
 * @param {string} hint 弹窗的内容
 * @param {() => void} yesCallback 确定后的回调函数
 * @param {() => void} noCallback 取消后的回调函数，可选
 */
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
/**
 * 让用户输入一段文字
 * @param {string} hint
 * @param {string} value
 * @param {(data?: string) => any} callback
 */
utils.prototype.myprompt = function (hint, value, callback) {
    main.dom.inputDiv.style.display = 'block';
    main.dom.inputMessage.innerHTML = hint.replace(/\n/g, '<br/>');
    main.dom.inputBox.style.display = 'block';
    main.dom.inputBox.value = value == null ? "" : value;
    main.dom.inputYes.blur();
    main.dom.inputNo.blur();
    setTimeout(function () {
        main.dom.inputBox.focus();
    });
    core.status.holdingKeys = [];

    core.platform.successCallback = core.platform.errorCallback = callback;
}

////// 动画显示某对象 //////
/**
 * 动画显示某对象
 * @param {any} obj
 * @param {number} speed
 * @param {() => any} callback
 */
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
/**
 * 动画使某对象消失
 * @param {any} obj
 * @param {number} speed
 * @param {() => any} callback
 */
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

////// 生成浏览器唯一的 guid //////
/** 获得浏览器唯一的guid */
utils.prototype.getGuid = function () {
    var guid = localStorage.getItem('guid');
    if (guid != null) return guid;
    guid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    localStorage.setItem('guid', guid);
    return guid;
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

/**
 * 判定深层相等, 会逐层比较每个元素
 * @param {any} a
 * @param {any} b
 */
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
        var obj = {};
        for (var i in a) obj[i] = true;
        for (var i in b) obj[i] = true;
        for (var i in obj) {
            if (!this.same(a[i], b[i])) return false;
        }
        return true;
    }
    return false;
}

/**
 * 解压一段内容
 * @param {any} blobOrUrl
 * @param {(data: any) => void} success
 * @param {(error: string) => void} error
 * @param {boolean} convertToText
 * @param {(loaded: number, total: number) => void} onprogress
 */
utils.prototype.unzip = function (blobOrUrl, success, error, convertToText, onprogress) {
    var _error = function (msg) {
        console.error(msg);
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
    if (entries == null || entries.length == 0) {
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

/**
 * 发送一个HTTP请求 [异步]
 * @param {'GET' | 'POST'} type 请求类型
 * @param {string} url 目标地址
 * @param {FormData} formData 如果是POST请求则为表单数据
 * @param {() => void} success 成功后的回调
 * @param {() => void} error 失败后的回调
 */
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
            if (onprogress) onprogress(e.loaded, e.total);
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

// LZW-compress
// https://gist.github.com/revolunet/843889
function lzw_encode (s) {
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
function lzw_decode (s) {
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
