(function () {
    fs = {};


    var _isset = function (val) {
        if (val == undefined || val == null || (typeof val=='number' && isNaN(val))) {
            return false;
        }
        return true
    }

    var _http = function (type, url, formData, success, error, mimeType, responseType) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        if (_isset(mimeType))
            xhr.overrideMimeType(mimeType);
        if (_isset(responseType))
            xhr.responseType = responseType;
        xhr.onload = function(e) {
            if (xhr.status==200) {
                if (_isset(success)) {
                    success(xhr.response);
                }
            }
            else {
                if (_isset(error))
                    error("HTTP "+xhr.status);
            }
        };
        xhr.onabort = function () {
            if (_isset(error))
                error("Abort");
        }
        xhr.ontimeout = function() {
            if (_isset(error))
                error("Timeout");
        }
        xhr.onerror = function() {
            if (_isset(error))
                error("Error on Connection");
        }
        xhr.setRequestHeader('Content-Type','text/plain');
        if (_isset(formData))
            xhr.send(formData);
        else xhr.send();
    }


    // var postsomething = function (data, _ip, callback) {
    var postsomething = function (data, callback) {
        if (typeof(data) == typeof([][0]) || data == null) data = JSON.stringify({1: 2});

        //_http("POST", _ip, data, function (data) {
        _http("POST", "http://127.0.0.1:1056", data, function (data) {
            if (data.slice(0, 6) == 'error:') {
                callback(data, null);
            }
            else {
                callback(null, data);
            }
        }, function (e) {
            console.log(e);
            callback(e+"：请检查启动服务是否处于正常运行状态。");
        //}, "text/plain; charset=x-user-defined");
        }, "text/plain");
    }

    fs.readFile = function (filename, encoding, callback) {
        if (typeof(filename) != typeof(''))
            throw 'Type Error in fs.readFile';
        if (encoding == 'utf-8') {
            //读文本文件
            //filename:支持"/"做分隔符
            //callback:function(err, data)
            //data:字符串
            var data={};
            data.name='readFile-utf-8';
            data.func='open';
            data.args=[filename];
            postsomething(JSON.stringify(data),callback);
            return;
        }
        if (encoding == 'base64') {
            //读二进制文件
            //filename:支持"/"做分隔符
            //callback:function(err, data)
            //data:base64字符串
            var data={};
            data.name='readFile-base64';
            data.func='open';
            data.args=[filename];
            postsomething(JSON.stringify(data),callback);
            return;
        }
        throw 'Type Error in fs.readFile';
    }

    fs.writeFile = function (filename, datastr, encoding, callback) {
        if (typeof(filename) != typeof('') || typeof(datastr) != typeof(''))
            throw 'Type Error in fs.writeFile';
        if (encoding == 'utf-8') {
            //写文本文件
            //filename:支持"/"做分隔符
            //callback:function(err)
            //datastr:字符串
            var data={};
            data.name='writeFile-utf-8';
            data.func='open';
            data.args=[filename,datastr];
            postsomething(JSON.stringify(data),callback);
            return;
        }
        if (encoding == 'base64') {
            //写二进制文件
            //filename:支持"/"做分隔符
            //callback:function(err)
            //datastr:base64字符串
            var data={};
            data.name='writeFile-base64';
            data.func='open';
            data.args=[filename,datastr];
            postsomething(JSON.stringify(data),callback);
            return;
        }
        throw 'Type Error in fs.writeFile';
    }

    fs.readdir = function (path, callback) {
        //callback:function(err, data)
        //path:支持"/"做分隔符,不以"/"结尾
        //data:[filename1,filename2,..] filename是字符串,只包含文件不包含目录
        if (typeof(path) != typeof(''))
            throw 'Type Error in fs.readdir';
        var data={};
        data.name='readdir';
        data.func='listdir';
        data.args=[path];
        postsomething(JSON.stringify(data), function (err, data) {
            callback(err, JSON.parse(data))
        });
        return;
    }
})();