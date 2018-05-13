(function () {
    fs = {};
    var postsomething = function (data, _ip, callback) {
        if (typeof(data) == typeof([][0]) || data == null) data = JSON.stringify({1: 2});
        core.http("POST", _ip, data, function (data) {
            if (data.slice(0, 6) == 'error:') {
                callback(data, null);
            }
            else {
                callback(null, data);
            }
        }, function (e) {
            console.log(e);
            callback(e+"：请检查启动服务是否处于正常运行状态。");
        }, "text/plain; charset=x-user-defined");
    }

    fs.readFile = function (filename, encoding, callback) {
        if (typeof(filename) != typeof(''))
            throw 'Type Error in fs.readFile';
        if (encoding == 'utf-8') {
            //读文本文件
            //filename:支持"/"做分隔符
            //callback:function(err, data)
            //data:字符串
            var data = '';
            data += 'type=utf8&';
            data += 'name=' + filename;
            postsomething(data, '/readFile', callback);
            return;
        }
        if (encoding == 'base64') {
            //读二进制文件
            //filename:支持"/"做分隔符
            //callback:function(err, data)
            //data:base64字符串
            var data = '';
            data += 'type=base64&';
            data += 'name=' + filename;
            postsomething(data, '/readFile', callback);
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
            var data = '';
            data += 'type=utf8&';
            data += 'name=' + filename;
            data += '&value=' + datastr;
            postsomething(data, '/writeFile', callback);
            return;
        }
        if (encoding == 'base64') {
            //写二进制文件
            //filename:支持"/"做分隔符
            //callback:function(err)
            //datastr:base64字符串
            var data = '';
            data += 'type=base64&';
            data += 'name=' + filename;
            data += '&value=' + datastr;
            postsomething(data, '/writeFile', callback);
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
        var data = '';
        data += 'name=' + path;
        postsomething(data, '/listFile', function (err, data) {
            callback(err, JSON.parse(data))
        });
        return;
    }
})();