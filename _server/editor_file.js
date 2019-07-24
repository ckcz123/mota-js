editor_file_wrapper = function (editor) {
    editor_file_proto = function () {
        /**
         * 以 
         * {
         *     "floor.MT1":<obj>,
         *     "plugins":<obj>
         * }
         * 的形式记录所有更改过的文件,save时写入
         * <obj>的内容暂时还没想好
         */
        this.fileMark = {}
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

        var tempJsonObj = Object.assign({}, floorData);
        var tempMap = [['map', editor.util.guid()], ['bgmap', editor.util.guid()], ['fgmap', editor.util.guid()]];
        tempMap.forEach(function (v) {
            v[2] = tempJsonObj[v[0]];
            tempJsonObj[v[0]] = v[1];
        });
        var tempJson = JSON.stringify(tempJsonObj, editor.game.replacerForSaving, 4);
        tempMap.forEach(function (v) {
            tempJson = tempJson.replace('"' + v[1] + '"', '[\n' + editor.file.formatMap(v[2], v[0] != 'map') + '\n]')
        });
        datastr = datastr.concat([tempJson]);
        datastr = datastr.join('');
        editor.file.alertWhenCompress();
        editor.fs.writeFile(filename, editor.util.encode64(datastr), 'base64', function (err, data) {
            editor.addUsedFlags(datastr);
            callback(err);
        });
    }

    editor_file_proto.prototype.saveScript = function (name, varName, dataObj, callback) {
        // 此处格式化以及写入 project/xxx.js 形式的文件
        editor.file.alertWhenCompress();

        if (['maps', 'enemys'].indexOf(name) === -1) {
            // 全部用\t展开
            var content = JSON.stringify(dataObj, editor.game.replacerForSaving, '\t');
        } else {
            // 只用\t展开第一层
            var emap = {};
            var estr = JSON.stringify(dataObj, function (_k, v) {
                if (v.id != null) {
                    var id_ = editor.util.guid();
                    emap[id_] = JSON.stringify(v, editor.game.replacerForSaving);
                    return id_;
                } else return v
            }, '\t');
            for (var id_ in emap) {
                estr = estr.replace('"' + id_ + '"', emap[id_]);
            }
            var content = estr;
        }

        var strToWrite = `var ${varName} = \n${content}`;
        editor.fs.writeFile(`project/${name}.js`, editor.util.encode64(strToWrite), 'base64', function (err, data) {
            callback(err);
        });
    }

    editor_file_proto.prototype.saveCommentJs = function () {
        // 无需格式化的写入, 把multi的那部分略微修改
    }

    editor_file_proto.prototype.saveImage = function () {
        // 给追加素材使用
    }

    editor_file_proto.prototype.addMark = function (name) {
        // 把name对应的文件在editor.file.fileMark添加标记
    }

    editor_file_proto.prototype.save = function (callback) {
        // 根据 editor.file.fileMark 把游戏对象格式化写入文件
    }


}