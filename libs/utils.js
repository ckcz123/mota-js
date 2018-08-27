/*
utils.js 工具类

 */

function utils() {

}

utils.prototype.init = function () {

}

////// 将文字中的${和}（表达式）进行替换 //////
utils.prototype.replaceText = function (text) {
    return text.replace(/\${([^}]+)}/g, function (word, value) {
        return core.calValue(value);
    });
}

////// 计算表达式的值 //////
utils.prototype.calValue = function (value) {
    if (typeof value == 'number') {
        return value;
    }
    if (value instanceof Function) {
        return value();
    }
    value=value.replace(/status:([\w\d_]+)/g, "core.getStatus('$1')");
    value=value.replace(/item:([\w\d_]+)/g, "core.itemCount('$1')");
    value=value.replace(/flag:([\w\d_]+)/g, "core.getFlag('$1', 0)");
    return eval(value);
}

////// 字符串自动换行的分割 //////
utils.prototype.splitLines = function(canvas, text, maxLength, font) {
    if (core.isset(font)) core.setFont(canvas, font);

    var contents = [];
    var last = 0;
    for (var i=0;i<text.length;i++) {

        if (text.charAt(i)=='\n') {
            contents.push(text.substring(last, i));
            last=i+1;
        }
        else if (text.charAt(i)=='\\' && text.charAt(i+1)=='n') {
            contents.push(text.substring(last, i));
            last=i+2;
        }
        else {
            var toAdd = text.substring(last, i+1);
            var width = core.canvas[canvas].measureText(toAdd).width;
            if (width>maxLength) {
                contents.push(text.substring(last, i));
                last=i;
            }
        }
    }
    contents.push(text.substring(last));
    return contents;
}

////// 向某个数组前插入另一个数组或元素 //////
utils.prototype.unshift = function (a,b) {
    if (!(a instanceof Array) || !core.isset(b)) return;
    if (b instanceof Array) {
        core.clone(b).reverse().forEach(function (e) {
            a.unshift(e);
        });
    }
    else a.unshift(b);
    return a;
}

