editor_file_wrapper = function (editor) {
    editor_file_proto = function () {

    }

    // 这个函数之后挪到editor.table?
    editor_file_proto.prototype.loadCommentjs = function (callback) {
        var commentjs = {
            'comment': 'comment',
            'data.comment': 'dataComment',
            'functions.comment': 'functionsComment',
            'events.comment': 'eventsComment',
            'plugins.comment': 'pluginsComment',
        }
        for (var key in commentjs) {
            (function (key) {
                var value = commentjs[key];
                var script = document.createElement('script');
                if (window.location.href.indexOf('_server') !== -1)
                    script.src = key + '.js';
                else
                    script.src = '_server/table/' + key + '.js';
                document.body.appendChild(script);
                script.onload = function () {
                    editor.file[value] = eval(key.replace('.', '_') + '_c456ea59_6018_45ef_8bcc_211a24c627dc');
                    var loaded = Boolean(callback);
                    for (var key_ in commentjs) {
                        loaded = loaded && editor.file[commentjs[key_]]
                    }
                    if (loaded) callback();
                }
            })(key);
        }
    }

    editor_file_proto.prototype.alertWhenCompress = function () {
        if (editor.useCompress === true) {
            editor.useCompress = 'alerted';
            setTimeout("alert('当前游戏使用的是压缩文件,修改完成后请使用启动服务.exe->Js代码压缩工具重新压缩,或者把main.js的useCompress改成false来使用原始文件')", 1000)
        }
    }

    editor_file_proto.prototype.formatMap = function (mapArr, trySimplify) {
        if (!mapArr || JSON.stringify(mapArr) == JSON.stringify([])) return '';
        if (trySimplify) {
            //检查是否是全0二维数组
            var jsoncheck = JSON.stringify(mapArr).replace(/\D/g, '');
            if (jsoncheck == Array(jsoncheck.length + 1).join('0')) return '';
        }
        //把二维数组格式化
        var formatArrStr = '';
        var arr = JSON.stringify(mapArr).replace(/\s+/g, '').split('],[');
        var si = mapArr.length - 1, sk = mapArr[0].length - 1;
        for (var i = 0; i <= si; i++) {
            var a = [];
            formatArrStr += '    [';
            if (i == 0 || i == si) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
            else a = arr[i].split(/\D+/);
            for (var k = 0; k <= sk; k++) {
                var num = parseInt(a[k]);
                formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == sk ? '' : ',');
            }
            formatArrStr += ']' + (i == si ? '' : ',\n');
        }
        return formatArrStr;
    }

    editor_file_proto.prototype.saveFloor = function (floorData, callback) {
        //callback(err:String)
        var floorId = floorData.floorId;
        var filename = 'project/floors/' + floorId + '.js';
        var datastr = ['main.floors.', floorId, '=\n'];

        // format 更改实现方式以支持undefined删除
        var tempJsonObj = Object.assign({}, floorData);
        var tempMap = [['map', editor.util.guid()], ['bgmap', editor.util.guid()], ['fgmap', editor.util.guid()]];
        tempMap.forEach(function (v) {
            v[2] = tempJsonObj[v[0]];
            tempJsonObj[v[0]] = v[1];
        });
        var tempJson = JSON.stringify(tempJsonObj, null, 4);
        tempMap.forEach(function (v) {
            tempJson = tempJson.replace('"' + v[1] + '"', '[\n' + editor.file.formatMap(v[2], v[0] != 'map') + '\n]')
        });
        datastr = datastr.concat([tempJson]);
        datastr = datastr.join('');
        editor.file.alertWhenCompress();
        editor.fs.writeFile(filename, encode(datastr), 'base64', function (err, data) {
            callback(err);
        });
    }


}