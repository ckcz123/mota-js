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
    value=value.replace(/status:([\w\d_]+)/g, "core.getStatus('$1')");
    value=value.replace(/item:([\w\d_]+)/g, "core.itemCount('$1')");
    value=value.replace(/flag:([\w\d_]+)/g, "core.getFlag('$1', false)");
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
        localStorage.setItem(core.firstData.name + "_" + key, JSON.stringify(value));
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

////// 获得本地存储 //////
utils.prototype.getLocalStorage = function(key, defaultValue) {
    var value = localStorage.getItem(core.firstData.name+"_"+key);
    if (core.isset(value)) return JSON.parse(value);
    return defaultValue;
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
            else if (t=='key:')
                ans+='K'+t.substring(4);
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

////// 读取一个本地文件内容 //////
utils.prototype.readFile = function (success, error, readType) {

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
        core.platform.fileInput.style.display = 'none';
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

    core.platform.successCallback = success;
    core.platform.errorCallback = error;
    core.platform.fileInput.click();
}

////// 下载文件到本地 //////
utils.prototype.download = function (filename, content) {

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
    textArea.select();
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

utils.prototype.http = function (type, url, formData, success, error, mimeType) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    if (core.isset(mimeType))
        xhr.overrideMimeType(mimeType);
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