////// 设置本地存储 //////
utils.prototype.setLocalStorage = function(key, value) {
    try {
        var str = JSON.stringify(value);
        var compressed = LZString.compress(str);

        // test if we can save to localStorage
        localStorage.setItem("__tmp__", compressed);
        if (LZString.decompress(localStorage.getItem("__tmp__"))==str) {
            localStorage.setItem(core.firstData.name + "_" + key, compressed);
        }
        else {
            // We cannot compress the data
            localStorage.setItem(core.firstData.name + "_" + key, str);
        }
        localStorage.removeItem("__tmp__");
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

////// 获得本地存储 //////
utils.prototype.getLocalStorage = function(key, defaultValue) {
    try {
        var value = localStorage.getItem(core.firstData.name+"_"+key);
        if (core.isset(value)) {
            var output = LZString.decompress(value);
            if (core.isset(output) && output.length>0) {
                try {
                    return JSON.parse(output);
                }
                catch (ee) {}
            }
            return JSON.parse(value);
        }
        return defaultValue;
    }
    catch (e) {
        console.log(e);
        return defaultValue;
    }
}

////// 移除本地存储 //////
utils.prototype.removeLocalStorage = function (key) {
    localStorage.removeItem(core.firstData.name+"_"+key);
}

////// 深拷贝一个对象 //////
utils.prototype.clone = function (data) {
    if (!core.isset(data)) return data;
    // date
    if (data instanceof Date) {
        var copy=new Date();
        copy.setTime(data.getTime());
        return copy;
    }
    // array
    if (data instanceof Array) {
        var copy=[];
        // for (var i=0;i<data.length;i++) {
        for (var i in data) {
            // copy.push(core.clone(data[i]));
            copy[i] = core.clone(data[i]);
        }
        return copy;
    }
    // 函数
    if (data instanceof Function) {
        return data;
    }
    // object
    if (data instanceof Object) {
        var copy={};
        for (var i in data) {
            if (data.hasOwnProperty(i))
                copy[i]=core.clone(data[i]);
        }
        return copy;
    }
    return data;
}

////// 裁剪图片 //////
utils.prototype.cropImage = function (image, size) {
    size = size||32;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    var ans = [];
    for (var i=0;i<image.height;i+=size) {
        context.drawImage(image, 0, i, size, size, 0, 0, size, size);
        var img = new Image();
        img.src = canvas.toDataURL("image/png");
        ans.push(img);
        context.clearRect(0,0,size,size);
    }
    return ans;
}

////// 格式化时间为字符串 //////
utils.prototype.formatDate = function(date) {
    if (!core.isset(date)) return "";
    return date.getFullYear()+"-"+core.setTwoDigits(date.getMonth()+1)+"-"+core.setTwoDigits(date.getDate())+" "
        +core.setTwoDigits(date.getHours())+":"+core.setTwoDigits(date.getMinutes())+":"+core.setTwoDigits(date.getSeconds());
}

////// 格式化时间为最简字符串 //////
utils.prototype.formatDate2 = function (date) {
    if (!core.isset(date)) return "";
    return date.getFullYear()+core.setTwoDigits(date.getMonth()+1)+core.setTwoDigits(date.getDate())
        +core.setTwoDigits(date.getHours())+core.setTwoDigits(date.getMinutes())+core.setTwoDigits(date.getSeconds());
}

////// 两位数显示 //////
utils.prototype.setTwoDigits = function (x) {
    return parseInt(x)<10?"0"+x:x;
}

utils.prototype.formatBigNumber = function (x) {
    x = Math.floor(parseFloat(x));
    if (!core.isset(x)) return '???';

    var c = x<0?"-":"";
    x = Math.abs(x);

    if (x<=999999) return c + x;

    var all = [
        {"val": 1e20, "c": "g"},
        {"val": 1e16, "c": "j"},
        {"val": 1e12, "c": "z"},
        {"val": 1e8, "c": "e"},
        {"val": 1e4, "c": "w"},
    ]

    for (var i=0;i<all.length;i++) {
        var one = all[i];
        if (x>=10*one.val) {
            var v = x/one.val;
            return c + v.toFixed(Math.max(0, Math.floor(4-Math.log10(v+1)))) + one.c;
        }
    }

    return c+x;
}

////// 数组转RGB //////
utils.prototype.arrayToRGB = function (color) {
    var nowR = parseInt(color[0])||0, nowG = parseInt(color[1])||0, nowB = parseInt(color[2])||0;
    if (nowR<0) nowR=0; if (nowB<0) nowB=0;if (nowG<0) nowG=0;
    if (nowR>255) nowR=255; if (nowB>255) nowB=255; if (nowG>255) nowG=255;
    return "#"+((1<<24)+(nowR<<16)+(nowG<<8)+nowB).toString(16).slice(1);
}

////// 加密路线 //////
utils.prototype.encodeRoute = function (route) {
    var ans="";
    var lastMove = "", cnt=0;

    route.forEach(function (t) {
        if (t=='up' || t=='down' || t=='left' || t=='right') {
            if (t!=lastMove && cnt>0) {
                ans+=lastMove.substring(0,1).toUpperCase();
                if (cnt>1) ans+=cnt;
                cnt=0;
            }
            lastMove=t;
            cnt++;
        }
        else {
            if (cnt>0) {
                ans+=lastMove.substring(0,1).toUpperCase();
                if (cnt>1) ans+=cnt;
                cnt=0;
            }
            if (t.indexOf('item:')==0)
                ans+="I"+t.substring(5)+":";
            else if (t.indexOf('fly:')==0)
                ans+="F"+t.substring(4)+":";
            else if (t.indexOf('choices:')==0)
                ans+="C"+t.substring(8);
            else if (t.indexOf('shop:')==0)
                ans+="S"+t.substring(5);
            else if (t=='turn')
                ans+='T';
            else if (t=='getNext')
                ans+='G';
            else if (t.indexOf('input:')==0)
                ans+="P"+t.substring(6);
            else if (t=='no')
                ans+='N';
            else if (t.indexOf('move:')==0)
                ans+="M"+t.substring(5);
            else if (t.indexOf('key:')==0)
                ans+='K'+t.substring(4);
            else if (t.indexOf('random:')==0)
                ans+='X'+t.substring(7);
        }
    });
    if (cnt>0) {
        ans+=lastMove.substring(0,1).toUpperCase();
        if (cnt>1) ans+=cnt;
    }
    return ans;
}

////// 解密路线 //////
utils.prototype.decodeRoute = function (route) {

    if (!core.isset(route)) return route;

    var ans=[], index=0;

    var getNumber = function (noparse) {
        var num="";
        while (index<route.length && !isNaN(route.charAt(index))) {
            num+=route.charAt(index++);
        }
        if (num.length==0) num="1";
        return core.isset(noparse)?num:parseInt(num);
    }
    var getString = function () {
        var str="";
        while (index<route.length && /\w/.test(route.charAt(index))) {
            str+=route.charAt(index++);
        }
        index++;
        return str;
    }

    while (index<route.length) {
        var c=route.charAt(index++);
        var nxt=(c=='I'||c=='F'||c=='S')?getString():getNumber();

        switch (c) {
            case "U": for (var i=0;i<nxt;i++) ans.push("up"); break;
            case "D": for (var i=0;i<nxt;i++) ans.push("down"); break;
            case "L": for (var i=0;i<nxt;i++) ans.push("left"); break;
            case "R": for (var i=0;i<nxt;i++) ans.push("right"); break;
            case "I": ans.push("item:"+nxt); break;
            case "F": ans.push("fly:"+nxt); break;
            case "C": ans.push("choices:"+nxt); break;
            case "S": ans.push("shop:"+nxt+":"+getNumber(true)); break;
            case "T": ans.push("turn"); break;
            case "G": ans.push("getNext"); break;
            case "P": ans.push("input:"+nxt); break;
            case "N": ans.push("no"); break;
            case "M": ++index; ans.push("move:"+nxt+":"+getNumber()); break;
            case "K": ans.push("key:"+nxt); break;
            case "X": ans.push("random:"+nxt); break;
        }
    }
    return ans;
}

////// 判断某对象是否不为undefined也不会null //////
utils.prototype.isset = function (val) {
    if (val == undefined || val == null || (typeof val=='number' && isNaN(val))) {
        return false;
    }
    return true
}

////// 获得子数组 //////
utils.prototype.subarray = function (a, b) {
    if (!core.isset(a) || !core.isset(b) || !(a instanceof Array) || !(b instanceof Array) || a.length<b.length)
        return null;
    var na = core.clone(a), nb=core.clone(b);
    while (nb.length>0) {
        if (na.shift() != nb.shift()) return null;
    }
    return na;
}

utils.prototype.clamp = function (x, a, b) {
    var min=Math.min(a, b), max=Math.max(a, b);
    return Math.min(Math.max(x||0, min), max);
}

////// Base64加密 //////
utils.prototype.encodeBase64 = function (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

////// Base64解密 //////
utils.prototype.decodeBase64 = function (str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

utils.prototype.__init_seed = function () {
    var rand = new Date().getTime()%34834795 + 3534;
    rand = this.__next_rand(rand);
    rand = this.__next_rand(rand);
    rand = this.__next_rand(rand);
    core.setFlag('seed', rand);
    core.setFlag('rand', rand);
}

utils.prototype.__next_rand = function (_rand) {
    _rand=(_rand%127773)*16807-~~(_rand/127773)*2836;
    _rand+=_rand<0?2147483647:0;
    return _rand;
}

utils.prototype.rand = function (num) {
    var rand = core.getFlag('rand');
    rand = this.__next_rand(rand);
    core.setFlag('rand', rand);
    var ans = rand/2147483647;
    if (core.isset(num) && num>0)
        return Math.floor(ans*num);
    return ans;
}

////// 生成随机数（录像方法） //////
utils.prototype.rand2 = function (num) {
    num = num||2147483648;

    var value;
    if (core.status.replay.replaying) {
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf("random:")==0 ) {
            value=parseInt(action.substring(7));
        }
        else {
            core.stopReplay();
            core.drawTip("录像文件出错");
            return;
        }
    }
    else {
        value = Math.floor(Math.random()*num);
    }
    core.status.route.push("random:"+value);
    return value;
}

////// 读取一个本地文件内容 //////
utils.prototype.readFile = function (success, error, readType) {

    core.platform.successCallback = success;
    core.platform.errorCallback = error;

    if (core.isset(window.jsinterface)) {
        window.jsinterface.readFile();
        return;
    }

    // step 0: 不为http/https，直接不支持
    if (!core.platform.isOnline) {
        alert("离线状态下不支持文件读取！");
        if (core.isset(error)) error();
        return;
    }

    // Step 1: 如果不支持FileReader，直接不支持
    if (core.platform.fileReader==null) {
        alert("当前浏览器不支持FileReader！");
        if (core.isset(error)) error();
        return;
    }

    if (core.platform.fileInput==null) {
        core.platform.fileInput = document.createElement("input");
        core.platform.fileInput.style.opacity = 0;
        core.platform.fileInput.type = 'file';
        core.platform.fileInput.onchange = function () {
            var files = core.platform.fileInput.files;
            if (files.length==0) {
                if (core.isset(core.platform.errorCallback))
                    core.platform.errorCallback();
                return;
            }
            if(!readType)core.platform.fileReader.readAsText(core.platform.fileInput.files[0]);
            else core.platform.fileReader.readAsDataURL(core.platform.fileInput.files[0]);
            core.platform.fileInput.value = '';
        }
    }

    core.platform.fileInput.click();
}

////// 读取文件完毕 //////
utils.prototype.readFileContent = function (content) {
    var obj=null;
    if(content.slice(0,4)==='data'){
        if (core.isset(core.platform.successCallback))
            core.platform.successCallback(content);
        return;
    }
    try {
        obj=JSON.parse(content);
        if (core.isset(obj)) {
            if (core.isset(core.platform.successCallback))
                core.platform.successCallback(obj);
            return;
        }
    }
    catch (e) {
        console.log(e);
    }
    alert("不是有效的JSON文件！");

    if (core.isset(core.platform.errorCallback))
        core.platform.errorCallback();
}

////// 下载文件到本地 //////
utils.prototype.download = function (filename, content) {

    if (core.isset(window.jsinterface)) {
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
        alert("iOS平台下不支持下载操作！");
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
        var opened=window.open(href, "_blank");
        // if (!opened) window.location.href=href;
        window.URL.revokeObjectURL(href);
        return;
    }

    // Step 4: 下载
    var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    if(window.navigator.msSaveOrOpenBlob) {
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

    if (core.isset(window.jsinterface)) {
        window.jsinterface.copy(filename, content);
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

////// 动画显示某对象 //////
utils.prototype.show = function (obj, speed, callback) {
    if (!core.isset(speed)) {
        obj.style.display = 'block';
        return;
    }
    obj.style.display = 'block';
    if (main.mode!='play'){
        obj.style.opacity = 1;
        if (core.isset(callback)) {callback();}
        return;
    }
    obj.style.opacity = 0;
    var opacityVal = 0;
    var showAnimate = window.setInterval(function () {
        opacityVal += 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal > 1) {
            clearInterval(showAnimate);
            if (core.isset(callback)) {
                callback();
            }
        }
    }, speed);
}

////// 动画使某对象消失 //////
utils.prototype.hide = function (obj, speed, callback) {
    if (!core.isset(speed)) {
        obj.style.display = 'none';
        return;
    }
    if (main.mode!='play'){
        obj.style.display = 'none';
        if (core.isset(callback)) {callback();}
        return;
    }
    var opacityVal = 1;
    var hideAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal < 0) {
            obj.style.display = 'none';
            clearInterval(hideAnimate);
            if (core.isset(callback)) {
                callback();
            }
        }
    }, speed);
}

utils.prototype._export = function (floorIds) {
    if (!core.isset(floorIds)) floorIds = [core.status.floorId];
    else if (floorIds=='all') floorIds = core.clone(core.floorIds);
    else if (typeof floorIds == 'string') floorIds = [floorIds];

    var monsterMap = {};

    // map
    var content = floorIds.length+"\n13 13\n\n";
    floorIds.forEach(function (floorId) {
        var arr = core.maps.getMapArray(core.status.maps[floorId].blocks);
        content += arr.map(function (x) {
            // check monster
            x.forEach(function (t) {
                var block = core.maps.initBlock(null, null, t);
                if (core.isset(block.event) && block.event.cls.indexOf("enemy")==0) {
                    monsterMap[t] = block.event.id;
                }
            })
            return x.join("\t");
        }).join("\n") + "\n\n";
    })

    // values
    content += ["redJewel", "blueJewel", "greenJewel", "redPotion", "bluePotion",
        "yellowPotion", "greenPotion", "sword1", "shield1"].map(function (x) {return core.values[x]}).join(" ") + "\n\n";

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

utils.prototype.http = function (type, url, formData, success, error, mimeType, responseType) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    if (core.isset(mimeType))
        xhr.overrideMimeType(mimeType);
    if (core.isset(responseType))
        xhr.responseType = responseType;
    xhr.onload = function(e) {
        if (xhr.status==200) {
            if (core.isset(success)) {
                success(xhr.response);
            }
        }
        else {
            if (core.isset(error))
                error("HTTP "+xhr.status);
        }
    };
    xhr.onabort = function () {
        if (core.isset(error))
            error("Abort");
    }
    xhr.ontimeout = function() {
        if (core.isset(error))
            error("Timeout");
    }
    xhr.onerror = function() {
        if (core.isset(error))
            error("Error on Connection");
    }
    if (core.isset(formData))
        xhr.send(formData);
    else xhr.send();
}
